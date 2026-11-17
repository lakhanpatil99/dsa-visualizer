import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { getProgramByDomain, validateDomain, getDomainDisplayName } from '../../../lib/internships/internshipData.js';
import crypto from 'crypto';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const {
    fullName,
    contactNumber,
    college,
    branch,
    academicYear,
    domain,
    duration,
    preferredStartDate,
    learningObjectives,
    priorExperience
  } = req.body || {};

  // Form Validations
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Valid full name is required.' });
  }
  if (!contactNumber || typeof contactNumber !== 'string' || contactNumber.trim().length < 8) {
    return res.status(400).json({ success: false, message: 'Valid contact number is required.' });
  }
  if (!college || typeof college !== 'string' || college.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'College/Institution is required.' });
  }
  if (!branch || typeof branch !== 'string') {
    return res.status(400).json({ success: false, message: 'Academic branch is required.' });
  }
  if (!academicYear) {
    return res.status(400).json({ success: false, message: 'Academic year is required.' });
  }

  const canonicalDomain = validateDomain(domain);
  if (!canonicalDomain) {
    return res.status(400).json({
      success: false,
      message: 'Invalid domain selected. Please select Java, Python, or C++.'
    });
  }

  const program = getProgramByDomain(canonicalDomain);
  if (!program) {
    return res.status(400).json({
      success: false,
      message: 'Program definition not found for the selected domain.'
    });
  }

  const validDurations = ['1_month', '2_months', '3_months'];
  if (!duration || !validDurations.includes(duration)) {
    return res.status(400).json({ success: false, message: 'Valid duration (1, 2, or 3 months) is required.' });
  }

  if (!preferredStartDate) {
    return res.status(400).json({ success: false, message: 'Preferred start date is required.' });
  }
  if (!learningObjectives || learningObjectives.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Please describe your learning objectives (minimum 10 characters).' });
  }

  // Check database connection
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) {
      isConnected = true;
    }
  } catch (err) {
    console.warn('MongoDB connection check failed:', err.message);
  }

  if (process.env.NODE_ENV === 'production' && !isConnected) {
    return res.status(503).json({
      success: false,
      code: 'SERVICE_UNAVAILABLE',
      message: 'Database service is temporarily unavailable. Please retry shortly.'
    });
  }

  // Check for existing application by this user in this domain
  let existing = null;
  if (isConnected) {
    existing = await InternshipApplication.findOne({
      firebaseUid: user.uid,
      domain: canonicalDomain,
    }).sort({ createdAt: -1 });
  } else {
    const existingApps = memoryStore.getApplicationsByUser(user.uid);
    existing = existingApps.find(a => a.domain === canonicalDomain) || null;
  }

  if (existing) {
    // If already paid, reject duplicate registration
    if (existing.paymentStatus === 'PAID_VERIFIED') {
      return res.status(409).json({
        success: false,
        code: 'ALREADY_REGISTERED',
        message: `You already have an active paid registration (${existing.applicationId}) for the ${getDomainDisplayName(canonicalDomain)} track.`
      });
    }

    // If unpaid, allow updating existing application and return it to proceed to payment
    const updateData = {
      fullName: fullName.trim(),
      contactNumber: contactNumber.trim(),
      college: college.trim(),
      branch: branch.trim(),
      academicYear,
      duration,
      preferredStartDate,
      learningObjectives: learningObjectives.trim(),
      priorExperience: (priorExperience || '').trim(),
      updatedAt: new Date()
    };

    let updatedApplication;
    if (isConnected) {
      updatedApplication = await InternshipApplication.findOneAndUpdate(
        { applicationId: existing.applicationId },
        { $set: updateData },
        { new: true }
      );
    } else {
      updatedApplication = memoryStore.updateApplication(existing.applicationId, updateData);
    }

    return res.status(200).json({
      success: true,
      isExistingPending: true,
      message: 'Existing pending application retrieved. Please proceed to payment.',
      application: updatedApplication || existing
    });
  }

  // Generate Unique Application ID: INT-2026-XXXXX
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  const applicationId = `INT-2026-${randomSuffix}`;

  const applicationDoc = {
    applicationId,
    firebaseUid: user.uid,
    userEmail: user.email,
    fullName: fullName.trim(),
    contactNumber: contactNumber.trim(),
    college: college.trim(),
    branch: branch.trim(),
    academicYear,
    domain: canonicalDomain,
    domainTitle: program.title,
    duration,
    preferredStartDate,
    learningObjectives: learningObjectives.trim(),
    priorExperience: (priorExperience || '').trim(),
    status: 'PENDING_REVIEW',
    paymentStatus: 'PENDING_PAYMENT',
    appliedAt: new Date()
  };

  if (isConnected) {
    const created = await InternshipApplication.create(applicationDoc);
    return res.status(201).json({
      success: true,
      message: 'Internship application submitted successfully.',
      application: created
    });
  } else {
    const created = memoryStore.saveApplication(applicationDoc);
    return res.status(201).json({
      success: true,
      message: 'Internship application submitted successfully.',
      application: created
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
