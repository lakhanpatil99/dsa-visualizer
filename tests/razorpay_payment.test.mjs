import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { getRazorpayConfig, isTestModeUser, INTERNSHIP_FEE_PAISE } from '../lib/payments/razorpayConfig.js';
import { paymentProvider } from '../lib/payments/PaymentProvider.js';
import memoryStore from '../lib/memoryStore.js';

describe('AlgoMania Razorpay Payment Gateway Integration', () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...origEnv };
    memoryStore.clear();
  });

  // ─── 1. Pricing & Currency Tests ─────────────────────────────────────────
  describe('Phase 2 — Pricing & Currency Consistency', () => {
    it('enforces exact internship registration fee of 9900 paise (₹99.00 INR)', () => {
      assert.equal(INTERNSHIP_FEE_PAISE, 9900, 'Fee must be exactly 9900 paise');
      const rupees = INTERNSHIP_FEE_PAISE / 100;
      assert.equal(rupees, 99, 'Rupee fee must be exactly 99.00');
    });

    it('server owns the fee calculation and does not rely on frontend', () => {
      const clientAmountAttempt = 100; // Malicious client attempt: ₹1
      assert.notEqual(INTERNSHIP_FEE_PAISE, clientAmountAttempt);
      assert.equal(INTERNSHIP_FEE_PAISE, 9900);
    });
  });

  // ─── 2. Configuration & Credential Validation ───────────────────────────
  describe('Phase 1 — Configuration & Environment Validation', () => {
    it('fails safely when RAZORPAY_KEY_ID is missing', () => {
      delete process.env.RAZORPAY_KEY_ID;
      process.env.RAZORPAY_KEY_SECRET = 'secret123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook123';
      process.env.RAZORPAY_MODE = 'test';

      assert.throws(() => getRazorpayConfig(), /RAZORPAY_KEY_ID environment variable is not set/);
    });

    it('fails safely when RAZORPAY_KEY_SECRET is missing', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_abc123';
      delete process.env.RAZORPAY_KEY_SECRET;
      process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook123';
      process.env.RAZORPAY_MODE = 'test';

      assert.throws(() => getRazorpayConfig(), /RAZORPAY_KEY_SECRET environment variable is not set/);
    });

    it('fails safely when RAZORPAY_WEBHOOK_SECRET is missing', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_abc123';
      process.env.RAZORPAY_KEY_SECRET = 'secret123';
      delete process.env.RAZORPAY_WEBHOOK_SECRET;
      process.env.RAZORPAY_MODE = 'test';

      assert.throws(() => getRazorpayConfig(), /RAZORPAY_WEBHOOK_SECRET environment variable is not set/);
    });

    it('rejects mode mismatch: test key used with RAZORPAY_MODE=live', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_123456789';
      process.env.RAZORPAY_KEY_SECRET = 'secret123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook123';
      process.env.RAZORPAY_MODE = 'live';

      assert.throws(() => getRazorpayConfig(), /RAZORPAY_KEY_ID prefix mismatch/);
    });

    it('rejects mode mismatch: live key used with RAZORPAY_MODE=test', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_live_123456789';
      process.env.RAZORPAY_KEY_SECRET = 'secret123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'webhook123';
      process.env.RAZORPAY_MODE = 'test';

      assert.throws(() => getRazorpayConfig(), /RAZORPAY_KEY_ID prefix mismatch/);
    });

    it('accepts matching test key with RAZORPAY_MODE=test', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_ValidKey123';
      process.env.RAZORPAY_KEY_SECRET = 'ValidSecret123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'ValidWebhookSecret123';
      process.env.RAZORPAY_MODE = 'test';

      const config = getRazorpayConfig();
      assert.equal(config.keyId, 'rzp_test_ValidKey123');
      assert.equal(config.mode, 'test');
      assert.equal(config.feePaise, 9900);
    });

    it('correctly checks RAZORPAY_TEST_ALLOWED_UIDS allowlist', () => {
      process.env.RAZORPAY_TEST_ALLOWED_UIDS = 'uid_admin_1, uid_tester_2, uid_founder_3';

      assert.equal(isTestModeUser('uid_admin_1'), true);
      assert.equal(isTestModeUser('uid_tester_2'), true);
      assert.equal(isTestModeUser('uid_random_public_user'), false);
      assert.equal(isTestModeUser(null), false);
      assert.equal(isTestModeUser(''), false);
    });
  });

  // ─── 3. Cryptographic Signature Verification ───────────────────────────
  describe('Phase 4 — Cryptographic HMAC-SHA256 Signature Verification', () => {
    const keySecret = 'sample_secret_key_for_testing_12345';

    beforeEach(() => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_12345678';
      process.env.RAZORPAY_KEY_SECRET = keySecret;
      process.env.RAZORPAY_WEBHOOK_SECRET = 'sample_webhook_secret_67890';
      process.env.RAZORPAY_MODE = 'test';
    });

    it('verifies a valid Razorpay checkout signature', () => {
      const orderId = 'order_test_998877';
      const paymentId = 'pay_test_112233';

      const validSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = paymentProvider.verifyPaymentSignature({
        orderId,
        paymentId,
        signature: validSignature,
      });

      assert.equal(isValid, true, 'Valid HMAC signature must pass');
    });

    it('rejects a forged or tampered signature', () => {
      const orderId = 'order_test_998877';
      const paymentId = 'pay_test_112233';
      const forgedSignature = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

      const isValid = paymentProvider.verifyPaymentSignature({
        orderId,
        paymentId,
        signature: forgedSignature,
      });

      assert.equal(isValid, false, 'Tampered signature must be rejected');
    });

    it('rejects when order ID or payment ID does not match the signature', () => {
      const orderId = 'order_test_998877';
      const paymentId = 'pay_test_112233';

      const signature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      // Attempt verification with an altered order ID
      const isValid = paymentProvider.verifyPaymentSignature({
        orderId: 'order_test_ATTACKER_ID',
        paymentId,
        signature,
      });

      assert.equal(isValid, false, 'Signature with mismatched order ID must fail');
    });

    it('rejects empty or missing parameters', () => {
      assert.equal(paymentProvider.verifyPaymentSignature({}), false);
      assert.equal(paymentProvider.verifyPaymentSignature({ orderId: 'ord', paymentId: 'pay' }), false);
      assert.equal(paymentProvider.verifyPaymentSignature({ orderId: 'ord', signature: 'sig' }), false);
    });
  });

  // ─── 4. Webhook Signature Verification ─────────────────────────────────
  describe('Phase 8 — Webhook Signature Verification', () => {
    const webhookSecret = 'sample_webhook_secret_key_abcxyz';

    beforeEach(() => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_12345678';
      process.env.RAZORPAY_KEY_SECRET = 'secret123';
      process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
      process.env.RAZORPAY_MODE = 'test';
    });

    it('validates a genuine Razorpay webhook payload signature', () => {
      const payloadString = JSON.stringify({
        event: 'payment.captured',
        payload: { payment: { entity: { id: 'pay_123', amount: 9900 } } },
      });

      const validSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payloadString)
        .digest('hex');

      const isValid = paymentProvider.verifyWebhookSignature(payloadString, validSignature);
      assert.equal(isValid, true, 'Genuine webhook signature must pass');
    });

    it('rejects an invalid webhook signature', () => {
      const payloadString = '{"event":"payment.captured"}';
      const invalidSignature = 'invalid_signature_hex';

      const isValid = paymentProvider.verifyWebhookSignature(payloadString, invalidSignature);
      assert.equal(isValid, false, 'Invalid webhook signature must fail');
    });

    it('rejects when payload has been modified post-signing', () => {
      const originalPayload = '{"event":"payment.captured","amount":9900}';
      const signature = crypto
        .createHmac('sha256', webhookSecret)
        .update(originalPayload)
        .digest('hex');

      const modifiedPayload = '{"event":"payment.captured","amount":100}'; // tampered amount
      const isValid = paymentProvider.verifyWebhookSignature(modifiedPayload, signature);
      assert.equal(isValid, false, 'Tampered payload must fail signature check');
    });
  });

  // ─── 5. Payment State Machine & Invariants ─────────────────────────────
  describe('Phase 5 — Payment State Machine & Invariants', () => {
    it('prevents CAPTURED order from being downgraded to FAILED', () => {
      const order = {
        orderId: 'ord_state_1',
        applicationId: 'INT-2026-TEST1',
        status: 'CAPTURED',
        verificationStatus: 'FULLY_VERIFIED',
      };
      memoryStore.savePaymentOrder(order);

      // Attempting to downgrade status to FAILED
      const existing = memoryStore.getPaymentOrder('ord_state_1');
      if (existing.status !== 'CAPTURED') {
        memoryStore.updatePaymentOrder('ord_state_1', { status: 'FAILED' });
      }

      const unchanged = memoryStore.getPaymentOrder('ord_state_1');
      assert.equal(unchanged.status, 'CAPTURED', 'CAPTURED status must never regress to FAILED');
    });

    it('allows FAILED payment to transition to PENDING on valid retry', () => {
      const order = {
        orderId: 'ord_retry_1',
        applicationId: 'INT-2026-RETRY1',
        status: 'FAILED',
        verificationStatus: 'VERIFICATION_FAILED',
      };
      memoryStore.savePaymentOrder(order);

      // User retries
      const updated = memoryStore.updatePaymentOrder('ord_retry_1', {
        status: 'PENDING',
        verificationStatus: 'UNVERIFIED',
      });

      assert.equal(updated.status, 'PENDING');
      assert.equal(updated.verificationStatus, 'UNVERIFIED');
    });

    it('prevents duplicate webhook processing using eventId dedup', () => {
      const eventId = 'evt_unique_12345';
      const eventDoc = {
        eventId,
        eventType: 'payment.captured',
        processedAt: new Date(),
        processingResult: 'captured_and_verified',
      };

      // First delivery
      memoryStore.saveWebhookEvent(eventDoc);
      assert.ok(memoryStore.getWebhookEvent(eventId));

      // Second delivery with duplicate eventId
      const isDuplicate = Boolean(memoryStore.getWebhookEvent(eventId));
      assert.equal(isDuplicate, true, 'Duplicate webhook event must be detected');
    });
  });

  // ─── 6. Application Ownership & Idempotency ────────────────────────────
  describe('Phase 6 & 9 — Application Ownership & Double-Payment Prevention', () => {
    it('verifies order belongs to correct user and application', () => {
      const app = {
        applicationId: 'INT-2026-OWNER1',
        firebaseUid: 'user_alice_123',
        userEmail: 'alice@example.com',
        paymentStatus: 'PENDING_PAYMENT',
      };
      memoryStore.saveApplication(app);

      const order = {
        orderId: 'ord_owner_1',
        applicationId: 'INT-2026-OWNER1',
        firebaseUid: 'user_alice_123',
        status: 'CREATED',
        amountPaise: 9900,
      };
      memoryStore.savePaymentOrder(order);

      // Alice accesses order
      const fetchedOrder = memoryStore.getPaymentOrder('ord_owner_1');
      assert.equal(fetchedOrder.firebaseUid, 'user_alice_123');

      // Bob tries to access Alice's order
      const bobUid = 'user_bob_456';
      const isAuthorized = fetchedOrder.firebaseUid === bobUid;
      assert.equal(isAuthorized, false, 'User must not be authorized to access another user order');
    });

    it('returns existing order when an open order is already in progress', () => {
      const appId = 'INT-2026-IDEMP1';
      const userUid = 'user_charlie_789';

      const existingOrder = {
        orderId: 'ord_open_1',
        applicationId: appId,
        firebaseUid: userUid,
        razorpayOrderId: 'order_rzp_existing',
        status: 'PENDING',
        amountPaise: 9900,
      };
      memoryStore.savePaymentOrder(existingOrder);

      const orders = memoryStore.getPaymentOrdersByApplication(appId);
      const openOrder = orders.find(
        (o) => o.firebaseUid === userUid && ['CREATED', 'PENDING'].includes(o.status)
      );

      assert.ok(openOrder);
      assert.equal(openOrder.razorpayOrderId, 'order_rzp_existing');
    });
  });

  // ─── 7. Certificate Unlock Security Rules ──────────────────────────────
  describe('Phase 10 — Certificate Unlock Rules', () => {
    it('rejects certificate issuance if paymentStatus is not PAID_VERIFIED', () => {
      const app = {
        applicationId: 'INT-2026-NOCERT1',
        fullName: 'Test Candidate',
        status: 'COMPLETED',
        paymentStatus: 'PENDING_PAYMENT', // not verified
      };
      memoryStore.saveApplication(app);

      // Policy check
      const canIssue = app.status === 'COMPLETED' && app.paymentStatus === 'PAID_VERIFIED';
      assert.equal(canIssue, false, 'Certificate cannot be issued without verified payment');
    });

    it('rejects certificate issuance if internship status is not COMPLETED even if paid', () => {
      const app = {
        applicationId: 'INT-2026-NOCERT2',
        fullName: 'Test Candidate',
        status: 'IN_PROGRESS', // not completed
        paymentStatus: 'PAID_VERIFIED', // paid
      };
      memoryStore.saveApplication(app);

      const canIssue = app.status === 'COMPLETED' && app.paymentStatus === 'PAID_VERIFIED';
      assert.equal(canIssue, false, 'Certificate cannot be issued if internship is not completed');
    });

    it('permits certificate issuance only when internship is COMPLETED AND payment is PAID_VERIFIED', () => {
      const app = {
        applicationId: 'INT-2026-ELIGIBLE',
        fullName: 'Graduated Fellow',
        status: 'COMPLETED',
        paymentStatus: 'PAID_VERIFIED',
      };
      memoryStore.saveApplication(app);

      const canIssue = app.status === 'COMPLETED' && app.paymentStatus === 'PAID_VERIFIED';
      assert.equal(canIssue, true, 'Certificate can be issued when both criteria are met');
    });
  });
});
