/**
 * GET /api/payments/status?applicationId=...
 *
 * Returns the latest payment status for a given internship application.
 * If the order has been PENDING for >15 minutes, attempts a live reconciliation
 * against the Razorpay API.
 */

import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';
import { INTERNSHIP_FEE_PAISE } from '../../../lib/payments/razorpayConfig.js';

const STALE_PENDING_MS = 15 * 60 * 1000; // 15 minutes

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { applicationId } = req.query;

  if (!applicationId || typeof applicationId !== 'string') {
    return res.status(400).json({ success: false, message: 'applicationId query parameter is required.' });
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

  // ── Fetch latest order for this user + application ────────────────
  let paymentOrder = null;
  if (isConnected) {
    paymentOrder = await PaymentOrder.findOne({
      applicationId,
      firebaseUid: user.uid,
    }).sort({ createdAt: -1 });
  } else {
    const orders = memoryStore.getPaymentOrdersByApplication(applicationId);
    paymentOrder = orders.filter(o => o.firebaseUid === user.uid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
  }

  if (!paymentOrder) {
    // No order yet — check if application exists
    let application = null;
    if (isConnected) {
      application = await InternshipApplication.findOne({
        applicationId,
        firebaseUid: user.uid,
      });
    } else {
      application = memoryStore.getApplication(applicationId);
      if (application && application.firebaseUid !== user.uid) application = null;
    }

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    return res.status(200).json({
      success: true,
      paymentStatus: 'PENDING_PAYMENT',
      applicationPaymentStatus: application.paymentStatus,
      order: null,
    });
  }

  // ── Stale PENDING reconciliation ──────────────────────────────────
  if (
    paymentOrder.status === 'PENDING' &&
    paymentOrder.razorpayPaymentId &&
    Date.now() - new Date(paymentOrder.updatedAt || paymentOrder.createdAt).getTime() > STALE_PENDING_MS
  ) {
    try {
      const payment = await paymentProvider.fetchPayment(paymentOrder.razorpayPaymentId);

      if (payment.status === 'captured' && payment.amount === INTERNSHIP_FEE_PAISE) {
        if (isConnected) {
          await PaymentOrder.findOneAndUpdate(
            { _id: paymentOrder._id, status: { $ne: 'CAPTURED' } },
            {
              status: 'CAPTURED',
              verificationStatus: 'FULLY_VERIFIED',
              capturedAt: new Date(),
            }
          );
          await InternshipApplication.findOneAndUpdate(
            { applicationId },
            { paymentStatus: 'PAID_VERIFIED', paymentRecordId: paymentOrder.orderId }
          );
        } else {
          memoryStore.updatePaymentOrder(paymentOrder.orderId, {
            status: 'CAPTURED',
            verificationStatus: 'FULLY_VERIFIED',
            capturedAt: new Date(),
          });
          memoryStore.updateApplication(applicationId, {
            paymentStatus: 'PAID_VERIFIED',
            paymentRecordId: paymentOrder.orderId,
          });
        }

        return res.status(200).json({
          success: true,
          paymentStatus: 'CAPTURED',
          verificationStatus: 'FULLY_VERIFIED',
          reconciledFromApi: true,
          order: {
            orderId: paymentOrder.orderId,
            razorpayOrderId: paymentOrder.razorpayOrderId,
            razorpayPaymentId: paymentOrder.razorpayPaymentId,
            amountPaise: paymentOrder.amountPaise,
            currency: paymentOrder.currency,
            status: 'CAPTURED',
            verificationStatus: 'FULLY_VERIFIED',
          },
        });
      } else if (payment.status === 'failed') {
        if (isConnected) {
          await PaymentOrder.findOneAndUpdate(
            { _id: paymentOrder._id, status: { $ne: 'CAPTURED' } },
            { status: 'FAILED', failedAt: new Date(), errorMessage: payment.error_description || 'Payment failed' }
          );
        } else {
          memoryStore.updatePaymentOrder(paymentOrder.orderId, {
            status: 'FAILED',
            failedAt: new Date(),
            errorMessage: payment.error_description || 'Payment failed',
          });
        }
      }
    } catch (err) {
      console.warn('[payment-status] Reconciliation fetch failed:', err.message);
      // Non-critical — fall through and return current state
    }
  }

  // ── Return current state ──────────────────────────────────────────
  return res.status(200).json({
    success: true,
    paymentStatus: paymentOrder.status,
    verificationStatus: paymentOrder.verificationStatus,
    order: {
      orderId: paymentOrder.orderId,
      razorpayOrderId: paymentOrder.razorpayOrderId,
      razorpayPaymentId: paymentOrder.razorpayPaymentId || null,
      amountPaise: paymentOrder.amountPaise,
      currency: paymentOrder.currency,
      status: paymentOrder.status,
      verificationStatus: paymentOrder.verificationStatus,
      paymentMode: paymentOrder.paymentMode,
      capturedAt: paymentOrder.capturedAt || null,
      createdAt: paymentOrder.createdAt,
    },
  });
}

export default withAuth(handler, { requireEmailVerified: true });
