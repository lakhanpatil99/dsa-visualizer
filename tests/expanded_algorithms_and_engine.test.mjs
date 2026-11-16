import { test } from 'node:test';
import assert from 'node:assert/strict';

import { bubbleSort } from '../src/algorithms/sorting/bubbleSort.js';
import { selectionSort } from '../src/algorithms/sorting/selectionSort.js';
import { insertionSort } from '../src/algorithms/sorting/insertionSort.js';
import { heapSort } from '../src/algorithms/sorting/heapSort.js';
import { countingSort } from '../src/algorithms/sorting/countingSort.js';
import { radixSort } from '../src/algorithms/sorting/radixSort.js';
import { shellSort } from '../src/algorithms/sorting/shellSort.js';

import { SearchingAlgorithms } from '../src/algorithms/searching/searching.js';
import { MinHeap } from '../src/algorithms/graphs/MinHeap.js';
import { WeightedGraph } from '../src/algorithms/graphs/dijkstra.js';
import { aStarSearch } from '../src/algorithms/graphs/astar.js';
import { bellmanFord } from '../src/algorithms/graphs/bellmanFord.js';
import { kruskalMST } from '../src/algorithms/graphs/kruskal.js';
import { topologicalSortKahn } from '../src/algorithms/graphs/topologicalSort.js';

import { solve01Knapsack } from '../src/algorithms/dynamicProgramming/knapsack.js';
import { solveCoinChange } from '../src/algorithms/dynamicProgramming/coinChange.js';
import { solveLCS } from '../src/algorithms/dynamicProgramming/lcs.js';
import { kmpSearch, computePiTable } from '../src/algorithms/strings/kmp.js';
import { solveNQueens } from '../src/algorithms/backtracking/nQueens.js';

import { ExecutionEngine } from '../src/engine/ExecutionEngine.js';
import { TraceBuilder } from '../src/engine/TraceBuilder.js';

test('Sorting: Bubble Sort terminates early on sorted input', async () => {
  const sortedInput = [1, 2, 3, 4, 5];
  let stepCount = 0;
  const result = await bubbleSort(sortedInput, (_arr, _i, _j, _p, step) => {
    stepCount = step;
  }, 0);

  assert.deepEqual(result, [1, 2, 3, 4, 5]);
  // For 5 elements, full n(n-1)/2 is 10 steps. With early exit on sorted array, only 1 outer loop runs (4 comparisons).
  assert.ok(stepCount <= 5, `Expected <= 5 steps due to early exit, got ${stepCount}`);
});

test('Sorting: Selection, Insertion, Heap, Counting, Radix, Shell correctly sort arbitrary array', async () => {
  const input = [64, 25, 12, 22, 11, 90, 42];
  const expected = [11, 12, 22, 25, 42, 64, 90];

  assert.deepEqual(await selectionSort([...input], null, 0), expected);
  assert.deepEqual(await insertionSort([...input], null, 0), expected);
  assert.deepEqual(await heapSort([...input], null, 0), expected);
  assert.deepEqual(await countingSort([...input], null, 0), expected);
  assert.deepEqual(await radixSort([...input], null, 0), expected);
  assert.deepEqual(await shellSort([...input], null, 0), expected);
});

test('Searching: Linear Search preserves unsorted order and finds element', () => {
  const searcher = new SearchingAlgorithms();
  const unsorted = [50, 10, 40, 20, 30];
  searcher.setArray(unsorted, false); // preserve raw order

  assert.deepEqual(searcher.array, [50, 10, 40, 20, 30], 'Raw unsorted order must be preserved');
  const history = searcher.linearSearch(40);
  assert.ok(history.length > 0);
  assert.equal(history[history.length - 1].found, true);
  assert.equal(history[history.length - 1].currentIndex, 2);
});

test('Searching: Binary, Jump, and Interpolation searches correctly locate target in sorted array', () => {
  const searcher = new SearchingAlgorithms();
  const sorted = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  searcher.setArray(sorted, false);

  const binHistory = searcher.binarySearch(70);
  assert.equal(binHistory[binHistory.length - 1].found, true);
  assert.equal(binHistory[binHistory.length - 1].mid, 6);

  const jumpHistory = searcher.jumpSearch(70);
  assert.equal(jumpHistory[jumpHistory.length - 1].found, true);
  assert.equal(jumpHistory[jumpHistory.length - 1].currentIndex, 6);

  const interpHistory = searcher.interpolationSearch(70);
  assert.equal(interpHistory[interpHistory.length - 1].found, true);
  assert.equal(interpHistory[interpHistory.length - 1].currentIndex, 6);
});

test('MinHeap: Binary Min-Heap maintains min-priority invariant', () => {
  const heap = new MinHeap();
  heap.insert('C', 30);
  heap.insert('A', 10);
  heap.insert('D', 40);
  heap.insert('B', 20);

  assert.equal(heap.size, 4);
  assert.equal(heap.peek().val, 'A');

  assert.equal(heap.extractMin().val, 'A');
  assert.equal(heap.extractMin().val, 'B');
  assert.equal(heap.extractMin().val, 'C');
  assert.equal(heap.extractMin().val, 'D');
  assert.equal(heap.isEmpty(), true);
});

test('Graphs: Dijkstra with MinHeap correctly finds shortest path and rejects negative weights', () => {
  const graph = new WeightedGraph();
  graph.addEdge('A', 'B', 4);
  graph.addEdge('A', 'C', 2);
  graph.addEdge('C', 'B', 1);
  graph.addEdge('B', 'D', 5);
  graph.addEdge('C', 'D', 8);

  const result = graph.dijkstra('A', 'D');
  assert.deepEqual(result.path, ['A', 'C', 'B', 'D']);
  assert.equal(result.distance, 8);

  // Negative weight rejection
  assert.throws(() => {
    graph.addEdge('D', 'E', -3);
  }, /negative/i);
});

test('Graphs: A*, Bellman-Ford, Kruskal MST, and Topological Sort', () => {
  // A*
  const nodes = [
    { id: 'S', x: 0, y: 0 },
    { id: 'A', x: 2, y: 1 },
    { id: 'B', x: 2, y: -1 },
    { id: 'G', x: 5, y: 0 }
  ];
  const edges = [
    { u: 'S', v: 'A', weight: 3 },
    { u: 'S', v: 'B', weight: 2 },
    { u: 'A', v: 'G', weight: 4 },
    { u: 'B', v: 'G', weight: 5 }
  ];
  const aStarRes = aStarSearch(nodes, edges, 'S', 'G');
  assert.deepEqual(aStarRes.path, ['S', 'B', 'G']);
  assert.equal(aStarRes.distance, 7);

  // Bellman-Ford
  const bfEdges = [
    { u: 'A', v: 'B', weight: -1 },
    { u: 'A', v: 'C', weight: 4 },
    { u: 'B', v: 'C', weight: 3 },
    { u: 'B', v: 'D', weight: 2 },
    { u: 'D', v: 'C', weight: 5 }
  ];
  const bfRes = bellmanFord(['A', 'B', 'C', 'D'], bfEdges, 'A');
  assert.equal(bfRes.distances['C'], 2);
  assert.equal(bfRes.hasNegativeCycle, false);

  // Kruskal MST
  const kVertices = ['A', 'B', 'C', 'D'];
  const kEdges = [
    { u: 'A', v: 'B', weight: 1 },
    { u: 'B', v: 'C', weight: 4 },
    { u: 'A', v: 'C', weight: 3 },
    { u: 'C', v: 'D', weight: 2 }
  ];
  const kRes = kruskalMST(kVertices, kEdges);
  assert.equal(kRes.totalCost, 6);
  assert.equal(kRes.mst.length, 3);

  // Topological Sort
  const topoEdges = [
    { u: '5', v: '2' },
    { u: '5', v: '0' },
    { u: '4', v: '0' },
    { u: '4', v: '1' },
    { u: '2', v: '3' },
    { u: '3', v: '1' }
  ];
  const topoRes = topologicalSortKahn(['0', '1', '2', '3', '4', '5'], topoEdges);
  assert.equal(topoRes.hasCycle, false);
  assert.equal(topoRes.order.length, 6);
  assert.ok(topoRes.order.indexOf('5') < topoRes.order.indexOf('2'));
});

test('Dynamic Programming: 0/1 Knapsack, Coin Change, and LCS', () => {
  // Knapsack
  const items = [
    { name: 'A', weight: 2, value: 3 },
    { name: 'B', weight: 3, value: 4 },
    { name: 'C', weight: 4, value: 5 },
    { name: 'D', weight: 5, value: 8 }
  ];
  const knap = solve01Knapsack(items, 5);
  assert.equal(knap.maxValue, 8); // Item D alone or A+B (7) -> D is 8

  // Coin Change
  const coins = [1, 2, 5];
  const change = solveCoinChange(coins, 11);
  assert.equal(change.minCoins, 3); // 5 + 5 + 1

  // LCS
  const lcs = solveLCS('ABCDE', 'ACE');
  assert.equal(lcs.length, 3);
  assert.equal(lcs.sequence, 'ACE');
});

test('Strings & Backtracking: KMP and N-Queens', () => {
  // KMP
  const pi = computePiTable('ABABCABAB');
  assert.deepEqual(pi, [0, 0, 1, 2, 0, 1, 2, 3, 4]);

  const kmp = kmpSearch('ABABDABACDABABCABAB', 'ABABCABAB');
  assert.deepEqual(kmp.matches, [10]);

  // N-Queens
  const nq4 = solveNQueens(4);
  assert.equal(nq4.totalSolutions, 2);
});

test('ExecutionEngine: Bidirectional step, speed, and timeline navigation', () => {
  const tb = new TraceBuilder();
  tb.compare([0, 1], 1, 'Step 1');
  tb.swap(0, 1, [2, 1], 2, 'Step 2');
  tb.complete({ array: [1, 2] }, 'Done');
  const trace = tb.getTrace();

  let lastStep = null;
  let lastIndex = -1;
  const engine = new ExecutionEngine({
    onStepChange: (step, index) => {
      lastStep = step;
      lastIndex = index;
    }
  });

  engine.loadTrace(trace);
  assert.equal(engine.totalSteps, 3);
  assert.equal(engine.isAtStart, true);

  engine.stepForward();
  assert.equal(lastIndex, 0);
  assert.equal(lastStep.type, 'compare');

  engine.stepForward();
  assert.equal(lastIndex, 1);
  assert.equal(lastStep.type, 'swap');

  engine.stepBackward();
  assert.equal(lastIndex, 0);

  engine.jumpTo(2);
  assert.equal(lastIndex, 2);
  assert.equal(engine.isAtEnd, true);

  engine.destroy();
});
