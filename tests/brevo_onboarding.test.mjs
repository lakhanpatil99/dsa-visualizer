import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { getBrevoConfig, resetBrevoConfig } from '../src/services/brevo/BrevoConfig.js';
import { BrevoClient } from '../src/services/brevo/BrevoClient.js';
import OnboardingEvent from '../models/OnboardingEvent.js';
import fs from 'fs';
import path from 'path';

describe('Brevo Automated Onboarding Engine — Unit & Invariant Tests', () => {

  beforeEach(() => {
    resetBrevoConfig();
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_ONBOARDING_ENABLED;
    delete process.env.BREVO_ONBOARDING_TEMPLATE_ID;
    delete process.env.BREVO_SENDER_EMAIL;
    delete process.env.BREVO_SENDER_NAME;
    delete process.env.APP_BASE_URL;
  });

  describe('BrevoConfig Validation & Isolation', () => {
    it('returns isConfigured: false when environment variables are missing (fails safe)', () => {
      const config = getBrevoConfig();
      assert.strictEqual(config.isConfigured, false);
      assert.strictEqual(config.isEnabled, false);
      assert.ok(config.errors.length > 0);
    });

    it('returns isConfigured: false when BREVO_ONBOARDING_ENABLED is not true', () => {
      process.env.BREVO_API_KEY = 'xkeysib-mock-api-key';
      process.env.BREVO_ONBOARDING_TEMPLATE_ID = '8';
      process.env.BREVO_ONBOARDING_ENABLED = 'false';

      const config = getBrevoConfig();
      assert.strictEqual(config.isConfigured, false);
      assert.strictEqual(config.isEnabled, false);
    });

    it('rejects non-numeric template ID safely', () => {
      process.env.BREVO_API_KEY = 'xkeysib-mock-api-key';
      process.env.BREVO_ONBOARDING_TEMPLATE_ID = 'invalid_id';
      process.env.BREVO_ONBOARDING_ENABLED = 'true';

      const config = getBrevoConfig();
      assert.strictEqual(config.isConfigured, false);
      assert.strictEqual(config.templateId, null);
    });

    it('returns isConfigured: true when valid configuration is provided', () => {
      process.env.BREVO_API_KEY = 'xkeysib-mock-api-key';
      process.env.BREVO_ONBOARDING_TEMPLATE_ID = '8';
      process.env.BREVO_ONBOARDING_ENABLED = 'true';
      process.env.BREVO_SENDER_EMAIL = 'welcome@algomania.in';
      process.env.BREVO_SENDER_NAME = 'AlgoMania Team';
      process.env.APP_BASE_URL = 'https://www.algomania.in';

      const config = getBrevoConfig();
      assert.strictEqual(config.isConfigured, true);
      assert.strictEqual(config.isEnabled, true);
      assert.strictEqual(config.templateId, 8);
      assert.strictEqual(config.senderEmail, 'welcome@algomania.in');
      assert.strictEqual(config.senderName, 'AlgoMania Team');
      assert.strictEqual(config.appBaseUrl, 'https://www.algomania.in');
      assert.strictEqual(config.errors.length, 0);
    });
  });

  describe('BrevoClient Classification & Parameter Preparation', () => {
    it('throws error if constructed without API key', () => {
      assert.throws(() => new BrevoClient(), {
        message: /API key is required/
      });
    });

    it('constructs successfully with API key', () => {
      const client = new BrevoClient('xkeysib-test-key');
      assert.strictEqual(client.apiKey, 'xkeysib-test-key');
    });

    it('handles simulated HTTP 401/404 as permanent error without crashing', async () => {
      const client = new BrevoClient('xkeysib-test-key');
      const originalFetch = global.fetch;

      // Mock 401 Unauthorized
      global.fetch = async () => ({
        ok: false,
        status: 401,
        text: async () => 'Key not found',
        json: async () => ({ message: 'Key not found', code: 'unauthorized' })
      });

      try {
        const res = await client.getTemplate(8);
        assert.strictEqual(res.success, false);
        assert.strictEqual(res.errorType, 'permanent');
        assert.strictEqual(res.status, 401);
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('handles simulated HTTP 429/500 as transient error', async () => {
      const client = new BrevoClient('xkeysib-test-key');
      const originalFetch = global.fetch;

      // Mock 429 Rate Limit
      global.fetch = async () => ({
        ok: false,
        status: 429,
        text: async () => 'Too many requests',
        json: async () => ({ message: 'Rate limit exceeded' })
      });

      try {
        const res = await client.sendTransactionalEmail({
          templateId: 8,
          to: [{ email: 'student@example.com' }]
        });
        assert.strictEqual(res.success, false);
        assert.strictEqual(res.errorType, 'transient');
        assert.strictEqual(res.status, 429);
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('parses successful 201 response and extracts messageId', async () => {
      const client = new BrevoClient('xkeysib-test-key');
      const originalFetch = global.fetch;

      // Mock 201 Accepted
      global.fetch = async () => ({
        ok: true,
        status: 201,
        json: async () => ({ messageId: '<202611171200.1234567@smtp-relay.brevo.com>' })
      });

      try {
        const res = await client.sendTransactionalEmail({
          templateId: 8,
          to: [{ email: 'student@example.com', name: 'Student Name' }],
          params: { firstName: 'Student', workspaceUrl: 'https://www.algomania.in/app' }
        });
        assert.strictEqual(res.success, true);
        assert.strictEqual(res.messageId, '<202611171200.1234567@smtp-relay.brevo.com>');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('OnboardingEvent Mongoose Schema & Indexes', () => {
    it('verifies OnboardingEvent schema has unique compound index on (firebaseUid, eventType)', () => {
      const indexes = OnboardingEvent.schema.indexes();
      const uniqueIndex = indexes.find(
        ([fields, opts]) => fields.firebaseUid === 1 && fields.eventType === 1 && opts.unique === true
      );
      assert.ok(uniqueIndex, 'Must define unique compound index on { firebaseUid: 1, eventType: 1 }');
    });

    it('verifies all required lifecycle statuses are supported', () => {
      const statusField = OnboardingEvent.schema.path('status');
      const enumValues = statusField.enumValues;
      assert.ok(enumValues.includes('PENDING_VERIFICATION'));
      assert.ok(enumValues.includes('QUEUED'));
      assert.ok(enumValues.includes('PROCESSING'));
      assert.ok(enumValues.includes('ACCEPTED_BY_BREVO'));
      assert.ok(enumValues.includes('RETRYABLE_FAILURE'));
      assert.ok(enumValues.includes('PERMANENT_FAILURE'));
    });
  });

  describe('Frontend & Endpoint Contract Invariants', () => {
    it('verifies pages/register.js dispatches /api/auth/onboarding/initiate safely', () => {
      const registerContent = fs.readFileSync(path.resolve('pages/register.js'), 'utf8');
      assert.ok(registerContent.includes('/api/auth/onboarding/initiate'), 'Must call onboarding/initiate');
      assert.ok(registerContent.includes('catch'), 'Must protect against unhandled rejection');
    });

    it('verifies pages/verify-email.js dispatches /api/auth/onboarding/complete upon verification', () => {
      const verifyContent = fs.readFileSync(path.resolve('pages/verify-email.js'), 'utf8');
      assert.ok(verifyContent.includes('/api/auth/onboarding/complete'), 'Must call onboarding/complete');
      assert.ok(verifyContent.includes('triggerOnboardingEmail'), 'Must have trigger helper');
    });

    it('verifies src/contexts/AuthContext.js detects new Google users and dispatches onboarding/complete', () => {
      const authContent = fs.readFileSync(path.resolve('src/contexts/AuthContext.js'), 'utf8');
      assert.ok(authContent.includes('/api/auth/onboarding/complete'), 'Must call onboarding/complete for Google');
      assert.ok(authContent.includes('creationTime'), 'Must inspect user creation metadata');
    });

    it('verifies pages/api/auth/onboarding/complete enforces email verification', () => {
      const completeApiContent = fs.readFileSync(path.resolve('pages/api/auth/onboarding/complete.js'), 'utf8');
      assert.ok(completeApiContent.includes('requireEmailVerified: true'), 'Must enforce requireEmailVerified');
      assert.ok(completeApiContent.includes('EMAIL_NOT_VERIFIED'), 'Must return EMAIL_NOT_VERIFIED code');
    });

    it('verifies pages/api/auth/onboarding/initiate allows unverified email for manual registration', () => {
      const initiateApiContent = fs.readFileSync(path.resolve('pages/api/auth/onboarding/initiate.js'), 'utf8');
      assert.ok(initiateApiContent.includes('requireEmailVerified: false'), 'Must allow requireEmailVerified: false');
    });
  });
});
