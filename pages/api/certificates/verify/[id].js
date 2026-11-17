import { getPublicCertificateById, normalizeCertificateId } from '../../../../lib/certificates/publicVerification.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({
      success: false,
      status: 'INVALID_ID',
      message: 'Enter a certificate ID to verify.'
    });
  }

  const certificateId = normalizeCertificateId(id);
  if (!certificateId) {
    return res.status(400).json({
      success: false,
      status: 'INVALID_ID',
      message: 'The certificate ID format is not valid.'
    });
  }

  try {
    const result = await getPublicCertificateById(certificateId);
    if (result.status === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: 'No certificate with this ID exists in the AlgoMania registry.'
      });
    }

    return res.status(200).json({
      success: true,
      status: result.status,
      certificate: result.certificate
    });
  } catch (error) {
    // Do not leak database details or classify an outage as an invalid credential.
    console.error('[PublicCertificateVerification] Registry lookup unavailable:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      status: 'UNAVAILABLE',
      message: 'Certificate verification is temporarily unavailable. Please try again shortly.'
    });
  }
}
