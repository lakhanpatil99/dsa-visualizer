import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.js';

/**
 * Translates Firebase error codes to friendly, human-readable error messages.
 */
export function getFriendlyAuthErrorMessage(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please log in or use password reset.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Invalid email or password. Please double check your credentials and try again.';
    case 'auth/weak-password':
      return 'Your password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access has been temporarily disabled. Please wait a few minutes or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. The Google sign-in window was closed before completion.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site and retry.';
    case 'auth/requires-recent-login':
      return 'This action is sensitive and requires recent authentication. Please log out and log in again before proceeding.';
    case 'auth/user-disabled':
      return 'This account has been suspended or disabled. Please contact support.';
    case 'auth/expired-action-code':
      return 'This verification link has expired. Please request a new verification email.';
    case 'auth/invalid-action-code':
      return 'This verification link is invalid or has already been used.';
    default:
      return error.message || 'Authentication error. Please try again.';
  }
}

/**
 * Build ActionCodeSettings for email verification and password resets
 */
function getActionCodeSettings() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return {
    url: `${origin}/verify-email?mode=action`,
    handleCodeInApp: true
  };
}

/**
 * Register a new user with full name, email, and password.
 * Dispatches verification email automatically.
 */
export async function registerWithEmailPassword(fullName, email, password) {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const normalizedEmail = email.toLowerCase().trim();

  // Create Firebase user
  const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
  const user = userCredential.user;

  // Update display name
  if (fullName && fullName.trim()) {
    try {
      await updateProfile(user, { displayName: fullName.trim() });
    } catch (e) {
      console.warn('Could not update display name during registration:', e);
    }
  }

  // Send email verification
  let verificationSent = false;
  try {
    await sendEmailVerification(user, getActionCodeSettings());
    verificationSent = true;
  } catch (err) {
    console.error('Error dispatching initial verification email:', err);
    verificationSent = false;
  }

  return {
    user,
    verificationSent
  };
}

/**
 * Authenticate existing user with email and password.
 */
export async function loginWithEmailPassword(email, password) {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const normalizedEmail = email.toLowerCase().trim();
  const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  
  // Reload user to get freshest emailVerified flag
  try {
    await userCredential.user.reload();
  } catch (e) {
    console.warn('Could not reload user after login:', e);
  }

  return userCredential.user;
}

/**
 * Authenticate with Google OAuth.
 */
export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Send or resend verification email with continuation settings.
 */
export async function resendVerificationEmail(user = null) {
  const targetUser = user || (auth ? auth.currentUser : null);
  if (!targetUser) throw new Error('No user is currently signed in');
  await sendEmailVerification(targetUser, getActionCodeSettings());
  return true;
}

/**
 * Reloads user profile and verifies refreshed status.
 */
export async function reloadCurrentUser() {
  if (!auth || !auth.currentUser) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
}

/**
 * Trigger password reset email.
 */
export async function requestPasswordReset(email) {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  const normalizedEmail = email.toLowerCase().trim();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  await sendPasswordResetEmail(auth, normalizedEmail, {
    url: `${origin}/login`
  });
  return true;
}

/**
 * Change current user password.
 */
export async function updateCurrentUserPassword(newPassword) {
  if (!auth || !auth.currentUser) throw new Error('No user signed in');
  await updatePassword(auth.currentUser, newPassword);
  return true;
}

/**
 * Update current user profile.
 */
export async function updateCurrentUserProfile(profileData) {
  if (!auth || !auth.currentUser) throw new Error('No user signed in');
  await updateProfile(auth.currentUser, profileData);
  return true;
}

/**
 * Change user email address with re-verification.
 */
export async function changeCurrentUserEmail(newEmail) {
  if (!auth || !auth.currentUser) throw new Error('No user signed in');
  const normalizedEmail = newEmail.toLowerCase().trim();
  await verifyBeforeUpdateEmail(auth.currentUser, normalizedEmail, getActionCodeSettings());
  return true;
}

/**
 * Sign out from Firebase.
 */
export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Synchronize Firebase user with MongoDB backend idempotently.
 */
export async function syncUserWithBackend(idToken) {
  const response = await fetch('/api/auth/sync-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to sync user with backend (${response.status})`);
  }

  const data = await response.json();
  return data.user;
}

/**
 * Delete account in Firebase and MongoDB.
 */
export async function deleteUserAccount(idToken) {
  // First notify backend to delete/archive MongoDB records
  const response = await fetch('/api/auth/delete-account', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete account from database');
  }

  // Then delete from Firebase Auth
  if (auth && auth.currentUser) {
    await deleteUser(auth.currentUser);
  }

  return true;
}
