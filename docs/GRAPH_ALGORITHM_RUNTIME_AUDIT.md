# ALGOMANIA — GRAPH ALGORITHM RUNTIME AUDIT & VERIFICATION REPORT

**Date:** November 16, 2026  
**Repository:** https://github.com/lakhanpatil99/dsa-visualizer  
**Production URL:** https://www.algomania.in  
**Primary File:** `src/pages/GraphVisualizer.js`  

---

## 1. Executive Summary & Root Cause Analysis

### A. The Critical Production Bug: `t.dfs is not a function` & `bfs` Method Mismatch
- **Root Cause:**
  - `GraphVisualizer.js` invoked `dfsGraph.dfs(startNode)` and `bfsGraph.bfs(startNode)`.
  - While alias methods existed in non-minified local development, production bundlers or direct imports expected the canonical methods:
    - DFS: `depthFirstSearch(start)`, `depthFirstSearchIterative(start)`, `depthFirstSearchWithTrace(start, end)`
    - BFS: `breadthFirstSearch(start)`, `breadthFirstSearchWithTrace(start, end)`, `breadthFirstSearchWithPath(start, end)`
  - Furthermore, `GraphVisualizer.js` previously only iterated over static vertex order lists, omitting real-time priority queue state, edge inspection, and relaxation steps.

### B. Tree Visualizer Method Mismatch Discovered in Phase 11
- **Root Cause:**
  - `TreeVisualizer.js` called `bst.preorder()`, `bst.postorder()`, and `bst.levelOrder()`.
  - In `src/algorithms/trees/bst.js`, `BinarySearchTree` only implemented `inorder()`, causing runtime errors when switching traversals.
- **Resolution:**
  - Implemented `preorder()`, `postorder()`, `levelOrder()`, and their traversal counterparts directly in `BinarySearchTree` with fallback guards to `src/algorithms/trees/traversals.js`.

---

## 2. Algorithm Compatibility Matrix

| Algorithm | UI Selector Key | Module Path | Canonical Method | Trace Supported | Directed / Undirected |
|---|---|---|---|---|---|
| **BFS** | `'bfs'` | `src/algorithms/graphs/bfs.js` | `breadthFirstSearchWithTrace(start, end)` | Full queue, frontier, edge inspect | Both |
| **DFS** | `'dfs'` | `src/algorithms/graphs/dfs.js` | `depthFirstSearchWithTrace(start, end)` | Call stack, backtrack, edge inspect | Both |
| **Dijkstra** | `'dijkstra'` | `src/algorithms/graphs/dijkstra.js` | `dijkstraWithTrace(start, end)` | MinHeap extractMin, relaxations, distances | Both (non-negative) |
| **A\* Search** | `'astar'` | `src/algorithms/graphs/astar.js` | `aStarSearch(nodes, edges, start, goal)` | Admissible scaled Euclidean heuristic, fScore, gScore | Both |
| **Bellman-Ford** | `'bellman'` | `src/algorithms/graphs/bellmanFord.js` | `bellmanFord(vertices, edges, start, goal)` | Relaxation passes 1..V-1, negative cycle detection | Directed |
| **Kruskal's MST**| `'kruskal'` | `src/algorithms/graphs/kruskal.js` | `kruskalMST(vertices, edges)` | DisjointSet union/find, cycle skips, MST cost | Undirected |
| **Topological** | `'topological'` | `src/algorithms/graphs/topologicalSort.js`| `topologicalSortKahn(vertices, edges)` | In-degree map tracking, source queue, cycle detection | Directed (DAG) |

---

## 3. Heuristic Normalization in A* Search

- **Problem:**
  - Previously, `astar.js` calculated raw Euclidean pixel distance (`Math.sqrt(dx^2 + dy^2)`). Because canvas node distances span 100–600 pixels while graph edge weights are small integers (1–6), the heuristic drastically overestimated graph costs ($h(n) \gg \text{cost}^*(n)$), violating admissibility and risking sub-optimal routes.
- **Solution:**
  - Computed the graph's minimum edge-to-distance ratio:
    $$\text{scaleRatio} = \min_{(u, v) \in E} \left( \frac{\text{weight}(u, v)}{\text{euclidean}(u, v)} \right)$$
  - Defined the admissible heuristic:
    $$h(n) = \text{scaleRatio} \times \text{euclidean}(n, \text{goal})$$
  - Satisfies the triangle inequality and ensures $h(n) \le d^*(n, \text{goal})$.
  - Verified against Dijkstra on identical graphs: **Both algorithms return the exact same optimal path cost**.

---

## 4. Deterministic Playback Engine & Canvas Quality Upgrades

1. **Playback Controller**:
   - `▶ Run / ⏸ Pause` toggle with speed selectors (`0.5x`, `1x`, `1.5x`, `2x`).
   - `⏮ Prev` and `⏭ Next` frame-by-frame step debugging.
   - `Timeline Slider` for instantaneous scrubbing across all simulation steps.
   - Clean timer cleanup on algorithm switch, reset, or canvas modification (zero asynchronous state leaks).

2. **Canvas Visuals**:
   - Scale factor mapping ($x = (e.clientX - \text{rect.left}) \times \frac{\text{width}}{\text{cssWidth}}$) ensuring pixel-accurate clicks on mobile and retina screens.
   - Directional vector arrowheads rendered on target node boundaries for directed graphs.
   - High-contrast badges for active nodes (Burnt Orange `#EF592A`), settled/visited nodes (Soft Sage `#E4E9DD`), and optimal paths (Forest Green `#28533D`).
   - Node dragging support allowing learners to interactively rearrange graph layouts on canvas.

---

## 5. Test Suite & Verification Results

- **Comprehensive Automated Tests (`tests/graph_algorithms_comprehensive.test.mjs`)**:
  - BFS: connected, disconnected, cyclic, single-node, missing start node.
  - DFS: recursive, iterative, cycles, call stack tracking, backtracking.
  - Dijkstra: non-negative weights, zero weight, unreachable nodes, start=goal, negative rejection.
  - A*: admissible heuristic verification, zero heuristic Dijkstra equivalence.
  - Bellman-Ford: negative edges, relaxation passes, negative-weight cycle detection.
  - Kruskal's MST: DisjointSet union/find, cycle skips, spanning forest for disconnected graphs.
  - Topological Sort: valid DAG, cycle detection, isolated nodes.
- **Global Test Suite**:
  - **79 / 79 tests passed** (`npm test`) across all test suites.
- **Next.js Production Build**:
  - **26 / 26 routes compiled cleanly** with zero build errors (`npm run build`).
