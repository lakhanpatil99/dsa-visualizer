/**
 * AlgoMania — Razorpay Payment Provider
 *
 * Production-grade wrapper around the `razorpay` npm package.
 * Handles order creation, signature verification, payment fetching,
 * and webhook signature validation.
 *
 * SECURITY:
 *  - HMAC verification uses crypto.timingSafeEqual() to prevent timing attacks.
 *  - Key secret is never exposed to client responses.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getRazorpayConfig, INTERNSHIP_FEE_PAISE } from './razorpayConfig.js';

export const PAYMENT_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING: 'PENDING',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  PAID_VERIFIED: 'PAID_VERIFIED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

class PaymentProvider {
  constructor() {
    this._instance = null;
    this._keyId = null;
    this._keySecret = null;
  }

  /**
   * Lazily initialises the Razorpay SDK instance so env vars can be loaded
   * at request time rather than module-load time (important for serverless).
   */
  _getRazorpay() {
    const config = getRazorpayConfig();
    if (!this._instance || this._keyId !== config.keyId || this._keySecret !== config.keySecret) {
      this._keyId = config.keyId;
      this._keySecret = config.keySecret;
      this._instance = new Razorpay({
        key_id: config.keyId,
        key_secret: config.keySecret,
      });
    }
    return this._instance;
  }

  /** @returns {import('./razorpayConfig.js').RazorpayConfig} */
  _getConfig() {
    return getRazorpayConfig();
  }

  // ─── Order Creation ──────────────────────────────────────────────

  /**
   * Creates a Razorpay order for an internship application fee.
   *
   * @param {{ applicationId: string, userId: string, userEmail: string, correlationId?: string }} params
   * @returns {Promise<import('razorpay/dist/types/orders').Orders.RazorpayOrder>}
   */
  async createOrder({ applicationId, userId, userEmail, correlationId }) {
    const rz = this._getRazorpay();
    const config = this._getConfig();

    const startTime = Date.now();
    const timeoutMs = 8000; // 8 seconds bounded timeout

    const orderPromise = rz.orders.create({
      amount: INTERNSHIP_FEE_PAISE,
      currency: 'INR',
      receipt: applicationId,
      notes: {
        applicationId,
        userId,
        userEmail,
        mode: config.mode,
        correlationId: correlationId || '',
      },
    });

    let timer = null;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error(`Razorpay upstream order creation timed out after ${timeoutMs}ms`);
        err.code = 'UPSTREAM_TIMEOUT';
        reject(err);
      }, timeoutMs);
    });

    try {
      const order = await Promise.race([orderPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);
      order._durationMs = Date.now() - startTime;
      return order;
    } catch (err) {
      if (timer) clearTimeout(timer);
      const durationMs = Date.now() - startTime;
      console.error(`[PaymentProvider] createOrder failed after ${durationMs}ms:`, err.message);
      throw err;
    }
  }

  /**
   * Fetches order details from Razorpay API.
   *
   * @param {string} orderId
   * @returns {Promise<object>}
   */
  async fetchOrder(orderId) {
    const rz = this._getRazorpay();
    return rz.orders.fetch(orderId);
  }

  // ─── Client-Side Callback Signature Verification ─────────────────

  /**
   * Verifies the Razorpay checkout callback signature.
   *
   * @param {{ orderId: string, paymentId: string, signature: string }} params
   * @returns {boolean}
   */
  verifyPaymentSignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId || !signature) return false;

    const config = this._getConfig();
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.keySecret)
      .update(body)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    try {
      const expected = Buffer.from(expectedSignature, 'hex');
      const actual = Buffer.from(signature, 'hex');
      if (expected.length !== actual.length) return false;
      return crypto.timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }

  // ─── Fetch Payment Details ───────────────────────────────────────

  /**
   * Fetches payment details from the Razorpay API.
   *
   * @param {string} paymentId — e.g. `pay_XXXXXXXXXX`
   * @returns {Promise<object>}
   */
  async fetchPayment(paymentId) {
    const rz = this._getRazorpay();
    return rz.payments.fetch(paymentId);
  }

  // ─── Fetch Payments for an Order ──────────────────────────────────

  /**
   * Fetches all payment attempts associated with a Razorpay order.
   *
   * @param {string} orderId — e.g. `order_XXXXXXXXXX`
   * @returns {Promise<object>}
   */
  async fetchOrderPayments(orderId) {
    const rz = this._getRazorpay();
    return rz.orders.fetchPayments(orderId);
  }

  // ─── Refund Payment ──────────────────────────────────────────────

  /**
   * Initiates a refund for a captured payment.
   *
   * @param {string} paymentId — e.g. `pay_XXXXXXXXXX`
   * @param {object} [options] — e.g. { amount, speed, notes }
   * @returns {Promise<object>}
   */
  async createRefund(paymentId, options = {}) {
    const rz = this._getRazorpay();
    return rz.payments.refund(paymentId, options);
  }

  // ─── Webhook Signature Verification ──────────────────────────────

  /**
   * Verifies the X-Razorpay-Signature header sent with webhook payloads.
   *
   * @param {string|Buffer} rawBody — raw request body
   * @param {string} signature — header value
   * @returns {boolean}
   */
  verifyWebhookSignature(rawBody, signature) {
    if (!rawBody || !signature) return false;

    const config = this._getConfig();
    const expectedSignature = crypto
      .createHmac('sha256', config.webhookSecret)
      .update(rawBody)
      .digest('hex');

    try {
      const expected = Buffer.from(expectedSignature, 'hex');
      const actual = Buffer.from(signature, 'hex');
      if (expected.length !== actual.length) return false;
      return crypto.timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }
}

// Singleton export
export const paymentProvider = new PaymentProvider();
export default paymentProvider;
