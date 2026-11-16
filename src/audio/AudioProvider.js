/**
 * AlgoMania Audio Provider
 * React Context provider exposing reactive audio preferences, controls,
 * and dispatchers with full SSR safety and auto-unlock listeners.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { audioManager } from './AudioManager.js';
import { dispatchAudio } from './AudioEventDispatcher.js';
import { AudioEventTypes } from './AudioEventTypes.js';

export const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [prefs, setPrefs] = useState(() => audioManager.getPreferences());

  useEffect(() => {
    // Sync React state with AudioManager updates
    const unsubscribe = audioManager.subscribe((newPrefs) => {
      setPrefs({ ...newPrefs });
    });

    // Auto-unlock Web Audio on first meaningful user interaction
    const handleFirstInteraction = () => {
      audioManager.unlock();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const next = !prefs.soundEnabled;
    audioManager.setSoundEnabled(next);
    if (next) {
      audioManager.preview(AudioEventTypes.UI_TOGGLE);
    }
  }, [prefs.soundEnabled]);

  const setMasterVolume = useCallback((val) => {
    audioManager.setMasterVolume(val);
  }, []);

  const setAlgorithmVolume = useCallback((val) => {
    audioManager.setAlgorithmVolume(val);
  }, []);

  const setUiVolume = useCallback((val) => {
    audioManager.setUiVolume(val);
  }, []);

  const setReducedSoundMode = useCallback((val) => {
    audioManager.setReducedSoundMode(val);
  }, []);

  const previewSound = useCallback((eventType = AudioEventTypes.UI_PREVIEW) => {
    audioManager.preview(eventType);
  }, []);

  const value = useMemo(() => ({
    soundEnabled: prefs.soundEnabled,
    masterVolume: prefs.masterVolume,
    algorithmVolume: prefs.algorithmVolume,
    uiVolume: prefs.uiVolume,
    reducedSoundMode: prefs.reducedSoundMode,
    toggleSound,
    setMasterVolume,
    setAlgorithmVolume,
    setUiVolume,
    setReducedSoundMode,
    previewSound,
    dispatchAudio,
    AudioEventTypes
  }), [
    prefs.soundEnabled,
    prefs.masterVolume,
    prefs.algorithmVolume,
    prefs.uiVolume,
    prefs.reducedSoundMode,
    toggleSound,
    setMasterVolume,
    setAlgorithmVolume,
    setUiVolume,
    setReducedSoundMode,
    previewSound
  ]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    // SSR or outside provider fallback with safe no-op defaults
    return {
      soundEnabled: false,
      masterVolume: 0.25,
      algorithmVolume: 0.3,
      uiVolume: 0.2,
      reducedSoundMode: false,
      toggleSound: () => {},
      setMasterVolume: () => {},
      setAlgorithmVolume: () => {},
      setUiVolume: () => {},
      setReducedSoundMode: () => {},
      previewSound: () => {},
      dispatchAudio,
      AudioEventTypes
    };
  }
  return context;
}

export default AudioProvider;
