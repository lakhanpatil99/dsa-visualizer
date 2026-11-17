import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');

describe('AlgoMania real-time competition progress and credential issuance', () => {
  it('keeps the canonical 227-challenge catalogue intact, including the Queues category', () => {
    const source = read('lib/competitions/challengesData.js');
    const ids = [...source.matchAll(/"challengeId":\s*"([^"]+)"/g)].map((match) => match[1]);
    const queues = [...source.matchAll(/"category":\s*"queues"/g)];

    assert.equal(ids.length, 227);
    assert.equal(new Set(ids).size, 227);
    assert.equal(queues.length, 12);
  });

  it('derives the competition count only from distinct accepted persisted submissions', () => {
    const stats = read('pages/api/competitions/stats.js');
    const challenges = read('pages/api/competitions/challenges.js');
    assert.match(stats, /CompetitionSubmission\.distinct\('challengeId'/);
    assert.match(stats, /status:\s*'ACCEPTED'/);
    assert.doesNotMatch(stats, /achievement\?\.uniqueSolvedCount/);
    assert.match(challenges, /COMPETITION_CHALLENGES\.map/);
    assert.match(challenges, /progressAvailable/);
    assert.match(challenges, /challenge catalogue is available/);
  });

  it('persists accepted submissions before counting and retries safe milestone issuance', () => {
    const submit = read('pages/api/competitions/submit.js');
    const issuer = read('lib/certificates/competitionMilestoneIssuance.js');
    assert.match(submit, /await CompetitionSubmission\.create\(submissionDoc\)/);
    assert.match(submit, /execResult\.status === 'ACCEPTED'/);
    assert.match(submit, /ensureCompetitionMilestoneCertificates/);
    assert.match(issuer, /crypto\.randomBytes\(16\)/);
    assert.match(issuer, /sourceKey/);
    assert.match(issuer, /Certificate\.create\(certificate\)/);
    assert.match(issuer, /competition_bronze/);
  });

  it('retries official milestone issuance from the authenticated certificate vault', () => {
    const api = read('pages/api/certificates/my-certificates.js');
    assert.match(api, /withAuth\(handler/);
    assert.match(api, /ensureCompetitionMilestoneCertificates/);
    assert.match(api, /CompetitionSubmission\.distinct/);
    assert.match(api, /certificateIssuancePending/);
  });

  it('refreshes competition catalogue and personal counts without stale HTTP caching', () => {
    const page = read('pages/competitions/index.js');
    assert.match(page, /refreshCompetitionData/);
    assert.match(page, /setInterval\(refreshIfVisible, 15000\)/);
    assert.match(page, /visibilitychange/);
    assert.match(page, /cache:\s*'no-store'/);
    assert.match(page, /issuedCompetitionCertificates/);
    assert.match(page, /Download PDF/);
    assert.match(page, /Share/);
  });

  it('keeps learning walkthrough sessions separate from competition submissions on the dashboard', () => {
    const dashboard = read('src/components/ProgressDashboard.js');
    assert.match(dashboard, /progressService\.getProgressSummary/);
    assert.match(dashboard, /Unique Accepted Challenges/);
    assert.match(dashboard, /api\/competitions\/stats/);
    assert.match(dashboard, /Bronze/);
    assert.match(dashboard, /Silver/);
    assert.match(dashboard, /Gold/);
  });

  it('makes internship completion PDFs available only for persisted official certificate records', () => {
    const applicationsApi = read('pages/api/internships/my-applications.js');
    const applicationsPage = read('pages/internships/my-applications.js');
    const downloadApi = read('pages/api/certificates/download/[id].js');

    assert.match(applicationsApi, /Certificate\.find\(\{ firebaseUid: req\.user\.uid, type: 'internship' \}\)/);
    assert.match(applicationsApi, /officialCertificate/);
    assert.match(applicationsPage, /setInterval\(refreshIfVisible, 12000\)/);
    assert.match(applicationsPage, /Download PDF/);
    assert.match(applicationsPage, /Share/);
    assert.match(downloadApi, /certificate\.status === 'REVOKED'/);
    assert.match(downloadApi, /certificate\.firebaseUid !== user\.uid/);
  });

  it('preserves internship payment as registration only and retains completion eligibility', () => {
    const issuer = read('pages/api/admin/issue-certificate.js');
    assert.match(issuer, /app\.status !== 'COMPLETED'/);
    assert.match(issuer, /app\.paymentStatus !== 'PAID_VERIFIED'/);
    assert.match(issuer, /type === 'internship'/);
    assert.match(read('pages/internships/my-applications.js'), /Complete the internship and mentor review/);
  });

  it('does not modify the Razorpay checkout implementation in this feature scope', () => {
    const paymentPage = read('pages/internships/apply.js');
    const createOrder = read('pages/api/payments/create-order.js');
    const paymentStatus = read('pages/api/payments/status.js');
    assert.match(paymentPage, /precreateOrder/);
    assert.match(createOrder, /inFlightOrders/);
    assert.match(paymentStatus, /RAZORPAY/);
  });
});
