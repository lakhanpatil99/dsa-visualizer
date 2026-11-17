/**
 * AlgoMania — Session Security & Automatic Logout Test Suite
 *
 * Tests for: browserSessionPersistence configuration, 8-hour max session lifetime,
 * 30-minute idle timeout, BroadcastChannel cross-tab logout, and footer cleanup.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// ── Firebase Session Persistence ────────────────────────────────────────────

describe('Session Security — Firebase Persistence Configuration', () => {
  it('lib/firebase.js uses browserSessionPersistence (not browserLocalPersistence)', () => {
    const firebasePath = path.resolve('lib/firebase.js');
    const content = fs.readFileSync(firebasePath, 'utf-8');

    assert.ok(
      content.includes('browserSessionPersistence'),
      'lib/firebase.js should import browserSessionPersistence'
    );
    assert.ok(
      !content.includes('browserLocalPersistence'),
      'lib/firebase.js should NOT reference browserLocalPersistence'
    );
  });
});

// ── AuthContext Session Enforcement ─────────────────────────────────────────

describe('Session Security — AuthContext Session Limits', () => {
  it('AuthContext defines MAX_SESSION_AGE_MS as 8 hours', () => {
    const authContextPath = path.resolve('src/contexts/AuthContext.js');
    const content = fs.readFileSync(authContextPath, 'utf-8');

    assert.ok(
      content.includes('MAX_SESSION_AGE_MS'),
      'AuthContext should define MAX_SESSION_AGE_MS constant'
    );
    assert.ok(
      content.includes('8 * 60 * 60 * 1000'),
      'MAX_SESSION_AGE_MS should be 8 hours in milliseconds'
    );
  });

  it('AuthContext defines IDLE_TIMEOUT_MS as 30 minutes', () => {
    const authContextPath = path.resolve('src/contexts/AuthContext.js');
    const content = fs.readFileSync(authContextPath, 'utf-8');

    assert.ok(
      content.includes('IDLE_TIMEOUT_MS'),
      'AuthContext should define IDLE_TIMEOUT_MS constant'
    );
    assert.ok(
      content.includes('30 * 60 * 1000'),
      'IDLE_TIMEOUT_MS should be 30 minutes in milliseconds'
    );
  });

  it('AuthContext checks auth_time for absolute session expiry', () => {
    const authContextPath = path.resolve('src/contexts/AuthContext.js');
    const content = fs.readFileSync(authContextPath, 'utf-8');

    assert.ok(
      content.includes('auth_time'),
      'AuthContext should check auth_time claim for session lifetime enforcement'
    );
    assert.ok(
      content.includes('getIdTokenResult'),
      'AuthContext should use getIdTokenResult to access token claims'
    );
  });

  it('AuthContext uses BroadcastChannel for cross-tab logout', () => {
    const authContextPath = path.resolve('src/contexts/AuthContext.js');
    const content = fs.readFileSync(authContextPath, 'utf-8');

    assert.ok(
      content.includes("BroadcastChannel('algomania_auth')"),
      'AuthContext should create BroadcastChannel with algomania_auth name'
    );
    assert.ok(
      content.includes("bc.postMessage('LOGOUT')"),
      'AuthContext logout handler should broadcast LOGOUT message'
    );
  });

  it('AuthContext tracks user activity with interaction events', () => {
    const authContextPath = path.resolve('src/contexts/AuthContext.js');
    const content = fs.readFileSync(authContextPath, 'utf-8');

    assert.ok(content.includes('lastActivityRef'), 'Should track last activity timestamp');
    assert.ok(content.includes('mousedown'), 'Should track mousedown events');
    assert.ok(content.includes('keydown'), 'Should track keydown events');
    assert.ok(content.includes('scroll'), 'Should track scroll events');
    assert.ok(content.includes('touchstart'), 'Should track touchstart events');
  });
});

// ── Footer Cleanup ──────────────────────────────────────────────────────────

describe('Footer Cleanup — No Framework Credits', () => {
  it('Footer.js does not display "Next.js 14 + React 18"', () => {
    const footerPath = path.resolve('src/components/Footer.js');
    const content = fs.readFileSync(footerPath, 'utf-8');

    assert.ok(
      !content.includes('Next.js 14 + React 18'),
      'Footer should not display framework version text'
    );
    assert.ok(
      content.includes('Founded by Lakhansing Patil'),
      'Footer should display founder attribution'
    );
  });

  it('HomeFooter.js does not display "Next.js 14 + React 18"', () => {
    const homeFooterPath = path.resolve('src/components/home/HomeFooter.js');
    const content = fs.readFileSync(homeFooterPath, 'utf-8');

    assert.ok(
      !content.includes('Next.js 14 + React 18'),
      'HomeFooter should not display framework version text'
    );
    assert.ok(
      content.includes('Founded by Lakhansing Patil'),
      'HomeFooter should display founder attribution'
    );
  });
});

// ── Webhook Lifecycle Resilience ────────────────────────────────────────────

describe('Webhook Lifecycle — Retry on Failure', () => {
  it('razorpay webhook handler returns non-200 on processing errors', () => {
    const webhookPath = path.resolve('pages/api/webhooks/razorpay.js');
    const content = fs.readFileSync(webhookPath, 'utf-8');

    assert.ok(
      content.includes('FAILED_RETRYABLE'),
      'Webhook handler should use FAILED_RETRYABLE status'
    );
    assert.ok(
      content.includes('res.status(500)'),
      'Webhook handler should return HTTP 500 on retryable failures'
    );
    assert.ok(
      content.includes('PROCESSING'),
      'Webhook handler should record PROCESSING state before handling'
    );
    assert.ok(
      content.includes('PROCESSED'),
      'Webhook handler should record PROCESSED state after success'
    );
  });

  it('webhook handler rejects database-unavailable requests in production with 503', () => {
    const webhookPath = path.resolve('pages/api/webhooks/razorpay.js');
    const content = fs.readFileSync(webhookPath, 'utf-8');

    assert.ok(
      content.includes("res.status(503)"),
      'Webhook should return 503 when DB is unavailable in production'
    );
  });
});

// ── Payment Status — Bounded Fast Recovery ──────────────────────────────────

describe('Payment Status — Fast Bounded Recovery', () => {
  it('status endpoint does not wait 15 minutes before reconciliation', () => {
    const statusPath = path.resolve('pages/api/payments/status.js');
    const content = fs.readFileSync(statusPath, 'utf-8');

    assert.ok(
      !content.includes('STALE_PENDING_MS'),
      'Status endpoint should not use a 15-minute stale threshold'
    );
    assert.ok(
      !content.includes('15 * 60 * 1000'),
      'Status endpoint should not define a 15-minute wait constant'
    );
  });

  it('status endpoint actively reconciles with Razorpay for non-captured orders', () => {
    const statusPath = path.resolve('pages/api/payments/status.js');
    const content = fs.readFileSync(statusPath, 'utf-8');

    assert.ok(
      content.includes('fetchOrderPayments'),
      'Status endpoint should use fetchOrderPayments for active reconciliation'
    );
  });
});

// ── Production Database Safety ──────────────────────────────────────────────

describe('Production Database Safety — No memoryStore Fallback', () => {
  const productionGatedFiles = [
    'pages/api/payments/verify.js',
    'pages/api/payments/status.js',
    'pages/api/payments/create-order.js',
    'pages/api/internships/apply.js',
    'pages/api/competitions/submit.js',
  ];

  for (const file of productionGatedFiles) {
    it(`${file} returns 503 when DB unavailable in production`, () => {
      const filePath = path.resolve(file);
      const content = fs.readFileSync(filePath, 'utf-8');

      assert.ok(
        content.includes("process.env.NODE_ENV === 'production'") &&
        content.includes('503'),
        `${file} should check for production environment and return 503 on DB failure`
      );
    });
  }
});
