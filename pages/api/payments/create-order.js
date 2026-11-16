/**
 * POST /api/payments/create-order
 *
 * Creates a Razorpay order for an internship application fee.
 * Reuses an existing CREATED/PENDING order for the same application if one exists.
 *
 * Request body: { applicationId: string }
 * Response:     { orderId, razorpayOrderId, razorpayKeyId, amount, currency,
 *                 applicationId, isTestMode, userName, userEmail }
 */

import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import memoryStore from '../../../lib/memoryStore.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';
import { getRazorpayConfig, isTestModeUser, INTERNSHIP_FEE_PAISE } from '../../../lib/payments/razorpayConfig.js';
import crypto from 'crypto';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { applicationId } = req.body || {};

  if (!applicationId || typeof applicationId !== 'string') {
    return res.status(400).json({ success: false, message: 'applicationId is required.' });
  }

  // ── Load config (validates env vars) ──────────────────────────────
  let config;
  try {
    config = getRazorpayConfig();
  } catch (err) {
    console.error('[create-order] Razorpay config error:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Payment gateway is not configured. Please contact support.',
    });
  }

  // ── Test-mode gate ────────────────────────────────────────────────
  if (config.mode === 'test' && !isTestModeUser(user.uid)) {
    return res.status(403).json({
      success: false,
      message: 'Payment gateway is in test mode. Your account is not authorised for test payments.',
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

  // ── Validate application ownership ────────────────────────────────
  let application = null;
  if (isConnected) {
    application = await InternshipApplication.findOne({ applicationId });
  } else {
    application = memoryStore.getApplication(applicationId);
  }

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  if (application.firebaseUid !== user.uid) {
    return res.status(403).json({ success: false, message: 'You are not authorised to pay for this application.' });
  }

  if (application.paymentStatus === 'PAID_VERIFIED') {
    return res.status(400).json({ success: false, message: 'This application has already been paid for.' });
  }

  // ── Reuse existing open order ─────────────────────────────────────
  let existingOrder = null;
  if (isConnected) {
    existingOrder = await PaymentOrder.findOne({
      applicationId,
      firebaseUid: user.uid,
      status: { $in: ['CREATED', 'PENDING'] },
    }).sort({ createdAt: -1 });
  } else {
    const orders = memoryStore.getPaymentOrdersByApplication(applicationId);
    existingOrder = orders.find(o => o.firebaseUid === user.uid && ['CREATED', 'PENDING'].includes(o.status)) || null;
  }

  if (existingOrder && existingOrder.razorpayOrderId) {
    return res.status(200).json({
      success: true,
      orderId: existingOrder.orderId,
      razorpayOrderId: existingOrder.razorpayOrderId,
      razorpayKeyId: config.keyId,
      amount: existingOrder.amountPaise,
      currency: existingOrder.currency,
      applicationId,
      isTestMode: config.mode === 'test',
      userName: user.name || application.fullName || '',
      userEmail: user.email,
    });
  }

  // ── Create Razorpay order ─────────────────────────────────────────
  let razorpayOrder;
  try {
    razorpayOrder = await paymentProvider.createOrder({
      applicationId,
      userId: user.uid,
      userEmail: user.email,
    });
  } catch (err) {
    console.error('[create-order] Razorpay order creation failed:', err);
    return res.status(502).json({
      success: false,
      message: 'Failed to create payment order. Please try again.',
    });
  }

  // ── Persist PaymentOrder ──────────────────────────────────────────
  const internalOrderId = `ord_${crypto.randomUUID().replace(/-/g, '')}`;

  const orderDoc = {
    orderId: internalOrderId,
    applicationId,
    firebaseUid: user.uid,
    userEmail: user.email,
    razorpayOrderId: razorpayOrder.id,
    amountPaise: INTERNSHIP_FEE_PAISE,
    currency: 'INR',
    paymentMode: config.mode,
    status: 'CREATED',
    verificationStatus: 'UNVERIFIED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let paymentOrder;
  if (isConnected) {
    paymentOrder = await PaymentOrder.create(orderDoc);
    await InternshipApplication.findOneAndUpdate(
      { applicationId },
      { paymentStatus: 'PENDING' }
    );
  } else {
    paymentOrder = memoryStore.savePaymentOrder(orderDoc);
    memoryStore.updateApplication(applicationId, { paymentStatus: 'PENDING' });
  }

  return res.status(200).json({
    success: true,
    orderId: paymentOrder.orderId,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: config.keyId,
    amount: INTERNSHIP_FEE_PAISE,
    currency: 'INR',
    applicationId,
    isTestMode: config.mode === 'test',
    userName: user.name || application.fullName || '',
    userEmail: user.email,
  });
}

export default withAuth(handler, { requireEmailVerified: true });
