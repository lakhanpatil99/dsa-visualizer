import { useState, useId } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import PublicOnlyRoute from '../src/components/PublicOnlyRoute';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  // Password strength evaluation
  const passwordCriteria = {
    length: formData.password.length >= 6,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password)
  };
  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await register(
        formData.fullName.trim(),
        formData.email.trim(),
        formData.password
      );

      if (result.success) {
        router.push('/verify-email');
      } else {
        setServerError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        const returnUrl = router.query.returnUrl || '/app';
        router.push(returnUrl);
      } else {
        setServerError(result.message || 'Google sign-in failed.');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnlyRoute>
      <Head>
        <title>Create Free Account — AlgoMania</title>
        <meta name="description" content="Create your free AlgoMania account to save progress and master Data Structures & Algorithms." />
      </Head>

      <div className="min-h-screen bg-[#080D1B] text-[#F8FAFC] flex flex-col justify-between selection:bg-blue-500/30 selection:text-cyan-300">
        {/* Header Bar */}
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

        {/* Main 2-Column Area */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT COLUMN: Visual Brand & Features */}
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-8 pr-4">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Interactive Learning
                </span>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                  Start your journey into{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    visual algorithms.
                  </span>
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Join thousands mastering algorithms with animated execution, complexity breakdowns, and cloud progress tracking.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3.5">
                {[
                  'Unlimited access to interactive sorting and graph visualizers',
                  'Step-by-step state debugger with pointer inspections',
                  'Cloud synchronization of completed algorithms and stats',
                  'Designed for technical coding interview preparation'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400">
                🔒 We enforce verified email authentication to protect your progress and learning history.
              </div>
            </div>

            {/* RIGHT COLUMN: Modern Registration Form Card */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#10182B]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Create Account
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Get started with your free AlgoMania account today.
                  </p>
                </div>

                {/* Server Error Message */}
                {serverError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-300 flex items-start space-x-2 animate-fadeIn"
                  >
                    <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Register with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-white/[0.08]"></div>
                  <span className="absolute bg-[#10182B] px-3 text-xs uppercase tracking-wider text-slate-500 font-medium">
                    Or register with email
                  </span>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor={nameId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id={nameId}
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                        fieldErrors.fullName ? 'border-red-500/60 focus:border-red-500' : 'border-white/[0.1] focus:border-blue-500'
                      }`}
                    />
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
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
                      placeholder="jane@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                        fieldErrors.email ? 'border-red-500/60 focus:border-red-500' : 'border-white/[0.1] focus:border-blue-500'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor={passwordId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id={passwordId}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors pr-12 ${
                          fieldErrors.password ? 'border-red-500/60 focus:border-red-500' : 'border-white/[0.1] focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Password Strength</span>
                          <span className={
                            strengthScore <= 1 ? 'text-red-400 font-semibold' :
                            strengthScore <= 3 ? 'text-amber-400 font-semibold' :
                            'text-green-400 font-semibold'
                          }>
                            {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 h-1.5">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`rounded-full transition-all duration-300 ${
                                level <= strengthScore
                                  ? strengthScore <= 1 ? 'bg-red-500' : strengthScore <= 3 ? 'bg-amber-400' : 'bg-green-500'
                                  : 'bg-white/[0.1]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor={confirmPasswordId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id={confirmPasswordId}
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors pr-12 ${
                          fieldErrors.confirmPassword ? 'border-red-500/60 focus:border-red-500' : 'border-white/[0.1] focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
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
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                {/* Explicit Navigation to Login */}
                <div className="pt-2 text-center text-sm text-slate-400 border-t border-white/[0.06]">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
                  >
                    Sign in
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
