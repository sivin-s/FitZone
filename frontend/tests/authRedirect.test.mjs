import test from 'node:test';
import assert from 'node:assert/strict';
import { getLoginRedirect } from '../src/lib/authRedirect.ts';

test('restores the original user or admin page with query and fragment', () => {
  assert.equal(getLoginRedirect({ from: { pathname: '/profile', search: '?tab=details', hash: '#phone' } }), '/profile?tab=details#phone');
  assert.equal(getLoginRedirect({ from: { pathname: '/admin/users', search: '?page=2' } }, true), '/admin/users?page=2');
});

test('rejects external, guest, malformed, and cross-role destinations', () => {
  for (const pathname of ['https://example.com', '//example.com', '/login', '/register', '/admin/users', '/unknown']) {
    assert.equal(getLoginRedirect({ from: { pathname } }), '/dashboard');
  }
  assert.equal(getLoginRedirect({ from: { pathname: '/profile' } }, true), '/admin/dashboard');
  for (const state of [null, undefined, {}, { from: null }, { from: { pathname: 5 } }]) {
    assert.equal(getLoginRedirect(state), '/dashboard');
  }
});

test('restores session-expiry returnTo while rejecting external and cross-role targets', () => {
  assert.equal(getLoginRedirect(null, true, '?returnTo=%2Fadmin%2Fusers%3Fpage%3D3'), '/admin/users?page=3');
  assert.equal(getLoginRedirect(null, false, '?returnTo=%2Fprofile%23phone'), '/profile#phone');
  for (const target of ['https://example.com', '//example.com', '/admin/users', '/login', '/%2fexample.com']) {
    assert.equal(getLoginRedirect(null, false, '?returnTo=' + encodeURIComponent(target)), '/dashboard');
  }
});
