import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
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
      message: 'Administrative privileges required.'
    });
  }

  const { status, domain } = req.query || {};

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  let applications = [];
  if (isConnected) {
    const filter = {};
    if (status) filter.status = status;
    if (domain) filter.domain = domain;
    applications = await InternshipApplication.find(filter).sort({ createdAt: -1 });
  } else {
    applications = memoryStore.getAllApplications();
    if (status) applications = applications.filter(a => a.status === status);
    if (domain) applications = applications.filter(a => a.domain === domain);
  }

  return res.status(200).json({
    success: true,
    applications
  });
}

export default withAuth(handler, { requireEmailVerified: true });
