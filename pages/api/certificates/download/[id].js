import withAuth from '../../../../lib/auth.js';
import dbConnect from '../../../../lib/dbConnect.js';
import Certificate from '../../../../models/Certificate.js';
import memoryStore from '../../../../lib/memoryStore.js';
import { generateCertificatePdf } from '../../../../lib/certificates/PdfCertificateGenerator.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
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
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  // Authorization Check: Must belong to requesting user (or authorized admin)
  if (cert.firebaseUid !== user.uid) {
    return res.status(403).json({
      success: false,
      code: 'UNAUTHORIZED_ACCESS',
      message: 'Access denied. You can only download certificates issued to your account.'
    });
  }

  if (cert.status === 'REVOKED') {
    return res.status(410).json({
      success: false,
      code: 'CERTIFICATE_REVOKED',
      message: 'This certificate has been revoked and can no longer be downloaded.'
    });
  }

  try {
    const pdfBytes = await generateCertificatePdf(cert);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`);
    res.setHeader('Content-Length', pdfBytes.length);

    return res.send(Buffer.from(pdfBytes));
  } catch (pdfErr) {
    console.error('Failed to generate certificate PDF:', pdfErr);
    return res.status(500).json({ success: false, message: 'PDF Generation Error' });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
