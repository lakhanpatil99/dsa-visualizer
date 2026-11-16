/**
 * AlgoMania Central Audio Manager
 * Singleton audio coordinator orchestrating Howler.js asset playback,
 * native Web Audio procedural synthesis fallback, volume management,
 * throttle cooldowns, voice concurrency, and user preferences.
 */

import { Howl } from 'howler';
import { AudioEventTypes } from './AudioEventTypes.js';
import { AudioCategories, AudioConfig } from './audioConfig.js';
import { AudioRegistry } from './AudioRegistry.js';
import { AudioPreferences } from './AudioPreferences.js';
import { synthesizer } from './WebAudioSynthesizer.js';

class AudioManager {
  constructor() {
    this.prefs = AudioPreferences.getPreferences();
    this.howlCache = new Map();
    this.lastPlayedTimestamps = new Map();
    this.activeVoiceCount = 0;
    this.listeners = new Set();
    this.isUnlocked = false;
  }

  isClient() {
    return typeof window !== 'undefined';
  }

  // Unlock browser audio context on user interaction
  unlock() {
    if (!this.isClient() || this.isUnlocked) return;
    this.isUnlocked = true;
    try {
      synthesizer.unlock();
    } catch (e) {
      // Suppress unlock errors
    }
  }

  // Subscribe to preference changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn({ ...this.prefs });
      } catch (e) {}
    });
  }

  getPreferences() {
    return { ...this.prefs };
  }

  setSoundEnabled(enabled) {
    this.prefs = AudioPreferences.savePreferences({ soundEnabled: !!enabled });
    this.notify();
  }

  setMasterVolume(val) {
    this.prefs = AudioPreferences.savePreferences({ masterVolume: val });
    this.notify();
  }

  setAlgorithmVolume(val) {
    this.prefs = AudioPreferences.savePreferences({ algorithmVolume: val });
    this.notify();
  }

  setUiVolume(val) {
    this.prefs = AudioPreferences.savePreferences({ uiVolume: val });
    this.notify();
  }

  setReducedSoundMode(enabled) {
    this.prefs = AudioPreferences.savePreferences({ reducedSoundMode: !!enabled });
    this.notify();
  }

  getEffectiveVolume(category = AudioCategories.ALGORITHM, multiplier = 1.0) {
    if (!this.prefs.soundEnabled) return 0;
    const catVol = category === AudioCategories.UI ? this.prefs.uiVolume : this.prefs.algorithmVolume;
    const eff = this.prefs.masterVolume * catVol * multiplier;
    return Math.min(Math.max(eff, 0), 1);
  }

  // Check throttle cooldown
  shouldThrottle(eventType) {
    const now = Date.now();
    const lastPlayed = this.lastPlayedTimestamps.get(eventType) || 0;
    const cooldown = AudioConfig.cooldowns[eventType] || AudioConfig.cooldowns.default || 40;

    if (now - lastPlayed < cooldown) {
      return true;
    }

    this.lastPlayedTimestamps.set(eventType, now);
    return false;
  }

  // Core Playback Engine
  play(eventType, options = {}) {
    if (!this.isClient()) return;

    try {
      if (!this.prefs.soundEnabled) return;

      // Handle reduced sound mode filtering
      if (this.prefs.reducedSoundMode && AudioConfig.reducedSoundFilteredEvents.has(eventType)) {
        return;
      }

      // Check throttling
      if (!options.force && this.shouldThrottle(eventType)) {
        return;
      }

      const meta = AudioRegistry[eventType];
      if (!meta) {
        // Unknown event type, safely ignore
        return;
      }

      const effectiveVolume = this.getEffectiveVolume(meta.category, options.gain || 1.0);
      if (effectiveVolume <= 0.001) return;

      // Concurrency check
      if (this.activeVoiceCount >= AudioConfig.maxConcurrentVoices && !options.priority) {
        return;
      }

      this.unlock();

      // Pitch calculation
      const pitch = options.pitch || (options.valueRatio ? 0.7 + options.valueRatio * 0.9 : 1.0);

      // Attempt synthesized procedural playback or Howler playback
      // Procedural synthesizer offers zero-latency, sample-accurate playback
      if (synthesizer && typeof synthesizer[meta.synthMethod] === 'function') {
        this.activeVoiceCount++;
        synthesizer[meta.synthMethod](effectiveVolume, pitch);
        setTimeout(() => {
          this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
        }, 120);
        return;
      }

      // Howler asset playback fallback
      this.playHowl(meta.assetPath, effectiveVolume, pitch);
    } catch (e) {
      // Audio engine must NEVER crash application or algorithm execution
    }
  }

  playHowl(assetPath, volume, pitch = 1.0) {
    try {
      let sound = this.howlCache.get(assetPath);
      if (!sound) {
        sound = new Howl({
          src: [assetPath],
          html5: false,
          preload: true
        });
        this.howlCache.set(assetPath, sound);
      }

      sound.volume(volume);
      sound.rate(Math.min(Math.max(pitch, AudioConfig.pitch.min), AudioConfig.pitch.max));
      this.activeVoiceCount++;
      const soundId = sound.play();

      sound.once('end', () => {
        this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
      }, soundId);
      sound.once('loaderror', () => {
        this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
      }, soundId);
    } catch (e) {
      this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
    }
  }

  // Sound Preview
  preview(eventType = AudioEventTypes.UI_PREVIEW) {
    this.unlock();
    this.play(eventType, { force: true, priority: true });
  }

  // Stop all active audio
  stopAll() {
    try {
      this.howlCache.forEach((sound) => {
        try {
          sound.stop();
        } catch (e) {}
      });
      this.activeVoiceCount = 0;
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();
export default audioManager;
