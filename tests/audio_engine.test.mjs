import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

import { AudioEventTypes } from '../src/audio/AudioEventTypes.js';
import { AudioConfig, AudioCategories } from '../src/audio/audioConfig.js';
import { AudioPreferences } from '../src/audio/AudioPreferences.js';
import { AudioRegistry } from '../src/audio/AudioRegistry.js';
import { audioManager } from '../src/audio/AudioManager.js';
import { audioDispatcher } from '../src/audio/AudioEventDispatcher.js';

test('Audio Engine - AudioEventTypes completeness and uniqueness', () => {
  const eventValues = Object.values(AudioEventTypes);
  assert.ok(eventValues.length >= 35, `Expected at least 35 event types, found ${eventValues.length}`);

  // Test uniqueness
  const uniqueSet = new Set(eventValues);
  assert.equal(uniqueSet.size, eventValues.length, 'Every event type must be strictly unique');

  // Verify critical operation types exist
  assert.ok(AudioEventTypes.SORT_COMPARE, 'SORT_COMPARE must exist');
  assert.ok(AudioEventTypes.SORT_SWAP, 'SORT_SWAP must exist');
  assert.ok(AudioEventTypes.SORT_COMPLETE, 'SORT_COMPLETE must exist');
  assert.ok(AudioEventTypes.GRAPH_VISIT, 'GRAPH_VISIT must exist');
  assert.ok(AudioEventTypes.GRAPH_RELAX, 'GRAPH_RELAX must exist');
  assert.ok(AudioEventTypes.GRAPH_PATH_FOUND, 'GRAPH_PATH_FOUND must exist');
  assert.ok(AudioEventTypes.GRAPH_BACKTRACK, 'GRAPH_BACKTRACK must exist');
  assert.ok(AudioEventTypes.STACK_PUSH, 'STACK_PUSH must exist');
  assert.ok(AudioEventTypes.STACK_POP, 'STACK_POP must exist');
  assert.ok(AudioEventTypes.QUEUE_ENQUEUE, 'QUEUE_ENQUEUE must exist');
  assert.ok(AudioEventTypes.QUEUE_DEQUEUE, 'QUEUE_DEQUEUE must exist');
  assert.ok(AudioEventTypes.HEAP_SIFT_UP, 'HEAP_SIFT_UP must exist');
  assert.ok(AudioEventTypes.TREE_INSERT, 'TREE_INSERT must exist');
  assert.ok(AudioEventTypes.TREE_TRAVERSE, 'TREE_TRAVERSE must exist');
  assert.ok(AudioEventTypes.SEARCH_FOUND, 'SEARCH_FOUND must exist');
  assert.ok(AudioEventTypes.DP_OPTIMUM_FOUND, 'DP_OPTIMUM_FOUND must exist');
  assert.ok(AudioEventTypes.STRING_PATTERN_FOUND, 'STRING_PATTERN_FOUND must exist');
  assert.ok(AudioEventTypes.BACKTRACK_SOLUTION, 'BACKTRACK_SOLUTION must exist');
});

test('Audio Engine - AudioConfig policies and defaults', () => {
  assert.equal(typeof AudioConfig.defaults.masterVolume, 'number');
  assert.ok(AudioConfig.defaults.masterVolume <= 0.3, 'Default master volume should be conservative (<= 30%)');
  assert.ok(AudioConfig.defaults.algorithmVolume <= 0.4, 'Default algorithm volume should be comfortable (<= 40%)');
  assert.ok(AudioConfig.maxConcurrentVoices >= 4, 'Should allow at least 4 concurrent voices');
  assert.ok(AudioConfig.reducedSoundFilteredEvents.has(AudioEventTypes.SORT_COMPARE), 'Reduced sound mode must filter high-frequency comparisons');
});

test('Audio Engine - AudioPreferences boundary clamping and SSR safety', () => {
  // Test clamping
  assert.equal(AudioPreferences.clamp(-0.5), 0, 'Negative values must clamp to 0');
  assert.equal(AudioPreferences.clamp(1.5), 1, 'Values > 1 must clamp to 1');
  assert.equal(AudioPreferences.clamp(0.42), 0.42, 'Valid values in [0, 1] must be preserved');
  assert.equal(AudioPreferences.clamp('invalid'), 0, 'NaN input should safely clamp to 0');

  // Test SSR safety (when window.localStorage is undefined in Node)
  const prefs = AudioPreferences.getPreferences();
  assert.ok(prefs, 'getPreferences() must return valid preference state in SSR');
  assert.equal(typeof prefs.soundEnabled, 'boolean');
  assert.equal(typeof prefs.masterVolume, 'number');
});

test('Audio Engine - AudioRegistry asset verification and mapping', () => {
  const missingFiles = [];

  for (const [eventType, meta] of Object.entries(AudioRegistry)) {
    assert.ok(meta.category === AudioCategories.ALGORITHM || meta.category === AudioCategories.UI, `Invalid category for ${eventType}`);
    assert.ok(typeof meta.synthMethod === 'string', `Missing synthMethod for ${eventType}`);
    assert.ok(meta.assetPath.startsWith('/audio/sfx/'), `Asset path must start with /audio/sfx/ for ${eventType}`);

    // Verify physical file existence in public/
    const diskPath = path.resolve(path.join('public', meta.assetPath.replace(/^\//, '')));
    if (!fs.existsSync(diskPath)) {
      missingFiles.push({ eventType, diskPath });
    }
  }

  assert.equal(missingFiles.length, 0, `Missing audio files: ${JSON.stringify(missingFiles)}`);
});

test('Audio Engine - AudioManager volume scaling and calculation', () => {
  audioManager.setSoundEnabled(true);
  audioManager.setMasterVolume(0.5);
  audioManager.setAlgorithmVolume(0.4);
  audioManager.setUiVolume(0.3);

  // Effective volume = master * category * multiplier
  const algoVol = audioManager.getEffectiveVolume(AudioCategories.ALGORITHM);
  assert.equal(algoVol, 0.5 * 0.4, 'Algorithm effective volume calculation is correct');

  const uiVol = audioManager.getEffectiveVolume(AudioCategories.UI);
  assert.equal(uiVol, 0.5 * 0.3, 'UI effective volume calculation is correct');

  // When muted
  audioManager.setSoundEnabled(false);
  assert.equal(audioManager.getEffectiveVolume(AudioCategories.ALGORITHM), 0, 'Muted state returns 0 effective volume');

  // Reset to defaults
  audioManager.setSoundEnabled(true);
  audioManager.setMasterVolume(AudioConfig.defaults.masterVolume);
  audioManager.setAlgorithmVolume(AudioConfig.defaults.algorithmVolume);
  audioManager.setUiVolume(AudioConfig.defaults.uiVolume);
});

test('Audio Engine - Throttle cooldown and duplicate suppression', () => {
  // First call should not throttle
  const firstCheck = audioManager.shouldThrottle('test.event.unique');
  assert.equal(firstCheck, false, 'First event trigger must not be throttled');

  // Immediate second call should throttle
  const secondCheck = audioManager.shouldThrottle('test.event.unique');
  assert.equal(secondCheck, true, 'Immediate subsequent event trigger must be throttled');
});

test('Audio Engine - AudioEventDispatcher resilience and error isolation', () => {
  let eventReceived = null;
  const unsubscribe = audioDispatcher.subscribe((ev, opts) => {
    eventReceived = ev;
  });

  // Safe dispatching
  assert.doesNotThrow(() => {
    audioDispatcher.dispatch(AudioEventTypes.SORT_SWAP, { pitch: 1.2 });
  }, 'Audio dispatch must never throw');

  assert.equal(eventReceived, AudioEventTypes.SORT_SWAP, 'Subscribers should receive dispatched event');

  // Null/undefined/garbage safety
  assert.doesNotThrow(() => {
    audioDispatcher.dispatch(null);
    audioDispatcher.dispatch(undefined);
    audioDispatcher.dispatch('completely.unknown.fake.event');
  }, 'Malformed event types must be silently and safely handled without throwing');

  unsubscribe();
});
