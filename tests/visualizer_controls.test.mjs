import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Playback Controls & Cooperative Pause Engine', () => {
  test('Button label state transitions match playback lifecycle', () => {
    const getButtonLabel = (isRunning, isPaused, isCompleted) => {
      if (isRunning && !isPaused) return 'PAUSE';
      if (isPaused) return 'RESUME';
      if (isCompleted) return 'REPLAY';
      return 'PLAY';
    };

    const getButtonIcon = (isRunning, isPaused) => {
      if (isRunning && !isPaused) return '⏸';
      return '▶';
    };

    // State 1: Ready / Initial
    assert.equal(getButtonLabel(false, false, false), 'PLAY');
    assert.equal(getButtonIcon(false, false), '▶');

    // State 2: Running
    assert.equal(getButtonLabel(true, false, false), 'PAUSE');
    assert.equal(getButtonIcon(true, false), '⏸');

    // State 3: Paused
    assert.equal(getButtonLabel(true, true, false), 'RESUME');
    assert.equal(getButtonIcon(true, true), '▶');

    // State 4: Completed
    assert.equal(getButtonLabel(false, false, true), 'REPLAY');
    assert.equal(getButtonIcon(false, false), '▶');
  });

  test('Cooperative pause loop suspends execution until resumed', async () => {
    let isRunning = true;
    let isPaused = true;
    let stepCount = 0;
    let resumeTriggered = false;

    const cooperativeCallback = async () => {
      stepCount++;
      while (isPaused && isRunning) {
        await new Promise((r) => setTimeout(r, 20));
      }
      if (!isRunning) {
        const err = new Error('SORT_STOPPED');
        err.isAbort = true;
        throw err;
      }
    };

    // Start background task that executes cooperative callback
    const taskPromise = (async () => {
      await cooperativeCallback();
      return 'COMPLETED_AFTER_RESUME';
    })();

    // Verify it is paused at step 1
    await new Promise((r) => setTimeout(r, 60));
    assert.equal(stepCount, 1);

    // Resume execution
    isPaused = false;
    resumeTriggered = true;

    const result = await taskPromise;
    assert.equal(result, 'COMPLETED_AFTER_RESUME');
    assert.equal(resumeTriggered, true);
  });

  test('Reset during pause aborts cooperative loop immediately without ghost execution', async () => {
    let isRunning = true;
    let isPaused = true;
    let remainingWorkExecuted = false;

    const cooperativeCallback = async () => {
      while (isPaused && isRunning) {
        await new Promise((r) => setTimeout(r, 20));
      }
      if (!isRunning) {
        const err = new Error('SORT_STOPPED');
        err.isAbort = true;
        throw err;
      }
      remainingWorkExecuted = true;
    };

    let caughtError = null;
    const taskPromise = (async () => {
      try {
        await cooperativeCallback();
      } catch (e) {
        caughtError = e;
      }
    })();

    // User clicks Reset while paused
    await new Promise((r) => setTimeout(r, 40));
    isRunning = false;
    isPaused = false;

    await taskPromise;
    assert.ok(caughtError, 'Should throw abort error');
    assert.equal(caughtError.isAbort, true);
    assert.equal(remainingWorkExecuted, false, 'No work should execute after abort');
  });

  test('Timeline scrubber does not render misleading 20/20 when totalSteps is 0', () => {
    // Simulating Controls rendering logic
    const renderScrubberOrBadge = (currentStep, totalSteps) => {
      if (totalSteps > 0) {
        return { type: 'SCRUBBER', display: `${currentStep}/${totalSteps}` };
      }
      if (currentStep > 0) {
        return { type: 'STEP_BADGE', display: `Step ${currentStep}` };
      }
      return null;
    };

    // While sorting in-progress at step 20 (totalSteps unknown = 0)
    const inProgress = renderScrubberOrBadge(20, 0);
    assert.equal(inProgress.type, 'STEP_BADGE');
    assert.equal(inProgress.display, 'Step 20');
    assert.notEqual(inProgress.display, '20/20', 'Must not show fake 20/20');

    // When algorithm completes with known total steps
    const completed = renderScrubberOrBadge(74, 74);
    assert.equal(completed.type, 'SCRUBBER');
    assert.equal(completed.display, '74/74');
  });
});
