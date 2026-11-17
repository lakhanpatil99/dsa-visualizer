/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay webhook endpoint.  Handles server-to-server event notifications.
 *
 * IMPORTANT:
 *  - NO auth middleware — this is a public endpoint called by Razorpay's servers.
 *  - Body parsing is DISABLED so we can read the raw body for HMAC verification.
 *  - Idempotent — duplicate event IDs are detected and skipped.
 */

import dbConnect from '../../../lib/dbConnect.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import WebhookEvent from '../../../models/WebhookEvent.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';

// Disable Next.js body parsing to receive raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Reads the raw request body as a Buffer.
 */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // ── Read raw body ─────────────────────────────────────────────────
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('[webhook] Failed to read request body:', err);
    return res.status(400).json({ success: false, message: 'Unable to read request body.' });
  }

  // ── Verify webhook signature ──────────────────────────────────────
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(401).json({ success: false, message: 'Missing X-Razorpay-Signature header.' });
  }

  let isValid;
  try {
    isValid = paymentProvider.verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error('[webhook] Signature verification error:', err);
    return res.status(500).json({ success: false, message: 'Webhook configuration error.' });
  }

  if (!isValid) {
    console.warn('[webhook] Invalid webhook signature');
    return res.status(401).json({ success: false, message: 'Invalid webhook signature.' });
  }

  // ── Parse body ────────────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(rawBody.toString('utf-8'));
  } catch (err) {
    console.error('[webhook] Malformed JSON body:', err);
    return res.status(400).json({ success: false, message: 'Malformed JSON body.' });
  }

  const eventId = req.headers['x-razorpay-event-id'] || body.event_id || `evt_${Date.now()}`;
  const eventType = body.event;

  if (!eventType) {
    return res.status(400).json({ success: false, message: 'Missing event type in payload.' });
  }

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) {
      isConnected = true;
    }
  } catch (err) {
    console.warn('MongoDB connection check failed:', err.message);
  }

  if (process.env.NODE_ENV === 'production' && !isConnected) {
    console.error('[webhook] Database unavailable in production — returning 503 for Razorpay retry');
    return res.status(503).json({ success: false, message: 'Database temporarily unavailable. Retry required.' });
  }

  // ── Dedup check ───────────────────────────────────────────────────
  let existingEvent = null;
  if (isConnected) {
    existingEvent = await WebhookEvent.findOne({ eventId });
  } else {
    existingEvent = memoryStore.getWebhookEvent(eventId);
  }

  if (existingEvent && existingEvent.status === 'PROCESSED') {
    return res.status(200).json({ success: true, message: 'Duplicate event — already processed.' });
  }

  // ── Extract payment entity ────────────────────────────────────────
  const paymentEntity = body.payload?.payment?.entity || {};
  const orderEntity = body.payload?.order?.entity || {};
  const razorpayOrderId = paymentEntity.order_id || orderEntity.id || null;
  const razorpayPaymentId = paymentEntity.id || null;

  // ── Stage 1: Record RECEIVED / PROCESSING state ───────────────────
  let webhookDoc = {
    eventId,
    eventType,
    status: 'PROCESSING',
    razorpayOrderId,
    razorpayPaymentId,
    payload: body,
    processedAt: null,
    processingResult: 'in_progress',
  };

  if (isConnected) {
    try {
      await WebhookEvent.findOneAndUpdate(
        { eventId },
        { $setOnInsert: webhookDoc },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('[webhook] Upsert warning for eventId:', e.message);
    }
  } else {
    memoryStore.saveWebhookEvent(webhookDoc);
  }

  let processingResult = 'unhandled';
  let isFailedRetryable = false;

  // ── Stage 2: Execute Handlers with Retry Preservation ───────────────
  try {
    if (eventType === 'payment.captured') {
      processingResult = await handlePaymentCaptured(razorpayOrderId, razorpayPaymentId, paymentEntity, eventId, isConnected);
    } else if (eventType === 'payment.failed') {
      processingResult = await handlePaymentFailed(razorpayOrderId, razorpayPaymentId, paymentEntity, eventId, isConnected);
    } else if (eventType === 'order.paid') {
      processingResult = await handleOrderPaid(razorpayOrderId, eventId, isConnected);
    } else {
      processingResult = `ignored_event_type:${eventType}`;
    }
  } catch (err) {
    console.error(`[webhook] Error handling event ${eventType}:`, err);
    processingResult = `error:${err.message}`;
    isFailedRetryable = true;
  }

  // ── Stage 3: Record Final Lifecycle State ─────────────────────────
  const finalStatus = isFailedRetryable
    ? 'FAILED_RETRYABLE'
    : (processingResult.startsWith('ignored') ? 'IGNORED' : 'PROCESSED');

  const updateFields = {
    status: finalStatus,
    processedAt: new Date(),
    processingResult,
  };

  if (isConnected) {
    try {
      await WebhookEvent.findOneAndUpdate({ eventId }, { $set: updateFields });
    } catch (err) {
      console.error('[webhook] Failed to update final WebhookEvent status:', err);
    }
  } else {
    memoryStore.updateWebhookEvent(eventId, updateFields);
  }

  // If retryable failure occurred, return HTTP 500 so Razorpay retries automatically
  if (isFailedRetryable) {
    return res.status(500).json({
      success: false,
      message: 'Temporary processing failure. Event scheduled for retry.',
      result: processingResult
    });
  }

  return res.status(200).json({ success: true, message: 'Webhook processed.', result: processingResult });
}

// ─── Event Handlers ─────────────────────────────────────────────────

async function handlePaymentCaptured(razorpayOrderId, razorpayPaymentId, paymentEntity, eventId, isConnected) {
  if (!razorpayOrderId) return 'missing_order_id';

  let order = null;
  if (isConnected) {
    order = await PaymentOrder.findOne({ razorpayOrderId });
  } else {
    order = memoryStore.getPaymentOrderByRazorpayOrderId(razorpayOrderId);
  }

  if (!order) return 'order_not_found';

  // Atomic: only update if not already CAPTURED (never re-process)
  const capturedUpdates = {
    razorpayPaymentId,
    status: 'CAPTURED',
    verificationStatus: 'FULLY_VERIFIED',
    capturedAt: new Date(),
  };

  let updated = null;
  if (isConnected) {
    updated = await PaymentOrder.findOneAndUpdate(
      { _id: order._id, status: { $ne: 'CAPTURED' } },
      {
        $set: capturedUpdates,
        $addToSet: { webhookEventIds: eventId },
      },
      { new: true }
    );
  } else {
    if (order.status !== 'CAPTURED') {
      const eventIds = order.webhookEventIds || [];
      if (!eventIds.includes(eventId)) eventIds.push(eventId);
      updated = memoryStore.updatePaymentOrder(order.orderId, {
        ...capturedUpdates,
        webhookEventIds: eventIds,
      });
    }
  }

  if (!updated) return 'already_captured';

  // Update internship application
  if (isConnected) {
    await InternshipApplication.findOneAndUpdate(
      { applicationId: order.applicationId },
      { paymentStatus: 'PAID_VERIFIED', paymentRecordId: order.orderId }
    );
  } else {
    memoryStore.updateApplication(order.applicationId, {
      paymentStatus: 'PAID_VERIFIED',
      paymentRecordId: order.orderId,
    });
  }

  return 'captured_and_verified';
}

async function handlePaymentFailed(razorpayOrderId, razorpayPaymentId, paymentEntity, eventId, isConnected) {
  if (!razorpayOrderId) return 'missing_order_id';

  let order = null;
  if (isConnected) {
    order = await PaymentOrder.findOne({ razorpayOrderId });
  } else {
    order = memoryStore.getPaymentOrderByRazorpayOrderId(razorpayOrderId);
  }

  if (!order) return 'order_not_found';

  // Never downgrade a CAPTURED order
  if (order.status === 'CAPTURED') return 'ignored_already_captured';

  const failedUpdates = {
    razorpayPaymentId,
    status: 'FAILED',
    failedAt: new Date(),
    errorMessage: paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed via webhook',
  };

  if (isConnected) {
    await PaymentOrder.findOneAndUpdate(
      { _id: order._id, status: { $ne: 'CAPTURED' } },
      {
        $set: failedUpdates,
        $addToSet: { webhookEventIds: eventId },
      }
    );

    await InternshipApplication.findOneAndUpdate(
      { applicationId: order.applicationId, paymentStatus: { $ne: 'PAID_VERIFIED' } },
      { paymentStatus: 'FAILED' }
    );
  } else {
    const eventIds = order.webhookEventIds || [];
    if (!eventIds.includes(eventId)) eventIds.push(eventId);
    memoryStore.updatePaymentOrder(order.orderId, {
      ...failedUpdates,
      webhookEventIds: eventIds,
    });
    const app = memoryStore.getApplication(order.applicationId);
    if (app && app.paymentStatus !== 'PAID_VERIFIED') {
      memoryStore.updateApplication(order.applicationId, { paymentStatus: 'FAILED' });
    }
  }

  return 'marked_failed';
}

async function handleOrderPaid(razorpayOrderId, eventId, isConnected) {
  if (!razorpayOrderId) return 'missing_order_id';

  let order = null;
  if (isConnected) {
    order = await PaymentOrder.findOne({ razorpayOrderId });
  } else {
    order = memoryStore.getPaymentOrderByRazorpayOrderId(razorpayOrderId);
  }

  if (!order) return 'order_not_found';

  // order.paid is a supplementary event — if we already have CAPTURED, skip
  if (order.status === 'CAPTURED') return 'already_captured';

  if (isConnected) {
    await PaymentOrder.findOneAndUpdate(
      { _id: order._id, status: { $ne: 'CAPTURED' } },
      {
        $set: { status: 'AUTHORIZED' },
        $addToSet: { webhookEventIds: eventId },
      }
    );
  } else {
    const eventIds = order.webhookEventIds || [];
    if (!eventIds.includes(eventId)) eventIds.push(eventId);
    memoryStore.updatePaymentOrder(order.orderId, {
      status: 'AUTHORIZED',
      webhookEventIds: eventIds,
    });
  }

  return 'marked_authorized';
}

export default handler;
