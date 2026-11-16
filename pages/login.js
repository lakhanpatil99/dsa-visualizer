import { useState, useId } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import PublicOnlyRoute from '../src/components/PublicOnlyRoute';
import Logo from '../src/components/Logo';

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

      <div className="min-h-screen bg-[#F8F5ED] text-[#24231F] flex flex-col justify-between selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        {/* Top Header Bar */}
        <header className="w-full bg-[#F8F5ED] border-b border-[#DED9CE] px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <Logo variant="auth" href="/" />

          {/* Back to Home Link */}
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#69665F] hover:text-[#24231F] px-3.5 py-1.5 rounded-lg border border-[#DED9CE] hover:border-[#24231F] bg-[#FFFDF8] transition-all"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Main 2-Column Content Area */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Visual Artwork & Feature Highlights */}
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-6 pr-2">
              <div className="space-y-3">
                <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase">
                  01 // ALGORITHM WORKSPACE
                </span>
                <h2 className="text-4xl font-extrabold text-[#24231F] tracking-tight leading-[1.1]">
                  Welcome back to your <br />
                  <span className="text-[#EF592A]">visual lab.</span>
                </h2>
                <p className="text-sm text-[#69665F] leading-relaxed">
                  Continue exploring step-by-step visualizations, analyze asymptotic complexities, and maintain your coding progress.
                </p>
              </div>

              {/* Custom Editorial DSA Visual Artwork Card */}
              <div className="p-6 rounded-2xl bg-[#EF592A] text-[#FFFDF8] border border-[#d64b20] shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-[#FFFDF8]/20 pb-3">
                  <span className="font-mono font-bold text-[#FFFDF8] flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFFDF8] animate-pulse"></span>
                    <span>ACTIVE WORKSPACE</span>
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#24231F] text-[#FFFDF8] font-bold">
                    O(n log n)
                  </span>
                </div>

                {/* Simulated Sorting Bar Animation Preview */}
                <div className="h-28 flex items-end justify-between gap-1.5 pt-2 px-1">
                  {[35, 60, 45, 80, 25, 95, 50, 70, 40, 85, 30, 65].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        idx === 5 || idx === 6
                          ? 'bg-[#FFFDF8] shadow-sm'
                          : idx === 1 || idx === 9
                          ? 'bg-[#28533D]'
                          : 'bg-[#24231F]'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-xs text-[#FFFDF8]/90 flex items-center justify-between pt-2 border-t border-[#FFFDF8]/20 font-mono">
                  <span>Merge Sort Divide &amp; Conquer</span>
                  <span className="font-bold text-[#FFFDF8]">Partition [L, R]</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Modern High-Contrast Authentication Card */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#FFFDF8] border border-[#DED9CE] shadow-sm hover:shadow-md transition-shadow space-y-6">
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24231F] tracking-tight">
                    Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-[#69665F]">
                    Enter your account details to access your dashboard.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl text-xs sm:text-sm bg-red-50 border border-red-200 text-red-700 flex items-start space-x-2 animate-fadeIn"
                  >
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#24231F] bg-[#FFFDF8] hover:bg-[#F8F5ED] border border-[#DED9CE] hover:border-[#24231F] transition-all flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] shadow-2xs"
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
                  <div className="w-full border-t border-[#DED9CE]"></div>
                  <span className="absolute bg-[#FFFDF8] px-3 text-[11px] uppercase tracking-wider text-[#69665F] font-mono">
                    Or continue with email
                  </span>
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor={emailId} className="block text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl bg-[#FFFDF8] border border-[#DED9CE] text-[#24231F] placeholder-[#69665F]/50 text-sm focus:outline-none focus:border-[#EF592A] focus:ring-2 focus:ring-[#EF592A]/20 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor={passwordId} className="block text-xs font-mono font-bold uppercase tracking-wider text-[#24231F]">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-[#EF592A] hover:text-[#d64b20] transition-colors"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FFFDF8] border border-[#DED9CE] text-[#24231F] placeholder-[#69665F]/50 text-sm focus:outline-none focus:border-[#EF592A] focus:ring-2 focus:ring-[#EF592A]/20 transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#69665F] hover:text-[#24231F] transition-colors text-xs font-mono font-bold"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FFFDF8]" fill="none" viewBox="0 0 24 24">
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
                <div className="pt-2 text-center text-sm text-[#69665F] border-t border-[#DED9CE]">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="font-bold text-[#EF592A] hover:text-[#d64b20] transition-colors ml-1"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="w-full py-5 text-center text-xs text-[#69665F] border-t border-[#DED9CE] bg-[#F8F5ED]">
          AlgoMania • A Visual Lab for Computer Science
        </footer>
      </div>
    </PublicOnlyRoute>
  );
}
