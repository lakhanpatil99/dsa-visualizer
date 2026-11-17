// ---------------------------------------------------------------------------
// OnboardingEmailService — Central business logic for onboarding emails
// ---------------------------------------------------------------------------
// Responsibilities:
//   1. Create PENDING_VERIFICATION events (manual registration)
//   2. Create and immediately send for verified users (Google registration)
//   3. Complete pending events when email verification is confirmed
//   4. Atomic lease claiming via findOneAndUpdate (prevents double-send)
//   5. Error classification: transient → RETRYABLE_FAILURE, permanent → PERMANENT_FAILURE
//
// INVARIANT: One new account = one onboarding event = one welcome email.
// SAFETY:    Brevo failure must NEVER break Firebase authentication.
// ---------------------------------------------------------------------------

import dbConnect from '../../../lib/dbConnect.js';
import OnboardingEvent from '../../../models/OnboardingEvent.js';
import { getBrevoConfig } from './BrevoConfig.js';
import { BrevoClient } from './BrevoClient.js';

/**
 * Creates a PENDING_VERIFICATION onboarding event for a manual registration.
 * Idempotent: if the event already exists, returns it without error.
 *
 * @param {Object} params
 * @param {string} params.firebaseUid
 * @param {string} params.email
 * @param {string} params.name
 * @returns {Promise<{success: boolean, event?: object, alreadyExists?: boolean, error?: string}>}
 */
export async function createPendingOnboarding({ firebaseUid, email, name }) {
  try {
    const config = getBrevoConfig();
    if (!config.isConfigured) {
      // Silently skip — do not break auth flow
      return { success: true, skipped: true, reason: 'Brevo not configured' };
    }

    await dbConnect();

    // Check if event already exists (idempotency)
    const existing = await OnboardingEvent.findOne({
      firebaseUid,
      eventType: 'account_onboarding'
    });

    if (existing) {
      return { success: true, event: existing, alreadyExists: true };
    }

    // Create new pending event
    const event = await OnboardingEvent.create({
      firebaseUid,
      recipientEmail: email.toLowerCase().trim(),
      recipientName: name || '',
      eventType: 'account_onboarding',
      templateId: config.templateId,
      status: 'PENDING_VERIFICATION',
      attempts: 0,
      metadata: {
        registrationMethod: 'email_password',
        createdVia: 'onboarding_initiate'
      }
    });

    return { success: true, event };
  } catch (err) {
    // Handle unique index violation (race condition idempotency)
    if (err.code === 11000) {
      const existing = await OnboardingEvent.findOne({
        firebaseUid,
        eventType: 'account_onboarding'
      }).catch(() => null);
      return { success: true, event: existing, alreadyExists: true };
    }
    console.error('[OnboardingEmailService] createPendingOnboarding error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Completes a pending onboarding event: claims the lease, sends the email, updates status.
 * Idempotent: if already sent, returns success with alreadyProcessed flag.
 *
 * @param {Object} params
 * @param {string} params.firebaseUid
 * @param {string} params.email - Verified email address
 * @param {string} params.name
 * @returns {Promise<{success: boolean, alreadyProcessed?: boolean, messageId?: string, error?: string}>}
 */
export async function completeOnboarding({ firebaseUid, email, name }) {
  try {
    const config = getBrevoConfig();
    if (!config.isConfigured) {
      return { success: true, skipped: true, reason: 'Brevo not configured' };
    }

    await dbConnect();

    // Check if already sent
    const existing = await OnboardingEvent.findOne({
      firebaseUid,
      eventType: 'account_onboarding'
    });

    if (existing) {
      if (['ACCEPTED_BY_BREVO', 'DELIVERED'].includes(existing.status)) {
        return { success: true, alreadyProcessed: true };
      }
      if (existing.status === 'PERMANENT_FAILURE') {
        return { success: true, alreadyProcessed: true, permanentFailure: true };
      }
    }

    // Atomic lease: transition from PENDING_VERIFICATION or QUEUED → PROCESSING
    const claimableStatuses = ['PENDING_VERIFICATION', 'QUEUED', 'RETRYABLE_FAILURE'];
    let event;

    if (existing && claimableStatuses.includes(existing.status)) {
      event = await OnboardingEvent.findOneAndUpdate(
        {
          firebaseUid,
          eventType: 'account_onboarding',
          status: { $in: claimableStatuses }
        },
        {
          $set: {
            status: 'PROCESSING',
            recipientEmail: email.toLowerCase().trim(),
            recipientName: name || existing.recipientName
          },
          $inc: { attempts: 1 }
        },
        { new: true }
      );
    } else if (!existing) {
      // Google sign-up path: no prior PENDING_VERIFICATION event exists.
      // Create directly in PROCESSING status.
      try {
        event = await OnboardingEvent.create({
          firebaseUid,
          recipientEmail: email.toLowerCase().trim(),
          recipientName: name || '',
          eventType: 'account_onboarding',
          templateId: config.templateId,
          status: 'PROCESSING',
          attempts: 1,
          metadata: {
            registrationMethod: 'google',
            createdVia: 'onboarding_complete'
          }
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          // Race condition: another request created it
          const raceEvent = await OnboardingEvent.findOne({
            firebaseUid,
            eventType: 'account_onboarding'
          });
          if (raceEvent && ['ACCEPTED_BY_BREVO', 'DELIVERED'].includes(raceEvent.status)) {
            return { success: true, alreadyProcessed: true };
          }
          return { success: true, alreadyProcessed: true };
        }
        throw createErr;
      }
    }

    if (!event) {
      // Another process already claimed the lease
      return { success: true, alreadyProcessed: true };
    }

    // Check max attempts
    if (event.attempts > event.maxAttempts) {
      await OnboardingEvent.updateOne(
        { _id: event._id },
        { $set: { status: 'PERMANENT_FAILURE', lastError: 'Max attempts exceeded' } }
      );
      return { success: false, error: 'Max delivery attempts exceeded' };
    }

    // Send the email via Brevo
    const sendResult = await sendOnboardingEmail(event, config);

    if (sendResult.success) {
      await OnboardingEvent.updateOne(
        { _id: event._id },
        {
          $set: {
            status: 'ACCEPTED_BY_BREVO',
            brevoMessageId: sendResult.messageId,
            sentAt: new Date(),
            lastError: null
          }
        }
      );
      return { success: true, messageId: sendResult.messageId };
    }

    // Handle failure
    const newStatus = sendResult.errorType === 'transient' ? 'RETRYABLE_FAILURE' : 'PERMANENT_FAILURE';
    await OnboardingEvent.updateOne(
      { _id: event._id },
      {
        $set: {
          status: newStatus,
          lastError: sendResult.error
        }
      }
    );

    return { success: false, error: sendResult.error, errorType: sendResult.errorType };
  } catch (err) {
    console.error('[OnboardingEmailService] completeOnboarding error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Checks whether a user has already been onboarded (event exists in a terminal state).
 *
 * @param {string} firebaseUid
 * @returns {Promise<boolean>}
 */
export async function isAlreadyOnboarded(firebaseUid) {
  try {
    await dbConnect();
    const event = await OnboardingEvent.findOne({
      firebaseUid,
      eventType: 'account_onboarding'
    });
    return !!event;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Private: Send the actual email via Brevo
// ---------------------------------------------------------------------------

/**
 * @param {Object} event - The OnboardingEvent document
 * @param {Object} config - Brevo configuration
 * @returns {Promise<{success: boolean, messageId?: string, error?: string, errorType?: string}>}
 */
async function sendOnboardingEmail(event, config) {
  const client = new BrevoClient(config.apiKey);

  const firstName = (event.recipientName || '').split(' ')[0] || 'there';
  const fullName = event.recipientName || event.recipientEmail.split('@')[0];

  const templateParams = {
    firstName,
    fullName,
    email: event.recipientEmail,
    workspaceUrl: `${config.appBaseUrl}/app`,
    internshipsUrl: `${config.appBaseUrl}/internships`,
    competitionsUrl: `${config.appBaseUrl}/competitions`,
    dashboardUrl: `${config.appBaseUrl}/dashboard`,
    catalogUrl: `${config.appBaseUrl}/catalog`,
    platformName: 'AlgoMania'
  };

  return await client.sendTransactionalEmail({
    templateId: event.templateId || config.templateId,
    to: [{
      email: event.recipientEmail,
      name: event.recipientName || undefined
    }],
    params: templateParams
  });
}

export default {
  createPendingOnboarding,
  completeOnboarding,
  isAlreadyOnboarded
};
