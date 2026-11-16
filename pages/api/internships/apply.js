import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import InternshipApplication from '../../../models/InternshipApplication.js';
import memoryStore from '../../../lib/memoryStore.js';
import { getProgramByDomain } from '../../../lib/internships/internshipData.js';
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

  const program = getProgramByDomain(domain);
  if (!program) {
    return res.status(400).json({
      success: false,
      message: 'Invalid domain selected. Please select Java, Python, or C++.'
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

  const domainNormalized = domain.toLowerCase().trim();

  // Check for duplicate active applications
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) {
      isConnected = true;
    }
  } catch (err) {
    console.warn('MongoDB connection check failed, using memory store fallback:', err.message);
  }

  if (isConnected) {
    const existing = await InternshipApplication.findOne({
      firebaseUid: user.uid,
      domain: domainNormalized,
      status: { $in: ['PENDING_REVIEW', 'APPROVED', 'IN_PROGRESS'] }
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_APPLICATION',
        message: `You already have an active application (${existing.applicationId}) for the ${program.domain} program.`
      });
    }
  } else {
    const existingApps = memoryStore.getApplicationsByUser(user.uid);
    const hasDuplicate = existingApps.some(
      a => a.domain === domainNormalized && ['PENDING_REVIEW', 'APPROVED', 'IN_PROGRESS'].includes(a.status)
    );
    if (hasDuplicate) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_APPLICATION',
        message: `You already have an active application for the ${program.domain} program.`
      });
    }
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
    domain: domainNormalized,
    domainTitle: program.title,
    duration,
    preferredStartDate,
    learningObjectives: learningObjectives.trim(),
    priorExperience: (priorExperience || '').trim(),
    status: 'PENDING_REVIEW',
    paymentStatus: 'NOT_CONFIGURED',
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
