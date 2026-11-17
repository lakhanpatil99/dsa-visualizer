import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import * as authService from '../../lib/authService.js';
import ProgressService from '../services/progressService.js';

// Session enforcement constants
const MAX_SESSION_AGE_MS = 8 * 60 * 60 * 1000;   // 8 hours absolute max
const IDLE_TIMEOUT_MS    = 30 * 60 * 1000;         // 30 minutes idle timeout
const IDLE_CHECK_INTERVAL_MS = 60 * 1000;          // Check every 60 seconds

// Explicit Authentication States
export const AuthStates = {
  INITIALIZING: 'INITIALIZING',
  SIGNED_OUT: 'SIGNED_OUT',
  AUTHENTICATING: 'AUTHENTICATING',
  AUTHENTICATED: 'AUTHENTICATED',
  EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
  PROFILE_SYNCHRONIZING: 'PROFILE_SYNCHRONIZING',
  AUTH_ERROR: 'AUTH_ERROR'
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(AuthStates.INITIALIZING);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const lastActivityRef = useRef(Date.now());

  // Helper to retrieve fresh ID token on demand
  const getIdToken = useCallback(async (forceRefresh = false) => {
    if (!auth || !auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken(forceRefresh);
      setIdToken(token);
      return token;
    } catch (err) {
      console.error('Failed to get fresh ID token:', err);
      return null;
    }
  }, []);

  // Synchronize user profile with MongoDB
  const syncWithBackend = useCallback(async (user, token) => {
    try {
      setAuthState(AuthStates.PROFILE_SYNCHRONIZING);
      const profile = await authService.syncUserWithBackend(token);
      setDbUser(profile);
      setAuthState(AuthStates.AUTHENTICATED);
      setAuthError(null);
      return profile;
    } catch (err) {
      console.error('Backend user sync failed:', err);
      // Fail-closed with recoverable state: do not create fake authenticated user on database failure
      setDbUser(null);
      setAuthError('Unable to synchronize profile with database. Please click retry to reconnect.');
      setAuthState(AuthStates.AUTH_ERROR);
      throw err;
    }
  }, []);

  // Main Firebase Auth State Observer
  useEffect(() => {
    if (!auth) {
      setAuthState(AuthStates.SIGNED_OUT);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setDbUser(null);
        setIdToken(null);
        setAuthState(AuthStates.SIGNED_OUT);
        return;
      }

      setFirebaseUser(user);

      // Check authoritative email_verified flag
      const isVerified = user.emailVerified === true;

      if (!isVerified) {
        setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
        return;
      }

      // User is verified, obtain token and sync with backend
      try {
        const token = await user.getIdToken();
        setIdToken(token);
        await syncWithBackend(user, token);
      } catch (err) {
        console.error('Error during auth state change processing:', err);
        setAuthError(authService.getFriendlyAuthErrorMessage(err));
        setAuthState(AuthStates.AUTH_ERROR);
      }
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  // Keep ID token fresh across expirations
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cross-tab logout and state synchronization via BroadcastChannel
  useEffect(() => {
    let bc = null;
    try {
      bc = new BroadcastChannel('algomania_auth');
      bc.onmessage = (event) => {
        if (event.data === 'LOGOUT') {
          if (auth && auth.currentUser) {
            auth.signOut();
          }
        }
      };
    } catch {
      // BroadcastChannel not supported — fall back to localStorage event
    }

    // Legacy fallback for browsers without BroadcastChannel
    const handleStorageChange = (e) => {
      if (e.key === 'algomania_logout_event') {
        if (auth && auth.currentUser) {
          auth.signOut();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

  // Track user activity for idle timeout
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
    };
  }, []);

  // Session enforcement: 8h max age + 30m idle timeout
  useEffect(() => {
    if (!auth) return;

    const intervalId = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;

      const now = Date.now();

      // Check idle timeout (30 minutes without user interaction)
      if (now - lastActivityRef.current > IDLE_TIMEOUT_MS) {
        console.warn('[AlgoMania Session] Idle timeout exceeded (30 minutes). Logging out.');
        if (auth) await auth.signOut();
        return;
      }

      // Check absolute session lifetime (8 hours from auth_time)
      try {
        const tokenResult = await user.getIdTokenResult(false);
        const authTime = tokenResult.claims.auth_time;
        if (authTime) {
          const authTimeMs = Number(authTime) * 1000;
          if (now - authTimeMs > MAX_SESSION_AGE_MS) {
            console.warn('[AlgoMania Session] Maximum session lifetime exceeded (8 hours). Logging out.');
            if (auth) await auth.signOut();
            return;
          }
        }
      } catch (err) {
        console.warn('[AlgoMania Session] Session check error:', err.message);
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // Registration handler
  const register = useCallback(async (fullName, email, password) => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const { user, verificationSent } = await authService.registerWithEmailPassword(
        fullName,
        email,
        password
      );
      setFirebaseUser(user);
      setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
      return {
        success: true,
        verificationSent,
        message: 'Account created! Please check your email to verify your account.'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const user = await authService.loginWithEmailPassword(email, password);
      setFirebaseUser(user);

      if (!user.emailVerified) {
        setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
        return {
          success: true,
          emailVerified: false,
          message: 'Please verify your email address to access AlgoMania.'
        };
      }

      const token = await user.getIdToken();
      setIdToken(token);
      await syncWithBackend(user, token);

      return {
        success: true,
        emailVerified: true,
        message: 'Login successful! Welcome back.'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, [syncWithBackend]);

  // Google Login handler
  const loginWithGoogle = useCallback(async () => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const user = await authService.loginWithGoogle();
      setFirebaseUser(user);

      const token = await user.getIdToken();
      setIdToken(token);
      await syncWithBackend(user, token);

      return {
        success: true,
        message: 'Signed in with Google successfully!'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, [syncWithBackend]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authService.logoutUser();
      // Notify other browser tabs via BroadcastChannel
      if (typeof window !== 'undefined') {
        try {
          const bc = new BroadcastChannel('algomania_auth');
          bc.postMessage('LOGOUT');
          bc.close();
        } catch {
          // Fallback for no BroadcastChannel support
        }
        // Legacy fallback
        localStorage.setItem('algomania_logout_event', Date.now().toString());
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setFirebaseUser(null);
      setDbUser(null);
      setIdToken(null);
      setAuthState(AuthStates.SIGNED_OUT);
      setAuthError(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, []);

  // Reload user state (used when user returns after clicking verification email)
  const refreshUser = useCallback(async () => {
    if (!auth || !auth.currentUser) return null;
    try {
      const refreshedUser = await authService.reloadCurrentUser();
      setFirebaseUser({ ...refreshedUser });

      if (refreshedUser && refreshedUser.emailVerified) {
        const token = await refreshedUser.getIdToken(true);
        setIdToken(token);
        await syncWithBackend(refreshedUser, token);
        return { verified: true };
      }
      return { verified: false };
    } catch (err) {
      console.error('Error refreshing user status:', err);
      return { verified: false, error: err.message };
    }
  }, [syncWithBackend]);

  // Resend verification email
  const resendVerification = useCallback(async () => {
    try {
      await authService.resendVerificationEmail(firebaseUser);
      return { success: true, message: 'Verification email sent. Please check your inbox.' };
    } catch (err) {
      return { success: false, message: authService.getFriendlyAuthErrorMessage(err) };
    }
  }, [firebaseUser]);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.requestPasswordReset(email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (err) {
      return { success: false, message: authService.getFriendlyAuthErrorMessage(err) };
    }
  }, []);

  // Progress service instance with fresh token accessor
  const progressService = useMemo(() => {
    if (!idToken) return null;
    return new ProgressService(idToken, getIdToken);
  }, [idToken, getIdToken]);

  // Retry backend synchronization
  const retrySync = useCallback(async () => {
    if (!firebaseUser) return null;
    try {
      setAuthError(null);
      const token = await getIdToken(true);
      if (token) {
        return await syncWithBackend(firebaseUser, token);
      }
    } catch (err) {
      console.error('Retry sync failed:', err);
      return null;
    }
  }, [firebaseUser, getIdToken, syncWithBackend]);

  // Unified user object for backward compatibility with existing components
  const unifiedUser = useMemo(() => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      id: dbUser?._id || firebaseUser.uid,
      _id: dbUser?._id || firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || dbUser?.displayName || firebaseUser.email?.split('@')[0] || 'User',
      username: dbUser?.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      displayName: firebaseUser.displayName || dbUser?.displayName,
      photoURL: firebaseUser.photoURL || dbUser?.photoURL,
      emailVerified: firebaseUser.emailVerified,
      createdAt: dbUser?.createdAt || firebaseUser.metadata?.creationTime
    };
  }, [firebaseUser, dbUser]);

  const value = {
    // States
    authState,
    loading: authState === AuthStates.INITIALIZING || authState === AuthStates.AUTHENTICATING || authState === AuthStates.PROFILE_SYNCHRONIZING,
    isAuthenticated: authState === AuthStates.AUTHENTICATED,
    isEmailVerified: !!firebaseUser && firebaseUser.emailVerified === true,
    
    // User objects
    user: unifiedUser,
    firebaseUser,
    dbUser,
    token: idToken,
    getIdToken,

    // Error
    error: authError,
    clearError: () => setAuthError(null),

    // Actions
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
    resendVerification,
    forgotPassword,
    retrySync,
    progressService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
