/**
 * AlgoMania Audio Event Dispatcher
 * Decoupled event bus facilitating safe audio triggers from any algorithm,
 * data structure, or UI component across the entire application.
 */

import { audioManager } from './AudioManager.js';
import { AudioEventTypes } from './AudioEventTypes.js';

class AudioEventDispatcher {
  constructor() {
    this.listeners = new Set();
  }

  // Subscribe to raw dispatched audio events (for telemetry, visualizers, or custom observers)
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Primary dispatch method
  dispatch(eventType, options = {}) {
    if (!eventType) return;

    try {
      // 1. Notify raw subscribers
      this.listeners.forEach((listener) => {
        try {
          listener(eventType, options);
        } catch (e) {}
      });

      // 2. Route directly to AudioManager
      audioManager.play(eventType, options);
    } catch (e) {
      // Never allow dispatch failure to interrupt algorithm runtime
    }
  }

  // Helper shortcuts for high-frequency operations
  compare(options = {}) {
    this.dispatch(AudioEventTypes.SORT_COMPARE, options);
  }

  swap(options = {}) {
    this.dispatch(AudioEventTypes.SORT_SWAP, options);
  }

  complete(options = {}) {
    this.dispatch(AudioEventTypes.SORT_COMPLETE, { ...options, priority: true, force: true });
  }

  visit(options = {}) {
    this.dispatch(AudioEventTypes.GRAPH_VISIT, options);
  }

  relax(options = {}) {
    this.dispatch(AudioEventTypes.GRAPH_RELAX, options);
  }

  pathFound(options = {}) {
    this.dispatch(AudioEventTypes.GRAPH_PATH_FOUND, { ...options, priority: true, force: true });
  }
}

export const audioDispatcher = new AudioEventDispatcher();
export const dispatchAudio = (eventType, options) => audioDispatcher.dispatch(eventType, options);
export default audioDispatcher;
