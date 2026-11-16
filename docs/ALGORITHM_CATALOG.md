# AlgoMania — Comprehensive Algorithm & Data Structure Catalog

**Document Version:** 2.0.0  
**Scope:** Complete Algorithm Curriculum & Technical Specification  

---

## 1. Sorting Algorithms

| Algorithm | Category | Difficulty | Best Time | Avg Time | Worst Time | Aux Space | Stable? | Key Characteristic |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | Comparison | Beginner | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | In-place adjacent pairwise comparison with early exit |
| **Selection Sort** | Comparison | Beginner | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No | Repeatedly finds minimum element in unsorted partition |
| **Insertion Sort** | Comparison | Beginner | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Inserts element into sorted prefix, efficient for small $n$ |
| **Merge Sort** | Divide & Conquer| Intermediate| $O(n \log n)$| $O(n \log n)$| $O(n \log n)$| $O(n)$ | Yes | Recursive partitioning with guaranteed $O(n \log n)$ bound |
| **Quick Sort** | Divide & Conquer| Intermediate| $O(n \log n)$| $O(n \log n)$| $O(n^2)$ | $O(\log n)$ | No | Pivot partitioning with Lomuto/Hoare schemes |
| **Heap Sort** | Comparison | Intermediate| $O(n \log n)$| $O(n \log n)$| $O(n \log n)$| $O(1)$ | No | Max-heap construction and root extraction in-place |
| **Counting Sort** | Non-Comparison | Intermediate| $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(k)$ | Yes | Direct frequency histogram indexing (integers $\ge 0$) |
| **Radix Sort** | Non-Comparison | Intermediate| $O(d(n + k))$| $O(d(n + k))$| $O(d(n + k))$| $O(n + k)$ | Yes | Least Significant Digit (LSD) digit-by-digit sorting |
| **Shell Sort** | Comparison | Intermediate| $O(n \log n)$| $O(n^{4/3})$ | $O(n^2)$ | $O(1)$ | No | Diminishing increment gap sort |

---

## 2. Searching Algorithms

| Algorithm | Category | Difficulty | Time Complexity | Aux Space | Input Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Search** | Sequential | Beginner | $O(n)$ | $O(1)$ | None (arbitrary/unsorted allowed) |
| **Binary Search** | Interval Divide | Beginner | $O(\log n)$ | $O(1)$ | **Strictly Sorted Array** |
| **Jump Search** | Block Traversal | Intermediate | $O(\sqrt{n})$ | $O(1)$ | Strictly Sorted Array |
| **Interpolation Search** | Estimation Divide| Intermediate | $O(\log \log n)$ (avg), $O(n)$ (worst) | $O(1)$ | Uniformly Distributed Sorted Array |
| **Exponential Search** | Unbounded Search | Intermediate | $O(\log i)$ | $O(1)$ | Sorted Array, ideal for unbounded/streaming data |

---

## 3. Graph & Pathfinding Algorithms

| Algorithm | Category | Directed? | Weighted? | Time Complexity | Aux Space | Key Feature |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Breadth-First Search (BFS)** | Traversal | Both | Unweighted | $O(V + E)$ | $O(V)$ | Shortest path on unweighted graphs via FIFO queue |
| **Depth-First Search (DFS)** | Traversal | Both | Unweighted | $O(V + E)$ | $O(V)$ | Deep branch exploration via recursive call stack |
| **Dijkstra's Algorithm** | Shortest Path | Both | Non-negative | $O((V + E) \log V)$ | $O(V)$ | Greedy single-source shortest path via Min-Heap Priority Queue |
| **A\* Search** | Heuristic Path | Both | Non-negative | $O(E)$ (best), $O(b^d)$ | $O(V)$ | Informed search using $f(n) = g(n) + h(n)$ admissible heuristic |
| **Bellman-Ford** | Shortest Path | Both | Arbitrary (Negative) | $O(V \cdot E)$ | $O(V)$ | Single-source shortest path with negative cycle detection |
| **Floyd-Warshall** | All-Pairs Path | Both | Arbitrary (No neg cycles) | $O(V^3)$ | $O(V^2)$ | Dynamic programming all-pairs distance matrix |
| **Kruskal's Algorithm** | Minimum Spanning Tree | Undirected | Weighted | $O(E \log E)$ | $O(V)$ | Greedy edge sorting with Disjoint Set Union (Union-Find) |
| **Prim's Algorithm** | Minimum Spanning Tree | Undirected | Weighted | $O((V + E) \log V)$ | $O(V)$ | Cut-property vertex expansion with Min-Heap |
| **Topological Sort** | Ordering | DAG Only | Either | $O(V + E)$ | $O(V)$ | Kahn's in-degree queue or DFS post-order ordering |

---

## 4. Dynamic Programming Algorithms

| Problem | Method | State Dimensions | Time Complexity | Space Complexity | Decision Invariant |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0/1 Knapsack** | Tabulation | $DP[i][w]$ | $O(N \cdot W)$ | $O(N \cdot W) \to O(W)$ | $\max(DP[i-1][w], v_i + DP[i-1][w - w_i])$ |
| **Unbounded Knapsack** | Tabulation | $DP[w]$ | $O(N \cdot W)$ | $O(W)$ | Reusable item allocation per weight state |
| **Coin Change** | Min Steps DP | $DP[amount]$ | $O(N \cdot A)$ | $O(A)$ | Fewest coins to construct target amount |
| **Longest Common Subsequence** | 2D Grid DP | $DP[i][j]$ | $O(M \cdot N)$ | $O(M \cdot N)$ | Character match vs branch skip |
| **Longest Increasing Subsequence**| 1D / Binary Search | $DP[i]$ | $O(n^2) \to O(n \log n)$| $O(n)$ | Monotonic subsequence extension |
| **Edit Distance (Levenshtein)**| 2D Grid DP | $DP[i][j]$ | $O(M \cdot N)$ | $O(M \cdot N)$ | Min cost of Insert, Delete, Replace |

---

## 5. String Matching Algorithms

| Algorithm | Preprocessing Time | Matching Time | Aux Space | Precomputed Structure |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Pattern Matching** | None | $O((N - M + 1) \cdot M)$ | $O(1)$ | None |
| **Knuth-Morris-Pratt (KMP)** | $O(M)$ | $O(N)$ | $O(M)$ | $\pi$ Prefix Function Table |
| **Rabin-Karp** | $O(M)$ | $O(N + M)$ avg, $O(N \cdot M)$ worst | $O(1)$ | Rolling Polynomial Hash |
| **Boyer-Moore** | $O(M + \Sigma)$ | $O(N / M)$ best, $O(N \cdot M)$ worst | $O(\Sigma)$ | Bad Character Heuristic Table |
| **Z Algorithm** | $O(N + M)$ | $O(N + M)$ | $O(N + M)$ | Z-Array (Longest Prefix Match) |

---

## 6. Backtracking & Recursion Laboratories

| Problem | State Representation | Search Space | Pruning Condition |
| :--- | :--- | :--- | :--- |
| **N-Queens** | 1D column array $row[i]$ | $O(N!)$ | Row, Column, Main Diagonal, Anti-Diagonal conflicts |
| **Sudoku Solver** | $9 \times 9$ Grid | $O(9^m)$ ($m$ blanks) | Row, Column, and $3 \times 3$ Box uniqueness check |
| **Maze Solver** | 2D Matrix $(r, c)$ | $O(4^{R \cdot C})$ | Wall boundary, visited cycle, obstacle avoidance |
| **Subsets / Power Set** | Decision Tree | $O(2^N)$ | Include vs Exclude element branch |
| **Permutations** | Element Pool | $O(N!)$ | Available element frequency exclusion |
