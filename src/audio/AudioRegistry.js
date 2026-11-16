/**
 * AlgoMania Audio Registry
 * Maps each AudioEventType to sound asset paths, audio categories,
 * synthesis fallback methods, and metadata.
 */

import { AudioEventTypes } from './AudioEventTypes.js';
import { AudioCategories } from './audioConfig.js';

export const AudioRegistry = {
  // UI
  [AudioEventTypes.UI_CLICK]: {
    id: AudioEventTypes.UI_CLICK,
    category: AudioCategories.UI,
    assetPath: '/audio/sfx/ui/click.wav',
    synthMethod: 'uiClick',
    label: 'UI Click'
  },
  [AudioEventTypes.UI_TOGGLE]: {
    id: AudioEventTypes.UI_TOGGLE,
    category: AudioCategories.UI,
    assetPath: '/audio/sfx/ui/toggle.wav',
    synthMethod: 'uiToggle',
    label: 'UI Toggle'
  },
  [AudioEventTypes.UI_SUCCESS]: {
    id: AudioEventTypes.UI_SUCCESS,
    category: AudioCategories.UI,
    assetPath: '/audio/sfx/ui/success.wav',
    synthMethod: 'complete',
    label: 'Action Success'
  },
  [AudioEventTypes.UI_PREVIEW]: {
    id: AudioEventTypes.UI_PREVIEW,
    category: AudioCategories.UI,
    assetPath: '/audio/sfx/ui/preview.wav',
    synthMethod: 'preview',
    label: 'Audio Preview'
  },

  // Sorting
  [AudioEventTypes.SORT_COMPARE]: {
    id: AudioEventTypes.SORT_COMPARE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/compare.wav',
    synthMethod: 'click',
    label: 'Sorting Compare'
  },
  [AudioEventTypes.SORT_SWAP]: {
    id: AudioEventTypes.SORT_SWAP,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/swap.wav',
    synthMethod: 'swap',
    label: 'Sorting Swap'
  },
  [AudioEventTypes.SORT_PIVOT]: {
    id: AudioEventTypes.SORT_PIVOT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/pivot.wav',
    synthMethod: 'pivot',
    label: 'Pivot Selection'
  },
  [AudioEventTypes.SORT_MERGE]: {
    id: AudioEventTypes.SORT_MERGE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/merge.wav',
    synthMethod: 'merge',
    label: 'Array Merge'
  },
  [AudioEventTypes.SORT_WRITE]: {
    id: AudioEventTypes.SORT_WRITE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/write.wav',
    synthMethod: 'write',
    label: 'Memory Write'
  },
  [AudioEventTypes.SORT_COMPLETE]: {
    id: AudioEventTypes.SORT_COMPLETE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/complete.wav',
    synthMethod: 'complete',
    label: 'Sorting Complete'
  },

  // Graphs
  [AudioEventTypes.GRAPH_DISCOVER]: {
    id: AudioEventTypes.GRAPH_DISCOVER,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/discover.wav',
    synthMethod: 'discover',
    label: 'Node Discovered'
  },
  [AudioEventTypes.GRAPH_VISIT]: {
    id: AudioEventTypes.GRAPH_VISIT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/visit.wav',
    synthMethod: 'visit',
    label: 'Node Visited'
  },
  [AudioEventTypes.GRAPH_RELAX]: {
    id: AudioEventTypes.GRAPH_RELAX,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/relax.wav',
    synthMethod: 'relax',
    label: 'Edge Relaxed'
  },
  [AudioEventTypes.GRAPH_PATH_FOUND]: {
    id: AudioEventTypes.GRAPH_PATH_FOUND,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/path_found.wav',
    synthMethod: 'pathFound',
    label: 'Path Found'
  },
  [AudioEventTypes.GRAPH_CYCLE]: {
    id: AudioEventTypes.GRAPH_CYCLE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/cycle.wav',
    synthMethod: 'cycle',
    label: 'Cycle Detected'
  },
  [AudioEventTypes.GRAPH_BACKTRACK]: {
    id: AudioEventTypes.GRAPH_BACKTRACK,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/backtrack.wav',
    synthMethod: 'backtrack',
    label: 'Graph Backtrack'
  },
  [AudioEventTypes.GRAPH_MST_EDGE]: {
    id: AudioEventTypes.GRAPH_MST_EDGE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/mst_edge.wav',
    synthMethod: 'mstEdge',
    label: 'MST Edge Accepted'
  },
  [AudioEventTypes.GRAPH_MST_REJECT]: {
    id: AudioEventTypes.GRAPH_MST_REJECT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/mst_reject.wav',
    synthMethod: 'mstReject',
    label: 'MST Edge Rejected'
  },

  // Stacks
  [AudioEventTypes.STACK_PUSH]: {
    id: AudioEventTypes.STACK_PUSH,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/push.wav',
    synthMethod: 'push',
    label: 'Stack Push'
  },
  [AudioEventTypes.STACK_POP]: {
    id: AudioEventTypes.STACK_POP,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/pop.wav',
    synthMethod: 'pop',
    label: 'Stack Pop'
  },
  [AudioEventTypes.STACK_PEEK]: {
    id: AudioEventTypes.STACK_PEEK,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/peek.wav',
    synthMethod: 'peek',
    label: 'Stack Peek'
  },
  [AudioEventTypes.STACK_UNDERFLOW]: {
    id: AudioEventTypes.STACK_UNDERFLOW,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/underflow.wav',
    synthMethod: 'underflow',
    label: 'Stack Underflow'
  },

  // Queues
  [AudioEventTypes.QUEUE_ENQUEUE]: {
    id: AudioEventTypes.QUEUE_ENQUEUE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/enqueue.wav',
    synthMethod: 'enqueue',
    label: 'Queue Enqueue'
  },
  [AudioEventTypes.QUEUE_DEQUEUE]: {
    id: AudioEventTypes.QUEUE_DEQUEUE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/dequeue.wav',
    synthMethod: 'dequeue',
    label: 'Queue Dequeue'
  },
  [AudioEventTypes.QUEUE_FRONT]: {
    id: AudioEventTypes.QUEUE_FRONT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/front.wav',
    synthMethod: 'front',
    label: 'Queue Front'
  },
  [AudioEventTypes.QUEUE_EMPTY]: {
    id: AudioEventTypes.QUEUE_EMPTY,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/empty.wav',
    synthMethod: 'underflow',
    label: 'Queue Empty'
  },

  // Linked Lists
  [AudioEventTypes.LINKED_LIST_INSERT]: {
    id: AudioEventTypes.LINKED_LIST_INSERT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/list_insert.wav',
    synthMethod: 'listInsert',
    label: 'List Insert'
  },
  [AudioEventTypes.LINKED_LIST_DELETE]: {
    id: AudioEventTypes.LINKED_LIST_DELETE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/list_delete.wav',
    synthMethod: 'listDelete',
    label: 'List Delete'
  },
  [AudioEventTypes.LINKED_LIST_CONNECT]: {
    id: AudioEventTypes.LINKED_LIST_CONNECT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/list_connect.wav',
    synthMethod: 'listConnect',
    label: 'List Pointer Connect'
  },
  [AudioEventTypes.LINKED_LIST_TRAVERSE]: {
    id: AudioEventTypes.LINKED_LIST_TRAVERSE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/list_traverse.wav',
    synthMethod: 'listTraverse',
    label: 'List Traverse'
  },

  // Heaps
  [AudioEventTypes.HEAP_INSERT]: {
    id: AudioEventTypes.HEAP_INSERT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/heap_insert.wav',
    synthMethod: 'heapInsert',
    label: 'Heap Insert'
  },
  [AudioEventTypes.HEAP_SIFT_UP]: {
    id: AudioEventTypes.HEAP_SIFT_UP,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/sift_up.wav',
    synthMethod: 'siftUp',
    label: 'Heap Sift Up'
  },
  [AudioEventTypes.HEAP_SIFT_DOWN]: {
    id: AudioEventTypes.HEAP_SIFT_DOWN,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/sift_down.wav',
    synthMethod: 'siftDown',
    label: 'Heap Sift Down'
  },
  [AudioEventTypes.HEAP_EXTRACT]: {
    id: AudioEventTypes.HEAP_EXTRACT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/heap_extract.wav',
    synthMethod: 'heapExtract',
    label: 'Heap Extract Min'
  },
  [AudioEventTypes.HEAP_SWAP]: {
    id: AudioEventTypes.HEAP_SWAP,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/sorting/swap.wav',
    synthMethod: 'swap',
    label: 'Heap Swap'
  },

  // Hash Table
  [AudioEventTypes.HASH_INSERT]: {
    id: AudioEventTypes.HASH_INSERT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/push.wav',
    synthMethod: 'push',
    label: 'Hash Insert'
  },
  [AudioEventTypes.HASH_LOOKUP]: {
    id: AudioEventTypes.HASH_LOOKUP,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/data-structures/peek.wav',
    synthMethod: 'peek',
    label: 'Hash Lookup'
  },
  [AudioEventTypes.HASH_COLLISION]: {
    id: AudioEventTypes.HASH_COLLISION,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/graphs/cycle.wav',
    synthMethod: 'cycle',
    label: 'Hash Collision'
  },

  // Trees
  [AudioEventTypes.TREE_INSERT]: {
    id: AudioEventTypes.TREE_INSERT,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/trees/insert.wav',
    synthMethod: 'treeInsert',
    label: 'Tree Insert'
  },
  [AudioEventTypes.TREE_TRAVERSE]: {
    id: AudioEventTypes.TREE_TRAVERSE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/trees/traverse.wav',
    synthMethod: 'treeTraverse',
    label: 'Tree Traverse'
  },
  [AudioEventTypes.TREE_ROTATE]: {
    id: AudioEventTypes.TREE_ROTATE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/trees/rotate.wav',
    synthMethod: 'treeRotate',
    label: 'Tree Rotate'
  },
  [AudioEventTypes.TREE_BALANCE]: {
    id: AudioEventTypes.TREE_BALANCE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/trees/balance.wav',
    synthMethod: 'treeBalance',
    label: 'Tree Balance'
  },

  // Searching
  [AudioEventTypes.SEARCH_COMPARE]: {
    id: AudioEventTypes.SEARCH_COMPARE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/searching/compare.wav',
    synthMethod: 'click',
    label: 'Search Compare'
  },
  [AudioEventTypes.SEARCH_FOUND]: {
    id: AudioEventTypes.SEARCH_FOUND,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/searching/found.wav',
    synthMethod: 'searchFound',
    label: 'Search Target Found'
  },
  [AudioEventTypes.SEARCH_NOT_FOUND]: {
    id: AudioEventTypes.SEARCH_NOT_FOUND,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/searching/not_found.wav',
    synthMethod: 'searchNotFound',
    label: 'Search Not Found'
  },

  // Dynamic Programming
  [AudioEventTypes.DP_CELL_UPDATE]: {
    id: AudioEventTypes.DP_CELL_UPDATE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/dynamic-programming/cell_update.wav',
    synthMethod: 'dpCell',
    label: 'DP Cell Computed'
  },
  [AudioEventTypes.DP_TABLE_ROW]: {
    id: AudioEventTypes.DP_TABLE_ROW,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/dynamic-programming/table_row.wav',
    synthMethod: 'visit',
    label: 'DP Row Processed'
  },
  [AudioEventTypes.DP_OPTIMUM_FOUND]: {
    id: AudioEventTypes.DP_OPTIMUM_FOUND,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/dynamic-programming/optimum_found.wav',
    synthMethod: 'dpOptimum',
    label: 'DP Optimum Solution'
  },

  // Strings
  [AudioEventTypes.STRING_MATCH]: {
    id: AudioEventTypes.STRING_MATCH,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/strings/match.wav',
    synthMethod: 'stringMatch',
    label: 'Character Match'
  },
  [AudioEventTypes.STRING_MISMATCH]: {
    id: AudioEventTypes.STRING_MISMATCH,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/strings/mismatch.wav',
    synthMethod: 'stringMismatch',
    label: 'Character Mismatch'
  },
  [AudioEventTypes.STRING_PATTERN_FOUND]: {
    id: AudioEventTypes.STRING_PATTERN_FOUND,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/strings/pattern_found.wav',
    synthMethod: 'stringFound',
    label: 'Pattern Occurrence Found'
  },

  // Backtracking
  [AudioEventTypes.BACKTRACK_BRANCH]: {
    id: AudioEventTypes.BACKTRACK_BRANCH,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/backtracking/branch.wav',
    synthMethod: 'backtrackBranch',
    label: 'Backtrack Branch'
  },
  [AudioEventTypes.BACKTRACK_DEAD_END]: {
    id: AudioEventTypes.BACKTRACK_DEAD_END,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/backtracking/dead_end.wav',
    synthMethod: 'backtrackDeadEnd',
    label: 'Dead End Encountered'
  },
  [AudioEventTypes.BACKTRACK_SOLUTION]: {
    id: AudioEventTypes.BACKTRACK_SOLUTION,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/backtracking/solution_found.wav',
    synthMethod: 'backtrackSolution',
    label: 'Solution Found'
  },

  // Universal Completion
  [AudioEventTypes.ALGO_COMPLETE]: {
    id: AudioEventTypes.ALGO_COMPLETE,
    category: AudioCategories.ALGORITHM,
    assetPath: '/audio/sfx/completion/complete.wav',
    synthMethod: 'complete',
    label: 'Algorithm Finished'
  }
};

export default AudioRegistry;
