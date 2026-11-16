import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import EmailVerificationGuard from '../src/components/EmailVerificationGuard';
import Logo from '../src/components/Logo';

export default function VerifyEmail() {
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  const router = useRouter();
  const { user, refreshUser, resendVerification, logout } = useAuth();

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
        <title>Verify Your Email — AlgoMania</title>
        <meta name="description" content="Please verify your email address to access AlgoMania learning features." />
      </Head>

      <div className="min-h-screen bg-[#F8F5ED] text-[#24231F] flex flex-col justify-between selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        {/* Header Bar */}
        <header className="w-full bg-[#F8F5ED] border-b border-[#DED9CE] px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <Logo variant="auth" href="/" />

          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#69665F] hover:text-[#24231F] px-3.5 py-1.5 rounded-lg border border-[#DED9CE] hover:border-[#24231F] bg-[#FFFDF8] transition-all"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] border border-[#DED9CE] shadow-sm hover:shadow-md transition-shadow space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F6DDD0] border border-[#EF592A]/30 flex items-center justify-center mx-auto text-[#EF592A]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase block">
                Verification Required
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24231F] tracking-tight">
                Verify your email address
              </h1>
              <p className="text-xs sm:text-sm text-[#69665F] max-w-sm mx-auto leading-relaxed">
                We sent a verification link to{' '}
                <strong className="text-[#24231F] break-all">
                  {user?.email || 'your email'}
                </strong>.
              </p>
            </div>

            {notification.text && (
              <div
                role="alert"
                className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start space-x-2 ${
                  notification.type === 'success'
                    ? 'bg-[#E4E9DD] text-[#28533D] border border-[#28533D]/20'
                    : notification.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-[#F8F5ED] text-[#24231F] border border-[#DED9CE]'
                }`}
              >
                <span className="flex-1">{notification.text}</span>
              </div>
            )}

            <div className="text-xs sm:text-sm text-[#69665F] space-y-2 bg-[#F8F5ED] p-4 rounded-xl border border-[#DED9CE]">
              <p className="font-medium text-[#24231F]">
                Email verification is required before accessing interactive visualizers:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#69665F]">
                <li>Check your spam folder if you don&apos;t see the message.</li>
                <li>You can verify from any device or browser tab.</li>
                <li>Once verified, click the button below to load your workspace.</li>
              </ul>
            </div>

            {/* Verification Check Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                {isChecking ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FFFDF8]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking Verification...</span>
                  </div>
                ) : (
                  <span>I&apos;ve verified my email →</span>
                )}
              </button>

              {/* Resend Verification Button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || isResending}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#24231F] bg-[#FFFDF8] hover:bg-[#F8F5ED] border border-[#DED9CE] hover:border-[#24231F] transition-all disabled:opacity-50"
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
            <div className="pt-4 border-t border-[#DED9CE] flex justify-between items-center text-xs text-[#69665F]">
              <button
                type="button"
                onClick={handleSignOut}
                className="hover:text-[#EF592A] transition-colors"
              >
                Sign in with another account
              </button>
              <Link
                href="/"
                className="font-medium text-[#24231F] hover:text-[#EF592A] transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>

        <footer className="w-full py-5 text-center text-xs text-[#69665F] border-t border-[#DED9CE] bg-[#F8F5ED]">
          AlgoMania • A Visual Lab for Computer Science
        </footer>
      </div>
    </EmailVerificationGuard>
  );
}
