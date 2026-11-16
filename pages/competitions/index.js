import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import AchievementBadge from '../../src/components/competitions/AchievementBadge';

export default function CompetitionPortal() {
  const { user, isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({
    uniqueSolvedCount: 0,
    solvedChallengeIds: [],
    unlockedTiers: [],
    nextMilestone: { target: 20, remaining: 20, tier: 'bronze' },
    badges: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch challenges & user stats
  useEffect(() => {
    async function loadData() {
      try {
        let headers = {};
        if (user) {
          const token = await user.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        }

        const [chalRes, statsRes] = await Promise.all([
          fetch('/api/competitions/challenges', { headers }),
          user ? fetch('/api/competitions/stats', { headers }) : Promise.resolve(null)
        ]);

        const chalData = await chalRes.json();
        if (chalData.success) {
          setChallenges(chalData.challenges || []);
          if (chalData.challenges?.length > 0 && !activeChallenge) {
            setActiveChallenge(chalData.challenges[0]);
            setUserCode(chalData.challenges[0].starterCode);
          }
        }

        if (statsRes) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.stats);
          }
        }
      } catch (err) {
        console.error('Failed to load competition data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const selectChallenge = (ch) => {
    setActiveChallenge(ch);
    setUserCode(ch.starterCode || '');
    setSubmissionResult(null);
    setErrorMsg('');
  };

  const handleRunCode = async () => {
    if (!isAuthenticated) {
      setErrorMsg('Please sign in to submit challenge solutions and earn achievements.');
      return;
    }

    setSubmitting(true);
    setSubmissionResult(null);
    setErrorMsg('');

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/competitions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId: activeChallenge.challengeId,
          code: userCode,
          language: 'javascript'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      setSubmissionResult(data);

      // Refresh stats if accepted
      if (data.result?.status === 'ACCEPTED') {
        const statsRes = await fetch('/api/competitions/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);

        // Update solved state on challenge in memory
        setChallenges(prev =>
          prev.map(c => c.challengeId === activeChallenge.challengeId ? { ...c, isSolved: true } : c)
        );
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Challenges' },
    { id: 'sorting', label: 'Sorting' },
    { id: 'searching', label: 'Searching' },
    { id: 'graphs', label: 'Graphs' },
    { id: 'trees', label: 'Trees' },
    { id: 'data-structures', label: 'Data Structures' },
    { id: 'general-dsa', label: 'General DSA' }
  ];

  const filteredChallenges = selectedCategory === 'all'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Algorithmic Competitions & Tier Milestones — AlgoMania</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="mb-10 pb-8 border-b border-[#DED9CE] dark:border-[#2E2C27] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EF592A]/15 text-[#EF592A] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span>★</span>
              <span>AlgoMania Competition Arena</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8]">
              Computational Problem-Solving Competitions
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-2xl leading-relaxed">
              Solve verified challenges across sorting, searching, graphs, trees, and dynamic structures. Unlock Bronze (20), Silver (100), and Gold (200) mastery milestones and earn official verifiable achievement certificates.
            </p>
          </div>

          {/* User Scorecard */}
          <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-xs min-w-[280px]">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] mb-1">
              Candidate Milestone Tracker
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-mono font-bold text-[#28533D] dark:text-[#88C49F]">
                {stats.uniqueSolvedCount}
              </span>
              <span className="text-xs text-[#69665F]">Unique Problems Solved</span>
            </div>

            {/* Milestone Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-[#69665F] mb-1">
                <span>Next: {stats.nextMilestone?.tier?.toUpperCase()}</span>
                <span>{stats.nextMilestone?.remaining} needed</span>
              </div>
              <div className="w-full bg-[#E4E9DD] dark:bg-[#2E2C27] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#EF592A] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (stats.uniqueSolvedCount / (stats.nextMilestone?.target || 20)) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Metallic Badges Showcase */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
              Achievement Badges & Certification Tiers
            </h2>
            <Link
              href="/certificates"
              className="text-xs font-semibold text-[#28533D] dark:text-[#88C49F] hover:underline"
            >
              View My Certificates →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AchievementBadge
              tier="bronze"
              unlocked={stats.unlockedTiers?.includes('bronze')}
              currentCount={stats.uniqueSolvedCount}
              size="lg"
            />
            <AchievementBadge
              tier="silver"
              unlocked={stats.unlockedTiers?.includes('silver')}
              currentCount={stats.uniqueSolvedCount}
              size="lg"
            />
            <AchievementBadge
              tier="gold"
              unlocked={stats.unlockedTiers?.includes('gold')}
              currentCount={stats.uniqueSolvedCount}
              size="lg"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-[#28533D] text-[#FFFDF8]'
                  : 'bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-[#69665F] hover:text-[#24231F]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main Arena: Split Challenge List & Code Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Challenge List Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredChallenges.map((ch) => {
              const isSelected = activeChallenge?.challengeId === ch.challengeId;
              return (
                <div
                  key={ch.challengeId}
                  onClick={() => selectChallenge(ch)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#28533D] bg-[#E4E9DD]/50 dark:bg-[#28382F]/50 ring-2 ring-[#28533D]'
                      : 'border-[#DED9CE] dark:border-[#383630] bg-[#FFFDF8] dark:bg-[#24231F] hover:border-[#EF592A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#1A1916] text-[#69665F]">
                      {ch.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold ${
                        ch.difficulty === 'Easy' ? 'text-emerald-600' : ch.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {ch.difficulty}
                      </span>
                      {ch.isSolved && (
                        <span className="text-xs text-emerald-600 font-bold" title="Solved">✓</span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-[#24231F] dark:text-[#FFFDF8]">
                    {ch.title}
                  </h4>
                  <p className="text-[11px] text-[#69665F] dark:text-[#A09D95] mt-1 line-clamp-2">
                    {ch.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Code Workspace Column (8 cols) */}
          <div className="lg:col-span-8 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {activeChallenge ? (
              <>
                {/* Challenge Header & Description */}
                <div className="p-6 border-b border-[#DED9CE] dark:border-[#383630]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#28533D] dark:text-[#88C49F]">
                      {activeChallenge.challengeId.toUpperCase()} • {activeChallenge.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#1A1916] text-[#EF592A]">
                      +{activeChallenge.points} Points
                    </span>
                  </div>

                  <h2 className="text-xl font-serif font-bold text-[#24231F] dark:text-[#FFFDF8] mb-2">
                    {activeChallenge.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4740] dark:text-[#C4C0B6] leading-relaxed mb-4">
                    {activeChallenge.description}
                  </p>

                  {/* Examples */}
                  {activeChallenge.examples?.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {activeChallenge.examples.map((ex, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[#FAF8F3] dark:bg-[#1A1916] font-mono text-[11px] space-y-1">
                          <div><span className="font-bold text-[#69665F]">Input:</span> {ex.input}</div>
                          <div><span className="font-bold text-[#69665F]">Output:</span> {ex.output}</div>
                          {ex.explanation && (
                            <div className="text-[10px] text-[#8E8B83]">{ex.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Code Editor Area */}
                <div className="p-4 bg-[#1E1E1E] flex-1 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8B83] mb-2 px-2">
                    <span>JavaScript (Node.js Sandbox Engine)</span>
                    <span>Deterministic Execution</span>
                  </div>
                  <textarea
                    rows={12}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full flex-1 bg-transparent text-[#D4D4D4] font-mono text-xs sm:text-sm leading-relaxed p-2 focus:outline-hidden resize-none"
                    spellCheck="false"
                  ></textarea>
                </div>

                {/* Execution Results Banner */}
                {submissionResult && (
                  <div className={`p-4 border-t text-xs font-mono ${
                    submissionResult.result?.status === 'ACCEPTED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        {submissionResult.result?.status === 'ACCEPTED' ? '✓ ACCEPTED' : `✕ ${submissionResult.result?.status}`}
                      </span>
                      <span>
                        Passed: {submissionResult.result?.passedTestCases} / {submissionResult.result?.totalTestCases} Test Cases ({submissionResult.result?.executionTimeMs}ms)
                      </span>
                    </div>
                    {submissionResult.result?.errorMessage && (
                      <p className="mt-1 text-[11px] opacity-90">{submissionResult.result.errorMessage}</p>
                    )}
                    {submissionResult.newlyUnlockedTiers?.length > 0 && (
                      <div className="mt-2 font-bold text-[#EF592A]">
                        🎉 NEW ACHIEVEMENT UNLOCKED: {submissionResult.newlyUnlockedTiers.join(', ').toUpperCase()} TIER!
                      </div>
                    )}
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-red-100 text-red-800 text-xs font-mono">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="p-4 bg-[#FAF8F3] dark:bg-[#1C1B18] border-t border-[#DED9CE] dark:border-[#383630] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#69665F]">
                    {activeChallenge.publicTestCases?.length || 2} Public Test Cases • Zero External Shell Access
                  </span>
                  <button
                    disabled={submitting}
                    onClick={handleRunCode}
                    className="px-6 py-2.5 rounded-xl bg-[#28533D] hover:bg-[#1f4230] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow-xs transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? 'Running Test Cases...' : 'Submit Solution ▶'}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-[#69665F]">
                Select a challenge from the catalogue to begin.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
