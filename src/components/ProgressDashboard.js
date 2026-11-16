import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../../context/ThemeContext';
import ProtectedFeature from './ProtectedFeature';

const ProgressDashboard = () => {
  const [progressSummary, setProgressSummary] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { progressService, isAuthenticated } = useAuth();
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
