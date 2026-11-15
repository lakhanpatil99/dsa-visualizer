import test from 'node:test';
import assert from 'node:assert/strict';
import { extractBearerToken, verifyIdToken, withAuth } from '../lib/auth.js';

// Set environment to test mode
process.env.NODE_ENV = 'test';

test('extractBearerToken extracts token correctly', () => {
  const req = { headers: { authorization: 'Bearer token-xyz-123' } };
  assert.equal(extractBearerToken(req), 'token-xyz-123');
});

test('extractBearerToken returns null when header is missing', () => {
  const req = { headers: {} };
  assert.equal(extractBearerToken(req), null);
});

test('extractBearerToken returns null when header is not Bearer', () => {
  const req = { headers: { authorization: 'Basic xyz123' } };
  assert.equal(extractBearerToken(req), null);
});

test('verifyIdToken decodes mock token in test mode', async () => {
  const token = 'mock-token-user1-verified-password';
  const decoded = await verifyIdToken(token);
  assert.equal(decoded.uid, 'user1');
  assert.equal(decoded.email_verified, true);
});

test('withAuth middleware returns 401 when Authorization header is missing', async () => {
  let handlerCalled = false;
  const handler = async (req, res) => { handlerCalled = true; };
  const protectedHandler = withAuth(handler);

  let statusCode = null;
  let jsonResponse = null;

  const req = { headers: {} };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    }
  };

  await protectedHandler(req, res);

  assert.equal(statusCode, 401);
  assert.equal(jsonResponse.code, 'UNAUTHORIZED');
  assert.equal(handlerCalled, false);
});

test('withAuth middleware rejects unverified email/password account with 403', async () => {
  let handlerCalled = false;
  const handler = async (req, res) => { handlerCalled = true; };
  const protectedHandler = withAuth(handler, { requireEmailVerified: true });

  let statusCode = null;
  let jsonResponse = null;

  // Mock token for unverified password account
  const req = { headers: { authorization: 'Bearer mock-token-userUnverified-unverified-password' } };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    }
  };

  await protectedHandler(req, res);

  assert.equal(statusCode, 403);
  assert.equal(jsonResponse.code, 'EMAIL_VERIFICATION_REQUIRED');
  assert.equal(handlerCalled, false);
});

test('withAuth middleware allows verified email/password account', async () => {
  let handlerCalled = false;
  const handler = async (req, res) => {
    handlerCalled = true;
    res.status(200).json({ success: true, user: req.user });
  };
  const protectedHandler = withAuth(handler, { requireEmailVerified: true });

  let statusCode = null;
  let jsonResponse = null;

  const req = { headers: { authorization: 'Bearer mock-token-userVerified-verified-password' } };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    }
  };

  await protectedHandler(req, res);

  assert.equal(statusCode, 200);
  assert.equal(handlerCalled, true);
  assert.equal(jsonResponse.user.uid, 'userVerified');
  assert.equal(jsonResponse.user.emailVerified, true);
});

test('withAuth middleware allows Google OAuth account even without separate email verification', async () => {
  let handlerCalled = false;
  const handler = async (req, res) => {
    handlerCalled = true;
    res.status(200).json({ success: true, user: req.user });
  };
  const protectedHandler = withAuth(handler, { requireEmailVerified: true });

  let statusCode = null;
  let jsonResponse = null;

  // Google provider token
  const req = { headers: { authorization: 'Bearer mock-token-googleUser-verified-google.com' } };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    }
  };

  await protectedHandler(req, res);

  assert.equal(statusCode, 200);
  assert.equal(handlerCalled, true);
  assert.equal(jsonResponse.user.uid, 'googleUser');
});
