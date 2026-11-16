import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { useAuth } from '../../src/contexts/AuthContext';
import AchievementBadge from '../../src/components/competitions/AchievementBadge';
import CertificatePreviewModal from '../../src/components/certificates/CertificatePreviewModal';

const ALL_CATEGORIES = [
  { id: 'all', label: 'All Challenges' },
  { id: 'arrays', label: 'Arrays' },
  { id: 'strings', label: 'Strings' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'searching', label: 'Searching' },
  { id: 'hashing', label: 'Hashing' },
  { id: 'stacks', label: 'Stacks' },
  { id: 'queues', label: 'Queues' },
  { id: 'linked-lists', label: 'Linked Lists' },
  { id: 'trees', label: 'Trees' },
  { id: 'heaps', label: 'Heaps' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dynamic-programming', label: 'DP' },
  { id: 'greedy', label: 'Greedy' },
  { id: 'backtracking', label: 'Backtracking' },
  { id: 'recursion', label: 'Recursion' }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Certificate Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    certificate: null,
    mode: 'LOCKED',
    userSolvedCount: 0,
    requiredCount: 20
  });

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

  const handleBadgeClick = (tier) => {
    const isUnlocked = stats.unlockedTiers?.includes(tier);
    const thresholdMap = { bronze: 20, silver: 100, gold: 200 };
    const targetThreshold = thresholdMap[tier] || 20;

    const sampleCert = {
      certificateId: isUnlocked
        ? `ALG-COMP-${tier.toUpperCase()}-${user?.uid?.slice(-6) || 'OFFICIAL'}`
        : `SAMPLE-${tier.toUpperCase()}-PREVIEW`,
      recipientName: user?.displayName || (user?.email ? user.email.split('@')[0] : 'Prospective Algorist'),
      title: tier === 'gold'
        ? 'Executive Gold Algorithmic Master'
        : tier === 'silver'
        ? 'Distinguished Silver Grandmaster'
        : 'Certified Bronze Algorist',
      type: `competition_${tier}`,
      milestoneCount: targetThreshold,
      issueDate: Date.now(),
      verificationUrl: isUnlocked
        ? `https://www.algomania.in/certificates/verify/ALG-COMP-${tier.toUpperCase()}`
        : 'https://www.algomania.in/certificates/sample'
    };

    setModalState({
      isOpen: true,
      certificate: sampleCert,
      mode: isUnlocked ? 'ISSUED' : 'LOCKED',
      userSolvedCount: stats.uniqueSolvedCount || 0,
      requiredCount: targetThreshold
    });
  };

  const filteredChallenges = challenges.filter(c => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchSearch = !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.challengeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1C1B18] text-[#24231F] dark:text-[#EAE7DF] transition-colors duration-200">
      <Head>
        <title>Algorithmic Competitions & Tier Milestones — AlgoMania</title>
        <meta name="description" content="Solve 220+ verified computational challenges, track your algorithmic mastery, and unlock Bronze, Silver, and Gold verifiable achievement certificates." />
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
              Solve {challenges.length || '220+'}+ verified challenges across 15 algorithmic domains. Click any achievement badge to inspect credential criteria and sample previews. Unlock Bronze (20), Silver (100), and Gold (200) mastery milestones and earn official verifiable certificates.
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
              <span className="text-xs text-[#69665F] dark:text-[#A09D95]">Unique Problems Solved</span>
            </div>

            {/* Milestone Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] mb-1">
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
            <div>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
                Achievement Badges & Certification Tiers
              </h2>
              <p className="text-[11px] text-[#69665F] dark:text-[#A09D95]">
                Click any tier badge to preview the milestone certificate and unlock requirements.
              </p>
            </div>
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
              onClick={() => handleBadgeClick('bronze')}
              size="lg"
            />
            <AchievementBadge
              tier="silver"
              unlocked={stats.unlockedTiers?.includes('silver')}
              currentCount={stats.uniqueSolvedCount}
              onClick={() => handleBadgeClick('silver')}
              size="lg"
            />
            <AchievementBadge
              tier="gold"
              unlocked={stats.unlockedTiers?.includes('gold')}
              currentCount={stats.uniqueSolvedCount}
              onClick={() => handleBadgeClick('gold')}
              size="lg"
            />
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none flex-1">
            {ALL_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-[#28533D] text-[#FFFDF8]'
                    : 'bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-[#69665F] hover:text-[#24231F] dark:hover:text-[#FFFDF8]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges..."
              className="w-full px-3.5 py-1.5 rounded-xl text-xs bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] focus:outline-hidden focus:border-[#EF592A]"
            />
          </div>
        </div>

        {/* Main Arena: Split Challenge List & Code Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Challenge List Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3 max-h-[720px] overflow-y-auto pr-1">
            <div className="text-[11px] font-mono text-[#69665F] dark:text-[#8E8B83] px-1">
              Showing {filteredChallenges.length} of {challenges.length} Challenges
            </div>
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
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF8F3] dark:bg-[#1A1916] text-[#69665F] dark:text-[#A09D95]">
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
                <div className="p-4 bg-[#1E1E1E] flex-1 flex flex-col min-h-[320px]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8E8B83] mb-2 px-2">
                    <span>JavaScript (Node.js Isolated VM Context)</span>
                    <span>Deterministic Test Evaluator</span>
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

      {/* Interactive Certificate Preview Modal */}
      <CertificatePreviewModal
        isOpen={modalState.isOpen}
        certificate={modalState.certificate}
        mode={modalState.mode}
        userSolvedCount={modalState.userSolvedCount}
        requiredCount={modalState.requiredCount}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />

      <Footer />
    </div>
  );
}
