import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import EmailVerificationGuard from '../src/components/EmailVerificationGuard';
import { confirmEmailVerification, getFriendlyAuthErrorMessage } from '../lib/authService';

export default function VerifyEmail() {
  const { user, refreshUser, resendVerification, logout } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const router = useRouter();

  // Handle direct verification link with action code (oobCode)
  useEffect(() => {
    if (!router.isReady) return;
    const { oobCode, mode } = router.query;
    if (oobCode && (mode === 'verifyEmail' || mode === 'action' || !mode)) {
      setIsChecking(true);
      setNotification({
        type: 'info',
        text: 'Verifying your email code...'
      });

      confirmEmailVerification(oobCode)
        .then(async () => {
          setNotification({
            type: 'success',
            text: 'Your email address has been successfully verified! Loading your AlgoMania workspace...'
          });
          await refreshUser();
          setTimeout(() => {
            router.replace('/app');
          }, 1500);
        })
        .catch((err) => {
          setNotification({
            type: 'error',
            text: getFriendlyAuthErrorMessage(err)
          });
        })
        .finally(() => {
          setIsChecking(false);
        });
    }
  }, [router.isReady, router.query, refreshUser, router]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Periodic background check in case user verified in another tab or mobile device
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        const res = await refreshUser();
        if (res && res.verified) {
          router.replace('/app');
        }
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [refreshUser, router]);

  // Manual verification check button handler
  const handleCheckVerification = useCallback(async () => {
    setIsChecking(true);
    setNotification({ type: '', text: '' });

    try {
      const res = await refreshUser();
      if (res && res.verified) {
        setNotification({
          type: 'success',
          text: 'Email verified successfully! Loading your AlgoMania workspace...'
        });
        setTimeout(() => {
          router.replace('/app');
        }, 1200);
      } else {
        setNotification({
          type: 'info',
          text: 'We haven’t detected the verification yet. Please click the link in your email and try again.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: 'Unable to check verification status. Please check your connection.'
      });
    } finally {
      setIsChecking(false);
    }
  }, [refreshUser, router]);

  // Resend email handler with rate limit cooldown
  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setNotification({ type: '', text: '' });

    try {
      const res = await resendVerification();
      if (res.success) {
        setNotification({
          type: 'success',
          text: 'A fresh verification link has been sent to your email.'
        });
        setCooldown(60); // 60 seconds cooldown
      } else {
        setNotification({
          type: 'error',
          text: res.message || 'Failed to send verification email. Please try again.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Failed to dispatch verification email.'
      });
    } finally {
      setIsResending(false);
    }
  }, [cooldown, isResending, resendVerification]);

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <EmailVerificationGuard>
      <Head>
        <title>Verify Your Email - AlgoMania</title>
        <meta name="description" content="Please verify your email address to access AlgoMania learning features." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-extrabold text-blue-600">AlgoMania</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
              DSA 10X
            </span>
          </Link>
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-4 text-blue-600 dark:text-blue-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify your email address
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            We sent a verification link to{' '}
            <span className="font-semibold text-gray-900 dark:text-white break-all">
              {user?.email || 'your email'}
            </span>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700 space-y-6">
            {notification.text && (
              <div
                role="alert"
                className={`p-4 rounded-md text-sm flex items-start space-x-2 ${
                  notification.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : notification.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <span className="flex-1">{notification.text}</span>
              </div>
            )}

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
              <p>
                To protect your progress and ensure account security, email verification is required before accessing our interactive algorithm visualizers and dashboards.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <li>Check your spam or junk folder if you don&apos;t see the email.</li>
                <li>You can verify from any device or browser.</li>
                <li>Once verified, click the button below to proceed.</li>
              </ul>
            </div>

            {/* Verification Check Button */}
            <div>
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {isChecking ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Checking Verification...</span>
                  </div>
                ) : (
                  'I\'ve verified my email'
                )}
              </button>
            </div>

            {/* Resend Verification Button */}
            <div>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  'Sending...'
                ) : cooldown > 0 ? (
                  `Resend email in ${cooldown}s`
                ) : (
                  'Resend verification email'
                )}
              </button>
            </div>

            {/* Options */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleSignOut}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Sign in with another account
              </button>
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </EmailVerificationGuard>
  );
}
