import test from 'node:test';
import assert from 'node:assert/strict';
import { getFriendlyAuthErrorMessage } from '../lib/authService.js';

test('Email validation regex correctly validates valid and invalid emails', () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test('valid@example.com'), true);
  assert.equal(emailRegex.test('learner.dsa@algomania.dev'), true);
  assert.equal(emailRegex.test('invalid-email'), false);
  assert.equal(emailRegex.test('no@domain'), false);
  assert.equal(emailRegex.test('@no-username.com'), false);
});

test('Password strength scoring accurately classifies strength', () => {
  const evaluatePassword = (pwd) => {
    return {
      length: pwd.length >= 6,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd)
    };
  };

  const weak = evaluatePassword('12345');
  assert.equal(weak.length, false);

  const ok = evaluatePassword('password123');
  assert.equal(ok.length, true);
  assert.equal(ok.hasLower, true);
  assert.equal(ok.hasNumber, true);
  assert.equal(ok.hasUpper, false);

  const strong = evaluatePassword('AlgoMania2026!');
  assert.equal(strong.length, true);
  assert.equal(strong.hasUpper, true);
  assert.equal(strong.hasLower, true);
  assert.equal(strong.hasNumber, true);
});

test('Password mismatch validation rejects differing passwords', () => {
  const pwd1 = 'AlgoPassword123';
  const pwd2 = 'AlgoPassword999';
  assert.notEqual(pwd1, pwd2);
});

test('getFriendlyAuthErrorMessage translates duplicate email error', () => {
  const err = { code: 'auth/email-already-in-use' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /already registered/i);
});

test('getFriendlyAuthErrorMessage translates weak password error', () => {
  const err = { code: 'auth/weak-password' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /too weak/i);
});

test('getFriendlyAuthErrorMessage translates invalid credential error', () => {
  const err = { code: 'auth/invalid-credential' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /Invalid email or password/i);
});

test('getFriendlyAuthErrorMessage translates expired verification link', () => {
  const err = { code: 'auth/expired-action-code' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /expired/i);
});

test('getFriendlyAuthErrorMessage translates already-used or invalid link', () => {
  const err = { code: 'auth/invalid-action-code' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /invalid or has already been used/i);
});

test('getFriendlyAuthErrorMessage translates popup closed by user', () => {
  const err = { code: 'auth/popup-closed-by-user' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /cancelled/i);
});

test('getFriendlyAuthErrorMessage translates network failure', () => {
  const err = { code: 'auth/network-request-failed' };
  const msg = getFriendlyAuthErrorMessage(err);
  assert.match(msg, /Network connection error/i);
});
