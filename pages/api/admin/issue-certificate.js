import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import Certificate from '../../../models/Certificate.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';
import { isUserAdmin, recordAdminAuditLog } from '../../../lib/admin/adminAuth.js';
import crypto from 'crypto';

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

  const {
    type, // 'internship', 'competition_bronze', 'competition_silver', 'competition_gold'
    targetId, // applicationId or firebaseUid
    recipientName,
    domain,
    duration,
    startDate,
    endDate
  } = req.body || {};

  if (!type || !['internship', 'competition_bronze', 'competition_silver', 'competition_gold'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Valid certificate type required.' });
  }

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  let userEmail = '';
  let firebaseUid = '';
  let finalRecipient = recipientName || '';
  let certTitle = '';
  let certDescription = '';
  let milestoneCount = null;
  let finalDomain = domain || null;
  let finalDuration = duration || null;
  let app = null;

  if (type === 'internship') {
    if (isConnected) {
      app = await InternshipApplication.findOne({ applicationId: targetId });
    } else {
      app = memoryStore.getApplication(targetId);
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Internship application not found.' });
    }

    if (app.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: `Cannot issue certificate: Application status is ${app.status}. Must be COMPLETED.`
      });
    }

    if (app.paymentStatus !== 'PAID_VERIFIED') {
      return res.status(400).json({
        success: false,
        message: `Cannot issue certificate: Payment status is ${app.paymentStatus}. Registration fee must be verified.`
      });
    }

    userEmail = app.userEmail;
    firebaseUid = app.firebaseUid;
    finalRecipient = finalRecipient || app.fullName;
    finalDomain = app.domainTitle;
    finalDuration = app.duration === '1_month' ? '1 Month' : app.duration === '2_months' ? '2 Months' : '3 Months';
    certTitle = `${app.domainTitle} Internship Completion`;
    certDescription = `Successfully completed all sprint deliverables, technical milestones, and project defense for the ${app.domainTitle} program.`;
  } else {
    // Competition certificate
    firebaseUid = targetId;
    let ach = null;
    if (isConnected) {
      ach = await CompetitionAchievement.findOne({ firebaseUid });
    } else {
      ach = memoryStore.getAchievement(firebaseUid);
    }

    if (!ach) {
      return res.status(404).json({ success: false, message: 'User achievement record not found.' });
    }

    userEmail = ach.userEmail;
    const tier = type.replace('competition_', '');
    const required = tier === 'gold' ? ACHIEVEMENT_THRESHOLDS.GOLD : tier === 'silver' ? ACHIEVEMENT_THRESHOLDS.SILVER : ACHIEVEMENT_THRESHOLDS.BRONZE;

    if (ach.uniqueSolvedCount < required) {
      return res.status(400).json({
        success: false,
        message: `Cannot issue certificate: User has solved ${ach.uniqueSolvedCount} problems, which is below the ${required} threshold for ${tier}.`
      });
    }

    milestoneCount = required;
    const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1);
    certTitle = `Competition Achievement — ${tierDisplay} Tier`;
    certDescription = `Verified mastery and successful solution of ${required}+ unique algorithmic and computational challenges on AlgoMania.`;
  }

  // Generate Unique Certificate ID: ALG-2026-XXXXX
  const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  const certificateId = `ALG-2026-${randomCode}`;
  const verificationUrl = `https://www.algomania.in/certificates/verify/${certificateId}`;

  const certDoc = {
    certificateId,
    firebaseUid,
    userEmail,
    recipientName: finalRecipient,
    type,
    title: certTitle,
    description: certDescription,
    domain: finalDomain,
    tier: type.startsWith('competition_') ? type.replace('competition_', '') : null,
    milestoneCount,
    duration: finalDuration,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    issueDate: new Date(),
    status: 'VALID',
    founderName: 'Lakhansing Patil',
    founderTitle: 'Founder, AlgoMania',
    verificationUrl,
    metadata: {
      issuedByAdmin: req.user.email,
      ...(type === 'internship' && app?.metadata?.paymentMode === 'test'
        ? { isTestCertificate: true, paymentMode: 'test' }
        : {})
    }
  };

  let savedCert = null;
  if (isConnected) {
    savedCert = await Certificate.create(certDoc);
    if (type === 'internship') {
      await InternshipApplication.findOneAndUpdate(
        { applicationId: targetId },
        { certificateIssued: true, certificateId }
      );
    }
  } else {
    savedCert = memoryStore.saveCertificate(certDoc);
    if (type === 'internship') {
      memoryStore.updateApplication(targetId, { certificateIssued: true, certificateId });
    }
  }

  await recordAdminAuditLog({
    action: `ISSUE_CERTIFICATE_${type.toUpperCase()}`,
    performedBy: req.user.email,
    targetType: 'certificate',
    targetId: certificateId,
    details: { recipientName: finalRecipient, type, userEmail },
    ipAddress: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
  });

  return res.status(201).json({
    success: true,
    message: 'Official certificate generated and issued successfully.',
    certificate: savedCert
  });
}

export default withAuth(handler, { requireEmailVerified: true });
