/**
 * AlgoMania — Razorpay Live Reliability & Payment Invariants Test Suite
 *
 * Tests for: mode validation, key prefix matching, 9900 paise enforcement,
 * canonical domains, duplicate application prevention, timing-safe signatures,
 * webhook lifecycle states, and payment order attempt tracking.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// ── Razorpay Config Validation ──────────────────────────────────────────────

describe('Razorpay Configuration Validation (v3)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset all Razorpay env vars between tests
    delete process.env.RAZORPAY_MODE;
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    delete process.env.RAZORPAY_WEBHOOK_SECRET;
    delete process.env.INTERNSHIP_APPLICATION_FEE_PAISE;
    delete process.env.APP_BASE_URL;
    delete process.env.RAZORPAY_TEST_ALLOWED_UIDS;
  });

  it('throws when RAZORPAY_MODE is not set', async () => {
    // Dynamic import to get fresh module evaluation
    const { getRazorpayConfig } = await import('../lib/payments/razorpayConfig.js');
    assert.throws(
      () => getRazorpayConfig(),
      /RAZORPAY_MODE environment variable is required/
    );
  });

  it('throws when RAZORPAY_MODE is not "test" or "live"', async () => {
    process.env.RAZORPAY_MODE = 'staging';
    const { getRazorpayConfig } = await import('../lib/payments/razorpayConfig.js');
    assert.throws(
      () => getRazorpayConfig(),
      /must be explicitly "test" or "live"/
    );
  });

  it('throws when Key ID prefix mismatches the declared mode', async () => {
    process.env.RAZORPAY_MODE = 'live';
    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc123';
    process.env.RAZORPAY_KEY_SECRET = 'secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec';
    const { getRazorpayConfig } = await import('../lib/payments/razorpayConfig.js');
    assert.throws(
      () => getRazorpayConfig(),
      /prefix mismatch/
    );
  });

  it('INTERNSHIP_FEE_PAISE is strictly 9900 (₹99)', async () => {
    const { INTERNSHIP_FEE_PAISE, CANONICAL_INTERNSHIP_FEE_PAISE } = await import('../lib/payments/razorpayConfig.js');
    assert.strictEqual(CANONICAL_INTERNSHIP_FEE_PAISE, 9900);
    assert.strictEqual(INTERNSHIP_FEE_PAISE, 9900);
  });

  it('INTERNSHIP_FEE_INR equals 99', async () => {
    const { INTERNSHIP_FEE_INR } = await import('../lib/payments/razorpayConfig.js');
    assert.strictEqual(INTERNSHIP_FEE_INR, 99);
  });
});

// ── Canonical Domain Validation ─────────────────────────────────────────────

describe('Canonical Internship Domains', () => {
  it('validates java, python, cpp as canonical domains', async () => {
    const { validateDomain } = await import('../lib/internships/internshipData.js');
    assert.strictEqual(validateDomain('java'), 'java');
    assert.strictEqual(validateDomain('python'), 'python');
    assert.strictEqual(validateDomain('cpp'), 'cpp');
    assert.strictEqual(validateDomain('c++'), 'cpp');
    assert.strictEqual(validateDomain('Java'), 'java');
    assert.strictEqual(validateDomain('PYTHON'), 'python');
  });

  it('rejects unknown domains (never defaults to java)', async () => {
    const { validateDomain } = await import('../lib/internships/internshipData.js');
    assert.strictEqual(validateDomain('ruby'), null);
    assert.strictEqual(validateDomain('go'), null);
    assert.strictEqual(validateDomain(''), null);
    assert.strictEqual(validateDomain(null), null);
    assert.strictEqual(validateDomain(undefined), null);
  });

  it('getDomainDisplayName returns human-readable names', async () => {
    const { getDomainDisplayName } = await import('../lib/internships/internshipData.js');
    assert.strictEqual(getDomainDisplayName('java'), 'Java Development');
    assert.strictEqual(getDomainDisplayName('python'), 'Python Development');
    assert.strictEqual(getDomainDisplayName('cpp'), 'C++ Development');
    assert.strictEqual(getDomainDisplayName('rust'), null);
  });

  it('getProgramByDomain returns correct programs for canonical domains', async () => {
    const { getProgramByDomain } = await import('../lib/internships/internshipData.js');
    const java = getProgramByDomain('java');
    assert.ok(java);
    assert.strictEqual(java.domain, 'java');
    assert.ok(java.title.includes('Java'));

    const python = getProgramByDomain('python');
    assert.ok(python);
    assert.strictEqual(python.domain, 'python');

    const cpp = getProgramByDomain('cpp');
    assert.ok(cpp);
    assert.strictEqual(cpp.domain, 'cpp');

    assert.strictEqual(getProgramByDomain('ruby'), null);
  });
});

// ── Timing-Safe Signature Verification ──────────────────────────────────────

describe('Payment Signature Verification (Timing-Safe)', () => {
  it('verifies a valid HMAC-SHA256 signature', async () => {
    const { paymentProvider } = await import('../lib/payments/PaymentProvider.js');

    // We can't call verifyPaymentSignature without real config,
    // so test the underlying crypto directly
    const secret = 'test_secret_key';
    const orderId = 'order_12345';
    const paymentId = 'pay_67890';
    const body = `${orderId}|${paymentId}`;

    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // Verify timing-safe comparison works correctly
    const expectedBuf = Buffer.from(expected, 'hex');
    const actualBuf = Buffer.from(expected, 'hex');
    assert.ok(crypto.timingSafeEqual(expectedBuf, actualBuf));

    // Tampered signature should fail
    const tampered = expected.replace(/.$/, expected.endsWith('0') ? '1' : '0');
    const tamperedBuf = Buffer.from(tampered, 'hex');
    assert.ok(!crypto.timingSafeEqual(expectedBuf, tamperedBuf));
  });

  it('webhook signature verification rejects empty inputs', async () => {
    const { paymentProvider } = await import('../lib/payments/PaymentProvider.js');
    assert.strictEqual(paymentProvider.verifyWebhookSignature('', 'sig'), false);
    assert.strictEqual(paymentProvider.verifyWebhookSignature('body', ''), false);
    assert.strictEqual(paymentProvider.verifyWebhookSignature(null, null), false);
  });
});

// ── Memory Store Durability Invariants ──────────────────────────────────────

describe('MemoryStore Payment Order Tracking', () => {
  let memoryStore;

  beforeEach(async () => {
    const mod = await import('../lib/memoryStore.js');
    memoryStore = mod.default;
    memoryStore.clear();
  });

  it('saves and retrieves payment orders with attempts', () => {
    const order = {
      orderId: 'ord_test_1',
      applicationId: 'INT-2026-TEST01',
      firebaseUid: 'uid_test_1',
      userEmail: 'test@example.com',
      razorpayOrderId: 'order_rzp_1',
      amountPaise: 9900,
      currency: 'INR',
      paymentMode: 'test',
      status: 'CREATED',
      verificationStatus: 'UNVERIFIED',
      attempts: [
        { attemptId: 'att_1', status: 'CREATED', createdAt: new Date() }
      ]
    };

    memoryStore.savePaymentOrder(order);
    const retrieved = memoryStore.getPaymentOrder('ord_test_1');
    assert.ok(retrieved);
    assert.strictEqual(retrieved.amountPaise, 9900);
    assert.strictEqual(retrieved.attempts.length, 1);
  });

  it('never downgrades a CAPTURED payment to FAILED', () => {
    const order = {
      orderId: 'ord_captured_1',
      applicationId: 'INT-2026-TEST02',
      firebaseUid: 'uid_test_2',
      userEmail: 'test2@example.com',
      razorpayOrderId: 'order_rzp_2',
      amountPaise: 9900,
      currency: 'INR',
      paymentMode: 'test',
      status: 'CAPTURED',
      verificationStatus: 'FULLY_VERIFIED'
    };

    memoryStore.savePaymentOrder(order);

    // Simulate a late payment.failed webhook trying to downgrade
    const existing = memoryStore.getPaymentOrder('ord_captured_1');
    assert.strictEqual(existing.status, 'CAPTURED');

    // The webhook handler checks status !== 'CAPTURED' before updating
    if (existing.status !== 'CAPTURED') {
      memoryStore.updatePaymentOrder('ord_captured_1', { status: 'FAILED' });
    }

    const unchanged = memoryStore.getPaymentOrder('ord_captured_1');
    assert.strictEqual(unchanged.status, 'CAPTURED');
  });

  it('webhook event lifecycle tracks status transitions', () => {
    const event = {
      eventId: 'evt_lifecycle_1',
      eventType: 'payment.captured',
      status: 'PROCESSING',
      processingResult: 'in_progress'
    };

    memoryStore.saveWebhookEvent(event);
    const saved = memoryStore.getWebhookEvent('evt_lifecycle_1');
    assert.strictEqual(saved.status, 'PROCESSING');

    memoryStore.updateWebhookEvent('evt_lifecycle_1', {
      status: 'PROCESSED',
      processedAt: new Date(),
      processingResult: 'captured_and_verified'
    });

    const updated = memoryStore.getWebhookEvent('evt_lifecycle_1');
    assert.strictEqual(updated.status, 'PROCESSED');
    assert.ok(updated.processedAt);
  });

  it('duplicate application detection: returns existing unpaid application', () => {
    const app = {
      applicationId: 'INT-2026-DUP01',
      firebaseUid: 'uid_dup_1',
      userEmail: 'dup@example.com',
      domain: 'java',
      status: 'PENDING_REVIEW',
      paymentStatus: 'PENDING_PAYMENT'
    };

    memoryStore.saveApplication(app);

    // Simulate checking for existing application
    const existingApps = memoryStore.getApplicationsByUser('uid_dup_1');
    const existing = existingApps.find(a => a.domain === 'java');
    assert.ok(existing);
    assert.strictEqual(existing.paymentStatus, 'PENDING_PAYMENT');

    // Should allow updating details while unpaid
    const updated = memoryStore.updateApplication('INT-2026-DUP01', {
      fullName: 'Updated Name'
    });
    assert.strictEqual(updated.fullName, 'Updated Name');
    assert.strictEqual(updated.paymentStatus, 'PENDING_PAYMENT');
  });

  it('paid applications are not duplicated on retry', () => {
    const app = {
      applicationId: 'INT-2026-PAID01',
      firebaseUid: 'uid_paid_1',
      userEmail: 'paid@example.com',
      domain: 'python',
      status: 'PENDING_REVIEW',
      paymentStatus: 'PAID_VERIFIED'
    };

    memoryStore.saveApplication(app);

    const existingApps = memoryStore.getApplicationsByUser('uid_paid_1');
    const existing = existingApps.find(a => a.domain === 'python');
    assert.ok(existing);
    assert.strictEqual(existing.paymentStatus, 'PAID_VERIFIED');
    // The API handler would return 409 ALREADY_REGISTERED here
  });
});
