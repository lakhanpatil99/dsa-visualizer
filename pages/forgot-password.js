import { useState, useId } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import PublicOnlyRoute from '../src/components/PublicOnlyRoute';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const { forgotPassword } = useAuth();
  const emailId = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await forgotPassword(email.trim());
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Password reset link sent! Please check your email inbox to reset your password.'
        });
        setEmail('');
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Failed to send password reset email. Please try again.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnlyRoute>
      <Head>
        <title>Reset Password — AlgoMania</title>
        <meta name="description" content="Reset your AlgoMania account password." />
      </Head>

      <div className="min-h-screen bg-[#F8F5ED] text-[#24231F] flex flex-col justify-between selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        {/* Header Bar */}
        <header className="w-full bg-[#F8F5ED] border-b border-[#DED9CE] px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EF592A] flex items-center justify-center text-[#FFFDF8] font-black text-lg tracking-tight shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#24231F]">
                Algo<span className="text-[#EF592A]">Mania</span>
              </span>
              <span className="hidden sm:block text-[10px] font-mono tracking-widest text-[#69665F] uppercase -mt-1">
                Visual Lab
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#69665F] hover:text-[#24231F] px-3.5 py-1.5 rounded-lg border border-[#DED9CE] hover:border-[#24231F] bg-[#FFFDF8] transition-all"
          >
            <span>←</span>
            <span>Back to Sign In</span>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] border border-[#DED9CE] shadow-sm hover:shadow-md transition-shadow space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase">
                Account Recovery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24231F] tracking-tight">
                Reset password
              </h1>
              <p className="text-xs sm:text-sm text-[#69665F]">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {feedback.message && (
              <div
                role="alert"
                className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start space-x-2 ${
                  feedback.type === 'success'
                    ? 'bg-[#E4E9DD] text-[#28533D] border border-[#28533D]/20'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor={emailId} className="block text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] mb-1.5">
                  Email Address
                </label>
                <input
                  id={emailId}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FFFDF8] border border-[#DED9CE] text-[#24231F] placeholder-[#69665F]/50 text-sm focus:outline-none focus:border-[#EF592A] focus:ring-2 focus:ring-[#EF592A]/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FFFDF8]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending reset email...</span>
                  </div>
                ) : (
                  <span>Send Password Reset Email</span>
                )}
              </button>

              <div className="pt-2 text-center text-sm text-[#69665F] border-t border-[#DED9CE]">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-bold text-[#EF592A] hover:text-[#d64b20] transition-colors ml-1"
                >
                  Return to sign in
                </Link>
              </div>
            </form>
          </div>
        </main>

        <footer className="w-full py-5 text-center text-xs text-[#69665F] border-t border-[#DED9CE] bg-[#F8F5ED]">
          AlgoMania • A Visual Lab for Computer Science
        </footer>
      </div>
    </PublicOnlyRoute>
  );
}
