# AlgoMania — Comprehensive Testing & Regression Verification Plan

**Document Version:** 2.0.0  
**Target:** 100% Pass Rate Across Algorithm Correctness, UI Stability, Authentication, and Persistence  

---

## 1. Test Architecture & Automated Suites

Tests are executed using Node.js native test runner (`node --test tests/*.test.mjs`).

### 1.1 Test Suite Breakdown
1. `tests/algorithms.test.mjs`: Core sorting and data structure correctness tests.
2. `tests/auth_service.test.mjs`: Client authentication error translation, email validation, password scoring.
3. `tests/scenarios_28_master.test.mjs`: Complete 28-scenario integration suite covering auth state transitions, route guards, token rejection, and legacy user migration.
4. `tests/sync_user_endpoint.test.mjs`: User synchronization endpoint security, Bearer extraction, and MongoDB race conditions.
5. `tests/engine_and_expanded_algorithms.test.mjs` (To be added):
   - Sorting: Selection, Insertion, Heap, Counting, Radix, Shell Sort.
   - Searching: Linear Search unsorted order preservation, Binary, Jump, Interpolation, Exponential Search.
   - Graph: Binary Min-Heap Priority Queue, Dijkstra non-negative weights, A*, Bellman-Ford negative cycles, Kruskal MST.
   - Dynamic Programming: 0/1 Knapsack matrix, Coin Change, LCS.
   - String Matching: KMP $\pi$ table, Rabin-Karp, Boyer-Moore.
   - Backtracking: N-Queens non-attacking placements, Sudoku validator.

---

## 2. Regression & Production Gates

| Gate | Requirement | Verification Method |
| :--- | :--- | :--- |
| **Algorithm Correctness** | 100% test oracle match across edge cases (empty, duplicates, negative numbers, single element) | Automated Unit Tests (`npm test`) |
| **Authentication Flow** | Firebase token validation, session persistence, protected route redirection | `tests/scenarios_28_master.test.mjs` |
| **Database Integrity** | MongoDB user synchronization and progress tracking without data mutation | `tests/sync_user_endpoint.test.mjs` |
| **Static Build** | Zero SSR/prerender errors across all static and dynamic pages | `npm run build` |
| **Visual Responsiveness** | Zero horizontal overflow at 360px, 390px, 768px, 1440px | Puppeteer Automated Screen Captures |
