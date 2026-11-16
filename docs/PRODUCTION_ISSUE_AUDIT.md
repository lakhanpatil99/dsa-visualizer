# AlgoMania — Production Issue & Root Cause Audit

**Target System:** https://www.algomania.in  
**GitHub:** https://github.com/lakhanpatil99/dsa-visualizer  
**Date of Audit:** November 16, 2026  
**Auditor:** Principal Software Architect & DevOps Lead  

---

## 1. Executive Summary

This audit inspects the reported production failures captured on `www.algomania.in`:
1. **HTTP 500 on Data Structure Routes** (`/data-structures/stack`, `/data-structures/queue`, `/data-structures/linked-list`, `/data-structures/heap`).
2. **Empty Central Canvas & Blank Complexity** on `/app` and `/sorting` upon initial load.
3. **Complexity Dash Metrics (`-`, `-`, `-`)** on `/graphs/route-lab` and Sorting.
4. **NaN Coordinates in Binary Heap Node Positions** causing root rendering collision.
5. **Division of Responsibility between Legacy and Next.js Pages Router.**

---

## 2. Root Cause Analysis

### Issue A: HTTP 500 on `/data-structures/stack`, `/queue`, `/linked-list`, `/heap`
- **Symptom:** Visiting `https://www.algomania.in/data-structures/stack` returned a full-page crash: `500 — A 500 error occurred on server`.
- **Root Cause:**
  In baseline commit `8220a43`, `pages/data-structures/stack.js`, `queue.js`, `linked-list.js`, and `heap.js` imported:
  ```javascript
  import { DarkModeContext } from '../../src/App';
  ```
  `src/App.js` was a legacy Create-React-App entry point that executed `localStorage.getItem('darkMode')` during component state declaration (`useState(() => localStorage.getItem('darkMode'))`), without checking `typeof window !== 'undefined'`.
  During Next.js Server-Side Rendering (SSR) in Node.js serverless functions on Vercel, `localStorage` is undefined, throwing `ReferenceError: localStorage is not defined` and crashing the server response with an unhandled 500 exception.
- **Resolution:**
  1. Converted all data structure pages to import `DarkModeContext` from the SSR-safe context `../../context/ThemeContext.js`.
  2. Guarded `src/App.js` with `typeof window !== 'undefined'` and moved localStorage reads to `useEffect`.
  3. Cleaned legacy page headers and integrated the shared editorial `<Navbar />` and `<Footer />`.

---

### Issue B: Empty Central Canvas & Blank Execution State
- **Symptom:** Central canvas on `/app` and `/sorting` appeared as a blank white box with "Idle" status and 0 comparisons.
- **Root Cause:**
  1. `array` state initialized as `[]` (`useState([])`). On initial SSR and before client-side `useEffect` execution, `array.length === 0`, leaving nothing to render.
  2. `VisualizerCanvas` set `minHeight: 360px` but omitted explicit `height: 360px` and flex layout on the inner container. As a result, child elements with `h-full` and `%` bar heights calculated `0%` or collapsed.
- **Resolution:**
  1. Provided a deterministic default array `DEFAULT_SORTING_ARRAY = [52, 28, 84, 38, 76, 16, 92, 44, 68, 20, 60, 32, 72, 12]`.
  2. Initialized state with this array immediately, ensuring instant, non-empty rendering on SSR and first paint.
  3. Set `height: ${height}px` and `display: flex; flex-direction: column` in `VisualizerCanvas.js`.
  4. Changed initial status badge from `Idle` to `● Ready`.

---

### Issue C: Dash Metrics (`-`, `-`, `-`) in ComplexityBox
- **Symptom:** Complexity analysis cards displayed `Best: —`, `Avg: —`, `Worst: —`.
- **Root Cause:**
  `ComplexityBox.js` previously destructured `{ timeComplexity, spaceComplexity, bestCase, averageCase, worstCase }`. However, callers (`SortingVisualizer.js` and `route-lab.js`) passed `complexity={currentAlgorithm.complexity}` as an object. Because the component did not unpack `props.complexity`, the fields evaluated to `undefined`, falling back to `—`.
- **Resolution:**
  Refactored `ComplexityBox.js` to accept both an encapsulated `complexity` object (`complexity.bestCase`, `complexity.averageCase`, `complexity.worstCase`, `complexity.space`) and direct props, with deterministic fallbacks.

---

### Issue D: NaN Coordinate Failure in Binary Heap Visualizer
- **Symptom:** Binary Max-Heap tree node for the root had `left: NaNpx` and disappeared.
- **Root Cause:**
  In `DataStructureVisualizer.js`, the position formula for level 0 was `(positionInLevel / (levelWidth - 1)) * 400 - 200`. For the root, `level = 0`, so `levelWidth = 2^0 = 1`. `levelWidth - 1` equaled `0`. Division by zero produced `NaN`.
- **Resolution:**
  Replaced formula with robust coordinate distribution `((positionInLevel + 0.5) / levelWidth) * 440 + 10`, eliminating any division by zero.

---

## 3. Verification Matrix

| Route | Pre-Fix Status | Post-Fix Status | Verified Viewports |
| :--- | :--- | :--- | :--- |
| `/data-structures/stack` | 500 Crash | 200 OK | Desktop (1440px), Mobile (390px) |
| `/data-structures/queue` | 500 Crash | 200 OK | Desktop (1440px), Mobile (390px) |
| `/data-structures/linked-list` | 500 Crash | 200 OK | Desktop (1440px), Mobile (390px) |
| `/data-structures/heap` | 500 Crash | 200 OK | Desktop (1440px), Mobile (390px) |
| `/data-structures/hash-table` | Blank on load | 200 OK (Populated) | Desktop, Mobile |
| `/data-structures/searching` | Blank on load | 200 OK (Populated) | Desktop, Mobile |
| `/sorting` | Blank White Box | 200 OK (Ready State) | Desktop, Mobile |
| `/app` | Inconsistent layout | 200 OK (Unified) | Desktop, Mobile |
| `/graphs/route-lab` | Dashes in Big-O | 200 OK (Real Bounds) | Desktop, Mobile |
