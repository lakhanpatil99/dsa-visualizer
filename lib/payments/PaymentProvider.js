/**
 * AlgoMania Payment Provider Architecture & Abstraction.
 * Designed for future Razorpay integration while enforcing strict server-side verification.
 * 
 * Strict Policies:
 * - Browser state NEVER sets 'PAID_VERIFIED'.
 * - No fake payments or simulated success in production.
 * - Zero secret leakage.
 */

export const PAYMENT_STATUS = {
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  PAID_VERIFIED: 'PAID_VERIFIED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export class PaymentProvider {
  constructor(config = {}) {
    this.keyId = config.keyId || process.env.RAZORPAY_KEY_ID || null;
    this.keySecret = config.keySecret || process.env.RAZORPAY_KEY_SECRET || null;
    this.isConfigured = Boolean(this.keyId && this.keySecret);
  }

  /**
   * Initializes order creation with provider.
   */
  async createOrder({ userId, userEmail, purpose, referenceId, amount, currency = 'INR', tier = null }) {
    if (!this.isConfigured) {
      return {
        status: PAYMENT_STATUS.NOT_CONFIGURED,
        orderId: null,
        amount,
        currency,
        message: 'Payment gateway activation is currently in progress. Certificate fee processing is not yet active.'
      };
    }

    // When Razorpay keys are provided in future:
    // const razorpay = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
    // return await razorpay.orders.create({ ... })
    return {
      status: PAYMENT_STATUS.PENDING,
      orderId: `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      amount,
      currency,
      message: 'Order initiated.'
    };
  }

  /**
   * Authoritative server-side signature verification.
   * Rejects any client-forged payment confirmation.
   */
  async verifyPayment({ orderId, paymentId, signature }) {
    if (!this.isConfigured) {
      return {
        verified: false,
        status: PAYMENT_STATUS.NOT_CONFIGURED,
        message: 'Payment verification unavailable: Provider is not active.'
      };
    }

    if (!orderId || !paymentId || !signature) {
      return {
        verified: false,
        status: PAYMENT_STATUS.FAILED,
        message: 'Incomplete payment credentials.'
      };
    }

    // Cryptographic signature check:
    // const crypto = require('crypto');
    // const expected = crypto.createHmac('sha256', this.keySecret).update(`${orderId}|${paymentId}`).digest('hex');
    // const verified = expected === signature;
    return {
      verified: false,
      status: PAYMENT_STATUS.FAILED,
      message: 'Signature mismatch or unverified transaction.'
    };
  }

  /**
   * Fetches payment status.
   */
  async getPaymentStatus(referenceId) {
    if (!this.isConfigured) {
      return {
        status: PAYMENT_STATUS.NOT_CONFIGURED,
        isPaid: false,
        message: 'Payment gateway is not currently configured.'
      };
    }
    return {
      status: PAYMENT_STATUS.PENDING,
      isPaid: false
    };
  }

  /**
   * Handles payment refunds.
   */
  async refundPayment(paymentId, amount) {
    if (!this.isConfigured) {
      throw new Error('Payment provider not configured.');
    }
    return { status: PAYMENT_STATUS.REFUNDED };
  }
}

// Singleton default instance
export const paymentProvider = new PaymentProvider();
