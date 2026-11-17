/**
 * POST /api/payments/create-order
 *
 * High-performance, idempotent Razorpay order creation for internship applications.
 *
 * OPTIMIZATIONS:
 * 1. In-flight deduplication lock prevents duplicate orders from rapid multi-clicks or multi-tab calls.
 * 2. Parallel database querying of InternshipApplication and existing PaymentOrder cuts lookup latency.
 * 3. Reuses valid unpaid orders (CREATED / ORDER_CREATED / PENDING / CHECKOUT_OPEN) in <30ms without upstream API calls.
 * 4. Bounded 8s upstream timeout protects against Razorpay network stalls.
 * 5. Parallelized database persistence on creation.
 * 6. Detailed performance instrumentation with correlation ID (zero secrets logged).
 */

import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import memoryStore from '../../../lib/memoryStore.js';
import { paymentProvider } from '../../../lib/payments/PaymentProvider.js';
import { getRazorpayConfig, isTestModeUser, INTERNSHIP_FEE_PAISE } from '../../../lib/payments/razorpayConfig.js';
import crypto from 'crypto';

// In-flight request lock map: ensures exactly one order is created per applicationId across concurrent requests
const inFlightOrders = new Map();

// Valid statuses for reusing an existing open order
const REUSABLE_ORDER_STATUSES = [
  'CREATED',
  'ORDER_CREATED',
  'PENDING',
  'PAYMENT_PENDING',
  'CHECKOUT_OPEN',
  'CHECKOUT_OPENED',
];

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const startTime = Date.now();
  const correlationId = (req.headers['x-correlation-id'] || `chk_${crypto.randomBytes(6).toString('hex')}`).slice(0, 50);

  const user = req.user;
  const { applicationId } = req.body || {};

  if (!applicationId || typeof applicationId !== 'string') {
    return res.status(400).json({ success: false, message: 'applicationId is required.' });
  }

  // If another request for this applicationId is already in-flight in this process, join it
  if (inFlightOrders.has(applicationId)) {
    try {
      const sharedResult = await inFlightOrders.get(applicationId);
      return res.status(200).json({
        ...sharedResult,
        correlationId,
        inFlightJoined: true,
        totalTimeMs: Date.now() - startTime,
      });
    } catch (err) {
      // In-flight request failed, proceed to normal flow
      inFlightOrders.delete(applicationId);
    }
  }

  // Register in-flight execution promise
  let resolveInFlight, rejectInFlight;
  const inFlightPromise = new Promise((resolve, reject) => {
    resolveInFlight = resolve;
    rejectInFlight = reject;
  });
  inFlightOrders.set(applicationId, inFlightPromise);

  try {
    // ── Load config (validates env vars) ──────────────────────────────
    let config;
    try {
      config = getRazorpayConfig();
    } catch (err) {
      console.error(`[create-order] correlationId=${correlationId} config error:`, err.message);
      const errRes = {
        success: false,
        message: 'Payment gateway is not configured. Please contact support.',
      };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(503).json(errRes);
    }

    // ── Test-mode gate ────────────────────────────────────────────────
    if (config.mode === 'test' && !isTestModeUser(user.uid)) {
      const errRes = {
        success: false,
        message: 'Payment gateway is in test mode. Your account is not authorised for test payments.',
      };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(403).json(errRes);
    }

    // ── Database Connection Verification ──────────────────────────────
    const dbStart = Date.now();
    let isConnected = false;
    try {
      const conn = await dbConnect();
      if (conn && conn.connection && conn.connection.readyState === 1) {
        isConnected = true;
      }
    } catch (err) {
      console.warn(`[create-order] correlationId=${correlationId} MongoDB connection warning:`, err.message);
    }
    const dbConnectMs = Date.now() - dbStart;

    if (process.env.NODE_ENV === 'production' && !isConnected) {
      const errRes = {
        success: false,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database service is temporarily unavailable. Please retry shortly.',
      };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(503).json(errRes);
    }

    // ── Parallelized Lookups: Application + Existing Open Order ───────
    const queryStart = Date.now();
    let application = null;
    let existingOrder = null;

    if (isConnected) {
      const [appDoc, orderDoc] = await Promise.all([
        InternshipApplication.findOne({ applicationId }),
        PaymentOrder.findOne({
          applicationId,
          firebaseUid: user.uid,
          status: { $in: REUSABLE_ORDER_STATUSES },
        }).sort({ createdAt: -1 }),
      ]);
      application = appDoc;
      existingOrder = orderDoc;
    } else {
      application = memoryStore.getApplication(applicationId);
      const orders = memoryStore.getPaymentOrdersByApplication(applicationId);
      existingOrder = orders.find(
        (o) => o.firebaseUid === user.uid && REUSABLE_ORDER_STATUSES.includes(o.status)
      ) || null;
    }
    const queryMs = Date.now() - queryStart;

    if (!application) {
      const errRes = { success: false, message: 'Application not found.' };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(404).json(errRes);
    }

    if (application.firebaseUid !== user.uid) {
      const errRes = { success: false, message: 'You are not authorised to pay for this application.' };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(403).json(errRes);
    }

    if (application.paymentStatus === 'PAID_VERIFIED') {
      const errRes = { success: false, message: 'This application has already been paid for.' };
      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(400).json(errRes);
    }

    // ── Fast-Path: Reuse existing open order (<30ms) ──────────────────
    if (existingOrder && existingOrder.razorpayOrderId) {
      const retryAttempt = {
        attemptId: `att_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        status: 'CHECKOUT_REOPENED',
        createdAt: new Date(),
      };

      // Non-blocking attempt recording
      if (isConnected) {
        PaymentOrder.updateOne(
          { _id: existingOrder._id },
          { $push: { attempts: retryAttempt } }
        ).catch((err) => console.warn(`[create-order] async attempt append warning: ${err.message}`));
      } else {
        const attempts = existingOrder.attempts || [];
        attempts.push(retryAttempt);
        memoryStore.updatePaymentOrder(existingOrder.orderId, { attempts });
      }

      const totalMs = Date.now() - startTime;
      console.log(
        `[create-order] correlationId=${correlationId} appId=${applicationId} db=${dbConnectMs}ms query=${queryMs}ms total=${totalMs}ms status=REUSED`
      );

      const responsePayload = {
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
        correlationId,
        reused: true,
        perf: { dbConnectMs, queryMs, totalMs },
      };

      resolveInFlight(responsePayload);
      inFlightOrders.delete(applicationId);
      return res.status(200).json(responsePayload);
    }

    // ── Upstream Razorpay Order Creation ──────────────────────────────
    const rzpStart = Date.now();
    let razorpayOrder;
    try {
      razorpayOrder = await paymentProvider.createOrder({
        applicationId,
        userId: user.uid,
        userEmail: user.email,
        correlationId,
      });
    } catch (err) {
      const rzpMs = Date.now() - rzpStart;
      console.error(
        `[create-order] correlationId=${correlationId} Razorpay order creation failed after ${rzpMs}ms:`,
        err.message
      );

      const errRes = {
        success: false,
        code: err.code === 'UPSTREAM_TIMEOUT' ? 'GATEWAY_TIMEOUT' : 'GATEWAY_ERROR',
        message:
          err.code === 'UPSTREAM_TIMEOUT'
            ? 'Payment gateway took too long to respond. Please click Retry Checkout.'
            : 'Failed to create payment order. Please try again.',
      };

      rejectInFlight(new Error(errRes.message));
      inFlightOrders.delete(applicationId);
      return res.status(502).json(errRes);
    }
    const razorpayMs = Date.now() - rzpStart;

    // ── Persist PaymentOrder in Parallel ──────────────────────────────
    const persistStart = Date.now();
    const internalOrderId = `ord_${crypto.randomUUID().replace(/-/g, '')}`;
    const initialAttempt = {
      attemptId: `att_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      status: 'ORDER_CREATED',
      createdAt: new Date(),
    };

    const orderDoc = {
      orderId: internalOrderId,
      applicationId,
      firebaseUid: user.uid,
      userEmail: user.email,
      razorpayOrderId: razorpayOrder.id,
      amountPaise: INTERNSHIP_FEE_PAISE,
      currency: 'INR',
      paymentMode: config.mode,
      status: 'ORDER_CREATED',
      verificationStatus: 'UNVERIFIED',
      attempts: [initialAttempt],
      metadata: { correlationId },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let paymentOrder;
    if (isConnected) {
      try {
        const [createdOrder] = await Promise.all([
          PaymentOrder.create(orderDoc),
          InternshipApplication.updateOne(
            { applicationId },
            { paymentStatus: 'PENDING' }
          ),
        ]);
        paymentOrder = createdOrder;
      } catch (err) {
        if (err.code === 11000) {
          // Concurrency duplicate key safety: retrieve winning order
          paymentOrder = await PaymentOrder.findOne({ applicationId });
        } else {
          throw err;
        }
      }
    } else {
      paymentOrder = memoryStore.savePaymentOrder(orderDoc);
      memoryStore.updateApplication(applicationId, { paymentStatus: 'PENDING' });
    }
    const persistMs = Date.now() - persistStart;

    const totalMs = Date.now() - startTime;
    console.log(
      `[create-order] correlationId=${correlationId} appId=${applicationId} db=${dbConnectMs}ms query=${queryMs}ms rzp=${razorpayMs}ms persist=${persistMs}ms total=${totalMs}ms status=CREATED`
    );

    const responsePayload = {
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
      correlationId,
      reused: false,
      perf: { dbConnectMs, queryMs, razorpayMs, persistMs, totalMs },
    };

    resolveInFlight(responsePayload);
    inFlightOrders.delete(applicationId);
    return res.status(200).json(responsePayload);
  } catch (err) {
    console.error(`[create-order] correlationId=${correlationId} unexpected error:`, err);
    rejectInFlight(err);
    inFlightOrders.delete(applicationId);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while preparing your checkout. Please retry.',
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
