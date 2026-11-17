import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import Certificate from '../../../models/Certificate.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
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

  let connection;
  try {
    connection = await dbConnect();
    if (!connection || connection.connection?.readyState !== 1) {
      throw new Error('MongoDB is not connected.');
    }
    // Ensure the sparse unique source index exists before issuing any credential.
    await Certificate.collection.createIndex(
      { sourceKey: 1 },
      { unique: true, sparse: true, name: 'certificate_sourceKey_unique' }
    );
  } catch (error) {
    console.error('[issue-certificate] Certificate registry unavailable:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'CERTIFICATE_REGISTRY_UNAVAILABLE',
      message: 'The certificate registry is temporarily unavailable. Please retry.'
    });
  }
  const isConnected = true;

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
    app = await InternshipApplication.findOne({ applicationId: targetId });

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
    ach = await CompetitionAchievement.findOne({ firebaseUid });

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

  // Stable source identity makes issuing the same eligible credential idempotent.
  const sourceKey = type === 'internship'
    ? `internship:${targetId}`
    : `competition:${firebaseUid}:${type}`;

  const existingCertificate = await Certificate.findOne({ sourceKey });
  const legacyCertificate = type === 'internship' && app.certificateId
    ? await Certificate.findOne({ certificateId: app.certificateId })
    : (type.startsWith('competition_')
      ? await Certificate.findOne({ firebaseUid, type })
      : null);
  const previouslyIssued = existingCertificate || legacyCertificate;

  if (previouslyIssued) {
    if (type === 'internship') {
      await InternshipApplication.findOneAndUpdate(
        { applicationId: targetId },
        { certificateIssued: true, certificateId: previouslyIssued.certificateId }
      );
    }
    return res.status(200).json({
      success: true,
      alreadyIssued: true,
      message: 'This source record already has an official certificate.',
      certificate: previouslyIssued
    });
  }

  const year = new Date().getUTCFullYear();
  const idPrefix = type === 'internship'
    ? 'ALG-INT'
    : type === 'competition_bronze'
      ? 'ALG-CMP-BR'
      : type === 'competition_silver'
        ? 'ALG-CMP-SL'
        : 'ALG-CMP-AU';

  let certificateId = '';
  let verificationUrl = '';

  const certDoc = {
    certificateId,
    sourceKey,
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
  for (let attempt = 0; attempt < 3; attempt += 1) {
    certificateId = `${idPrefix}-${year}-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
    verificationUrl = `https://www.algomania.in/certificates/verify/${certificateId}`;
    certDoc.certificateId = certificateId;
    certDoc.verificationUrl = verificationUrl;

    try {
      savedCert = await Certificate.create(certDoc);
      break;
    } catch (error) {
      if (error?.code === 11000) {
        // Another concurrent request may have issued this source record first.
        const winner = await Certificate.findOne({ sourceKey });
        if (winner) {
          savedCert = winner;
          break;
        }
        // Otherwise retry a highly unlikely credential-ID collision.
        if (attempt < 2) continue;
      }
      throw error;
    }
  }

  if (!savedCert) {
    return res.status(503).json({
      success: false,
      code: 'CERTIFICATE_ISSUANCE_RETRY',
      message: 'The credential could not be issued safely. Please retry.'
    });
  }

  if (type === 'internship') {
    await InternshipApplication.findOneAndUpdate(
      { applicationId: targetId },
      { certificateIssued: true, certificateId: savedCert.certificateId }
    );
  }

  await recordAdminAuditLog({
    action: `ISSUE_CERTIFICATE_${type.toUpperCase()}`,
    performedBy: req.user.email,
    targetType: 'certificate',
    targetId: savedCert.certificateId,
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
