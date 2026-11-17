import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import Certificate from '../../../models/Certificate.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import CompetitionSubmission from '../../../models/CompetitionSubmission.js';
import { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import { COMPETITION_CHALLENGES } from '../../../lib/competitions/challengesData.js';
import memoryStore from '../../../lib/memoryStore.js';
import { ensureCompetitionMilestoneCertificates } from '../../../lib/certificates/competitionMilestoneIssuance.js';

async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const connection = await dbConnect();
    let issuedCertificates = [];
    let applications = [];
    let acceptedChallengeIds = [];

    if (connection?.connection?.readyState === 1) {
      [issuedCertificates, applications, acceptedChallengeIds] = await Promise.all([
        Certificate.find({ firebaseUid: req.user.uid }).sort({ issueDate: -1 }).lean(),
        InternshipApplication.find({ firebaseUid: req.user.uid }).sort({ createdAt: -1 }).lean(),
        CompetitionSubmission.distinct('challengeId', {
          firebaseUid: req.user.uid,
          status: 'ACCEPTED'
        })
      ]);
    } else if (process.env.NODE_ENV !== 'production') {
      issuedCertificates = memoryStore.getCertificatesByUser(req.user.uid);
      applications = memoryStore.getApplicationsByUser(req.user.uid);
      acceptedChallengeIds = [...new Set(
        memoryStore.getSubmissionsByUser(req.user.uid)
          .filter((submission) => submission.status === 'ACCEPTED')
          .map((submission) => submission.challengeId)
      )];
    } else {
      throw new Error('MongoDB is not connected.');
    }

    const uniqueSolved = acceptedChallengeIds.length;
    let certificateIssuancePending = false;

    // Idempotent retry path: if issuance was interrupted after an accepted
    // submission, loading the signed-in certificate vault completes it safely.
    if (connection?.connection?.readyState === 1) {
      try {
        await ensureCompetitionMilestoneCertificates({
          firebaseUid: req.user.uid,
          userEmail: req.user.email,
          recipientName: req.dbUser?.displayName || req.dbUser?.username || req.user.name,
          uniqueSolvedCount: uniqueSolved
        });
        issuedCertificates = await Certificate.find({ firebaseUid: req.user.uid })
          .sort({ issueDate: -1 })
          .lean();
      } catch (issuanceError) {
        certificateIssuancePending = true;
        console.error('[MyCertificates] Automatic competition issuance will retry:', issuanceError?.message || 'Unknown error');
      }
    }

    const unlockedTiers = [];
    if (uniqueSolved >= ACHIEVEMENT_THRESHOLDS.BRONZE) unlockedTiers.push('bronze');
    if (uniqueSolved >= ACHIEVEMENT_THRESHOLDS.SILVER) unlockedTiers.push('silver');
    if (uniqueSolved >= ACHIEVEMENT_THRESHOLDS.GOLD) unlockedTiers.push('gold');

    const pendingCertificates = [];
    const competitionMilestones = [
      { tier: 'bronze', label: 'Bronze Tier Competition Achievement', target: ACHIEVEMENT_THRESHOLDS.BRONZE },
      { tier: 'silver', label: 'Silver Tier Competition Achievement', target: ACHIEVEMENT_THRESHOLDS.SILVER },
      { tier: 'gold', label: 'Gold Tier Competition Mastery', target: ACHIEVEMENT_THRESHOLDS.GOLD }
    ];

    for (const milestone of competitionMilestones) {
      const existingCredential = issuedCertificates.find(
        (certificate) => certificate.type === `competition_${milestone.tier}`
      );

      if (!existingCredential) {
        const milestoneReached = uniqueSolved >= milestone.target;
        pendingCertificates.push({
          id: `comp-${milestone.tier}`,
          type: `competition_${milestone.tier}`,
          title: milestone.label,
          milestoneReached,
          currentProgress: uniqueSolved,
          targetProgress: milestone.target,
          remainingProgress: Math.max(0, milestone.target - uniqueSolved),
          lockReason: milestoneReached
            ? (certificateIssuancePending
              ? 'Achievement verified. Official certificate creation is temporarily delayed; this page will retry automatically.'
              : 'Achievement verified. The official credential is being synchronized. Refresh shortly if the download option is not visible.')
            : `Milestone not reached: ${uniqueSolved}/${milestone.target} unique accepted problems solved.`
        });
      }
    }

    for (const app of applications) {
      const existingCredential = issuedCertificates.find(
        (certificate) =>
          certificate.type === 'internship' &&
          ((app.certificateId && certificate.certificateId === app.certificateId) ||
            certificate.sourceKey === `internship:${app.applicationId}`)
      );

      if (!existingCredential) {
        const isCompleted = app.status === 'COMPLETED';
        const isPaid = app.paymentStatus === 'PAID_VERIFIED';
        let lockReason;

        if (app.status === 'PENDING_REVIEW') {
          lockReason = 'Application is awaiting administrative review.';
        } else if (app.status === 'APPROVED') {
          lockReason = 'Application approved. Your internship will begin as scheduled.';
        } else if (app.status === 'IN_PROGRESS') {
          lockReason = isPaid
            ? 'Your ₹99 registration payment is verified. Complete the internship deliverables and mentor review to become eligible for the completion certificate.'
            : 'Your internship is in progress. Complete the deliverables and ensure the ₹99 registration payment is verified.';
        } else if (isCompleted && isPaid) {
          lockReason = 'Internship completion and registration payment are verified. Waiting for authorized certificate issuance.';
        } else if (isCompleted && !isPaid) {
          lockReason = 'Internship completion is recorded, but the ₹99 registration payment is not verified.';
        } else if (app.status === 'REJECTED') {
          lockReason = 'Application was not approved.';
        } else if (app.status === 'CANCELLED') {
          lockReason = 'Application was cancelled.';
        } else {
          lockReason = 'Complete the internship and verify the registration payment before certificate issuance.';
        }

        pendingCertificates.push({
          id: app.applicationId,
          type: 'internship',
          title: `${app.domainTitle} Internship Certificate`,
          domain: app.domain,
          duration: app.duration,
          applicationStatus: app.status,
          paymentStatus: app.paymentStatus,
          isCompleted,
          paymentVerified: isPaid,
          eligibleForIssuance: isCompleted && isPaid,
          lockReason
        });
      }
    }

    return res.status(200).json({
      success: true,
      issuedCertificates,
      pendingCertificates,
      certificateIssuancePending,
      competitionProgress: {
        uniqueSolvedCount: uniqueSolved,
        solvedChallengeIds: acceptedChallengeIds,
        totalChallenges: COMPETITION_CHALLENGES.length,
        unlockedTiers,
        updatedAt: new Date().toISOString()
      },
      badges: [
        { tier: 'bronze', unlocked: unlockedTiers.includes('bronze'), count: ACHIEVEMENT_THRESHOLDS.BRONZE, currentCount: uniqueSolved },
        { tier: 'silver', unlocked: unlockedTiers.includes('silver'), count: ACHIEVEMENT_THRESHOLDS.SILVER, currentCount: uniqueSolved },
        { tier: 'gold', unlocked: unlockedTiers.includes('gold'), count: ACHIEVEMENT_THRESHOLDS.GOLD, currentCount: uniqueSolved }
      ]
    });
  } catch (error) {
    console.error('[MyCertificates] Unable to load authoritative records:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'CERTIFICATE_DATA_UNAVAILABLE',
      message: 'Certificate and achievement records are temporarily unavailable. Please retry shortly.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
