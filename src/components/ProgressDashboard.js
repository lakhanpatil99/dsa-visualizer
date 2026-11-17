import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../../context/ThemeContext';
import ProtectedFeature from './ProtectedFeature';
import Link from 'next/link';

const ProgressDashboard = () => {
  const [progressSummary, setProgressSummary] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [competitionStats, setCompetitionStats] = useState(null);
  const [competitionError, setCompetitionError] = useState('');
  const [competitionSyncAt, setCompetitionSyncAt] = useState(null);
  const [competitionRefreshing, setCompetitionRefreshing] = useState(false);

  const { progressService, isAuthenticated, user } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (isAuthenticated && progressService) {
      loadProgressData();
    }
  }, [isAuthenticated, progressService]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const [summary, progress] = await Promise.all([
        progressService.getProgressSummary(),
        progressService.fetchProgress()
      ]);

      setProgressSummary(summary);
      setAllProgress(progress.progress || []);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompetitionProgress = useCallback(async ({ silent = false } = {}) => {
    if (!user) return;
    if (!silent) setCompetitionRefreshing(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/competitions/stats', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Competition progress is temporarily unavailable.');
      }
      setCompetitionStats(data.stats);
      setCompetitionError('');
      setCompetitionSyncAt(new Date().toISOString());
    } catch (err) {
      setCompetitionError(err.message || 'Competition progress could not be synchronized.');
    } finally {
      setCompetitionRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return undefined;

    loadCompetitionProgress();
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        loadCompetitionProgress({ silent: true });
      }
    };
    const interval = setInterval(refreshIfVisible, 15000);
    window.addEventListener('focus', refreshIfVisible);
    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('online', refreshIfVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refreshIfVisible);
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('online', refreshIfVisible);
    };
  }, [isAuthenticated, user, loadCompetitionProgress]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#E4E9DD] text-[#28533D] dark:bg-[#28382F] dark:text-[#E4E9DD]';
      case 'in_progress':
        return 'bg-[#FDEDEA] text-[#EF592A] dark:bg-[#3D251D]';
      case 'mastered':
        return 'bg-[#ECEAE4] text-[#24231F] dark:bg-[#2D2A24] dark:text-[#FFFDF8]';
      default:
        return 'bg-[#FAF8F3] text-[#69665F] dark:bg-[#1D1C19]';
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-xs font-mono text-[#69665F]">
        <svg className="animate-spin h-5 w-5 mr-3 text-[#EF592A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Synchronizing learning profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border font-mono text-xs bg-[#FDEDEA] text-[#C93B14] border-[#EF592A]/30">
        {error}
        <button
          onClick={loadProgressData}
          className="ml-3 underline font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProtectedFeature>
      <div className="space-y-8">
        {/* Progress Summary Cards */}
        {progressSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
              <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold">
                TOTAL TRACKED
              </span>
              <div className="text-3xl font-black font-mono text-[#24231F] dark:text-[#FFFDF8] mt-1">
                {progressSummary.totalAlgorithms || 0}
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
              <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold">
                COMPLETED
              </span>
              <div className="text-3xl font-black font-mono text-[#28533D] dark:text-[#E4E9DD] mt-1">
                {progressSummary.completed || 0}
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
              <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold">
                IN PROGRESS
              </span>
              <div className="text-3xl font-black font-mono text-[#EF592A] mt-1">
                {progressSummary.inProgress || 0}
              </div>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
              <span className="block text-[10px] font-mono tracking-widest text-[#24231F] dark:text-[#FFFDF8] uppercase font-bold">
                MASTERED
              </span>
              <div className="text-3xl font-black font-mono text-[#24231F] dark:text-[#FFFDF8] mt-1">
                {progressSummary.mastered || 0}
              </div>
            </div>
          </div>
        )}

        {/* Competition progress is intentionally separate from saved visualizer walkthroughs. */}
        <section className={`p-5 sm:p-7 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#28533D] dark:text-[#A8C8AE]">
                Competition Arena · Verified Submission Progress
              </p>
              <h3 className="mt-2 text-lg font-black text-[#24231F] dark:text-[#FFFDF8]">
                Unique Accepted Challenges
              </h3>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#69665F] dark:text-[#A09D95]">
                This counter is separate from algorithm walkthrough sessions. Only unique challenges with an ACCEPTED server-verified submission count toward Bronze, Silver and Gold.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/competitions" className="rounded-xl bg-[#28533D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1F4230]">
                Open Competition Arena →
              </Link>
              <button
                type="button"
                onClick={() => loadCompetitionProgress()}
                disabled={competitionRefreshing}
                className="rounded-xl border border-[#DED9CE] px-3 py-2.5 text-xs font-semibold text-[#28533D] hover:border-[#28533D] disabled:opacity-50"
              >
                {competitionRefreshing ? 'Syncing…' : '↻'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tier: 'Bronze', target: 20, color: 'text-[#8C5028]' },
              { tier: 'Silver', target: 100, color: 'text-[#64748B]' },
              { tier: 'Gold', target: 200, color: 'text-[#976E1A]' }
            ].map((milestone) => {
              const current = competitionStats?.uniqueSolvedCount || 0;
              const percentage = Math.min(100, Math.round((current / milestone.target) * 100));
              const unlocked = current >= milestone.target;
              return (
                <div key={milestone.tier} className="rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1C1B18] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${milestone.color}`}>{milestone.tier}</span>
                    <span className={`text-[10px] font-mono font-bold ${unlocked ? 'text-[#28533D]' : 'text-[#8E8B83]'}`}>
                      {unlocked ? 'MILESTONE REACHED' : `${milestone.target - current} TO GO`}
                    </span>
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-[#24231F] dark:text-[#FFFDF8]">
                    {current}<span className="ml-1 text-xs font-normal text-[#8E8B83]">/ {milestone.target}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E4E9DD] dark:bg-[#383630]">
                    <div className="h-full rounded-full bg-[#28533D] transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#8E8B83]">
            <span>{competitionSyncAt ? `Competition progress synced · ${new Date(competitionSyncAt).toLocaleTimeString()}` : 'Waiting for competition progress sync'}</span>
            <span>Source: unique ACCEPTED submissions</span>
          </div>
          {competitionError && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              {competitionError} The last verified count is preserved and will be retried automatically.
            </p>
          )}
        </section>

        {/* Detailed Progress List */}
        <div className={`p-6 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
          }`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-black tracking-tight text-[#24231F] dark:text-[#FFFDF8]">
              Algorithm Mastery Records
            </h3>
            <span className="text-xs font-mono text-[#69665F] dark:text-[#A09D95]">
              {allProgress.length} recorded sessions
            </span>
          </div>

          {allProgress.length === 0 ? (
            <div className="text-center py-12 text-[#69665F] dark:text-[#A09D95] space-y-2">
              <div className="text-3xl">🧭</div>
              <p className="text-sm font-semibold">No progress recorded yet.</p>
              <p className="text-xs">
                Launch any visualizer, run an algorithm simulation, and click "Save Cloud Progress" to start tracking your journey.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#DED9CE]/40 dark:divide-[#383630]/40">
              {allProgress.map((prog) => (
                <div
                  key={prog._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-[#24231F] dark:text-[#FFFDF8]">
                        {prog.algorithmName}
                      </h4>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getStatusBadge(prog.completionStatus)}`}>
                        {prog.completionStatus?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#69665F] dark:text-[#A09D95] font-mono">
                      Category: {prog.algorithmType} · Steps: {prog.stepsCompleted}/{prog.totalSteps} · Time: {formatTime(prog.timeSpent || 0)}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono text-[#A09D95]">
                    {new Date(prog.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedFeature>
  );
};

export default ProgressDashboard;
