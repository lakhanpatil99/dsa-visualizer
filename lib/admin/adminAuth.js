import dbConnect from '../dbConnect.js';
import AdminAuditLog from '../../models/AdminAuditLog.js';
import memoryStore from '../memoryStore.js';

const DEFAULT_ADMIN_EMAILS = [
  'lakhannpatil2211@gmail.com',
  'admin@algomania.in',
  'lakhansing@algomania.in'
];

/**
 * Checks if a user has administrative authorization.
 */
export function isUserAdmin(user) {
  if (!user || !user.email) return false;
  const adminList = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : DEFAULT_ADMIN_EMAILS;

  return adminList.includes(user.email.toLowerCase().trim()) || user.isAdmin === true;
}

/**
 * Logs an administrative action to database or memory store.
 */
export async function recordAdminAuditLog({ action, performedBy, targetType, targetId, details, ipAddress = '' }) {
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  const logEntry = {
    action,
    performedBy,
    targetType,
    targetId,
    details,
    ipAddress,
    timestamp: new Date()
  };

  if (isConnected) {
    try {
      await AdminAuditLog.create(logEntry);
    } catch (err) {
      console.error('Failed to write AdminAuditLog:', err);
    }
  } else {
    memoryStore.logAction(logEntry);
  }
}
