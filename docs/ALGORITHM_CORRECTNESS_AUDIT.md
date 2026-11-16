# AlgoMania — Algorithm Correctness & Complexity Audit

This document verifies the algorithmic correctness, time/space complexity justifications, and edge-case handling across all algorithm families.

---

## 1. Sorting Algorithms Audit

| Algorithm | Best Time | Avg Time | Worst Time | Space | Correctness Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Early termination flag `swapped` halts when array is sorted in 1 pass. Tested in `tests/expanded_algorithms.test.mjs`. |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Finds minimum in unsorted suffix and swaps into place. In-place. |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Shifts larger elements right and inserts current element. Stable. |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Lomuto partition scheme with pivot tracking. |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Divide and conquer with auxiliary merge buffer. Stable. |
| **Heap Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | Builds max-heap in $O(n)$, repeatedly extracts max in $O(\log n)$. |
| **Counting Sort** | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(k)$ | Non-comparison distribution sort using frequency histogram. |
| **Radix Sort** | $O(d(n + k))$ | $O(d(n + k))$ | $O(d(n + k))$ | $O(n + k)$ | LSD digit-by-digit bucket distribution. |
| **Shell Sort** | $O(n \log n)$ | $O(n^{4/3})$ | $O(n^{3/2})$ | $O(1)$ | Diminishing gap sequence insertion sort. |

---

## 2. Searching Algorithms Audit

- **Linear Search:** Preserves raw input order (`autoSort = false`). Does not mutate or sort the user's input.
- **Binary Search:** Requires a sorted array ($O(\log n)$). Displays search interval `[left, right]` and midpoint `mid`.
- **Jump Search:** Moves by block step $m = \lfloor\sqrt{n}\rfloor$, then performs linear scan in target block ($O(\sqrt{n})$).
- **Interpolation Search:** Uses probing formula $pos = low + \lfloor \frac{target - arr[low]}{arr[high] - arr[low]} \cdot (high - low) \rfloor$ ($O(\log \log n)$ average for uniformly distributed data).

---

## 3. Graph Algorithms Audit

- **Dijkstra's Algorithm:**
  - Priority Queue: Backed by a true Binary Min-Heap (`src/algorithms/graphs/MinHeap.js`) instead of array sorting.
  - Time Complexity: $O((V + E) \log V)$ with min-heap operations ($O(\log V)$ extract-min and decrease-key).
  - Negative Edge Weights: Rejects negative edges with `throw new Error(...)` to prevent infinite loops.
- **A\* Pathfinding:**
  - Uses Euclidean distance heuristic $h(n) = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$, which is admissible and consistent in 2D space.
  - Tracks $f(n) = g(n) + h(n)$ in priority queue.
- **Bellman-Ford:**
  - Relaxes all $|V| - 1$ edges and detects negative-weight cycles in $O(V \cdot E)$.
- **Kruskal's MST:**
  - Uses Disjoint Set Union (DSU) with union-by-rank and path compression in $O(E \log E)$.

---

## 4. Dynamic Programming Audit

- **0/1 Knapsack:**
  - Real 2D DP matrix $dp[i][w]$ storing optimal value for items $1..i$ with capacity $w$.
  - Recurrence: $dp[i][w] = \max(dp[i-1][w], dp[i-1][w - weight_i] + val_i)$.
  - Backtracks selected item subsets.
- **Longest Common Subsequence (LCS):**
  - Matrix dimensions $(m+1) \times (n+1)$. Correctly extracts matching substring path.

---

## 5. Backtracking Audit

- **N-Queens Solver:**
  - Safe placement checks row, primary diagonal, and secondary diagonal.
  - Backtracks invalid partial configurations.
- **Sudoku Solver:**
  - Validates row, column, and $3 \times 3$ sub-grid constraints.
