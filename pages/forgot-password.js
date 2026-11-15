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
        <title>Reset Password - AlgoMania</title>
        <meta name="description" content="Reset your AlgoMania account password." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <span className="text-3xl font-extrabold text-blue-600">AlgoMania</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200">
              DSA 10X
            </span>
          </Link>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
            {feedback.message && (
              <div
                role="alert"
                className={`mb-6 p-4 rounded-md text-sm flex items-start space-x-2 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id={emailId}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="learner@algomania.dev"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Sending reset email...</span>
                    </div>
                  ) : (
                    'Send Password Reset Email'
                  )}
                </button>
              </div>

              <div className="flex justify-center text-sm">
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Return to sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PublicOnlyRoute>
  );
}
