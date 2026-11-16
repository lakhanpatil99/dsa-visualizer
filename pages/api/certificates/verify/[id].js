import dbConnect from '../../../../lib/dbConnect.js';
import Certificate from '../../../../models/Certificate.js';
import memoryStore from '../../../../lib/memoryStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Certificate ID is required.' });
  }

  const certIdNormalized = id.trim().toUpperCase();

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  let cert = null;
  if (isConnected) {
    cert = await Certificate.findOne({ certificateId: certIdNormalized });
  } else {
    cert = memoryStore.getCertificate(certIdNormalized);
  }

  if (!cert) {
    return res.status(404).json({
      success: false,
      isValid: false,
      message: 'Certificate not found. This credential may be invalid or unissued.'
    });
  }

  // Public safe payload - NEVER expose email, phone, or payment information
  return res.status(200).json({
    success: true,
    certificate: {
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      type: cert.type,
      title: cert.title,
      description: cert.description,
      domain: cert.domain,
      tier: cert.tier,
      milestoneCount: cert.milestoneCount,
      duration: cert.duration,
      issueDate: cert.issueDate,
      status: cert.status, // 'VALID' or 'REVOKED'
      revokedReason: cert.status === 'REVOKED' ? cert.revokedReason : null,
      revokedAt: cert.status === 'REVOKED' ? cert.revokedAt : null,
      founderTitle: cert.founderTitle || 'Founder, AlgoMania'
    }
  });
}
