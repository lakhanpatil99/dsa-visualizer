/**
 * AlgoMania Web Audio Synthesizer
 * Pure, zero-latency procedural sound synthesis engine using Web Audio API.
 * Produces crisp, pleasant, non-intrusive harmonic and percussive audio
 * with zero network requests and 100% offline reliability.
 */

class WebAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isUnlocked = false;
  }

  getContext() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended' && this.isUnlocked) {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  unlock() {
    this.isUnlocked = true;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  // Helper: Play a shaped tone
  playTone({ freq = 440, type = 'sine', duration = 0.08, gain = 0.3, attack = 0.005, decay = 0.075, endFreq = null }) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq && endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
      }

      // Envelope
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      // Audio error suppressed silently
    }
  }

  // --- Specific Algorithm & UI Sound Synthesizers ---

  // Sorting
  click(gain = 0.15) {
    // Subtle dry micro-click
    this.playTone({ freq: 1200, endFreq: 400, type: 'triangle', duration: 0.02, gain, attack: 0.002 });
  }

  swap(gain = 0.22, pitch = 1.0) {
    // Two short percussive tones
    const baseFreq = 340 * pitch;
    this.playTone({ freq: baseFreq, endFreq: baseFreq * 1.25, type: 'sine', duration: 0.035, gain, attack: 0.003 });
    setTimeout(() => {
      this.playTone({ freq: baseFreq * 1.35, endFreq: baseFreq * 1.6, type: 'sine', duration: 0.035, gain: gain * 0.9, attack: 0.003 });
    }, 28);
  }

  pivot(gain = 0.25, pitch = 1.0) {
    // Soft focused accent
    this.playTone({ freq: 587 * pitch, type: 'sine', duration: 0.09, gain, attack: 0.004, decay: 0.085 });
  }

  merge(gain = 0.2, pitch = 1.0) {
    // Smooth connected notes
    const f = 440 * pitch;
    this.playTone({ freq: f, type: 'triangle', duration: 0.045, gain: gain * 0.8 });
    setTimeout(() => this.playTone({ freq: f * 1.25, type: 'triangle', duration: 0.045, gain }), 30);
  }

  write(gain = 0.18, pitch = 1.0) {
    // Light digital tap
    this.playTone({ freq: 620 * pitch, endFreq: 520 * pitch, type: 'sine', duration: 0.03, gain, attack: 0.002 });
  }

  complete(gain = 0.3) {
    // Warm triumphant 4-note arpeggio (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: 'sine', duration: 0.16, gain: gain * (idx === 3 ? 1.0 : 0.75), attack: 0.008 });
      }, idx * 60);
    });
  }

  // Graphs
  discover(gain = 0.2, pitch = 1.0) {
    // Light ascending ping
    this.playTone({ freq: 440 * pitch, endFreq: 880 * pitch, type: 'sine', duration: 0.06, gain, attack: 0.005 });
  }

  visit(gain = 0.22, pitch = 1.0) {
    // Rounded resonant pluck
    this.playTone({ freq: 330 * pitch, endFreq: 220 * pitch, type: 'triangle', duration: 0.07, gain, attack: 0.003 });
  }

  relax(gain = 0.2, pitch = 1.0) {
    // Short rising digital tone
    this.playTone({ freq: 520 * pitch, endFreq: 780 * pitch, type: 'sine', duration: 0.05, gain, attack: 0.004 });
  }

  pathFound(gain = 0.3) {
    // Distinctive 3-note success cue
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: 'sine', duration: 0.14, gain: gain * 0.9, attack: 0.006 });
      }, idx * 70);
    });
  }

  cycle(gain = 0.25) {
    // Muted warning cue, descending interval
    this.playTone({ freq: 240, endFreq: 180, type: 'sawtooth', duration: 0.12, gain: gain * 0.6, attack: 0.01 });
  }

  backtrack(gain = 0.2, pitch = 1.0) {
    // Descending muted cue
    this.playTone({ freq: 392 * pitch, endFreq: 261 * pitch, type: 'sine', duration: 0.06, gain, attack: 0.005 });
  }

  mstEdge(gain = 0.25, pitch = 1.0) {
    // Clean positive tone
    this.playTone({ freq: 659.25 * pitch, type: 'sine', duration: 0.08, gain, attack: 0.004 });
  }

  mstReject(gain = 0.18, pitch = 1.0) {
    // Softer, lower-pitched cue
    this.playTone({ freq: 220 * pitch, endFreq: 196 * pitch, type: 'triangle', duration: 0.05, gain, attack: 0.004 });
  }

  // Stacks
  push(gain = 0.22, pitch = 1.0) {
    // Short rising wooden click
    this.playTone({ freq: 220 * pitch, endFreq: 440 * pitch, type: 'triangle', duration: 0.04, gain, attack: 0.003 });
  }

  pop(gain = 0.22, pitch = 1.0) {
    // Descending soft pop
    this.playTone({ freq: 440 * pitch, endFreq: 200 * pitch, type: 'sine', duration: 0.04, gain, attack: 0.003 });
  }

  peek(gain = 0.18, pitch = 1.0) {
    // Small high-pitched confirmation
    this.playTone({ freq: 880 * pitch, type: 'sine', duration: 0.035, gain, attack: 0.003 });
  }

  underflow(gain = 0.22) {
    // Subtle low warning
    this.playTone({ freq: 130, endFreq: 90, type: 'triangle', duration: 0.1, gain, attack: 0.01 });
  }

  // Queues
  enqueue(gain = 0.22, pitch = 1.0) {
    // Short clean insertion sound
    this.playTone({ freq: 330 * pitch, endFreq: 494 * pitch, type: 'sine', duration: 0.04, gain, attack: 0.003 });
  }

  dequeue(gain = 0.22, pitch = 1.0) {
    // Soft release sound
    this.playTone({ freq: 494 * pitch, endFreq: 330 * pitch, type: 'sine', duration: 0.04, gain, attack: 0.003 });
  }

  front(gain = 0.18, pitch = 1.0) {
    this.playTone({ freq: 740 * pitch, type: 'sine', duration: 0.035, gain, attack: 0.003 });
  }

  // Linked Lists
  listInsert(gain = 0.2, pitch = 1.0) {
    this.playTone({ freq: 415 * pitch, endFreq: 554 * pitch, type: 'sine', duration: 0.045, gain, attack: 0.004 });
  }

  listDelete(gain = 0.2, pitch = 1.0) {
    this.playTone({ freq: 554 * pitch, endFreq: 370 * pitch, type: 'sine', duration: 0.045, gain, attack: 0.004 });
  }

  listConnect(gain = 0.22, pitch = 1.0) {
    // Short snapping connection cue
    this.playTone({ freq: 800 * pitch, endFreq: 950 * pitch, type: 'triangle', duration: 0.025, gain, attack: 0.002 });
  }

  listTraverse(gain = 0.15, pitch = 1.0) {
    this.playTone({ freq: 520 * pitch, type: 'sine', duration: 0.025, gain, attack: 0.003 });
  }

  // Heaps
  heapInsert(gain = 0.22, pitch = 1.0) {
    this.playTone({ freq: 330 * pitch, endFreq: 520 * pitch, type: 'sine', duration: 0.05, gain, attack: 0.004 });
  }

  siftUp(gain = 0.2, pitch = 1.0) {
    // Upward stepped notes
    this.playTone({ freq: 350 * pitch, endFreq: 550 * pitch, type: 'triangle', duration: 0.04, gain, attack: 0.003 });
  }

  siftDown(gain = 0.2, pitch = 1.0) {
    // Downward stepped notes
    this.playTone({ freq: 550 * pitch, endFreq: 350 * pitch, type: 'triangle', duration: 0.04, gain, attack: 0.003 });
  }

  heapExtract(gain = 0.25, pitch = 1.0) {
    this.playTone({ freq: 260 * pitch, endFreq: 520 * pitch, type: 'sine', duration: 0.08, gain, attack: 0.005 });
  }

  // Trees
  treeInsert(gain = 0.22, pitch = 1.0) {
    this.playTone({ freq: 440 * pitch, endFreq: 660 * pitch, type: 'sine', duration: 0.06, gain, attack: 0.004 });
  }

  treeTraverse(gain = 0.16, pitch = 1.0) {
    this.playTone({ freq: 660 * pitch, type: 'sine', duration: 0.03, gain, attack: 0.003 });
  }

  treeRotate(gain = 0.22, pitch = 1.0) {
    this.playTone({ freq: 440 * pitch, endFreq: 700 * pitch, type: 'triangle', duration: 0.07, gain, attack: 0.005 });
  }

  treeBalance(gain = 0.25, pitch = 1.0) {
    // Balanced chord cue
    this.playTone({ freq: 523 * pitch, type: 'sine', duration: 0.1, gain: gain * 0.7 });
    this.playTone({ freq: 659 * pitch, type: 'sine', duration: 0.1, gain: gain * 0.7 });
  }

  // Searching
  searchFound(gain = 0.3, pitch = 1.0) {
    // Bright bell ding
    this.playTone({ freq: 1046.5 * pitch, type: 'sine', duration: 0.18, gain, attack: 0.004 });
  }

  searchNotFound(gain = 0.22) {
    // Low dual tone
    this.playTone({ freq: 220, type: 'triangle', duration: 0.1, gain: gain * 0.7 });
    this.playTone({ freq: 207, type: 'triangle', duration: 0.1, gain: gain * 0.7 });
  }

  // Dynamic Programming
  dpCell(gain = 0.2, pitch = 1.0) {
    this.playTone({ freq: 480 * pitch, type: 'sine', duration: 0.04, gain, attack: 0.003 });
  }

  dpOptimum(gain = 0.3) {
    [587, 740, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone({ freq, type: 'sine', duration: 0.12, gain: gain * 0.8 }), idx * 60);
    });
  }

  // Strings
  stringMatch(gain = 0.18, pitch = 1.0) {
    this.playTone({ freq: 880 * pitch, type: 'triangle', duration: 0.025, gain, attack: 0.002 });
  }

  stringMismatch(gain = 0.15, pitch = 1.0) {
    this.playTone({ freq: 240 * pitch, type: 'sine', duration: 0.03, gain, attack: 0.003 });
  }

  stringFound(gain = 0.28) {
    [659, 880, 1174].forEach((freq, idx) => {
      setTimeout(() => this.playTone({ freq, type: 'sine', duration: 0.12, gain: gain * 0.8 }), idx * 55);
    });
  }

  // Backtracking
  backtrackBranch(gain = 0.2, pitch = 1.0) {
    this.playTone({ freq: 400 * pitch, endFreq: 600 * pitch, type: 'sine', duration: 0.04, gain, attack: 0.003 });
  }

  backtrackDeadEnd(gain = 0.18) {
    this.playTone({ freq: 200, endFreq: 140, type: 'triangle', duration: 0.05, gain, attack: 0.005 });
  }

  backtrackSolution(gain = 0.3) {
    [523, 659, 784, 1046].forEach((freq, idx) => {
      setTimeout(() => this.playTone({ freq, type: 'sine', duration: 0.14, gain }), idx * 60);
    });
  }

  // UI
  uiClick(gain = 0.15) {
    this.playTone({ freq: 900, endFreq: 600, type: 'sine', duration: 0.02, gain, attack: 0.002 });
  }

  uiToggle(gain = 0.18) {
    this.playTone({ freq: 600, endFreq: 900, type: 'sine', duration: 0.03, gain, attack: 0.003 });
  }

  preview(gain = 0.28) {
    // Elegant warm preview chime
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone({ freq, type: 'sine', duration: 0.15, gain: gain * 0.85, attack: 0.005 });
      }, idx * 70);
    });
  }
}

export const synthesizer = new WebAudioSynthesizer();
export default synthesizer;
