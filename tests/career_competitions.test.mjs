import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPETITION_CHALLENGES, getChallengeById } from '../lib/competitions/challengesData.js';

test('Competition Catalog - Comprehensive 200+ Challenge Bank', () => {
  assert.ok(
    COMPETITION_CHALLENGES.length >= 200,
    `Expected at least 200 challenges, found ${COMPETITION_CHALLENGES.length}`
  );

  const seenIds = new Set();
  const categories = new Set();

  for (const c of COMPETITION_CHALLENGES) {
    assert.ok(c.challengeId, 'Challenge must have a challengeId');
    assert.ok(!seenIds.has(c.challengeId), `Duplicate challenge ID detected: ${c.challengeId}`);
    seenIds.add(c.challengeId);

    assert.ok(c.title && c.title.trim().length > 0, `Challenge ${c.challengeId} missing title`);
    assert.ok(c.category, `Challenge ${c.challengeId} missing category`);
    categories.add(c.category);

    assert.ok(['Easy', 'Medium', 'Hard'].includes(c.difficulty), `Invalid difficulty in ${c.challengeId}`);
    assert.ok(typeof c.starterCode === 'string' && c.starterCode.length > 0, `Invalid starterCode in ${c.challengeId}`);
    assert.ok(Array.isArray(c.testCases) && c.testCases.length >= 1, `Test cases missing in ${c.challengeId}`);
  }

  // 15 distinct categories
  const expectedCategories = [
    'arrays', 'strings', 'sorting', 'searching', 'hashing',
    'stacks', 'queues', 'linked-lists', 'trees', 'heaps',
    'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'recursion'
  ];

  for (const exp of expectedCategories) {
    assert.ok(categories.has(exp), `Expected category '${exp}' to be represented in challenges catalog`);
  }
});

test('Competition Catalog - Challenge retrieval by ID', () => {
  const found = getChallengeById('arr-01');
  assert.ok(found, 'Expected to find challenge arr-01');
  assert.equal(found.challengeId, 'arr-01');
  assert.equal(found.category, 'arrays');

  const notFound = getChallengeById('non-existent-999');
  assert.equal(notFound, null, 'Non-existent ID should return null');
});

test('Milestone Calculation & Boundary Invariants', () => {
  function computeUnlockedTiers(solvedCount) {
    const tiers = [];
    if (solvedCount >= 20) tiers.push('bronze');
    if (solvedCount >= 100) tiers.push('silver');
    if (solvedCount >= 200) tiers.push('gold');
    return tiers;
  }

  function getNextMilestone(solvedCount) {
    if (solvedCount < 20) return { target: 20, remaining: 20 - solvedCount, tier: 'bronze' };
    if (solvedCount < 100) return { target: 100, remaining: 100 - solvedCount, tier: 'silver' };
    if (solvedCount < 200) return { target: 200, remaining: 200 - solvedCount, tier: 'gold' };
    return { target: 200, remaining: 0, tier: 'master' };
  }

  // Boundary 0: none unlocked
  assert.deepEqual(computeUnlockedTiers(0), []);
  assert.deepEqual(getNextMilestone(0), { target: 20, remaining: 20, tier: 'bronze' });

  // Boundary 19: just below Bronze
  assert.deepEqual(computeUnlockedTiers(19), []);
  assert.deepEqual(getNextMilestone(19), { target: 20, remaining: 1, tier: 'bronze' });

  // Boundary 20: Bronze unlocks
  assert.deepEqual(computeUnlockedTiers(20), ['bronze']);
  assert.deepEqual(getNextMilestone(20), { target: 100, remaining: 80, tier: 'silver' });

  // Boundary 99: just below Silver
  assert.deepEqual(computeUnlockedTiers(99), ['bronze']);
  assert.deepEqual(getNextMilestone(99), { target: 100, remaining: 1, tier: 'silver' });

  // Boundary 100: Silver unlocks, Bronze remains unlocked
  assert.deepEqual(computeUnlockedTiers(100), ['bronze', 'silver']);
  assert.deepEqual(getNextMilestone(100), { target: 200, remaining: 100, tier: 'gold' });

  // Boundary 199: just below Gold
  assert.deepEqual(computeUnlockedTiers(199), ['bronze', 'silver']);
  assert.deepEqual(getNextMilestone(199), { target: 200, remaining: 1, tier: 'gold' });

  // Boundary 200: Gold unlocks, all tiers unlocked
  assert.deepEqual(computeUnlockedTiers(200), ['bronze', 'silver', 'gold']);
  assert.deepEqual(getNextMilestone(200), { target: 200, remaining: 0, tier: 'master' });

  // Beyond 200: All tiers persist
  assert.deepEqual(computeUnlockedTiers(227), ['bronze', 'silver', 'gold']);
});

test('Certificate Security - Issuance & Verification Invariants', () => {
  function canDownloadCertificate({ mode, isVerifiedPayment, isCompleted }) {
    if (mode !== 'ISSUED') return false;
    return Boolean(isVerifiedPayment && isCompleted);
  }

  // Locked or Sample preview must never permit download
  assert.equal(canDownloadCertificate({ mode: 'LOCKED', isVerifiedPayment: true, isCompleted: true }), false);
  assert.equal(canDownloadCertificate({ mode: 'SAMPLE', isVerifiedPayment: true, isCompleted: true }), false);

  // Unpaid application cannot download even if marked completed
  assert.equal(canDownloadCertificate({ mode: 'ISSUED', isVerifiedPayment: false, isCompleted: true }), false);

  // Paid but unverified completion cannot download
  assert.equal(canDownloadCertificate({ mode: 'ISSUED', isVerifiedPayment: true, isCompleted: false }), false);

  // Both verified payment and verified completion enables download in ISSUED mode
  assert.equal(canDownloadCertificate({ mode: 'ISSUED', isVerifiedPayment: true, isCompleted: true }), true);
});
