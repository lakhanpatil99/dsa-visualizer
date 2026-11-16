/**
 * GET /api/admin/payments
 *
 * Privileged endpoint returning all payment orders for administrative review.
 * Protected by Firebase Auth + isUserAdmin check.
 */

import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import PaymentOrder from '../../../models/PaymentOrder.js';
import memoryStore from '../../../lib/memoryStore.js';
import { isUserAdmin } from '../../../lib/admin/adminAuth.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  if (!isUserAdmin(req.user)) {
    return res.status(403).json({
      success: false,
      code: 'ADMIN_ACCESS_REQUIRED',
      message: 'Administrative privileges required.',
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

  let payments = [];
  if (isConnected) {
    payments = await PaymentOrder.find({}).sort({ createdAt: -1 }).limit(100);
  } else {
    payments = memoryStore.getAllPaymentOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return res.status(200).json({
    success: true,
    payments,
  });
}

export default withAuth(handler, { requireEmailVerified: true });
