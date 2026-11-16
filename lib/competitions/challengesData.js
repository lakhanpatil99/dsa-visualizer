/**
 * Authoritative Competition Challenges Catalog for AlgoMania.
 * Categorized into Sorting, Searching, Graphs, Trees, Data Structures, and General DSA.
 * Each challenge contains verified test cases for deterministic evaluation.
 */
export const COMPETITION_CHALLENGES = [
  // --- SORTING CHALLENGES ---
  {
    challengeId: 'sort-01',
    title: 'Sort an Array in Linearithmic Time',
    slug: 'sort-array-linearithmic',
    category: 'sorting',
    difficulty: 'Easy',
    points: 10,
    description: 'Given an array of integers nums, sort the array in ascending order and return it in O(n log n) time.',
    constraints: ['1 <= nums.length <= 50,000', '-50,000 <= nums[i] <= 50,000'],
    examples: [
      { input: '[5,2,3,1]', output: '[1,2,3,5]', explanation: 'Numbers sorted ascending.' },
      { input: '[5,1,1,2,0,0]', output: '[0,0,1,1,2,5]', explanation: 'Duplicates are handled.' }
    ],
    starterCode: `function solve(nums) {
  // Your O(n log n) sorting algorithm here
  return nums.sort((a, b) => a - b);
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[5,2,3,1]]', expectedOutput: '[1,2,3,5]', isHidden: false },
      { input: '[[5,1,1,2,0,0]]', expectedOutput: '[0,0,1,1,2,5]', isHidden: false },
      { input: '[[10,-1,3,8,0]]', expectedOutput: '[-1,0,3,8,10]', isHidden: true },
      { input: '[[42]]', expectedOutput: '[42]', isHidden: true }
    ],
    order: 1
  },
  {
    challengeId: 'sort-02',
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element',
    category: 'sorting',
    difficulty: 'Medium',
    points: 20,
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array without a full O(n log n) sort if possible.',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: '[3,2,1,5,6,4], k = 2', output: '5', explanation: 'The 2nd largest element is 5.' }
    ],
    starterCode: `function solve(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[3,2,1,5,6,4], 2]', expectedOutput: '5', isHidden: false },
      { input: '[[3,2,3,1,2,4,5,5,6], 4]', expectedOutput: '4', isHidden: false },
      { input: '[[7,10,4,3,20,15], 3]', expectedOutput: '10', isHidden: true }
    ],
    order: 2
  },

  // --- SEARCHING CHALLENGES ---
  {
    challengeId: 'search-01',
    title: 'Binary Search in Sorted Array',
    slug: 'binary-search-basic',
    category: 'searching',
    difficulty: 'Easy',
    points: 10,
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1 in O(log n) runtime.',
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All elements are unique.'],
    examples: [
      { input: '[-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists at index 4.' },
      { input: '[-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums.' }
    ],
    starterCode: `function solve(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[-1,0,3,5,9,12], 9]', expectedOutput: '4', isHidden: false },
      { input: '[[-1,0,3,5,9,12], 2]', expectedOutput: '-1', isHidden: false },
      { input: '[[5], 5]', expectedOutput: '0', isHidden: true }
    ],
    order: 3
  },
  {
    challengeId: 'search-02',
    title: 'Find Peak Element',
    slug: 'find-peak-element',
    category: 'searching',
    difficulty: 'Medium',
    points: 20,
    description: 'A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element and return its index in O(log n) time.',
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1'],
    examples: [
      { input: '[1,2,3,1]', output: '2', explanation: 'Index 2 has value 3, strictly greater than neighbors.' }
    ],
    starterCode: `function solve(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] > nums[mid + 1]) r = mid;
    else l = mid + 1;
  }
  return l;
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[1,2,3,1]]', expectedOutput: '2', isHidden: false },
      { input: '[[1,2]]', expectedOutput: '1', isHidden: true },
      { input: '[[1]]', expectedOutput: '0', isHidden: true }
    ],
    order: 4
  },

  // --- DATA STRUCTURE CHALLENGES ---
  {
    challengeId: 'ds-01',
    title: 'Valid Parentheses Matching',
    slug: 'valid-parentheses',
    category: 'data-structures',
    difficulty: 'Easy',
    points: 10,
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid using a Stack.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only.'],
    examples: [
      { input: 's = "()[]{}"', output: 'true', explanation: 'Brackets match and close in order.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched closing bracket.' }
    ],
    starterCode: `function solve(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (map[ch]) {
      if (stack.pop() !== map[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    functionName: 'solve',
    testCases: [
      { input: '["()[]{}"]', expectedOutput: 'true', isHidden: false },
      { input: '["(]"]', expectedOutput: 'false', isHidden: false },
      { input: '["([{}])"]', expectedOutput: 'true', isHidden: true },
      { input: '["["]', expectedOutput: 'false', isHidden: true }
    ],
    order: 5
  },
  {
    challengeId: 'ds-02',
    title: 'Implement Min Stack with O(1) GetMin',
    slug: 'min-stack-design',
    category: 'data-structures',
    difficulty: 'Medium',
    points: 20,
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1). Simulate sequence of operations: ops = ["push", 3, "push", 5, "getMin", "pop", "top"].',
    constraints: ['Operations are valid and non-empty for pop/top.'],
    examples: [
      { input: '["push", -2, "push", 0, "push", -3, "getMin", "pop", "top", "getMin"]', output: '[-3, 0, -2]', explanation: 'Min Stack returns values correctly.' }
    ],
    starterCode: `function solve(operations) {
  const stack = [];
  const minStack = [];
  const results = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (op === 'push') {
      const val = operations[++i];
      stack.push(val);
      if (minStack.length === 0 || val <= minStack[minStack.length - 1]) minStack.push(val);
    } else if (op === 'pop') {
      const val = stack.pop();
      if (val === minStack[minStack.length - 1]) minStack.pop();
    } else if (op === 'top') {
      results.push(stack[stack.length - 1]);
    } else if (op === 'getMin') {
      results.push(minStack[minStack.length - 1]);
    }
  }
  return results;
}`,
    functionName: 'solve',
    testCases: [
      { input: '[["push", -2, "push", 0, "push", -3, "getMin", "pop", "top", "getMin"]]', expectedOutput: '[-3,0,-2]', isHidden: false }
    ],
    order: 6
  },

  // --- TREES CHALLENGES ---
  {
    challengeId: 'tree-01',
    title: 'Maximum Depth of Binary Tree',
    slug: 'max-depth-binary-tree',
    category: 'trees',
    difficulty: 'Easy',
    points: 10,
    description: 'Given the root of a binary tree represented as an array (level-order traversal where null denotes empty child), return its maximum depth.',
    constraints: ['The number of nodes is in range [0, 10^4].'],
    examples: [
      { input: '[3,9,20,null,null,15,7]', output: '3', explanation: 'Root 3 has depth 3 through 20 -> 15.' }
    ],
    starterCode: `function solve(treeArr) {
  if (!treeArr || treeArr.length === 0 || treeArr[0] === null) return 0;
  // Compute max depth from array representation
  function getDepth(idx) {
    if (idx >= treeArr.length || treeArr[idx] === null) return 0;
    return 1 + Math.max(getDepth(2 * idx + 1), getDepth(2 * idx + 2));
  }
  return getDepth(0);
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[3,9,20,null,null,15,7]]', expectedOutput: '3', isHidden: false },
      { input: '[[1,null,2]]', expectedOutput: '2', isHidden: true },
      { input: '[[]]', expectedOutput: '0', isHidden: true }
    ],
    order: 7
  },
  {
    challengeId: 'tree-02',
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    category: 'trees',
    difficulty: 'Medium',
    points: 20,
    description: 'Given an array representation of a binary tree, determine if it is a valid Binary Search Tree (BST) where every left child is strictly smaller and every right child strictly larger.',
    constraints: ['Node values are in range [-2^31, 2^31 - 1].'],
    examples: [
      { input: '[2,1,3]', output: 'true', explanation: 'Left 1 < 2 < Right 3.' },
      { input: '[5,1,4,null,null,3,6]', output: 'false', explanation: 'Root 5 is greater than right child 4.' }
    ],
    starterCode: `function solve(treeArr) {
  if (!treeArr || treeArr.length === 0) return true;
  function isValid(idx, min, max) {
    if (idx >= treeArr.length || treeArr[idx] === null) return true;
    const val = treeArr[idx];
    if (val <= min || val >= max) return false;
    return isValid(2 * idx + 1, min, val) && isValid(2 * idx + 2, val, max);
  }
  return isValid(0, -Infinity, Infinity);
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[2,1,3]]', expectedOutput: 'true', isHidden: false },
      { input: '[[5,1,4,null,null,3,6]]', expectedOutput: 'false', isHidden: false },
      { input: '[[10,5,15,null,null,6,20]]', expectedOutput: 'false', isHidden: true }
    ],
    order: 8
  },

  // --- GRAPH CHALLENGES ---
  {
    challengeId: 'graph-01',
    title: 'Shortest Path in Unweighted Graph (BFS)',
    slug: 'shortest-path-unweighted-graph',
    category: 'graphs',
    difficulty: 'Medium',
    points: 20,
    description: 'Given an undirected graph with n nodes (0 to n-1) and an edges array, find the shortest distance from node start to node target. Return -1 if unreachable.',
    constraints: ['1 <= n <= 1000', 'edges.length <= 5000'],
    examples: [
      { input: 'n = 4, edges = [[0,1],[1,2],[2,3],[0,2]], start = 0, target = 3', output: '2', explanation: 'Path 0 -> 2 -> 3 has length 2.' }
    ],
    starterCode: `function solve(n, edges, start, target) {
  if (start === target) return 0;
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    if (node === target) return dist;
    for (const neighbor of adj[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return -1;
}`,
    functionName: 'solve',
    testCases: [
      { input: '[4, [[0,1],[1,2],[2,3],[0,2]], 0, 3]', expectedOutput: '2', isHidden: false },
      { input: '[3, [[0,1]], 0, 2]', expectedOutput: '-1', isHidden: false },
      { input: '[5, [[0,1],[1,2],[2,3],[3,4]], 0, 4]', expectedOutput: '4', isHidden: true }
    ],
    order: 9
  },

  // --- GENERAL DSA CHALLENGES ---
  {
    challengeId: 'gen-01',
    title: 'Two Sum Problem',
    slug: 'two-sum-linear-time',
    category: 'general-dsa',
    difficulty: 'Easy',
    points: 10,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) time.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9.' }
    ],
    starterCode: `function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    functionName: 'solve',
    testCases: [
      { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false },
      { input: '[[3,2,4], 6]', expectedOutput: '[1,2]', isHidden: false },
      { input: '[[3,3], 6]', expectedOutput: '[0,1]', isHidden: true }
    ],
    order: 10
  }
];

export function getChallengeById(id) {
  return COMPETITION_CHALLENGES.find(c => c.challengeId === id) || null;
}
