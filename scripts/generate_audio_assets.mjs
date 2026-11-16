import fs from 'fs';
import path from 'path';

const SAMPLE_RATE = 22050;

function createWavBuffer(samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (SAMPLE_RATE * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt Chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk 1 size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data Chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    // Clamp to 16-bit signed integer range
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.round(intSample), 44 + i * 2);
  }

  return buffer;
}

// Synthesis generators
function tone(freq, durationSec, { type = 'sine', decay = 'exp', endFreq = null, gain = 0.5 } = {}) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(numSamples);
  let phase = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;
    const currentFreq = endFreq ? freq + (endFreq - freq) * progress : freq;

    phase += (2 * Math.PI * currentFreq) / SAMPLE_RATE;

    let raw = 0;
    if (type === 'sine') {
      raw = Math.sin(phase);
    } else if (type === 'triangle') {
      raw = (2 / Math.PI) * Math.asin(Math.sin(phase));
    } else if (type === 'sawtooth') {
      raw = 2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5));
    }

    // Envelope
    let env = 1;
    const attackSamples = Math.floor(SAMPLE_RATE * 0.005);
    if (i < attackSamples) {
      env = i / attackSamples;
    } else if (decay === 'exp') {
      env = Math.exp(-progress * 4.5);
    } else {
      env = 1 - progress;
    }

    samples[i] = raw * env * gain;
  }
  return samples;
}

function chord(notes, durationSec, gain = 0.4) {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const result = new Float32Array(numSamples);
  const noteGain = gain / notes.length;

  for (const n of notes) {
    const s = tone(n.freq, n.duration || durationSec, {
      type: n.type || 'sine',
      endFreq: n.endFreq,
      gain: noteGain
    });
    const offset = Math.floor(SAMPLE_RATE * (n.start || 0));
    for (let i = 0; i < s.length && offset + i < numSamples; i++) {
      result[offset + i] += s[i];
    }
  }
  return result;
}

function sequence(tones, totalDurationSec) {
  const numSamples = Math.floor(SAMPLE_RATE * totalDurationSec);
  const result = new Float32Array(numSamples);

  for (const item of tones) {
    const s = tone(item.freq, item.duration, {
      type: item.type || 'sine',
      endFreq: item.endFreq,
      gain: item.gain || 0.4
    });
    const offset = Math.floor(SAMPLE_RATE * item.start);
    for (let i = 0; i < s.length && offset + i < numSamples; i++) {
      result[offset + i] += s[i];
    }
  }
  return result;
}

// Definitions for all sound assets
const soundAssets = {
  // UI
  'public/audio/sfx/ui/click.wav': tone(900, 0.02, { endFreq: 600, type: 'sine', gain: 0.3 }),
  'public/audio/sfx/ui/toggle.wav': tone(600, 0.035, { endFreq: 900, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/ui/success.wav': chord([{ freq: 523, start: 0, duration: 0.12 }, { freq: 659, start: 0.05, duration: 0.14 }, { freq: 784, start: 0.1, duration: 0.2 }], 0.35, 0.5),
  'public/audio/sfx/ui/preview.wav': sequence([
    { freq: 440, start: 0, duration: 0.1, gain: 0.3 },
    { freq: 554, start: 0.06, duration: 0.1, gain: 0.32 },
    { freq: 659, start: 0.12, duration: 0.12, gain: 0.35 },
    { freq: 880, start: 0.18, duration: 0.2, gain: 0.4 }
  ], 0.4),

  // Sorting
  'public/audio/sfx/sorting/compare.wav': tone(1200, 0.02, { endFreq: 400, type: 'triangle', gain: 0.25 }),
  'public/audio/sfx/sorting/swap.wav': sequence([
    { freq: 340, start: 0, duration: 0.03, type: 'sine', endFreq: 420, gain: 0.35 },
    { freq: 460, start: 0.025, duration: 0.035, type: 'sine', endFreq: 550, gain: 0.35 }
  ], 0.07),
  'public/audio/sfx/sorting/pivot.wav': tone(587, 0.09, { type: 'sine', gain: 0.4 }),
  'public/audio/sfx/sorting/merge.wav': sequence([
    { freq: 440, start: 0, duration: 0.04, type: 'triangle', gain: 0.3 },
    { freq: 554, start: 0.028, duration: 0.05, type: 'triangle', gain: 0.35 }
  ], 0.09),
  'public/audio/sfx/sorting/write.wav': tone(620, 0.03, { endFreq: 520, type: 'sine', gain: 0.3 }),
  'public/audio/sfx/sorting/complete.wav': chord([
    { freq: 523.25, start: 0, duration: 0.18 },
    { freq: 659.25, start: 0.05, duration: 0.2 },
    { freq: 783.99, start: 0.1, duration: 0.22 },
    { freq: 1046.50, start: 0.15, duration: 0.3 }
  ], 0.48, 0.5),

  // Graphs
  'public/audio/sfx/graphs/discover.wav': tone(440, 0.06, { endFreq: 880, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/graphs/visit.wav': tone(330, 0.07, { endFreq: 220, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/graphs/relax.wav': tone(520, 0.05, { endFreq: 780, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/graphs/path_found.wav': sequence([
    { freq: 523.25, start: 0, duration: 0.12, gain: 0.35 },
    { freq: 659.25, start: 0.07, duration: 0.14, gain: 0.38 },
    { freq: 783.99, start: 0.14, duration: 0.22, gain: 0.42 }
  ], 0.38),
  'public/audio/sfx/graphs/cycle.wav': tone(240, 0.14, { endFreq: 180, type: 'sawtooth', gain: 0.3 }),
  'public/audio/sfx/graphs/backtrack.wav': tone(392, 0.06, { endFreq: 261, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/graphs/mst_edge.wav': tone(659.25, 0.08, { type: 'sine', gain: 0.4 }),
  'public/audio/sfx/graphs/mst_reject.wav': tone(220, 0.05, { endFreq: 196, type: 'triangle', gain: 0.3 }),

  // Data Structures
  'public/audio/sfx/data-structures/push.wav': tone(220, 0.04, { endFreq: 440, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/pop.wav': tone(440, 0.04, { endFreq: 200, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/peek.wav': tone(880, 0.035, { type: 'sine', gain: 0.3 }),
  'public/audio/sfx/data-structures/underflow.wav': tone(130, 0.1, { endFreq: 90, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/enqueue.wav': tone(330, 0.04, { endFreq: 494, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/dequeue.wav': tone(494, 0.04, { endFreq: 330, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/front.wav': tone(740, 0.035, { type: 'sine', gain: 0.3 }),
  'public/audio/sfx/data-structures/empty.wav': tone(140, 0.09, { endFreq: 95, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/list_insert.wav': tone(415, 0.045, { endFreq: 554, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/list_delete.wav': tone(554, 0.045, { endFreq: 370, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/list_connect.wav': tone(800, 0.025, { endFreq: 950, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/list_traverse.wav': tone(520, 0.025, { type: 'sine', gain: 0.25 }),
  'public/audio/sfx/data-structures/heap_insert.wav': tone(330, 0.05, { endFreq: 520, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/data-structures/sift_up.wav': tone(350, 0.04, { endFreq: 550, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/sift_down.wav': tone(550, 0.04, { endFreq: 350, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/data-structures/heap_extract.wav': tone(260, 0.08, { endFreq: 520, type: 'sine', gain: 0.4 }),

  // Trees
  'public/audio/sfx/trees/insert.wav': tone(440, 0.06, { endFreq: 660, type: 'sine', gain: 0.35 }),
  'public/audio/sfx/trees/traverse.wav': tone(660, 0.03, { type: 'sine', gain: 0.25 }),
  'public/audio/sfx/trees/rotate.wav': tone(440, 0.07, { endFreq: 700, type: 'triangle', gain: 0.35 }),
  'public/audio/sfx/trees/balance.wav': chord([{ freq: 523, duration: 0.1 }, { freq: 659, duration: 0.1 }], 0.12, 0.4),

  // Searching
  'public/audio/sfx/searching/compare.wav': tone(1100, 0.02, { endFreq: 450, type: 'triangle', gain: 0.25 }),
  'public/audio/sfx/searching/found.wav': tone(1046.5, 0.18, { type: 'sine', gain: 0.45 }),
  'public/audio/sfx/searching/not_found.wav': chord([{ freq: 220, duration: 0.1 }, { freq: 207, duration: 0.1 }], 0.12, 0.35),

  // Dynamic Programming
  'public/audio/sfx/dynamic-programming/cell_update.wav': tone(480, 0.04, { type: 'sine', gain: 0.3 }),
  'public/audio/sfx/dynamic-programming/table_row.wav': tone(380, 0.05, { endFreq: 500, type: 'sine', gain: 0.3 }),
  'public/audio/sfx/dynamic-programming/optimum_found.wav': sequence([
    { freq: 587, start: 0, duration: 0.1, gain: 0.35 },
    { freq: 740, start: 0.06, duration: 0.12, gain: 0.38 },
    { freq: 880, start: 0.12, duration: 0.2, gain: 0.45 }
  ], 0.35),

  // Strings
  'public/audio/sfx/strings/match.wav': tone(880, 0.025, { type: 'triangle', gain: 0.3 }),
  'public/audio/sfx/strings/mismatch.wav': tone(240, 0.03, { type: 'sine', gain: 0.25 }),
  'public/audio/sfx/strings/pattern_found.wav': sequence([
    { freq: 659, start: 0, duration: 0.1, gain: 0.35 },
    { freq: 880, start: 0.055, duration: 0.12, gain: 0.38 },
    { freq: 1174, start: 0.11, duration: 0.2, gain: 0.42 }
  ], 0.33),

  // Backtracking
  'public/audio/sfx/backtracking/branch.wav': tone(400, 0.04, { endFreq: 600, type: 'sine', gain: 0.3 }),
  'public/audio/sfx/backtracking/dead_end.wav': tone(200, 0.05, { endFreq: 140, type: 'triangle', gain: 0.25 }),
  'public/audio/sfx/backtracking/solution_found.wav': sequence([
    { freq: 523, start: 0, duration: 0.1, gain: 0.35 },
    { freq: 659, start: 0.05, duration: 0.1, gain: 0.35 },
    { freq: 784, start: 0.1, duration: 0.12, gain: 0.38 },
    { freq: 1046, start: 0.15, duration: 0.2, gain: 0.45 }
  ], 0.38),

  // Completion
  'public/audio/sfx/completion/complete.wav': chord([
    { freq: 523.25, start: 0, duration: 0.2 },
    { freq: 659.25, start: 0.06, duration: 0.22 },
    { freq: 783.99, start: 0.12, duration: 0.25 },
    { freq: 1046.50, start: 0.18, duration: 0.32 }
  ], 0.52, 0.5)
};

console.log('Generating audio assets in public/audio/sfx/ ...');
let count = 0;
for (const [relPath, samples] of Object.entries(soundAssets)) {
  const fullPath = path.resolve(relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const buffer = createWavBuffer(samples);
  fs.writeFileSync(fullPath, buffer);
  count++;
}

console.log(`Successfully generated ${count} original audio assets!`);
