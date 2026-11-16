/**
 * AlgoMania Audio Event Types
 * Strictly defined event identifiers for platform-wide algorithm and UI audio.
 */

export const AudioEventTypes = {
  // UI Operations
  UI_CLICK: 'ui.click',
  UI_TOGGLE: 'ui.toggle',
  UI_SUCCESS: 'ui.success',
  UI_PREVIEW: 'ui.preview',

  // Sorting Operations
  SORT_COMPARE: 'sorting.compare',
  SORT_SWAP: 'sorting.swap',
  SORT_PIVOT: 'sorting.pivot',
  SORT_MERGE: 'sorting.merge',
  SORT_WRITE: 'sorting.write',
  SORT_COMPLETE: 'sorting.complete',

  // Graph Operations
  GRAPH_DISCOVER: 'graph.discover',
  GRAPH_VISIT: 'graph.visit',
  GRAPH_RELAX: 'graph.relax',
  GRAPH_PATH_FOUND: 'graph.pathFound',
  GRAPH_CYCLE: 'graph.cycle',
  GRAPH_BACKTRACK: 'graph.backtrack',
  GRAPH_MST_EDGE: 'graph.mstEdge',
  GRAPH_MST_REJECT: 'graph.mstReject',

  // Data Structures - Stack
  STACK_PUSH: 'stack.push',
  STACK_POP: 'stack.pop',
  STACK_PEEK: 'stack.peek',
  STACK_UNDERFLOW: 'stack.underflow',

  // Data Structures - Queue
  QUEUE_ENQUEUE: 'queue.enqueue',
  QUEUE_DEQUEUE: 'queue.dequeue',
  QUEUE_FRONT: 'queue.front',
  QUEUE_EMPTY: 'queue.empty',

  // Data Structures - Linked List
  LINKED_LIST_INSERT: 'linkedList.insert',
  LINKED_LIST_DELETE: 'linkedList.delete',
  LINKED_LIST_CONNECT: 'linkedList.connect',
  LINKED_LIST_TRAVERSE: 'linkedList.traverse',

  // Data Structures - Heap & Priority Queue
  HEAP_INSERT: 'heap.insert',
  HEAP_SIFT_UP: 'heap.siftUp',
  HEAP_SIFT_DOWN: 'heap.siftDown',
  HEAP_EXTRACT: 'heap.extract',
  HEAP_SWAP: 'heap.swap',

  // Data Structures - Hash Table
  HASH_INSERT: 'hashTable.insert',
  HASH_LOOKUP: 'hashTable.lookup',
  HASH_COLLISION: 'hashTable.collision',

  // Trees & BST / AVL / Red-Black
  TREE_INSERT: 'tree.insert',
  TREE_TRAVERSE: 'tree.traverse',
  TREE_ROTATE: 'tree.rotate',
  TREE_BALANCE: 'tree.balance',

  // Searching Algorithms
  SEARCH_COMPARE: 'search.compare',
  SEARCH_FOUND: 'search.found',
  SEARCH_NOT_FOUND: 'search.notFound',

  // Dynamic Programming
  DP_CELL_UPDATE: 'dp.cellUpdate',
  DP_TABLE_ROW: 'dp.tableRow',
  DP_OPTIMUM_FOUND: 'dp.optimumFound',

  // String Algorithms (KMP, Rabin-Karp, Z-Algorithm)
  STRING_MATCH: 'string.match',
  STRING_MISMATCH: 'string.mismatch',
  STRING_PATTERN_FOUND: 'string.patternFound',

  // Backtracking (N-Queens, Sudoku, Knight's Tour, Maze)
  BACKTRACK_BRANCH: 'backtrack.branch',
  BACKTRACK_DEAD_END: 'backtrack.deadEnd',
  BACKTRACK_SOLUTION: 'backtrack.solutionFound',

  // Universal Completion
  ALGO_COMPLETE: 'completion.success'
};

export default AudioEventTypes;
