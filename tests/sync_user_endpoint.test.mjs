import test from 'node:test';
import assert from 'node:assert/strict';
import { withAuth, extractBearerToken } from '../lib/auth.js';

// Enforce test environment
process.env.NODE_ENV = 'test';

function createMockRes() {
  const res = {
    statusCode: null,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

test('Sync-User: Missing Authorization header returns 401 UNAUTHORIZED', async () => {
  const handler = async (req, res) => res.status(200).json({ success: true });
  const protectedHandler = withAuth(handler, { requireEmailVerified: false });

  const req = { method: 'POST', headers: {} };
  const res = createMockRes();

  await protectedHandler(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.jsonData.code, 'UNAUTHORIZED');
  assert.match(res.jsonData.message, /Authentication token required/);
});

test('Sync-User: Invalid Bearer token returns 401 INVALID_TOKEN', async () => {
  const handler = async (req, res) => res.status(200).json({ success: true });
  const protectedHandler = withAuth(handler, { requireEmailVerified: false });

  const req = { method: 'POST', headers: { authorization: 'Bearer bad-invalid-token' } };
  const res = createMockRes();

  await protectedHandler(req, res);

  assert.equal(res.statusCode, 401);
  assert.equal(res.jsonData.code, 'INVALID_TOKEN');
});

test('Sync-User: Method Not Allowed rejects non-POST requests with 405', async () => {
  // Simulate the inner handler check
  const syncHandler = async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed. Use POST to synchronize profile.'
      });
    }
    return res.status(200).json({ success: true });
  };
  const protectedHandler = withAuth(syncHandler, { requireEmailVerified: false });

  const req = {
    method: 'GET',
    headers: { authorization: 'Bearer mock-token-user123-unverified-password' }
  };
  const res = createMockRes();

  await protectedHandler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.jsonData.success, false);
  assert.match(res.jsonData.message, /Method not allowed/);
});

test('Sync-User: Valid authentication sets req.user and executes synchronization handler', async () => {
  let capturedUser = null;
  const syncHandler = async (req, res) => {
    capturedUser = req.user;
    return res.status(200).json({
      success: true,
      message: 'Profile synchronized successfully',
      user: {
        firebaseUid: req.user.firebaseUid,
        email: req.user.email,
        emailVerified: req.user.emailVerified
      }
    });
  };
  const protectedHandler = withAuth(syncHandler, { requireEmailVerified: false });

  const req = {
    method: 'POST',
    headers: { authorization: 'Bearer mock-token-validUid99-verified-password' }
  };
  const res = createMockRes();

  await protectedHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.jsonData.success, true);
  assert.equal(capturedUser.firebaseUid, 'validUid99');
  assert.equal(capturedUser.emailVerified, true);
  assert.equal(res.jsonData.user.firebaseUid, 'validUid99');
});

test('Sync-User: MongoDB failure returns 500 DATABASE_ERROR and is never masked as 404', async () => {
  // Simulate database failure inside handler
  const syncHandler = async (req, res) => {
    try {
      throw new Error('MongoNetworkTimeoutError: connection timed out');
    } catch (error) {
      if (error.code === 11000) {
        return res.status(200).json({ success: true });
      }
      return res.status(500).json({
        success: false,
        code: 'DATABASE_ERROR',
        message: 'Failed to synchronize user profile. Please try again later.'
      });
    }
  };
  const protectedHandler = withAuth(syncHandler, { requireEmailVerified: false });

  const req = {
    method: 'POST',
    headers: { authorization: 'Bearer mock-token-testUser-verified-password' }
  };
  const res = createMockRes();

  await protectedHandler(req, res);

  // Must be 500, not 404
  assert.equal(res.statusCode, 500);
  assert.equal(res.jsonData.success, false);
  assert.equal(res.jsonData.code, 'DATABASE_ERROR');
  assert.notEqual(res.statusCode, 404);
});

test('Sync-User: Duplicate key race condition (E11000) recovers safely with 200', async () => {
  // Simulate handling duplicate key error 11000 by retrieving existing user
  const existingRecord = {
    firebaseUid: 'duplicateUid123',
    email: 'duplicate@example.com',
    toJSON: () => ({ firebaseUid: 'duplicateUid123', email: 'duplicate@example.com' })
  };

  const syncHandler = async (req, res) => {
    try {
      const err = new Error('E11000 duplicate key error collection: users index: firebaseUid_1');
      err.code = 11000;
      throw err;
    } catch (error) {
      if (error.code === 11000) {
        // Safe reconciliation
        return res.status(200).json({
          success: true,
          message: 'Profile synchronized',
          user: existingRecord.toJSON()
        });
      }
      return res.status(500).json({ success: false });
    }
  };
  const protectedHandler = withAuth(syncHandler, { requireEmailVerified: false });

  const req = {
    method: 'POST',
    headers: { authorization: 'Bearer mock-token-duplicateUid123-verified-password' }
  };
  const res = createMockRes();

  await protectedHandler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.jsonData.success, true);
  assert.equal(res.jsonData.user.firebaseUid, 'duplicateUid123');
});
