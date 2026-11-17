// ---------------------------------------------------------------------------
// POST /api/auth/onboarding/initiate
// ---------------------------------------------------------------------------
// Called immediately after manual registration (email/password) to create a
// PENDING_VERIFICATION onboarding event. The email is not sent yet — it waits
// for the user to verify their email, at which point /complete is called.
//
// For Google sign-up, the client calls /complete directly (email is already
// verified by Google/Firebase).
//
// Auth: Requires Firebase ID token. Does NOT require email verification
//       (the whole point is to register intent before verification).
// ---------------------------------------------------------------------------

import { withAuth } from '../../../../lib/auth.js';
import { createPendingOnboarding } from '../../../../src/services/brevo/OnboardingEmailService.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { firebaseUid, email, name } = req.user;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing authenticated identity'
      });
    }

    const result = await createPendingOnboarding({
      firebaseUid,
      email,
      name: name || ''
    });

    if (!result.success) {
      // Log but do not fail the registration flow
      console.error('[onboarding/initiate] Failed to create pending event:', result.error);
      return res.status(200).json({
        success: true,
        onboarding: false,
        reason: 'Could not create onboarding event'
      });
    }

    return res.status(200).json({
      success: true,
      onboarding: true,
      alreadyExists: result.alreadyExists || false,
      skipped: result.skipped || false
    });
  } catch (err) {
    console.error('[onboarding/initiate] Unexpected error:', err.message);
    // NEVER fail the registration flow due to Brevo errors
    return res.status(200).json({
      success: true,
      onboarding: false,
      reason: 'Internal error creating onboarding event'
    });
  }
}

// Allow without email verification — this is called during registration
export default withAuth(handler, { requireEmailVerified: false });
