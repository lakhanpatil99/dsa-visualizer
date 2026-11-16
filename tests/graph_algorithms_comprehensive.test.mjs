import test from 'node:test';
import assert from 'node:assert/strict';

import { Graph as BFSGraph } from '../src/algorithms/graphs/bfs.js';
import { Graph as DFSGraph } from '../src/algorithms/graphs/dfs.js';
import { WeightedGraph } from '../src/algorithms/graphs/dijkstra.js';
import { aStarSearch } from '../src/algorithms/graphs/astar.js';
import { bellmanFord } from '../src/algorithms/graphs/bellmanFord.js';
import { kruskalMST, DisjointSet } from '../src/algorithms/graphs/kruskal.js';
import { topologicalSortKahn } from '../src/algorithms/graphs/topologicalSort.js';

// ============================================================================
// PHASE 2 & 10: BFS TESTS
// ============================================================================
test('BFS: Standard connected graph traversal & trace verification', () => {
  const g = new BFSGraph();
  ['A', 'B', 'C', 'D', 'E'].forEach(v => g.addVertex(v));
  g.addEdge('A', 'B');
  g.addEdge('A', 'C');
  g.addEdge('B', 'D');
  g.addEdge('C', 'E');

  const order = g.breadthFirstSearch('A');
  assert.equal(order[0], 'A');
  assert.equal(order.length, 5);

  // Backward compatibility alias
  assert.deepEqual(g.bfs('A'), order);

  // Trace verification
  const { trace, path } = g.breadthFirstSearchWithTrace('A', 'E');
  assert.ok(trace.length > 0);
  assert.deepEqual(path, ['A', 'C', 'E']);
  assert.equal(trace[0].type, 'enqueue');
  assert.equal(trace[trace.length - 1].type, 'complete');
});

test('BFS: Disconnected graph, cyclic graph, single node, and missing start node', () => {
  const g = new BFSGraph();
  ['A', 'B', 'C', 'D'].forEach(v => g.addVertex(v));
  // A - B cycle
  g.addEdge('A', 'B');
  g.addEdge('B', 'A');
  // C - D separate component
  g.addEdge('C', 'D');

  // Disconnected traversal from A should not visit C or D
  const orderA = g.breadthFirstSearch('A');
  assert.deepEqual(orderA, ['A', 'B']);

  // Path between disconnected nodes is null
  const res = g.breadthFirstSearchWithTrace('A', 'D');
  assert.equal(res.path, null);

  // Single node
  const single = new BFSGraph();
  single.addVertex('Z');
  assert.deepEqual(single.breadthFirstSearch('Z'), ['Z']);

  // Missing start node handling
  const missing = g.breadthFirstSearch('NONEXISTENT');
  assert.deepEqual(missing, []);
  const missingTrace = g.breadthFirstSearchWithTrace('NONEXISTENT');
  assert.equal(missingTrace.trace[0].type, 'error');
});

// ============================================================================
// PHASE 2 & 10: DFS TESTS
// ============================================================================
test('DFS: Recursive and iterative traversals with call stack & backtrack trace', () => {
  const g = new DFSGraph();
  ['A', 'B', 'C', 'D'].forEach(v => g.addVertex(v));
  g.addEdge('A', 'B');
  g.addEdge('B', 'C');
  g.addEdge('C', 'D');

  const recOrder = g.depthFirstSearch('A');
  assert.deepEqual(recOrder, ['A', 'B', 'C', 'D']);

  // Backward compatibility alias
  assert.deepEqual(g.dfs('A'), recOrder);

  // Iterative
  const iterOrder = g.depthFirstSearchIterative('A');
  assert.equal(iterOrder.length, 4);
  assert.equal(iterOrder[0], 'A');
  assert.deepEqual(g.dfsIterative('A'), iterOrder);

  // Trace with call stack and backtracking
  const { trace, path } = g.depthFirstSearchWithTrace('A', 'D');
  assert.deepEqual(path, ['A', 'B', 'C', 'D']);
  const backtrackSteps = trace.filter(t => t.type === 'backtrack');
  assert.ok(backtrackSteps.length >= 1);
});

test('DFS: Cycles, disconnected graph, single node, and missing start node', () => {
  const g = new DFSGraph();
  ['1', '2', '3', '4'].forEach(v => g.addVertex(v));
  // Cycle 1-2-3-1
  g.addEdge('1', '2');
  g.addEdge('2', '3');
  g.addEdge('3', '1');
  // 4 is isolated

  const order = g.depthFirstSearch('1');
  assert.deepEqual(order, ['1', '2', '3']);
  assert.equal(order.includes('4'), false);
  assert.equal(g.hasCycle(), true);

  // Single node
  const single = new DFSGraph();
  single.addVertex('X');
  assert.deepEqual(single.depthFirstSearch('X'), ['X']);

  // Missing start node
  assert.deepEqual(g.depthFirstSearch('GHOST'), []);
  const missingRes = g.depthFirstSearchWithTrace('GHOST');
  assert.equal(missingRes.trace[0].type, 'error');
});

// ============================================================================
// PHASE 3 & 10: DIJKSTRA TESTS
// ============================================================================
test('Dijkstra: Shortest weighted path, zero-weight, start=goal, and unreachable node', () => {
  const wg = new WeightedGraph();
  ['A', 'B', 'C', 'D', 'E'].forEach(v => wg.addVertex(v));
  wg.addEdge('A', 'B', 4);
  wg.addEdge('A', 'C', 2);
  wg.addEdge('C', 'B', 1);
  wg.addEdge('B', 'D', 5);
  wg.addEdge('C', 'D', 8);
  wg.addEdge('C', 'E', 0); // Zero weight edge

  // Shortest path A -> D via C and B: A(0) + C(2) + B(1) + D(5) = 8
  const res = wg.dijkstraWithTrace('A', 'D');
  assert.deepEqual(res.path, ['A', 'C', 'B', 'D']);
  assert.equal(res.distance, 8);

  // Zero-weight edge to E
  const resE = wg.dijkstraWithTrace('A', 'E');
  assert.deepEqual(resE.path, ['A', 'C', 'E']);
  assert.equal(resE.distance, 2);

  // Start === Goal
  const resSelf = wg.dijkstraWithTrace('A', 'A');
  assert.deepEqual(resSelf.path, ['A']);
  assert.equal(resSelf.distance, 0);

  // Unreachable node
  wg.addVertex('ISOLATED');
  const resUnreachable = wg.dijkstraWithTrace('A', 'ISOLATED');
  assert.deepEqual(resUnreachable.path, []);
  assert.equal(resUnreachable.distance, null);

  // Negative weight rejection
  assert.throws(() => {
    wg.addEdge('D', 'E', -4);
  }, /negative/i);
});

// ============================================================================
// PHASE 4 & 10: A* SEARCH TESTS
// ============================================================================
test('A* Search: Admissible scaling matches Dijkstra optimal path cost exactly', () => {
  const nodes = [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 200, y: 250 },
    { id: 'D', x: 500, y: 150 }
  ];
  const edges = [
    { u: 'A', v: 'B', weight: 4 },
    { u: 'A', v: 'C', weight: 2 },
    { u: 'C', v: 'B', weight: 1 },
    { u: 'B', v: 'D', weight: 5 },
    { u: 'C', v: 'D', weight: 8 }
  ];

  // 1. Run Dijkstra baseline
  const wg = new WeightedGraph();
  nodes.forEach(n => wg.addVertex(n.id));
  edges.forEach(e => wg.addEdge(e.u, e.v, e.weight));
  const dijkstraRes = wg.dijkstra('A', 'D');

  // 2. Run A* with admissible scaling
  const aStarAdmissible = aStarSearch(nodes, edges, 'A', 'D', { heuristicMode: 'admissible' });
  assert.equal(aStarAdmissible.distance, dijkstraRes.distance);
  assert.deepEqual(aStarAdmissible.path, dijkstraRes.path);

  // 3. Run A* with zero heuristic (exact Dijkstra equivalence)
  const aStarZero = aStarSearch(nodes, edges, 'A', 'D', { heuristicMode: 'zero' });
  assert.equal(aStarZero.distance, dijkstraRes.distance);
  assert.deepEqual(aStarZero.path, dijkstraRes.path);

  // 4. Unreachable node
  nodes.push({ id: 'Z', x: 800, y: 800 });
  const aStarUnreachable = aStarSearch(nodes, edges, 'A', 'Z');
  assert.deepEqual(aStarUnreachable.path, []);
  assert.equal(aStarUnreachable.distance, null);
});

// ============================================================================
// PHASE 5 & 10: BELLMAN-FORD TESTS
// ============================================================================
test('Bellman-Ford: Negative edges, relaxation passes, and negative cycle detection', () => {
  const vertices = ['S', 'A', 'B', 'C', 'D'];
  const edgesWithNegative = [
    { u: 'S', v: 'A', weight: 4 },
    { u: 'S', v: 'B', weight: 2 },
    { u: 'B', v: 'A', weight: -3 }, // negative edge!
    { u: 'A', v: 'C', weight: 3 },
    { u: 'B', v: 'D', weight: 5 },
    { u: 'D', v: 'C', weight: -2 }
  ];

  const bfRes = bellmanFord(vertices, edgesWithNegative, 'S', 'C');
  assert.equal(bfRes.hasNegativeCycle, false);
  // Path S -> B -> A -> C cost: 2 - 3 + 3 = 2
  assert.equal(bfRes.distances['C'], 2);
  assert.deepEqual(bfRes.path, ['S', 'B', 'A', 'C']);

  // Negative cycle test
  const cycleEdges = [
    { u: '1', v: '2', weight: 1 },
    { u: '2', v: '3', weight: -4 },
    { u: '3', v: '1', weight: 2 } // 1+2-4 = -1 cycle
  ];
  const cycleRes = bellmanFord(['1', '2', '3'], cycleEdges, '1');
  assert.equal(cycleRes.hasNegativeCycle, true);
  const cycleTrace = cycleRes.trace.find(t => t.type === 'negative_cycle');
  assert.ok(cycleTrace !== undefined);
});

// ============================================================================
// PHASE 6 & 10: KRUSKAL'S MST & TOPOLOGICAL SORT TESTS
// ============================================================================
test("Kruskal's MST: DisjointSet correctness, cycle rejection, and minimum spanning forest", () => {
  // Test DisjointSet
  const dsu = new DisjointSet(['A', 'B', 'C', 'D']);
  assert.equal(dsu.find('A'), 'A');
  assert.equal(dsu.union('A', 'B'), true);
  assert.equal(dsu.find('A'), dsu.find('B'));
  assert.equal(dsu.union('A', 'B'), false); // already unioned

  // Connected MST test
  const vertices = ['A', 'B', 'C', 'D'];
  const edges = [
    { u: 'A', v: 'B', weight: 1 },
    { u: 'B', v: 'C', weight: 2 },
    { u: 'A', v: 'C', weight: 3 }, // redundant cycle edge
    { u: 'C', v: 'D', weight: 4 }
  ];

  const mstRes = kruskalMST(vertices, edges);
  assert.equal(mstRes.totalCost, 7); // 1 + 2 + 4
  assert.equal(mstRes.mst.length, 3);
  assert.equal(mstRes.isConnectedSpanningTree, true);

  // Disconnected spanning forest test
  const forestVertices = ['A', 'B', 'C', 'D'];
  const forestEdges = [
    { u: 'A', v: 'B', weight: 5 },
    { u: 'C', v: 'D', weight: 6 }
  ];
  const forestRes = kruskalMST(forestVertices, forestEdges);
  assert.equal(forestRes.isConnectedSpanningTree, false);
  assert.equal(forestRes.mst.length, 2);
});

test('Topological Sort: Kahn in-degree algorithm, valid DAG order, and cycle detection', () => {
  const dagVertices = ['A', 'B', 'C', 'D', 'E'];
  const dagEdges = [
    { u: 'A', v: 'B' },
    { u: 'A', v: 'C' },
    { u: 'B', v: 'D' },
    { u: 'C', v: 'D' },
    { u: 'D', v: 'E' }
  ];

  const topoRes = topologicalSortKahn(dagVertices, dagEdges);
  assert.equal(topoRes.hasCycle, false);
  assert.equal(topoRes.order.length, 5);
  // Verify topological invariants
  assert.ok(topoRes.order.indexOf('A') < topoRes.order.indexOf('B'));
  assert.ok(topoRes.order.indexOf('A') < topoRes.order.indexOf('C'));
  assert.ok(topoRes.order.indexOf('B') < topoRes.order.indexOf('D'));
  assert.ok(topoRes.order.indexOf('C') < topoRes.order.indexOf('D'));
  assert.ok(topoRes.order.indexOf('D') < topoRes.order.indexOf('E'));

  // Cycle detection
  const cyclicEdges = [
    { u: 'X', v: 'Y' },
    { u: 'Y', v: 'Z' },
    { u: 'Z', v: 'X' }
  ];
  const cyclicRes = topologicalSortKahn(['X', 'Y', 'Z'], cyclicEdges);
  assert.equal(cyclicRes.hasCycle, true);
  assert.deepEqual(cyclicRes.order, []);
});
