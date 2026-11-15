import { useState, useId } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import PublicOnlyRoute from '../src/components/PublicOnlyRoute';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const emailId = useId();
  const passwordId = useId();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        if (result.emailVerified === false) {
          router.push('/verify-email');
        } else {
          const returnUrl = router.query.returnUrl || '/app';
          router.push(returnUrl);
        }
      } else {
        setErrorMessage(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        const returnUrl = router.query.returnUrl || '/app';
        router.push(returnUrl);
      } else {
        setErrorMessage(result.message || 'Google sign-in failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to sign in with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnlyRoute>
      <Head>
        <title>Sign In — AlgoMania</title>
        <meta name="description" content="Sign in to your AlgoMania account to continue your interactive DSA learning journey." />
      </Head>

      <div className="min-h-screen bg-[#080D1B] text-[#F8FAFC] flex flex-col justify-between selection:bg-blue-500/30 selection:text-cyan-300">
        {/* Top Header Bar */}
        <header className="w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#080D1B] rounded-[10px] flex items-center justify-center font-black text-white text-base">
                A
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Algo<span className="text-cyan-400">Mania</span>
            </span>
          </Link>

          {/* Prominent Back to Home navigation */}
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Main 2-Column Content Area */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT COLUMN: Visual Artwork & Feature Highlights */}
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-8 pr-4">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Master Algorithm Intuition
                </span>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                  Welcome back to your{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    algorithm workspace.
                  </span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Continue exploring step-by-step visualizations, analyze asymptotic complexities, and maintain your coding progress.
                </p>
              </div>

              {/* Decorative Interactive Preview Card */}
              <div className="p-5 rounded-2xl bg-[#10182B]/80 border border-white/[0.08] backdrop-blur-md space-y-4 shadow-xl shadow-blue-900/10">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-3">
                  <span className="font-semibold text-cyan-400 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Active Visualizer</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">O(n log n)</span>
                </div>

                {/* Simulated Sorting Bar Animation Preview */}
                <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
                  {[35, 60, 45, 80, 25, 95, 50, 70, 40, 85, 30, 65].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        idx === 5 || idx === 6
                          ? 'bg-gradient-to-t from-cyan-500 to-cyan-300 shadow-md shadow-cyan-500/30'
                          : idx === 1 || idx === 9
                          ? 'bg-gradient-to-t from-indigo-500 to-indigo-300'
                          : 'bg-gradient-to-t from-blue-700/60 to-blue-500/70'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span>Merge Sort Divide & Conquer</span>
                  <span className="text-cyan-400 font-mono text-[11px]">Partition [L, R]</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Modern Authentication Card */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#10182B]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Enter your account details to access your dashboard.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-300 flex items-start space-x-2 animate-fadeIn"
                  >
                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Google Sign-in Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-white/[0.08]"></div>
                  <span className="absolute bg-[#10182B] px-3 text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Or continue with email
                  </span>
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor={emailId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email address
                    </label>
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor={passwordId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id={passwordId}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                {/* Explicit Navigation to Registration */}
                <div className="pt-2 text-center text-sm text-slate-400 border-t border-white/[0.06]">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="w-full py-5 text-center text-xs text-slate-500 border-t border-white/[0.04]">
          AlgoMania • Master Data Structures & Algorithms
        </footer>
      </div>
    </PublicOnlyRoute>
  );
}
