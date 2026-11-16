import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import Certificate from '../../../models/Certificate.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  let issuedCertificates = [];
  let applications = [];
  let achievement = null;

  if (isConnected) {
    issuedCertificates = await Certificate.find({ firebaseUid: user.uid }).sort({ issueDate: -1 });
    applications = await InternshipApplication.find({ firebaseUid: user.uid });
    achievement = await CompetitionAchievement.findOne({ firebaseUid: user.uid });
  } else {
    issuedCertificates = memoryStore.getCertificatesByUser(user.uid);
    applications = memoryStore.getApplicationsByUser(user.uid);
    achievement = memoryStore.getAchievement(user.uid);
  }

  const uniqueSolved = achievement?.uniqueSolvedCount || 0;
  const unlockedTiers = achievement?.unlockedTiers || [];

  // Build Locked / Pending certificates list
  const pendingCertificates = [];

  // Check competition tiers eligibility
  const competitionMilestones = [
    { tier: 'bronze', label: 'Bronze Tier Competition Achievement', target: ACHIEVEMENT_THRESHOLDS.BRONZE },
    { tier: 'silver', label: 'Silver Tier Competition Achievement', target: ACHIEVEMENT_THRESHOLDS.SILVER },
    { tier: 'gold', label: 'Gold Tier Competition Mastery', target: ACHIEVEMENT_THRESHOLDS.GOLD }
  ];

  for (const m of competitionMilestones) {
    const hasCertificate = issuedCertificates.some(c => c.type === `competition_${m.tier}` && c.status === 'VALID');
    if (!hasCertificate) {
      const milestoneReached = uniqueSolved >= m.target;
      pendingCertificates.push({
        id: `comp-${m.tier}`,
        type: `competition_${m.tier}`,
        title: m.label,
        milestoneReached,
        currentProgress: uniqueSolved,
        targetProgress: m.target,
        paymentVerified: false,
        paymentConfigured: false,
        lockReason: !milestoneReached
          ? `Milestone not reached: ${uniqueSolved}/${m.target} problems solved.`
          : 'Payment gateway activation is in progress. Certificate download will activate upon payment activation.'
      });
    }
  }

  // Check internship applications eligibility
  for (const app of applications) {
    if (!app.certificateIssued) {
      const isCompleted = app.status === 'COMPLETED';
      const isPaid = app.paymentStatus === 'PAID_VERIFIED';
      let lockReason = '';
      if (app.status === 'PENDING_REVIEW') {
        lockReason = 'Application pending administrative review.';
      } else if (app.status === 'APPROVED') {
        lockReason = 'Internship approved. Program is scheduled to begin.';
      } else if (app.status === 'IN_PROGRESS') {
        lockReason = 'Internship in progress. Complete all sprint deliverables and project defense.';
      } else if (isCompleted && !isPaid) {
        lockReason = 'Internship verified completed by mentor. Certificate fee processing is pending payment gateway activation.';
      } else if (app.status === 'REJECTED') {
        lockReason = 'Application was not approved.';
      }

      pendingCertificates.push({
        id: app.applicationId,
        type: 'internship',
        title: `${app.domainTitle} Internship Certificate`,
        domain: app.domain,
        duration: app.duration,
        applicationStatus: app.status,
        isCompleted,
        paymentStatus: app.paymentStatus,
        lockReason
      });
    }
  }

  return res.status(200).json({
    success: true,
    issuedCertificates,
    pendingCertificates,
    badges: [
      { tier: 'bronze', unlocked: unlockedTiers.includes('bronze'), count: 20 },
      { tier: 'silver', unlocked: unlockedTiers.includes('silver'), count: 100 },
      { tier: 'gold', unlocked: unlockedTiers.includes('gold'), count: 200 }
    ]
  });
}

export default withAuth(handler, { requireEmailVerified: true });
