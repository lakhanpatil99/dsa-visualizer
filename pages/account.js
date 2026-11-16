import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
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

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-[#EF592A] uppercase font-bold">
              USER PROFILE & CREDENTIALS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Account Settings.
            </h1>
            <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95]">
              Manage your display identity, password credentials, and cloud learning synchronization.
            </p>
          </div>

          {feedback.text && (
            <div
              role="alert"
              className={`p-4 rounded-xl text-xs font-mono font-bold border ${
                feedback.type === 'success'
                  ? 'bg-[#E4E9DD] text-[#28533D] border-[#28533D]/30'
                  : 'bg-[#FDEDEA] text-[#C93B14] border-[#EF592A]/30'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Profile Overview Card */}
          <div className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <h2 className="text-lg font-black tracking-tight">Profile Identity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
                <span className="text-[#69665F] dark:text-[#A09D95] block mb-1">Email Address</span>
                <span className="font-bold text-[#24231F] dark:text-[#FFFDF8]">{user?.email}</span>
                <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] font-bold">
                  Verified
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
                <span className="text-[#69665F] dark:text-[#A09D95] block mb-1">Account ID</span>
                <span className="font-mono text-[11px] truncate block text-[#69665F] dark:text-[#A09D95]">{user?.uid}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-[#DED9CE]/60 dark:border-[#383630]/60">
              <div>
                <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                  Display Name
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1D1C19] text-xs font-mono font-bold outline-none focus:border-[#EF592A]"
                  />
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Saving...' : 'Update Name'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Password Security Card */}
          <div className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            <h2 className="text-lg font-black tracking-tight">Security Credentials</h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1D1C19] text-xs font-mono outline-none focus:border-[#EF592A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1D1C19] text-xs font-mono outline-none focus:border-[#EF592A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#24231F] dark:bg-[#FFFDF8] text-[#FFFDF8] dark:text-[#24231F] hover:bg-[#EF592A] dark:hover:bg-[#EF592A] dark:hover:text-[#FFFDF8] shadow-xs disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#FDEDEA] dark:border-[#3D251D] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-black tracking-tight text-[#EF592A]">Danger Zone</h2>
            <p className="text-xs text-[#69665F] dark:text-[#A09D95]">
              Permanently delete your AlgoMania account and all stored algorithm milestones and cloud telemetry.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-[#FDEDEA] text-[#C93B14] border border-[#EF592A]/30 hover:bg-[#EF592A] hover:text-[#FFFDF8] transition-all"
            >
              Delete Account
            </button>
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
                <h3 className="text-lg font-black text-[#EF592A]">Confirm Account Deletion</h3>
                <p className="text-xs text-[#69665F] dark:text-[#A09D95] leading-relaxed">
                  This action is irreversible. Your Firebase authentication credentials and MongoDB progress data will be deleted immediately.
                </p>
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold border"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#EF592A] text-white"
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
