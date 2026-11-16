/**
 * AlgoMania Audio Preferences
 * SSR-safe persistent storage manager for user audio settings.
 */

import { AudioConfig } from './audioConfig.js';

const STORAGE_KEY = 'algomania_audio_preferences';

class AudioPreferencesManager {
  constructor() {
    this.memoryState = { ...AudioConfig.defaults };
  }

  isClient() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  clamp(val, min = 0, max = 1) {
    const num = Number(val);
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  }

  getPreferences() {
    if (!this.isClient()) {
      return { ...this.memoryState };
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : AudioConfig.defaults.soundEnabled,
          masterVolume: this.clamp(parsed.masterVolume ?? AudioConfig.defaults.masterVolume),
          algorithmVolume: this.clamp(parsed.algorithmVolume ?? AudioConfig.defaults.algorithmVolume),
          uiVolume: this.clamp(parsed.uiVolume ?? AudioConfig.defaults.uiVolume),
          reducedSoundMode: typeof parsed.reducedSoundMode === 'boolean' ? parsed.reducedSoundMode : AudioConfig.defaults.reducedSoundMode
        };
      }
    } catch (e) {
      // Storage unavailable or quota exceeded; use fallback
    }

    return { ...this.memoryState };
  }

  savePreferences(prefs) {
    const updated = {
      ...this.getPreferences(),
      ...prefs
    };

    // Ensure values are clamped
    if (typeof updated.masterVolume !== 'undefined') {
      updated.masterVolume = this.clamp(updated.masterVolume);
    }
    if (typeof updated.algorithmVolume !== 'undefined') {
      updated.algorithmVolume = this.clamp(updated.algorithmVolume);
    }
    if (typeof updated.uiVolume !== 'undefined') {
      updated.uiVolume = this.clamp(updated.uiVolume);
    }

    this.memoryState = { ...updated };

    if (this.isClient()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // Fallback silently
      }
    }

    return updated;
  }
}

export const AudioPreferences = new AudioPreferencesManager();
export default AudioPreferences;
