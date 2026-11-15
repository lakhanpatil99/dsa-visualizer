import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/AuthContext';
import ProtectedRoute from '../src/components/ProtectedRoute';
import * as authService from '../lib/authService';

export default function AccountSettings() {
  const { user, token, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsUpdatingProfile(true);
    setFeedback({ type: '', text: '' });

    try {
      await authService.updateCurrentUserProfile({ displayName: displayName.trim() });
      setFeedback({ type: 'success', text: 'Profile display name updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', text: authService.getFriendlyAuthErrorMessage(err) });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    setFeedback({ type: '', text: '' });

    try {
      await authService.updateCurrentUserPassword(newPassword);
      setFeedback({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setFeedback({ type: 'error', text: authService.getFriendlyAuthErrorMessage(err) });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setFeedback({ type: '', text: '' });

    try {
      await authService.deleteUserAccount(token);
      await logout();
      router.push('/');
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete account.' });
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Account Settings - AlgoMania</title>
        <meta name="description" content="Manage your AlgoMania profile, security and preferences." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your credentials, profile information, and account data.
              </p>
            </div>
            <Link
              href="/app"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back to Visualizer
            </Link>
          </div>

          {feedback.text && (
            <div
              role="alert"
              className={`p-4 rounded-md text-sm ${
                feedback.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Profile Overview */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Email Address</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block">Firebase UID</span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{user?.uid}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Update Name'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security & Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !newPassword}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-300">Danger Zone</h2>
            <p className="text-sm text-red-700 dark:text-red-400">
              Deleting your account permanently removes your profile, learning statistics, and algorithm progress history. This action cannot be undone.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex justify-center py-2 px-4 border border-red-300 dark:border-red-700 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Confirm Permanent Account Deletion
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you absolutely sure you want to delete your account? All saved algorithm steps and progress records in MongoDB will be permanently purged.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isDeletingAccount && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  )}
                  <span>Yes, Delete My Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
