import test from 'node:test';
import assert from 'node:assert/strict';
import 'reflect-metadata';
import { listUsersSchema } from '../dist/modules/admin/schemas/listUsers.schemas.js';
import { UserMapper } from '../dist/modules/users/mapper/user.mappers.js';
import User from '../dist/modules/auth/models/user.models.js';

// These tests use fake infrastructure and never connect to external services.
Object.assign(process.env, {
  NODE_ENV: 'production', PORT: '8080', CLIENT_URL: 'http://localhost:5173',
  MONGO_URI: 'mongodb://localhost/test', REDIS_URI: 'redis://localhost:6379',
  JWT_ACCESS_SECRET: 'test-only', JWT_REFRESH_SECRET: 'test-only',
  GOOGLE_CLIENT_ID: 'test', GOOGLE_CLIENT_URL: 'http://localhost', GOOGLE_CLIENT_SECRET: 'test', GOOGLE_CALLBACK_URL: 'http://localhost',
  SMTP_HOST: 'localhost', SMTP_PORT: '1025', SMTP_USER: 'test', SMTP_PASS: 'test', SMTP_FROM_EMAIL: 'test@example.com', SMTP_FROM_NAME: 'test',
  AWS_REGION: 'us-east-1', AWS_ACCESS_KEY_ID: 'test', AWS_SECRET_ACCESS_KEY: 'test', AWS_S3_BUCKET: 'test', OTP_EXPIRY_SECONDS: '60', OTP_PREFIX: 'test',
});
const { AdminRepository } = await import('../dist/modules/admin/repositories/admin.repositories.js');
const { AdminService } = await import('../dist/modules/admin/services/admin.services.js');

test('list query applies defaults and rejects unsupported fields and invalid pagination', () => {
  const defaults = listUsersSchema.parse({});
  assert.equal(defaults.page, 1);
  assert.equal(defaults.sortBy, 'createdAt');
  for (const input of [{ page: true }, { page: ["1"] }, { page: "1e2" }, { limit: ["10", "20"] }, { page: 0 }, { page: 1.5 }, { limit: 1001 }, { sortBy: 'password' }, { sortOrder: '$gt' }, { search: {} }, { status: 'unknown' }, { membership: 'admin' }]) {
    assert.equal(listUsersSchema.safeParse(input).success, false);
  }
});

test('membership and status filters affect both total and paginated query; sort is stable', async () => {
  const repo = new AdminRepository();
  let counted;
  repo.countDocuments = async filter => { counted = filter; return 23; };
  repo.find = async (filter, projection, options) => {
    assert.deepEqual(filter, counted);
    assert.equal(filter.role, 'trainer');
    assert.equal(filter.isBlocked, true);
    assert.equal(projection, '-password');
    assert.equal(options.skip, 20);
    assert.equal(options.limit, 10);
    assert.deepEqual(options.sort, { username: 1, _id: 1 });
    assert.equal(new RegExp(filter.$or[0].username.$regex).test('a.*['), true);
    assert.equal(new RegExp(filter.$or[0].username.$regex).test('abc'), false);
    return [];
  };
  const result = await repo.findUsers('a.*[', 99, 10, { membership: 'trainers', status: 'blocked', sortBy: 'username', sortOrder: 'asc' });
  assert.deepEqual(result, { users: [], total: 23, page: 3, limit: 10, totalPages: 3 });
});

test('basic members include legacy documents without a premium flag; empty results stay on page one', async () => {
  const repo = new AdminRepository();
  repo.countDocuments = async filter => {
    assert.deepEqual(filter, { role: 'user', isPremium: { $ne: true }, isBlocked: false });
    return 0;
  };
  repo.find = async (_filter, _projection, options) => { assert.equal(options.skip, 0); return []; };
  const result = await repo.findUsers('', 3, 10, { membership: 'basic', status: 'active', sortBy: 'createdAt', sortOrder: 'desc' });
  assert.equal(result.page, 1);
  assert.equal(result.totalPages, 1);
});

test('premium filter preserves admin exclusion', async () => {
  const repo = new AdminRepository();
  repo.countDocuments = async filter => { assert.deepEqual(filter, { role: { $ne: 'admin' }, isPremium: true }); return 0; };
  repo.find = async () => [];
  await repo.findUsers('', 1, 10, { membership: 'premium', status: 'all', sortBy: 'createdAt', sortOrder: 'desc' });
});

test('service validates queries before calling repository', async () => {
  let called = false;
  const service = new AdminService({ findUsers: async () => { called = true; } });
  await assert.rejects(service.getUsers('', -1, 10));
  await assert.rejects(service.getUsers('', 1, 10, { sortBy: 'password' }));
  assert.equal(called, false);
});

test('DTOs preserve premium and identifiers without leaking authentication fields', () => {
  const user = new User({ username: 'Example', email: 'example@example.com', password: 'secret', googleId: 'private-google-id', isPremium: true });
  const dto = UserMapper.toDto(user);
  assert.equal(dto._id, user._id.toString());
  assert.equal(dto.isPremium, true);
  assert.equal(dto.password, undefined);
  assert.equal(dto.googleId, undefined);
  const auth = UserMapper.toAuthDto(user);
  assert.equal(auth.id, dto._id);
  assert.equal(auth.password, undefined);
  assert.equal(UserMapper.toDto(new User()).isPremium, false);
});
