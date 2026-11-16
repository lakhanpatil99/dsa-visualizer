import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import Certificate from '../../../models/Certificate.js';
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

  const { certificateId, reason = 'Administrative revocation' } = req.body || {};

  if (!certificateId) {
    return res.status(400).json({ success: false, message: 'Certificate ID is required.' });
  }

  const certIdNormalized = certificateId.trim().toUpperCase();

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  const updates = {
    status: 'REVOKED',
    revokedReason: reason,
    revokedAt: new Date()
  };

  let updatedCert = null;
  if (isConnected) {
    updatedCert = await Certificate.findOneAndUpdate(
      { certificateId: certIdNormalized },
      { $set: updates },
      { new: true }
    );
  } else {
    updatedCert = memoryStore.updateCertificate(certIdNormalized, updates);
  }

  if (!updatedCert) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  await recordAdminAuditLog({
    action: 'REVOKE_CERTIFICATE',
    performedBy: req.user.email,
    targetType: 'certificate',
    targetId: certIdNormalized,
    details: { reason },
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
  });

  return res.status(200).json({
    success: true,
    message: `Certificate ${certIdNormalized} has been successfully revoked.`,
    certificate: updatedCert
  });
}

export default withAuth(handler, { requireEmailVerified: true });
