import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "../dist/shared/middlewares/validate.middlewares.js";
import { updateUserSchema } from "../dist/modules/admin/schemas/updateUser.schemas.js";
import { registerSchema } from "../dist/modules/auth/schemas/register.schemas.js";
import { profileSchema, changePasswordSchema } from "../dist/modules/users/schemas/profile.schemas.js";

test("multipart false remains false and unknown fields are stripped", () => {
  const req = { body: { isBlocked: "false", password: "injected" }, query: {}, params: {} };
  let result;
  validate(updateUserSchema)(req, {}, error => { result = error; });
  assert.equal(result, undefined);
  assert.deepEqual(req.body, { isBlocked: false });
});

test("validation forwards parsed email normalization to controllers", () => {
  const req = { body: { username: "Tester", email: "TEST@example.com", password: "Test1234!" } };
  let result;
  validate(registerSchema)(req, {}, error => { result = error; });
  assert.equal(result, undefined);
  assert.equal(req.body.email, "test@example.com");
});

test("invalid multipart boolean fails instead of becoming true", () => {
  assert.equal(updateUserSchema.safeParse({ body: { isBlocked: "invalid" } }).success, false);
});

test("profile accepts Other and strips protected fields", () => {
  const parsed = profileSchema.parse({ body: { gender: "Other", role: "admin", email: "changed@example.com", isPremium: true } });
  assert.deepEqual(parsed.body, { gender: "Other" });
});

test("password updates reject weak passwords and accept valid ones", () => {
  assert.equal(changePasswordSchema.safeParse({ body: { oldPassword: "old", newPassword: "12345678" } }).success, false);
  assert.equal(changePasswordSchema.safeParse({ body: { oldPassword: "old", newPassword: "Strong123!" } }).success, true);
});
