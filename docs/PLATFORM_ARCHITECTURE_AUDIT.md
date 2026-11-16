# AlgoMania — Platform Architecture & Baseline Audit

**Document Version:** 2.0.0  
**Audit Date:** 2026-11-16  
**Commit Baseline:** `8220a4393931e550a61a25478a9fd96ff36f3cf4`  
**Target Architecture:** Unified Editorial DSA Learning Platform  

---

## 1. Executive Summary

AlgoMania is an interactive computer science education web application built on Next.js 14 (Pages Router), React 18, Tailwind CSS, Firebase Authentication, and MongoDB Atlas. 

This audit assesses the state of the codebase prior to the complete platform transformation, identifying architectural bottlenecks, design system inconsistencies, algorithm correctness flaws, and execution engine fragmentation.

---

## 2. Source Code & Route Inventory

### 2.1 Route Mapping (`pages/`)
| Route | File | Auth Guard | Current Visual State | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `pages/index.js` | Public | Warm Ivory Editorial | Transformed in commit `8220a43` |
| `/login` | `pages/login.js` | PublicOnly | Warm Ivory Editorial | Transformed in commit `8220a43` |
| `/register` | `pages/register.js` | PublicOnly | Warm Ivory Editorial | Transformed in commit `8220a43` |
| `/forgot-password`| `pages/forgot-password.js`| PublicOnly | Warm Ivory Editorial | Transformed in commit `8220a43` |
| `/verify-email` | `pages/verify-email.js` | Guarded | Warm Ivory Editorial | Transformed in commit `8220a43` |
| `/app` | `pages/app.js` | Protected | Dark Navy `#080D1B` | Legacy shell with inline hardcoded header |
| `/sorting` | `pages/sorting.js` | Protected | Dark Navy `#080D1B` | Inline header with `text-blue-600` |
| `/graphs` | `pages/graphs.js` | Protected | Dark Navy `#080D1B` | Uses legacy canvas and inline nav |
| `/trees` | `pages/trees.js` | Protected | Dark Navy `#080D1B` | Uses legacy BST state |
| `/data-structures`| `pages/data-structures.js`| Protected | Dark Navy `#080D1B` | 3 legacy cards |
| `/data-structures/*`| 6 sub-routes | Protected | Dark Navy `#080D1B` | Singly linked, stack, queue, heap, etc. |
| `/dashboard` | `pages/dashboard.js` | Protected | Dark Navy `#080D1B` | Incomplete telemetry presentation |
| `/account` | `pages/account.js` | Protected | Dark Navy `#080D1B` | Needs editorial alignment |

---

## 3. Algorithm Implementation & Correctness Audit

### 3.1 Sorting Algorithms (`src/algorithms/sorting/`)
- **Bubble Sort (`bubbleSort.js`)**:
  - *Finding*: Generates step-by-step swap traces. Lacked explicit early-termination identification when zero swaps occur in a pass.
  - *Fix Needed*: Add explicit swap-flag tracking to guarantee $O(n)$ best-case behavior.
- **Quick Sort (`quickSort.js`)**:
  - *Finding*: Inconsistent pivot selection and partition boundaries across edge cases.
  - *Fix Needed*: Standardize Lomuto and Hoare partition traces with clear pivot, left, right, and swapped markers.
- **Merge Sort (`mergeSort.js`)**:
  - *Finding*: Auxiliary array slicing generates inconsistent step indexes for visual element highlighting.
  - *Fix Needed*: Normalized trace events with explicit range bounds $[L, M, R]$ and source-to-target array indices.

### 3.2 Searching Algorithms (`src/algorithms/searching/searching.js`)
- **Critical Flaw**: `SearchingAlgorithms.setArray()` was automatically sorting the input array upon receipt!
  - *Impact*: Linear Search was executing on a sorted array, masking bugs and distorting educational intuition.
  - *Fix Needed*: Preserve the raw, unsorted order for Linear Search. Enforce sorting exclusively for Binary Search with an educational notice.

### 3.3 Graph Algorithms (`src/algorithms/graphs/`)
- **Dijkstra (`dijkstra.js`)**:
  - *Critical Flaw*: Uses an array that is re-sorted via `sort()` on every insertion to simulate a priority queue.
  - *Impact*: Degrades theoretical time complexity from $O((V+E) \log V)$ to $O(V \cdot E \log V)$. Lacks validation rejecting negative weights.
  - *Fix Needed*: Implement an authentic Binary Min-Heap Priority Queue. Validate non-negative edge weights. Add path reconstruction and unreachable detection.
- **BFS & DFS (`bfs.js`, `dfs.js`)**:
  - *Finding*: Graph representation relies on unstructured node arrays with inconsistent adjacency lists.
  - *Fix Needed*: Standardize adjacency list and matrix models with explicit frontier and visitation states.

### 3.4 Missing Algorithm Domains
- **Dynamic Programming**: 0/1 Knapsack, Coin Change, LCS, LIS, Edit Distance completely absent.
- **String Algorithms**: KMP, Rabin-Karp, Boyer-Moore, Z-Algorithm completely absent.
- **Backtracking**: N-Queens, Sudoku, Maze, Subsets completely absent.
- **Advanced Sorting**: Heap Sort, Counting Sort, Radix Sort, Shell Sort, Selection Sort, Insertion Sort absent.
- **Advanced Searching**: Jump Search, Interpolation Search, Exponential Search absent.

---

## 4. Execution Engine Audit

### 4.1 Fragmented Animation & Execution Model
- Sorting visualizer uses `setTimeout` recursion with local state.
- Data structures visualizer uses internal callbacks.
- Graphs use manual step counters without reverse/scrubbing support.
- *Remedy*: Establish a **Universal Deterministic Algorithm Execution Engine** (`src/engine/`) that produces normalized trace steps supporting bidirectional scrubbing, time travel, speed scaling, and deterministic state rendering.

---

## 5. Security & Persistence Baseline

- **Authentication**: Firebase Authentication with server-side public certificate verification in `lib/auth.js`.
- **Database**: MongoDB Atlas via `lib/dbConnect.js`.
- **Models**: `models/User.js` and `models/Progress.js`.
- **Requirement**: All existing user identities, progress collections, and token security checks must be 100% preserved. Zero breaking changes to API schemas.
