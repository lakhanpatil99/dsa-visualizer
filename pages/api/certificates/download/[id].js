import withAuth from '../../../../lib/auth.js';
import dbConnect from '../../../../lib/dbConnect.js';
import Certificate from '../../../../models/Certificate.js';
import memoryStore from '../../../../lib/memoryStore.js';
import { generateCertificatePdf } from '../../../../lib/certificates/PdfCertificateGenerator.js';

// Bounded in-memory cache for validated PDF buffers
// Keyed strictly by certificateId + issue timestamp to ensure 100% data integrity
const pdfBufferCache = new Map();
const MAX_CACHE_ENTRIES = 100;

function getCachedPdf(key) {
  return pdfBufferCache.get(key) || null;
}

function setCachedPdf(key, buffer) {
  if (pdfBufferCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = pdfBufferCache.keys().next().value;
    pdfBufferCache.delete(oldestKey);
  }
  pdfBufferCache.set(key, buffer);
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { id } = req.query;
  if (!id || typeof id !== 'string' || id.length > 96) {
    return res.status(400).json({ success: false, message: 'Certificate ID is required.' });
  }

  const certificateId = id.trim().toUpperCase();

  let certificate = null;
  try {
    const connection = await dbConnect();
    if (connection?.connection?.readyState === 1) {
      certificate = await Certificate.findOne({ certificateId });
    } else if (process.env.NODE_ENV !== 'production') {
      certificate = memoryStore.getCertificate(certificateId);
    } else {
      return res.status(503).json({
        success: false,
        code: 'CERTIFICATE_REGISTRY_UNAVAILABLE',
        message: 'The certificate registry is temporarily unavailable. Please retry.'
      });
    }
  } catch (error) {
    console.error('[CertificateDownload] Registry lookup failed:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'CERTIFICATE_REGISTRY_UNAVAILABLE',
      message: 'The certificate registry is temporarily unavailable. Please retry.'
    });
  }

  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  if (certificate.firebaseUid !== user.uid) {
    return res.status(403).json({
      success: false,
      code: 'UNAUTHORIZED_ACCESS',
      message: 'You can only download certificates issued to your account.'
    });
  }

  if (certificate.status === 'REVOKED') {
    return res.status(410).json({
      success: false,
      code: 'CERTIFICATE_REVOKED',
      message: 'This certificate has been revoked and can no longer be downloaded.'
    });
  }

  if (certificate.status !== 'VALID') {
    return res.status(409).json({
      success: false,
      code: 'CERTIFICATE_NOT_ISSUED',
      message: 'This certificate is not currently available for download.'
    });
  }

  try {
    const issueTime = certificate.issueDate ? new Date(certificate.issueDate).getTime() : 0;
    const cacheKey = `${certificate.certificateId}:${issueTime}`;
    let pdfBuffer = getCachedPdf(cacheKey);

    if (!pdfBuffer) {
      const pdfBytes = await generateCertificatePdf(certificate);
      pdfBuffer = Buffer.from(pdfBytes);
      setCachedPdf(cacheKey, pdfBuffer);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('[CertificateDownload] PDF generation failed:', error?.message || 'Unknown error');
    return res.status(500).json({
      success: false,
      code: 'CERTIFICATE_PDF_FAILED',
      message: 'The certificate PDF could not be generated. Please retry.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
