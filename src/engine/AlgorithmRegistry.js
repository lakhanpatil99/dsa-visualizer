/**
 * Master Algorithm Registry
 * Provides single source of truth for all algorithm metadata, complexities,
 * taxonomy, routes, and pseudocode across AlgoMania.
 */

export const ALGORITHM_CATEGORIES = {
  SORTING: 'Sorting',
  SEARCHING: 'Searching',
  GRAPHS: 'Graphs',
  TREES: 'Trees',
  DATA_STRUCTURES: 'Data Structures',
  DYNAMIC_PROGRAMMING: 'Dynamic Programming',
  STRINGS: 'String Matching',
  BACKTRACKING: 'Backtracking & Recursion'
};

export const ALGORITHMS = [
  // --- SORTING ---
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    route: '/sorting?algo=bubble',
    description: 'Compares adjacent items and swaps them until the largest bubble to the top. Terminates early if already sorted.',
    pseudocode: `function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n - 1:
    swapped = false
    for j from 0 to n - i - 2:
      if arr[j] > arr[j + 1]:
        swap(arr[j], arr[j + 1])
        swapped = true
    if not swapped:
      break
  return arr`
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    route: '/sorting?algo=selection',
    description: 'Finds the minimum item in the unsorted suffix and swaps it to the front of the unsorted segment.',
    pseudocode: `function selectionSort(arr):
  n = length(arr)
  for i from 0 to n - 2:
    minIdx = i
    for j from i + 1 to n - 1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    if minIdx != i:
      swap(arr[i], arr[minIdx])
  return arr`
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    route: '/sorting?algo=insertion',
    description: 'Builds sorted array one element at a time by shifting larger elements right and inserting current element into place.',
    pseudocode: `function insertionSort(arr):
  for i from 1 to length(arr) - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j = j - 1
    arr[j + 1] = key
  return arr`
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    route: '/sorting?algo=quick',
    description: 'Divide-and-conquer strategy choosing a pivot element and partitioning the array around it.',
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pivotIndex = partition(arr, low, high)
    quickSort(arr, low, pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j from low to high - 1:
    if arr[j] <= pivot:
      i = i + 1
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[high])
  return i + 1`
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    route: '/sorting?algo=merge',
    description: 'Recursively divides array into two halves, sorts each half, and merges the two sorted sequences.',
    pseudocode: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
  mid = length(arr) / 2
  left = mergeSort(arr[0..mid])
  right = mergeSort(arr[mid..end])
  return merge(left, right)`
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    route: '/sorting?algo=heap',
    description: 'Builds a max heap from the array, then repeatedly extracts the root maximum to the end of the array.',
    pseudocode: `function heapSort(arr):
  buildMaxHeap(arr)
  for i from n - 1 down to 1:
    swap(arr[0], arr[i])
    maxHeapify(arr, 0, i)
  return arr`
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
    spaceComplexity: 'O(k)',
    stable: true,
    route: '/sorting?algo=counting',
    description: 'Non-comparison integer sorting algorithm that tallies frequencies of keys in a fixed range.',
    pseudocode: `function countingSort(arr, maxVal):
  count = array of zeros of size maxVal + 1
  for x in arr:
    count[x] += 1
  for i from 1 to maxVal:
    count[i] += count[i - 1]
  output = array of size length(arr)
  for i from length(arr) - 1 down to 0:
    output[count[arr[i]] - 1] = arr[i]
    count[arr[i]] -= 1
  return output`
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(d · (n + b))', average: 'O(d · (n + b))', worst: 'O(d · (n + b))' },
    spaceComplexity: 'O(n + b)',
    stable: true,
    route: '/sorting?algo=radix',
    description: 'Sorts integers digit by digit from least significant to most significant using stable counting sort as subroutine.',
    pseudocode: `function radixSort(arr):
  maxVal = max(arr)
  exp = 1
  while maxVal / exp > 0:
    countingSortByDigit(arr, exp)
    exp *= 10
  return arr`
  },
  {
    id: 'shell',
    name: 'Shell Sort',
    category: ALGORITHM_CATEGORIES.SORTING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^(4/3))', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    route: '/sorting?algo=shell',
    description: 'Generalization of insertion sort that allows exchanges of items that are far apart using a diminishing gap sequence.',
    pseudocode: `function shellSort(arr):
  gap = n / 2
  while gap > 0:
    for i from gap to n - 1:
      temp = arr[i]
      j = i
      while j >= gap and arr[j - gap] > temp:
        arr[j] = arr[j - gap]
        j -= gap
      arr[j] = temp
    gap = gap / 2
  return arr`
  },

  // --- SEARCHING ---
  {
    id: 'linear_search',
    name: 'Linear Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    route: '/data-structures/searching?algo=linear',
    description: 'Scans each item one by one from left to right. Works on any arbitrary, unsorted array.',
    pseudocode: `function linearSearch(arr, target):
  for i from 0 to length(arr) - 1:
    if arr[i] == target:
      return i
  return -1`
  },
  {
    id: 'binary_search',
    name: 'Binary Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    route: '/data-structures/searching?algo=binary',
    description: 'Divides search interval in half each iteration. Requires the array to be sorted.',
    pseudocode: `function binarySearch(arr, target):
  low = 0, high = length(arr) - 1
  while low <= high:
    mid = low + (high - low) / 2
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1`
  },
  {
    id: 'jump_search',
    name: 'Jump Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
    spaceComplexity: 'O(1)',
    route: '/data-structures/searching?algo=jump',
    description: 'Jumps ahead by fixed block steps of size √n, then performs linear search within the target block.',
    pseudocode: `function jumpSearch(arr, target):
  n = length(arr)
  step = floor(sqrt(n))
  prev = 0
  while arr[min(step, n) - 1] < target:
    prev = step
    step += floor(sqrt(n))
    if prev >= n:
      return -1
  while arr[prev] < target:
    prev += 1
    if prev == min(step, n):
      return -1
  return arr[prev] == target ? prev : -1`
  },
  {
    id: 'interpolation_search',
    name: 'Interpolation Search',
    category: ALGORITHM_CATEGORIES.SEARCHING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
    spaceComplexity: 'O(1)',
    route: '/data-structures/searching?algo=interpolation',
    description: 'Estimates target position based on value distribution in uniformly distributed sorted data.',
    pseudocode: `function interpolationSearch(arr, target):
  low = 0, high = length(arr) - 1
  while low <= high and target >= arr[low] and target <= arr[high]:
    if low == high:
      return arr[low] == target ? low : -1
    pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))
    if arr[pos] == target:
      return pos
    if arr[pos] < target:
      low = pos + 1
    else:
      high = pos - 1
  return -1`
  },

  // --- GRAPHS ---
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    route: '/graphs?algo=bfs',
    description: 'Explores vertices layer by layer outward from source using a FIFO queue. Finds shortest path in unweighted graphs.',
    pseudocode: `function bfs(graph, start):
  visited = set()
  queue = [start]
  visited.add(start)
  while queue is not empty:
    node = queue.dequeue()
    for neighbor in graph[node]:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)`
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Beginner',
    timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    spaceComplexity: 'O(V)',
    route: '/graphs?algo=dfs',
    description: 'Explores as deep as possible along each branch before backtracking using a LIFO stack or recursion.',
    pseudocode: `function dfs(graph, node, visited):
  visited.add(node)
  for neighbor in graph[node]:
    if neighbor not in visited:
      dfs(graph, neighbor, visited)`
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    spaceComplexity: 'O(V)',
    route: '/graphs?algo=dijkstra',
    description: 'Greedy shortest-path algorithm using a Binary Min-Heap Priority Queue. Requires non-negative edge weights.',
    pseudocode: `function dijkstra(graph, source):
  dist = {v: infinity for v in vertices}
  dist[source] = 0
  pq = MinHeap()
  pq.insert(source, 0)
  while not pq.isEmpty():
    u, d = pq.extractMin()
    if d > dist[u]: continue
    for neighbor, weight in graph[u]:
      if dist[u] + weight < dist[neighbor]:
        dist[neighbor] = dist[u] + weight
        pq.insert(neighbor, dist[neighbor])
  return dist`
  },
  {
    id: 'astar',
    name: 'A* Pathfinding Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Advanced',
    timeComplexity: { best: 'O(E)', average: 'O(E log V)', worst: 'O(b^d)' },
    spaceComplexity: 'O(V)',
    route: '/graphs/route-lab',
    description: 'Heuristic-guided search algorithm using f(n) = g(n) + h(n) where g is distance from start and h is estimated Euclidean distance to goal.',
    pseudocode: `function aStar(graph, start, goal, heuristic):
  openSet = MinHeap()
  openSet.insert(start, fScore[start])
  gScore[start] = 0
  fScore[start] = heuristic(start, goal)
  while not openSet.isEmpty():
    current = openSet.extractMin()
    if current == goal:
      return reconstructPath(cameFrom, current)
    for neighbor, weight in graph[current]:
      tentative_g = gScore[current] + weight
      if tentative_g < gScore[neighbor]:
        cameFrom[neighbor] = current
        gScore[neighbor] = tentative_g
        fScore[neighbor] = tentative_g + heuristic(neighbor, goal)
        openSet.insert(neighbor, fScore[neighbor])`
  },
  {
    id: 'bellman_ford',
    name: 'Bellman-Ford Algorithm',
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Advanced',
    timeComplexity: { best: 'O(E)', average: 'O(V · E)', worst: 'O(V · E)' },
    spaceComplexity: 'O(V)',
    route: '/graphs?algo=bellman_ford',
    description: 'Finds shortest paths from single source even with negative weights. Detects negative-weight cycles.',
    pseudocode: `function bellmanFord(vertices, edges, source):
  dist = {v: infinity for v in vertices}
  dist[source] = 0
  for i from 1 to |V| - 1:
    for each (u, v, weight) in edges:
      if dist[u] + weight < dist[v]:
        dist[v] = dist[u] + weight
  for each (u, v, weight) in edges:
    if dist[u] + weight < dist[v]:
      error "Graph contains a negative-weight cycle"
  return dist`
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST Algorithm",
    category: ALGORITHM_CATEGORIES.GRAPHS,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
    spaceComplexity: 'O(V)',
    route: '/graphs?algo=kruskal',
    description: 'Greedy Minimum Spanning Tree algorithm using Disjoint Set Union (Union-Find) with path compression.',
    pseudocode: `function kruskal(vertices, edges):
  mst = []
  sort edges by weight ascending
  dsu = DisjointSet(vertices)
  for (u, v, weight) in edges:
    if dsu.find(u) != dsu.find(v):
      dsu.union(u, v)
      mst.add((u, v, weight))
  return mst`
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: 'knapsack',
    name: '0/1 Knapsack Problem',
    category: ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(N · W)', average: 'O(N · W)', worst: 'O(N · W)' },
    spaceComplexity: 'O(N · W)',
    route: '/dynamic-programming?algo=knapsack',
    description: 'Determines maximum value of items fitting within a fixed weight capacity W using a 2D dynamic programming grid.',
    pseudocode: `function knapsack(W, weights, values, n):
  dp = 2D array of size (n + 1) x (W + 1)
  for i from 1 to n:
    for w from 0 to W:
      if weights[i - 1] <= w:
        dp[i][w] = max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w])
      else:
        dp[i][w] = dp[i - 1][w]
  return dp[n][W]`
  },
  {
    id: 'coin_change',
    name: 'Coin Change Problem',
    category: ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n · amount)', average: 'O(n · amount)', worst: 'O(n · amount)' },
    spaceComplexity: 'O(amount)',
    route: '/dynamic-programming?algo=coin_change',
    description: 'Finds fewest coins needed to make up a given amount using bottom-up tabulations.',
    pseudocode: `function coinChange(coins, amount):
  dp = array of size amount + 1 filled with infinity
  dp[0] = 0
  for i from 1 to amount:
    for coin in coins:
      if i - coin >= 0:
        dp[i] = min(dp[i], dp[i - coin] + 1)
  return dp[amount] == infinity ? -1 : dp[amount]`
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence (LCS)',
    category: ALGORITHM_CATEGORIES.DYNAMIC_PROGRAMMING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(m · n)', average: 'O(m · n)', worst: 'O(m · n)' },
    spaceComplexity: 'O(m · n)',
    route: '/dynamic-programming?algo=lcs',
    description: 'Finds longest subsequence present in both strings in the same order (not necessarily contiguous).',
    pseudocode: `function lcs(s1, s2):
  m = length(s1), n = length(s2)
  dp = 2D array (m + 1) x (n + 1)
  for i from 1 to m:
    for j from 1 to n:
      if s1[i - 1] == s2[j - 1]:
        dp[i][j] = dp[i - 1][j - 1] + 1
      else:
        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
  return dp[m][n]`
  },

  // --- STRINGS ---
  {
    id: 'kmp',
    name: 'Knuth-Morris-Pratt (KMP)',
    category: ALGORITHM_CATEGORIES.STRINGS,
    difficulty: 'Advanced',
    timeComplexity: { best: 'O(n)', average: 'O(n + m)', worst: 'O(n + m)' },
    spaceComplexity: 'O(m)',
    route: '/strings?algo=kmp',
    description: 'Precomputes longest proper prefix-suffix (pi) table to skip redundant character comparisons upon mismatch.',
    pseudocode: `function kmp(text, pattern):
  pi = computePiTable(pattern)
  j = 0
  for i from 0 to length(text) - 1:
    while j > 0 and text[i] != pattern[j]:
      j = pi[j - 1]
    if text[i] == pattern[j]:
      j += 1
    if j == length(pattern):
      reportMatch(i - j + 1)
      j = pi[j - 1]`
  },
  {
    id: 'rabin_karp',
    name: 'Rabin-Karp Rolling Hash',
    category: ALGORITHM_CATEGORIES.STRINGS,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n · m)' },
    spaceComplexity: 'O(1)',
    route: '/strings?algo=rabin_karp',
    description: 'Uses rolling polynomial hash function to filter candidate substring positions in O(1) expected time.',
    pseudocode: `function rabinKarp(text, pattern, prime, base):
  pHash = hash(pattern)
  tHash = hash(text[0..m])
  for i from 0 to n - m:
    if pHash == tHash and text[i..i+m] == pattern:
      reportMatch(i)
    tHash = rollHash(tHash, text[i], text[i + m])`
  },

  // --- BACKTRACKING ---
  {
    id: 'n_queens',
    name: 'N-Queens Solver',
    category: ALGORITHM_CATEGORIES.BACKTRACKING,
    difficulty: 'Advanced',
    timeComplexity: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
    spaceComplexity: 'O(N)',
    route: '/backtracking?algo=n_queens',
    description: 'Places N non-attacking queens on an N×N chessboard using recursive depth exploration and row/diagonal conflict pruning.',
    pseudocode: `function solveNQueens(board, col):
  if col >= N:
    return true
  for row from 0 to N - 1:
    if isSafe(board, row, col):
      board[row][col] = 1
      if solveNQueens(board, col + 1):
        return true
      board[row][col] = 0 // backtrack
  return false`
  },
  {
    id: 'sudoku',
    name: 'Sudoku Solver',
    category: ALGORITHM_CATEGORIES.BACKTRACKING,
    difficulty: 'Intermediate',
    timeComplexity: { best: 'O(1)', average: 'O(9^(empty cells))', worst: 'O(9^81)' },
    spaceComplexity: 'O(81)',
    route: '/backtracking?algo=sudoku',
    description: 'Solves 9x9 puzzles by recursively placing digits 1-9 in empty cells and pruning whenever row, column, or 3x3 box constraints fail.',
    pseudocode: `function solveSudoku(grid):
  empty = findEmptyCell(grid)
  if not empty: return true
  row, col = empty
  for num from 1 to 9:
    if isValid(grid, row, col, num):
      grid[row][col] = num
      if solveSudoku(grid): return true
      grid[row][col] = 0 // backtrack
  return false`
  }
];

export function getAlgorithmById(id) {
  return ALGORITHMS.find(algo => algo.id === id) || null;
}

export function getAlgorithmsByCategory(category) {
  return ALGORITHMS.filter(algo => algo.category === category);
}

export default ALGORITHMS;
