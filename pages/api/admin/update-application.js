import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { isUserAdmin, recordAdminAuditLog } from '../../../lib/admin/adminAuth.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  if (!isUserAdmin(req.user)) {
    return res.status(403).json({
      success: false,
      code: 'ADMIN_ACCESS_REQUIRED',
      message: 'Administrative privileges required.'
    });
  }

  const { applicationId, status, verifiedStartDate, verifiedEndDate, completionNotes } = req.body || {};

  if (!applicationId) {
    return res.status(400).json({ success: false, message: 'Application ID is required.' });
  }

  const validStatuses = ['PENDING_REVIEW', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid application status.' });
  }

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  const updates = {};
  if (status) updates.status = status;
  if (completionNotes !== undefined) updates.completionNotes = completionNotes;
  if (verifiedStartDate) updates.verifiedStartDate = new Date(verifiedStartDate);
  if (verifiedEndDate) updates.verifiedEndDate = new Date(verifiedEndDate);

  if (status === 'COMPLETED' || status === 'APPROVED') {
    updates.verifiedBy = req.user.email;
    updates.verifiedAt = new Date();
  }

  let updatedApp = null;
  if (isConnected) {
    updatedApp = await InternshipApplication.findOneAndUpdate(
      { applicationId },
      { $set: updates },
      { new: true }
    );
  } else {
    updatedApp = memoryStore.updateApplication(applicationId, updates);
  }

  if (!updatedApp) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  await recordAdminAuditLog({
    action: `UPDATE_INTERNSHIP_APPLICATION_${status || 'INFO'}`,
    performedBy: req.user.email,
    targetType: 'internship_application',
    targetId: applicationId,
    details: updates,
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
  });

  return res.status(200).json({
    success: true,
    message: 'Application updated successfully.',
    application: updatedApp
  });
}

export default withAuth(handler, { requireEmailVerified: true });
