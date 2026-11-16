/**
 * AlgoMania Audio Configuration
 * Centralized configurations for volumes, cooldowns, voice limits, and sound policies.
 */

import { AudioEventTypes } from './AudioEventTypes.js';

export const AudioCategories = {
  UI: 'ui',
  ALGORITHM: 'algorithm'
};

export const AudioConfig = {
  // Default audio volumes (conservative, comfortable, non-fatiguing)
  defaults: {
    soundEnabled: true,
    masterVolume: 0.25,      // 25% master volume
    algorithmVolume: 0.30,   // 30% relative algorithm volume
    uiVolume: 0.20,          // 20% relative UI volume
    reducedSoundMode: false  // Filters high-rate comparisons when true
  },

  // Maximum concurrent voices to avoid audio overload or distortion
  maxConcurrentVoices: 6,

  // Pitch constraints for dynamic frequency scaling
  pitch: {
    min: 0.5,
    max: 2.0,
    default: 1.0
  },

  // Throttle cooldown (minimum interval in ms between identical sound triggers)
  cooldowns: {
    [AudioEventTypes.SORT_COMPARE]: 24,
    [AudioEventTypes.SORT_SWAP]: 32,
    [AudioEventTypes.SORT_PIVOT]: 80,
    [AudioEventTypes.SORT_MERGE]: 45,
    [AudioEventTypes.SORT_WRITE]: 30,
    [AudioEventTypes.SORT_COMPLETE]: 300,

    [AudioEventTypes.GRAPH_DISCOVER]: 40,
    [AudioEventTypes.GRAPH_VISIT]: 50,
    [AudioEventTypes.GRAPH_RELAX]: 40,
    [AudioEventTypes.GRAPH_PATH_FOUND]: 300,
    [AudioEventTypes.GRAPH_CYCLE]: 200,
    [AudioEventTypes.GRAPH_BACKTRACK]: 60,
    [AudioEventTypes.GRAPH_MST_EDGE]: 80,
    [AudioEventTypes.GRAPH_MST_REJECT]: 80,

    [AudioEventTypes.STACK_PUSH]: 40,
    [AudioEventTypes.STACK_POP]: 40,
    [AudioEventTypes.STACK_PEEK]: 60,
    [AudioEventTypes.STACK_UNDERFLOW]: 150,

    [AudioEventTypes.QUEUE_ENQUEUE]: 40,
    [AudioEventTypes.QUEUE_DEQUEUE]: 40,
    [AudioEventTypes.QUEUE_FRONT]: 60,
    [AudioEventTypes.QUEUE_EMPTY]: 150,

    [AudioEventTypes.LINKED_LIST_INSERT]: 50,
    [AudioEventTypes.LINKED_LIST_DELETE]: 50,
    [AudioEventTypes.LINKED_LIST_CONNECT]: 40,
    [AudioEventTypes.LINKED_LIST_TRAVERSE]: 35,

    [AudioEventTypes.HEAP_INSERT]: 50,
    [AudioEventTypes.HEAP_SIFT_UP]: 35,
    [AudioEventTypes.HEAP_SIFT_DOWN]: 35,
    [AudioEventTypes.HEAP_EXTRACT]: 80,
    [AudioEventTypes.HEAP_SWAP]: 35,

    [AudioEventTypes.HASH_INSERT]: 50,
    [AudioEventTypes.HASH_LOOKUP]: 40,
    [AudioEventTypes.HASH_COLLISION]: 100,

    [AudioEventTypes.TREE_INSERT]: 50,
    [AudioEventTypes.TREE_TRAVERSE]: 40,
    [AudioEventTypes.TREE_ROTATE]: 70,
    [AudioEventTypes.TREE_BALANCE]: 80,

    [AudioEventTypes.SEARCH_COMPARE]: 25,
    [AudioEventTypes.SEARCH_FOUND]: 200,
    [AudioEventTypes.SEARCH_NOT_FOUND]: 150,

    [AudioEventTypes.DP_CELL_UPDATE]: 30,
    [AudioEventTypes.DP_TABLE_ROW]: 80,
    [AudioEventTypes.DP_OPTIMUM_FOUND]: 250,

    [AudioEventTypes.STRING_MATCH]: 28,
    [AudioEventTypes.STRING_MISMATCH]: 35,
    [AudioEventTypes.STRING_PATTERN_FOUND]: 250,

    [AudioEventTypes.BACKTRACK_BRANCH]: 40,
    [AudioEventTypes.BACKTRACK_DEAD_END]: 50,
    [AudioEventTypes.BACKTRACK_SOLUTION]: 250,

    [AudioEventTypes.UI_CLICK]: 60,
    [AudioEventTypes.UI_TOGGLE]: 80,
    [AudioEventTypes.UI_SUCCESS]: 150,
    [AudioEventTypes.UI_PREVIEW]: 100,

    [AudioEventTypes.ALGO_COMPLETE]: 300,
    default: 40
  },

  // Events suppressed during Reduced Sound Mode (high-speed visualizer mode)
  reducedSoundFilteredEvents: new Set([
    AudioEventTypes.SORT_COMPARE,
    AudioEventTypes.SEARCH_COMPARE,
    AudioEventTypes.LINKED_LIST_TRAVERSE,
    AudioEventTypes.STRING_MISMATCH
  ])
};

export default AudioConfig;
