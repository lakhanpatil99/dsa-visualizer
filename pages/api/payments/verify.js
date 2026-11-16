/**
 * POST /api/payments/verify
 *
 * Server-side verification of a Razorpay payment after the client-side
 * checkout completes. Performs:
 *   1. Signature verification (HMAC-SHA256, timing-safe)
 *   2. Payment details fetch from Razorpay API
 *   3. Amount / currency / order validation
 *   4. Atomic status update (prevents double-capture race)
 *
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId }
 */

import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';
import { INTERNSHIP_FEE_PAISE } from '../../../lib/payments/razorpayConfig.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    applicationId,
  } = req.body || {};

  // ── Input validation ──────────────────────────────────────────────
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !applicationId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId.',
    });
  }

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) {
      isConnected = true;
    }
  } catch (err) {
    console.warn('MongoDB connection check failed, using memory store fallback:', err.message);
  }

  // ── Find PaymentOrder ─────────────────────────────────────────────
  let paymentOrder = null;
  if (isConnected) {
    paymentOrder = await PaymentOrder.findOne({ razorpayOrderId: razorpay_order_id });
  } else {
    paymentOrder = memoryStore.getPaymentOrderByRazorpayOrderId(razorpay_order_id);
  }

  if (!paymentOrder) {
    return res.status(404).json({ success: false, message: 'Payment order not found.' });
  }

  // ── Ownership check ───────────────────────────────────────────────
  if (paymentOrder.firebaseUid !== user.uid) {
    return res.status(403).json({ success: false, message: 'Unauthorised: This order does not belong to you.' });
  }

  // ── Idempotency — already captured ────────────────────────────────
  if (paymentOrder.status === 'CAPTURED' && paymentOrder.verificationStatus === 'FULLY_VERIFIED') {
    return res.status(200).json({
      success: true,
      message: 'Payment already verified.',
      paymentOrder: {
        orderId: paymentOrder.orderId,
        razorpayOrderId: paymentOrder.razorpayOrderId,
        razorpayPaymentId: paymentOrder.razorpayPaymentId,
        status: paymentOrder.status,
        verificationStatus: paymentOrder.verificationStatus,
        capturedAt: paymentOrder.capturedAt,
      },
    });
  }

  // ── Step 1: Signature verification ────────────────────────────────
  const isSignatureValid = paymentProvider.verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isSignatureValid) {
    const failedUpdates = {
      verificationStatus: 'VERIFICATION_FAILED',
      status: 'FAILED',
      failedAt: new Date(),
      errorMessage: 'Signature verification failed.',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    if (isConnected) {
      await PaymentOrder.findOneAndUpdate({ _id: paymentOrder._id }, failedUpdates);
    } else {
      memoryStore.updatePaymentOrder(paymentOrder.orderId, failedUpdates);
    }

    return res.status(400).json({
      success: false,
      message: 'Payment signature verification failed. This may indicate tampering.',
    });
  }

  // ── Step 2: Fetch payment from Razorpay ───────────────────────────
  let payment;
  try {
    payment = await paymentProvider.fetchPayment(razorpay_payment_id);
  } catch (err) {
    console.error('[verify] Failed to fetch payment from Razorpay:', err);
    // Signature is valid, mark for later reconciliation
    const pendingUpdates = {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verificationStatus: 'SIGNATURE_VALID',
      status: 'PENDING',
    };

    if (isConnected) {
      await PaymentOrder.findOneAndUpdate({ _id: paymentOrder._id }, pendingUpdates);
    } else {
      memoryStore.updatePaymentOrder(paymentOrder.orderId, pendingUpdates);
    }

    return res.status(502).json({
      success: false,
      message: 'Unable to verify payment details with Razorpay. Please check status later.',
    });
  }

  // ── Step 3: Validate amount, currency, status, order ──────────────
  const errors = [];

  if (payment.amount !== INTERNSHIP_FEE_PAISE) {
    errors.push(`Amount mismatch: expected ${INTERNSHIP_FEE_PAISE}, got ${payment.amount}`);
  }
  if (payment.currency !== 'INR') {
    errors.push(`Currency mismatch: expected INR, got ${payment.currency}`);
  }
  if (payment.status !== 'captured') {
    errors.push(`Payment status is "${payment.status}", expected "captured"`);
  }
  if (payment.order_id !== razorpay_order_id) {
    errors.push(`Order ID mismatch: expected ${razorpay_order_id}, got ${payment.order_id}`);
  }

  if (errors.length > 0) {
    const failedUpdates = {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verificationStatus: 'VERIFICATION_FAILED',
      status: 'FAILED',
      failedAt: new Date(),
      errorMessage: errors.join('; '),
    };

    if (isConnected) {
      await PaymentOrder.findOneAndUpdate({ _id: paymentOrder._id }, failedUpdates);
    } else {
      memoryStore.updatePaymentOrder(paymentOrder.orderId, failedUpdates);
    }

    return res.status(400).json({
      success: false,
      message: 'Payment validation failed.',
      errors,
    });
  }

  // ── Step 4: Atomic update — only if not already CAPTURED ──────────
  let updated;
  const capturedUpdates = {
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: 'CAPTURED',
    verificationStatus: 'FULLY_VERIFIED',
    capturedAt: new Date(),
  };

  if (isConnected) {
    updated = await PaymentOrder.findOneAndUpdate(
      {
        _id: paymentOrder._id,
        status: { $ne: 'CAPTURED' },
      },
      capturedUpdates,
      { new: true }
    );
  } else {
    if (paymentOrder.status !== 'CAPTURED') {
      updated = memoryStore.updatePaymentOrder(paymentOrder.orderId, capturedUpdates);
    }
  }

  if (!updated) {
    // Race condition — another process already captured
    const current = isConnected
      ? await PaymentOrder.findById(paymentOrder._id)
      : memoryStore.getPaymentOrder(paymentOrder.orderId);
    return res.status(200).json({
      success: true,
      message: 'Payment already verified (concurrent verification).',
      paymentOrder: {
        orderId: current.orderId,
        razorpayOrderId: current.razorpayOrderId,
        razorpayPaymentId: current.razorpayPaymentId,
        status: current.status,
        verificationStatus: current.verificationStatus,
        capturedAt: current.capturedAt,
      },
    });
  }

  // ── Step 5: Update InternshipApplication ──────────────────────────
  if (isConnected) {
    await InternshipApplication.findOneAndUpdate(
      { applicationId: paymentOrder.applicationId },
      {
        paymentStatus: 'PAID_VERIFIED',
        paymentRecordId: paymentOrder.orderId,
      }
    );
  } else {
    memoryStore.updateApplication(paymentOrder.applicationId, {
      paymentStatus: 'PAID_VERIFIED',
      paymentRecordId: paymentOrder.orderId,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Payment verified successfully.',
    paymentOrder: {
      orderId: updated.orderId,
      razorpayOrderId: updated.razorpayOrderId,
      razorpayPaymentId: updated.razorpayPaymentId,
      status: updated.status,
      verificationStatus: updated.verificationStatus,
      capturedAt: updated.capturedAt,
      amountPaise: updated.amountPaise,
      currency: updated.currency,
    },
  });
}

export default withAuth(handler, { requireEmailVerified: true });
