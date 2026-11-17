import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import Certificate from '../../../models/Certificate.js';
import memoryStore from '../../../lib/memoryStore.js';

async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const connection = await dbConnect();
    let applications = [];
    let certificates = [];

    if (connection?.connection?.readyState === 1) {
      [applications, certificates] = await Promise.all([
        InternshipApplication.find({ firebaseUid: req.user.uid }).sort({ createdAt: -1 }),
        Certificate.find({ firebaseUid: req.user.uid, type: 'internship' })
          .select('certificateId sourceKey type title status issueDate verificationUrl')
          .lean()
      ]);
    } else if (process.env.NODE_ENV !== 'production') {
      applications = memoryStore.getApplicationsByUser(req.user.uid);
      certificates = memoryStore.getCertificatesByUser(req.user.uid)
        .filter((certificate) => certificate.type === 'internship');
    } else {
      throw new Error('MongoDB is not connected.');
    }

    const synchronizedApplications = applications.map((application) => {
      const app = typeof application.toObject === 'function' ? application.toObject() : { ...application };
      const certificate = certificates.find((item) =>
        (app.certificateId && item.certificateId === app.certificateId) ||
        item.sourceKey === `internship:${app.applicationId}`
      );

      return {
        ...app,
        // A database certificate document, not the application boolean alone,
        // is the authority for whether a downloadable official credential exists.
        certificateIssued: Boolean(certificate),
        certificateId: certificate?.certificateId || null,
        officialCertificate: certificate ? {
          certificateId: certificate.certificateId,
          title: certificate.title,
          status: certificate.status,
          issueDate: certificate.issueDate,
          verificationUrl: certificate.verificationUrl ||
            `https://www.algomania.in/certificates/verify/${certificate.certificateId}`
        } : null
      };
    });

    return res.status(200).json({
      success: true,
      applications: synchronizedApplications,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[MyInternshipApplications] Unable to synchronize applications:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'APPLICATION_DATA_UNAVAILABLE',
      message: 'Your application status is temporarily unavailable. Please retry shortly.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
