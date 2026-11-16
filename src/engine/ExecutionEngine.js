/**
 * Universal Deterministic Execution Engine
 * Manages playback, bidirectional stepping, timeline scrubbing, speed scaling,
 * and state transitions for all algorithm visualizers.
 */

export class ExecutionEngine {
  constructor({ onStepChange, onComplete, onStateChange } = {}) {
    this.steps = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.speed = 1; // 0.25x to 4x multiplier
    this.baseDelayMs = 400;
    this.timerId = null;

    this.onStepChange = onStepChange || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onStateChange = onStateChange || (() => {});
  }

  loadTrace(trace) {
    this.stop();
    if (!trace || !Array.isArray(trace.steps)) {
      this.steps = [];
      this.currentIndex = -1;
    } else {
      this.steps = trace.steps;
      this.currentIndex = -1;
    }
    this._notifyState();
  }

  get totalSteps() {
    return this.steps.length;
  }

  get currentStep() {
    return this.currentIndex >= 0 && this.currentIndex < this.steps.length
      ? this.steps[this.currentIndex]
      : null;
  }

  get isAtStart() {
    return this.currentIndex <= 0;
  }

  get isAtEnd() {
    return this.steps.length > 0 && this.currentIndex >= this.steps.length - 1;
  }

  setSpeed(multiplier) {
    this.speed = Math.max(0.1, Math.min(10, Number(multiplier) || 1));
    if (this.isPlaying) {
      this._reschedule();
    }
    this._notifyState();
  }

  getStepDelay() {
    return Math.max(20, Math.round(this.baseDelayMs / this.speed));
  }

  play() {
    if (this.isPlaying || this.steps.length === 0) return;
    if (this.isAtEnd) {
      this.jumpTo(0);
    }
    this.isPlaying = true;
    this._notifyState();
    this._scheduleNext();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this._clearTimer();
    this._notifyState();
  }

  stop() {
    this.pause();
    this.currentIndex = -1;
    this._notifyState();
  }

  reset() {
    this.pause();
    this.currentIndex = -1;
    if (this.steps.length > 0) {
      this.jumpTo(0);
    } else {
      this._notifyState();
    }
  }

  stepForward() {
    this.pause();
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex += 1;
      this._emitCurrent();
      this._notifyState();
      if (this.isAtEnd) {
        this.onComplete(this.currentStep);
      }
      return true;
    }
    return false;
  }

  stepBackward() {
    this.pause();
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this._emitCurrent();
      this._notifyState();
      return true;
    } else if (this.currentIndex === 0) {
      this.currentIndex = -1;
      this._emitCurrent();
      this._notifyState();
      return true;
    }
    return false;
  }

  jumpTo(index) {
    this.pause();
    const target = Math.max(0, Math.min(this.steps.length - 1, Number(index) || 0));
    this.currentIndex = target;
    this._emitCurrent();
    this._notifyState();
    if (this.isAtEnd) {
      this.onComplete(this.currentStep);
    }
  }

  _scheduleNext() {
    this._clearTimer();
    if (!this.isPlaying) return;

    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;

      if (this.currentIndex < this.steps.length - 1) {
        this.currentIndex += 1;
        this._emitCurrent();
        this._notifyState();

        if (this.isAtEnd) {
          this.isPlaying = false;
          this._notifyState();
          this.onComplete(this.currentStep);
        } else {
          this._scheduleNext();
        }
      } else {
        this.isPlaying = false;
        this._notifyState();
        this.onComplete(this.currentStep);
      }
    }, this.getStepDelay());
  }

  _reschedule() {
    this._clearTimer();
    if (this.isPlaying) {
      this._scheduleNext();
    }
  }

  _clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  _emitCurrent() {
    this.onStepChange(this.currentStep, this.currentIndex, this.totalSteps);
  }

  _notifyState() {
    this.onStateChange({
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      totalSteps: this.totalSteps,
      isAtStart: this.isAtStart,
      isAtEnd: this.isAtEnd,
      speed: this.speed,
      currentStep: this.currentStep
    });
  }

  destroy() {
    this.pause();
    this._clearTimer();
    this.steps = [];
    this.currentIndex = -1;
  }
}

export default ExecutionEngine;
