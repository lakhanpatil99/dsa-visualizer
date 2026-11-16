# AlgoMania — Platform Upgrade & Engineering Execution Plan

**Document Version:** 2.0.0  
**Target Release:** Production Platform Transformation  
**Branch:** `feat/algomania-complete-platform-upgrade`  

---

## 1. Master Architectural Strategy

The platform transformation is structured into 6 sequential, testable engineering tiers:

```
Tier 1: Design System & Application Shell (Navbar, Layout, Colors, Tokens)
Tier 2: Universal Algorithm Execution Engine (Registry, TraceBuilder, Controls)
Tier 3: Algorithm Modernization & Correctness (Sorting, Searching, Dijkstra Min-Heap)
Tier 4: New Interactive Laboratories (Route Lab, Dynamic Programming, Strings, Backtracking)
Tier 5: Platform Discovery & Learning Experience (Catalogue, Compare Mode, Dashboard)
Tier 6: Automated Testing, Security Audit & Production Release
```

---

## 2. Tier-by-Tier Implementation Schedule

### Tier 1 — Cohesive Design System & Navigation Shell
1. Upgrade `src/components/Navbar.js`:
   - Replace legacy `#080D1B` dark navigation with the Warm Ivory (`#F8F5ED`), Paper White (`#FFFDF8`), and Burnt Orange (`#EF592A`) theme.
   - Grouped navigation links: Curriculum dropdown (Sorting, Graphs, Trees, DP, Strings, Backtracking, Data Structures).
   - Clean user avatar menu (Dashboard, Settings, Logout).
   - Smooth mobile drawer menu.
2. Upgrade `src/components/VisualizerLayout.js`:
   - Unified workspace header with AlgoMania brand mark, breadcrumb hierarchy, and algorithm family tags.
   - Collapsible panels for responsive 3-column layout.
3. Upgrade `src/components/Controls.js`:
   - Universal playback controller: Play/Pause, Step Forward, Step Backward, Reset, Scrubbing, Speed presets.

### Tier 2 — Universal Execution Engine (`src/engine/`)
1. `src/engine/AlgorithmRegistry.js`: Centralized catalog of algorithm metadata, input schemas, pseudocode, and step generators.
2. `src/engine/TraceBuilder.js`: Normalized event schema for all algorithm operations.
3. `src/engine/ExecutionEngine.js`: Stateful runner managing play, pause, step-forward, step-backward, speed, and timer cancellation.

### Tier 3 — Core Algorithm Modernization
1. **Sorting**:
   - Add early-exit to Bubble Sort.
   - Implement Selection Sort, Insertion Sort, Heap Sort, Counting Sort, Radix Sort, Shell Sort.
2. **Searching**:
   - Fix Linear Search to preserve raw array order.
   - Implement Jump Search, Interpolation Search, Exponential Search.
3. **Graphs**:
   - Replace Dijkstra's array sort with Binary Min-Heap Priority Queue.
   - Implement A* Search, Bellman-Ford, Floyd-Warshall, Kruskal's MST, Prim's MST, Topological Sort.

### Tier 4 — New Interactive Laboratories
1. **Route & Pathfinding Lab (`pages/graphs/route-lab.js`)**:
   - Interactive road-network map visualizer with editable nodes, weighted edges in kilometers, and shortest path calculation.
2. **Dynamic Programming Workspace (`pages/dynamic-programming.js`)**:
   - 0/1 Knapsack matrix visualization with cell-by-cell decision tracking, plus Coin Change, LCS, and LIS.
3. **String Matching Lab (`pages/strings.js`)**:
   - Character alignment with KMP ($\pi$ table), Rabin-Karp, Boyer-Moore, and Z-Algorithm.
4. **Backtracking & Recursion Lab (`pages/backtracking.js`)**:
   - N-Queens board solver with conflict raycasting, Sudoku solver, and call stack visualization.

### Tier 5 — Platform Discovery & Learning
1. **Algorithm Catalog (`pages/algorithms.js`)**: Search, category filters, difficulty tags, Big-O metrics, and direct visualizer launches.
2. **Compare Mode (`pages/compare.js`)**: Side-by-side execution of algorithm pairs on identical inputs.
3. **Dashboard (`pages/dashboard.js`)**: Verified progress, explored categories, and resume learning.

### Tier 6 — Testing & Production Release
1. Run full test suite (`npm test`).
2. Run production build (`npm run build`).
3. Deploy Vercel preview, test authentication and persistence, merge to `main`.
