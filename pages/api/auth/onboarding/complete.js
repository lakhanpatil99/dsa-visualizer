// ---------------------------------------------------------------------------
// POST /api/auth/onboarding/complete
// ---------------------------------------------------------------------------
// Called when email verification is confirmed (manual flow) or immediately
// after Google sign-up (email already verified).
//
// Server-side verification:
//   1. Verifies the Firebase ID token
//   2. Confirms emailVerified === true via the token claims
//   3. Optionally double-checks via Firebase Admin getUser()
//   4. Claims the onboarding lease atomically
//   5. Sends the Brevo transactional email
//   6. Updates the event status
//
// Idempotent: repeated calls return { success: true, alreadyProcessed: true }.
// SAFETY: Failure here NEVER breaks the user's login/verification flow.
// ---------------------------------------------------------------------------

import { withAuth } from '../../../../lib/auth.js';
import { completeOnboarding, isAlreadyOnboarded } from '../../../../src/services/brevo/OnboardingEmailService.js';
import admin from '../../../../lib/firebaseAdmin.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { firebaseUid, email, name, emailVerified } = req.user;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing authenticated identity'
      });
    }

    // REQUIREMENT: Email must be verified before sending the onboarding email
    if (!emailVerified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email verification is required before onboarding email can be sent.'
      });
    }

    // Optional: Double-check with Firebase Admin for extra security
    let verifiedName = name;
    try {
      const adminAuth = admin.auth();
      if (adminAuth) {
        const userRecord = await adminAuth.getUser(firebaseUid);
        if (!userRecord.emailVerified) {
          return res.status(403).json({
            success: false,
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Server-side verification confirms email is not verified.'
          });
        }
        // Use Firebase Admin's authoritative display name
        verifiedName = userRecord.displayName || name || '';
      }
    } catch (adminErr) {
      // Firebase Admin check failed — proceed with token claims only
      console.warn('[onboarding/complete] Firebase Admin getUser failed, proceeding with token claims:', adminErr.message);
    }

    // Check if request body indicates this is a new user (for Google sign-up detection)
    const body = typeof req.body === 'object' ? req.body : {};
    const isNewUser = body.isNewUser === true;

    // For non-new-user Google logins, check if already onboarded
    if (!isNewUser) {
      const alreadyOnboarded = await isAlreadyOnboarded(firebaseUid);
      if (alreadyOnboarded) {
        return res.status(200).json({
          success: true,
          alreadyProcessed: true,
          message: 'User already onboarded'
        });
      }
    }

    // Complete the onboarding: claim lease → send email → update status
    const result = await completeOnboarding({
      firebaseUid,
      email,
      name: verifiedName || ''
    });

    if (result.skipped) {
      return res.status(200).json({
        success: true,
        onboarding: false,
        reason: result.reason
      });
    }

    if (result.alreadyProcessed) {
      return res.status(200).json({
        success: true,
        alreadyProcessed: true,
        message: 'Onboarding email was already sent'
      });
    }

    if (!result.success) {
      console.error('[onboarding/complete] Send failed:', result.error);
      // SAFETY: Return 200 so the user's auth flow is not broken
      return res.status(200).json({
        success: true,
        onboarding: false,
        emailSent: false,
        reason: 'Email delivery encountered an error'
      });
    }

    return res.status(200).json({
      success: true,
      onboarding: true,
      emailSent: true,
      messageId: result.messageId
    });
  } catch (err) {
    console.error('[onboarding/complete] Unexpected error:', err.message);
    // NEVER break the user's authentication flow
    return res.status(200).json({
      success: true,
      onboarding: false,
      reason: 'Internal error during onboarding'
    });
  }
}

// Email verification IS required for this endpoint
export default withAuth(handler, { requireEmailVerified: true });
