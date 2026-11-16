/**
 * Authoritative Competition Challenges Catalog for AlgoMania.
 * 227 unique, deterministic DSA challenges spanning 15 algorithmic categories.
 * Legitimately supports Bronze (20), Silver (100), and Gold (200) milestone thresholds.
 */
export const COMPETITION_CHALLENGES = [
  {
    "challengeId": "arr-01",
    "title": "Two Sum Target Index",
    "slug": "arr-01-two-sum-target-index",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] = 9"
      }
    ],
    "starterCode": "function solve(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,7,11,15], 9]",
        "expectedOutput": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[[3,2,4], 6]",
        "expectedOutput": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[[3,3], 6]",
        "expectedOutput": "[0,1]",
        "isHidden": true
      }
    ],
    "order": 1
  },
  {
    "challengeId": "arr-02",
    "title": "Best Time to Buy and Sell Stock",
    "slug": "arr-02-best-time-to-buy-and-sell-stock",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find maximum profit by choosing a single day to buy one stock and choosing a future day to sell.",
    "constraints": [
      "1 <= prices.length <= 10^5"
    ],
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "explanation": "Buy on day 2 and sell on day 5."
      }
    ],
    "starterCode": "function solve(prices) {\n  let minP = Infinity, maxP = 0;\n  for (const p of prices) {\n    if (p < minP) minP = p;\n    else if (p - minP > maxP) maxP = p - minP;\n  }\n  return maxP;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[7,1,5,3,6,4]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[7,6,4,3,1]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 2
  },
  {
    "challengeId": "arr-03",
    "title": "Maximum Subarray Sum",
    "slug": "arr-03-maximum-subarray-sum",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find the contiguous subarray with the largest sum and return its sum.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": "[4,-1,2,1] has sum 6."
      }
    ],
    "starterCode": "function solve(nums) {\n  let maxS = nums[0], curr = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curr = Math.max(nums[i], curr + nums[i]);\n    maxS = Math.max(maxS, curr);\n  }\n  return maxS;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[-2,1,-3,4,-1,2,1,-5,4]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[5,4,-1,7,8]]",
        "expectedOutput": "23",
        "isHidden": true
      }
    ],
    "order": 3
  },
  {
    "challengeId": "arr-04",
    "title": "Contains Duplicate Elements",
    "slug": "arr-04-contains-duplicate-elements",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Return true if any value appears at least twice in the array, otherwise false.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true",
        "explanation": "1 appears twice."
      }
    ],
    "starterCode": "function solve(nums) {\n  return new Set(nums).size !== nums.length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,1]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 4
  },
  {
    "challengeId": "arr-05",
    "title": "Product of Array Except Self",
    "slug": "arr-05-product-of-array-except-self",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Return an array where res[i] is the product of all elements except nums[i] without division in O(n).",
    "constraints": [
      "2 <= nums.length <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": "Products except self."
      }
    ],
    "starterCode": "function solve(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = left;\n    left *= nums[i];\n  }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= right;\n    right *= nums[i];\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4]]",
        "expectedOutput": "[24,12,8,6]",
        "isHidden": false
      },
      {
        "input": "[[-1,1,0,-3,3]]",
        "expectedOutput": "[0,0,9,0,0]",
        "isHidden": false
      }
    ],
    "order": 5
  },
  {
    "challengeId": "arr-06",
    "title": "Rotate Array by K",
    "slug": "arr-06-rotate-array-by-k",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Rotate the array to the right by k steps.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k >= 0"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,4,5,6,7], k = 3",
        "output": "[5,6,7,1,2,3,4]",
        "explanation": "Rotated by 3 steps."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  k %= nums.length;\n  const rev = (l, r) => {\n    while (l < r) {\n      const t = nums[l]; nums[l] = nums[r]; nums[r] = t;\n      l++; r--;\n    }\n  };\n  rev(0, nums.length - 1);\n  rev(0, k - 1);\n  rev(k, nums.length - 1);\n  return nums;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5,6,7], 3]",
        "expectedOutput": "[5,6,7,1,2,3,4]",
        "isHidden": false
      },
      {
        "input": "[[-1,-100,3,99], 2]",
        "expectedOutput": "[3,99,-1,-100]",
        "isHidden": false
      }
    ],
    "order": 6
  },
  {
    "challengeId": "arr-07",
    "title": "Move Zeroes In-Place",
    "slug": "arr-07-move-zeroes-in-place",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Move all zeros to the end of the array while maintaining relative order of non-zero elements.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [0,1,0,3,12]",
        "output": "[1,3,12,0,0]",
        "explanation": "Zeroes shifted to end."
      }
    ],
    "starterCode": "function solve(nums) {\n  let last = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      const t = nums[last]; nums[last] = nums[i]; nums[i] = t;\n      last++;\n    }\n  }\n  return nums;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[0,1,0,3,12]]",
        "expectedOutput": "[1,3,12,0,0]",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "[0]",
        "isHidden": false
      }
    ],
    "order": 7
  },
  {
    "challengeId": "arr-08",
    "title": "Find Minimum in Rotated Sorted Array",
    "slug": "arr-08-find-minimum-in-rotated-sorted-array",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find minimum element in sorted rotated array in O(log n).",
    "constraints": [
      "1 <= nums.length <= 5000"
    ],
    "examples": [
      {
        "input": "nums = [3,4,5,1,2]",
        "output": "1",
        "explanation": "Min is 1."
      }
    ],
    "starterCode": "function solve(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const m = Math.floor((l + r) / 2);\n    if (nums[m] > nums[r]) l = m + 1;\n    else r = m;\n  }\n  return nums[l];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,4,5,1,2]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[4,5,6,7,0,1,2]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 8
  },
  {
    "challengeId": "arr-09",
    "title": "Container With Most Water Area",
    "slug": "arr-09-container-with-most-water-area",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find two lines that with x-axis form a container holding the most water.",
    "constraints": [
      "2 <= height.length <= 10^5"
    ],
    "examples": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": "Max area 49."
      }
    ],
    "starterCode": "function solve(height) {\n  let l = 0, r = height.length - 1, maxA = 0;\n  while (l < r) {\n    maxA = Math.max(maxA, (r - l) * Math.min(height[l], height[r]));\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return maxA;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,8,6,2,5,4,8,3,7]]",
        "expectedOutput": "49",
        "isHidden": false
      },
      {
        "input": "[[1,1]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 9
  },
  {
    "challengeId": "arr-10",
    "title": "3Sum Triplets",
    "slug": "arr-10-3sum-triplets",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find all unique triplets [nums[i], nums[j], nums[k]] that sum to 0.",
    "constraints": [
      "3 <= nums.length <= 3000"
    ],
    "examples": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "explanation": "Triplets summing to zero."
      }
    ],
    "starterCode": "function solve(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const s = nums[i] + nums[l] + nums[r];\n      if (s === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (s < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[-1,0,1,2,-1,-4]]",
        "expectedOutput": "[[-1,-1,2],[-1,0,1]]",
        "isHidden": false
      },
      {
        "input": "[[0,0,0]]",
        "expectedOutput": "[[0,0,0]]",
        "isHidden": false
      }
    ],
    "order": 10
  },
  {
    "challengeId": "arr-11",
    "title": "Missing Number in Arithmetic Sequence",
    "slug": "arr-11-missing-number-in-arithmetic-sequence",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find missing number in range 0 to n.",
    "constraints": [
      "1 <= n <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [3,0,1]",
        "output": "2",
        "explanation": "2 is missing."
      }
    ],
    "starterCode": "function solve(nums) {\n  const n = nums.length;\n  return (n * (n + 1)) / 2 - nums.reduce((a, b) => a + b, 0);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,0,1]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[0,1]]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 11
  },
  {
    "challengeId": "arr-12",
    "title": "Disappeared Numbers in 1 to N",
    "slug": "arr-12-disappeared-numbers-in-1-to-n",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find all numbers in [1, n] that do not appear in the array.",
    "constraints": [
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [4,3,2,7,8,2,3,1]",
        "output": "[5,6]",
        "explanation": "5 and 6 missing."
      }
    ],
    "starterCode": "function solve(nums) {\n  const s = new Set(nums);\n  const res = [];\n  for (let i = 1; i <= nums.length; i++) if (!s.has(i)) res.push(i);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,3,2,7,8,2,3,1]]",
        "expectedOutput": "[5,6]",
        "isHidden": false
      }
    ],
    "order": 12
  },
  {
    "challengeId": "arr-13",
    "title": "Single Number XOR",
    "slug": "arr-13-single-number-xor",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Every element appears twice except one. Find that element.",
    "constraints": [
      "1 <= nums.length <= 3*10^4"
    ],
    "examples": [
      {
        "input": "nums = [2,2,1]",
        "output": "1",
        "explanation": "1 is single."
      }
    ],
    "starterCode": "function solve(nums) {\n  return nums.reduce((a, b) => a ^ b, 0);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,2,1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[4,1,2,1,2]]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "order": 13
  },
  {
    "challengeId": "arr-14",
    "title": "Majority Element Boyer-Moore",
    "slug": "arr-14-majority-element-boyer-moore",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find element that appears more than n/2 times in O(1) space.",
    "constraints": [
      "1 <= n <= 50000"
    ],
    "examples": [
      {
        "input": "nums = [3,2,3]",
        "output": "3",
        "explanation": "3 is majority."
      }
    ],
    "starterCode": "function solve(nums) {\n  let cand = null, c = 0;\n  for (const n of nums) {\n    if (c === 0) cand = n;\n    c += (n === cand ? 1 : -1);\n  }\n  return cand;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,2,3]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[2,2,1,1,1,2,2]]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 14
  },
  {
    "challengeId": "arr-15",
    "title": "Subarrays with Given Sum K",
    "slug": "arr-15-subarrays-with-given-sum-k",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Return count of continuous subarrays whose sum equals k.",
    "constraints": [
      "1 <= nums.length <= 20000"
    ],
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2",
        "explanation": "Two subarrays."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  let count = 0, sum = 0;\n  const m = new Map([[0, 1]]);\n  for (const n of nums) {\n    sum += n;\n    if (m.has(sum - k)) count += m.get(sum - k);\n    m.set(sum, (m.get(sum) || 0) + 1);\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,1], 2]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 15
  },
  {
    "challengeId": "arr-16",
    "title": "Maximum Product Subarray",
    "slug": "arr-16-maximum-product-subarray",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find contiguous subarray with largest product.",
    "constraints": [
      "1 <= nums.length <= 20000"
    ],
    "examples": [
      {
        "input": "nums = [2,3,-2,4]",
        "output": "6",
        "explanation": "[2,3] product is 6."
      }
    ],
    "starterCode": "function solve(nums) {\n  let maxP = nums[0], minP = nums[0], res = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const n = nums[i];\n    if (n < 0) { const t = maxP; maxP = minP; minP = t; }\n    maxP = Math.max(n, maxP * n);\n    minP = Math.min(n, minP * n);\n    res = Math.max(res, maxP);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,-2,4]]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "order": 16
  },
  {
    "challengeId": "arr-17",
    "title": "Next Lexicographical Permutation",
    "slug": "arr-17-next-lexicographical-permutation",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Rearrange numbers into the lexicographically next greater permutation of numbers.",
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[1,3,2]",
        "explanation": "Next permutation."
      }
    ],
    "starterCode": "function solve(nums) {\n  let i = nums.length - 2;\n  while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n  if (i >= 0) {\n    let j = nums.length - 1;\n    while (nums[j] <= nums[i]) j--;\n    const t = nums[i]; nums[i] = nums[j]; nums[j] = t;\n  }\n  let l = i + 1, r = nums.length - 1;\n  while (l < r) {\n    const t = nums[l]; nums[l] = nums[r]; nums[r] = t;\n    l++; r--;\n  }\n  return nums;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "[1,3,2]",
        "isHidden": false
      },
      {
        "input": "[[3,2,1]]",
        "expectedOutput": "[1,2,3]",
        "isHidden": false
      }
    ],
    "order": 17
  },
  {
    "challengeId": "arr-18",
    "title": "Find Repeated Element (Floyd Cycle)",
    "slug": "arr-18-find-repeated-element-floyd-cycle",
    "category": "arrays",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find duplicate number in array of n+1 integers in range 1..n without extra memory.",
    "constraints": [
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [1,3,4,2,2]",
        "output": "2",
        "explanation": "2 is repeated."
      }
    ],
    "starterCode": "function solve(nums) {\n  let s = nums[0], f = nums[0];\n  do { s = nums[s]; f = nums[nums[f]]; } while (s !== f);\n  s = nums[0];\n  while (s !== f) { s = nums[s]; f = nums[f]; }\n  return s;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,3,4,2,2]]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 18
  },
  {
    "challengeId": "arr-19",
    "title": "Trapping Rain Water Capacity",
    "slug": "arr-19-trapping-rain-water-capacity",
    "category": "arrays",
    "difficulty": "Hard",
    "points": 30,
    "description": "Compute trapped water units after rain on elevation map.",
    "constraints": [
      "1 <= height.length <= 20000"
    ],
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "Trapped 6 units."
      }
    ],
    "starterCode": "function solve(h) {\n  let l = 0, r = h.length - 1, lm = 0, rm = 0, ans = 0;\n  while (l < r) {\n    if (h[l] < h[r]) {\n      if (h[l] >= lm) lm = h[l];\n      else ans += lm - h[l];\n      l++;\n    } else {\n      if (h[r] >= rm) rm = h[r];\n      else ans += rm - h[r];\n      r--;\n    }\n  }\n  return ans;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[0,1,0,2,1,0,1,3,2,1,2,1]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[4,2,0,3,2,5]]",
        "expectedOutput": "9",
        "isHidden": false
      }
    ],
    "order": 19
  },
  {
    "challengeId": "arr-20",
    "title": "Merge Two Sorted Arrays In-Place",
    "slug": "arr-20-merge-two-sorted-arrays-in-place",
    "category": "arrays",
    "difficulty": "Easy",
    "points": 10,
    "description": "Merge nums2 into nums1 of length m+n in non-decreasing order.",
    "constraints": [
      "nums1.length == m+n"
    ],
    "examples": [
      {
        "input": "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        "output": "[1,2,2,3,5,6]",
        "explanation": "Merged array."
      }
    ],
    "starterCode": "function solve(nums1, m, nums2, n) {\n  let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n  while (p2 >= 0) {\n    if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n    else nums1[p--] = nums2[p2--];\n  }\n  return nums1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,0,0,0], 3, [2,5,6], 3]",
        "expectedOutput": "[1,2,2,3,5,6]",
        "isHidden": false
      }
    ],
    "order": 20
  },
  {
    "challengeId": "str-01",
    "title": "Valid Palindrome Alphanumeric",
    "slug": "str-01-valid-palindrome-alphanumeric",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Return true if s is a palindrome after converting to lowercase and removing non-alphanumeric chars.",
    "constraints": [
      "1 <= s.length <= 2*10^5"
    ],
    "examples": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true",
        "explanation": "\"amanaplanacanalpanama\" is a palindrome."
      }
    ],
    "starterCode": "function solve(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  return clean === clean.split(\"\").reverse().join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"A man, a plan, a canal: Panama\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"race a car\"]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 21
  },
  {
    "challengeId": "str-02",
    "title": "Valid Anagram Check",
    "slug": "str-02-valid-anagram-check",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given strings s and t, return true if t is an anagram of s, otherwise false.",
    "constraints": [
      "1 <= s.length, t.length <= 5*10^4"
    ],
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "explanation": "Same character counts."
      }
    ],
    "starterCode": "function solve(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"anagram\", \"nagaram\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"rat\", \"car\"]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 22
  },
  {
    "challengeId": "str-03",
    "title": "Longest Common Prefix",
    "slug": "str-03-longest-common-prefix",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find the longest common prefix string amongst an array of strings.",
    "constraints": [
      "1 <= strs.length <= 200"
    ],
    "examples": [
      {
        "input": "strs = [\"flower\",\"flow\",\"flight\"]",
        "output": "\"fl\"",
        "explanation": "Common prefix is \"fl\"."
      }
    ],
    "starterCode": "function solve(strs) {\n  if (!strs.length) return \"\";\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (strs[i].indexOf(prefix) !== 0) {\n      prefix = prefix.slice(0, -1);\n      if (!prefix) return \"\";\n    }\n  }\n  return prefix;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"flower\",\"flow\",\"flight\"]]",
        "expectedOutput": "\"fl\"",
        "isHidden": false
      },
      {
        "input": "[[\"dog\",\"racecar\",\"car\"]]",
        "expectedOutput": "\"\"",
        "isHidden": false
      }
    ],
    "order": 23
  },
  {
    "challengeId": "str-04",
    "title": "Longest Substring Without Repeating Characters",
    "slug": "str-04-longest-substring-without-repeating-characters",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Find length of longest substring without repeating characters in O(n).",
    "constraints": [
      "0 <= s.length <= 5*10^4"
    ],
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "\"abc\" length is 3."
      }
    ],
    "starterCode": "function solve(s) {\n  let maxLen = 0, l = 0;\n  const seen = new Map();\n  for (let r = 0; r < s.length; r++) {\n    if (seen.has(s[r]) && seen.get(s[r]) >= l) l = seen.get(s[r]) + 1;\n    seen.set(s[r], r);\n    maxLen = Math.max(maxLen, r - l + 1);\n  }\n  return maxLen;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abcabcbb\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"bbbbb\"]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[\"pwwkew\"]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "order": 24
  },
  {
    "challengeId": "str-05",
    "title": "Longest Palindromic Substring",
    "slug": "str-05-longest-palindromic-substring",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given string s, return the longest palindromic substring in s.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\"",
        "explanation": "\"aba\" is also valid."
      }
    ],
    "starterCode": "function solve(s) {\n  let start = 0, maxLen = 0;\n  const expand = (l, r) => {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n    if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }\n  };\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return s.substring(start, start + maxLen);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"babad\"]",
        "expectedOutput": "\"bab\"",
        "isHidden": false
      },
      {
        "input": "[\"cbbd\"]",
        "expectedOutput": "\"bb\"",
        "isHidden": false
      }
    ],
    "order": 25
  },
  {
    "challengeId": "str-06",
    "title": "Reverse String In-Place",
    "slug": "str-06-reverse-string-in-place",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Write a function that reverses an array of characters in-place.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "examples": [
      {
        "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
        "explanation": "Reversed string."
      }
    ],
    "starterCode": "function solve(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    const t = s[l]; s[l] = s[r]; s[r] = t;\n    l++; r--;\n  }\n  return s;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"h\",\"e\",\"l\",\"l\",\"o\"]]",
        "expectedOutput": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
        "isHidden": false
      }
    ],
    "order": 26
  },
  {
    "challengeId": "str-07",
    "title": "Reverse Words in a String",
    "slug": "str-07-reverse-words-in-a-string",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Reverse the order of words in a string, reducing multiple spaces to a single space.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "examples": [
      {
        "input": "s = \"the sky is blue\"",
        "output": "\"blue is sky the\"",
        "explanation": "Words reversed."
      }
    ],
    "starterCode": "function solve(s) {\n  return s.trim().split(/\\s+/).reverse().join(\" \");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"the sky is blue\"]",
        "expectedOutput": "\"blue is sky the\"",
        "isHidden": false
      },
      {
        "input": "[\"  hello world  \"]",
        "expectedOutput": "\"world hello\"",
        "isHidden": false
      }
    ],
    "order": 27
  },
  {
    "challengeId": "str-08",
    "title": "Roman to Integer Conversion",
    "slug": "str-08-roman-to-integer-conversion",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Convert a roman numeral string to an integer.",
    "constraints": [
      "1 <= s.length <= 15"
    ],
    "examples": [
      {
        "input": "s = \"MCMXCIV\"",
        "output": "1994",
        "explanation": "M = 1000, CM = 900, XC = 90, IV = 4."
      }
    ],
    "starterCode": "function solve(s) {\n  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let sum = 0;\n  for (let i = 0; i < s.length; i++) {\n    const cur = map[s[i]], next = map[s[i + 1]];\n    if (next && cur < next) sum -= cur;\n    else sum += cur;\n  }\n  return sum;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"MCMXCIV\"]",
        "expectedOutput": "1994",
        "isHidden": false
      },
      {
        "input": "[\"LVIII\"]",
        "expectedOutput": "58",
        "isHidden": false
      }
    ],
    "order": 28
  },
  {
    "challengeId": "str-09",
    "title": "First Unique Character Index",
    "slug": "str-09-first-unique-character-index",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Find the first non-repeating character in a string and return its index, or -1.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "examples": [
      {
        "input": "s = \"leetcode\"",
        "output": "0",
        "explanation": "\"l\" is unique at index 0."
      }
    ],
    "starterCode": "function solve(s) {\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (let i = 0; i < s.length; i++) if (count[s[i]] === 1) return i;\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"leetcode\"]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[\"loveleetcode\"]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[\"aabb\"]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "order": 29
  },
  {
    "challengeId": "str-10",
    "title": "Length of Last Word",
    "slug": "str-10-length-of-last-word",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a string s consisting of words and spaces, return length of the last word.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "examples": [
      {
        "input": "s = \"Hello World\"",
        "output": "5",
        "explanation": "Last word is \"World\" of length 5."
      }
    ],
    "starterCode": "function solve(s) {\n  const words = s.trim().split(/\\s+/);\n  return words[words.length - 1].length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"Hello World\"]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[\"   fly me   to   the moon  \"]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "order": 30
  },
  {
    "challengeId": "str-11",
    "title": "Isomorphic Strings",
    "slug": "str-11-isomorphic-strings",
    "category": "strings",
    "difficulty": "Easy",
    "points": 10,
    "description": "Determine if two strings s and t are isomorphic with 1-to-1 character mapping.",
    "constraints": [
      "s.length == t.length"
    ],
    "examples": [
      {
        "input": "s = \"egg\", t = \"add\"",
        "output": "true",
        "explanation": "e->a, g->d."
      }
    ],
    "starterCode": "function solve(s, t) {\n  const m1 = {}, m2 = {};\n  for (let i = 0; i < s.length; i++) {\n    if (m1[s[i]] !== m2[t[i]]) return false;\n    m1[s[i]] = i + 1; m2[t[i]] = i + 1;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"egg\", \"add\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"foo\", \"bar\"]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 31
  },
  {
    "challengeId": "str-12",
    "title": "Count and Say Sequence",
    "slug": "str-12-count-and-say-sequence",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Run-length encoding sequence generator for nth element.",
    "constraints": [
      "1 <= n <= 30"
    ],
    "examples": [
      {
        "input": "n = 4",
        "output": "\"1211\"",
        "explanation": "1, 11, 21, 1211."
      }
    ],
    "starterCode": "function solve(n) {\n  let s = \"1\";\n  for (let i = 1; i < n; i++) {\n    let next = \"\", count = 1;\n    for (let j = 0; j < s.length; j++) {\n      if (s[j] === s[j + 1]) count++;\n      else { next += count + s[j]; count = 1; }\n    }\n    s = next;\n  }\n  return s;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[4]",
        "expectedOutput": "\"1211\"",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "\"1\"",
        "isHidden": false
      }
    ],
    "order": 32
  },
  {
    "challengeId": "str-13",
    "title": "Valid Parentheses String (with *)",
    "slug": "str-13-valid-parentheses-string-with",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Determine if string is valid where \"*\" can be treated as \"(\", \")\", or \"\".",
    "constraints": [
      "1 <= s.length <= 100"
    ],
    "examples": [
      {
        "input": "s = \"(*))\"",
        "output": "true",
        "explanation": "* treated as (."
      }
    ],
    "starterCode": "function solve(s) {\n  let cmin = 0, cmax = 0;\n  for (const c of s) {\n    if (c === \"(\") { cmax++; cmin++; }\n    else if (c === \")\") { cmax--; cmin = Math.max(cmin - 1, 0); }\n    else { cmax++; cmin = Math.max(cmin - 1, 0); }\n    if (cmax < 0) return false;\n  }\n  return cmin === 0;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"(*))\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"()\"]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "order": 33
  },
  {
    "challengeId": "str-14",
    "title": "Minimum Window Substring",
    "slug": "str-14-minimum-window-substring",
    "category": "strings",
    "difficulty": "Hard",
    "points": 30,
    "description": "Find minimum window in s which will contain all characters in t in O(m+n).",
    "constraints": [
      "1 <= s.length, t.length <= 10^5"
    ],
    "examples": [
      {
        "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
        "output": "\"BANC\"",
        "explanation": "\"BANC\" contains A, B, C."
      }
    ],
    "starterCode": "function solve(s, t) {\n  if (!s || !t) return \"\";\n  const map = {};\n  for (const c of t) map[c] = (map[c] || 0) + 1;\n  let l = 0, r = 0, count = Object.keys(map).length, minLen = Infinity, start = 0;\n  while (r < s.length) {\n    const c = s[r];\n    if (map[c] !== undefined) {\n      map[c]--;\n      if (map[c] === 0) count--;\n    }\n    r++;\n    while (count === 0) {\n      if (r - l < minLen) { minLen = r - l; start = l; }\n      const lc = s[l];\n      if (map[lc] !== undefined) {\n        map[lc]++;\n        if (map[lc] > 0) count++;\n      }\n      l++;\n    }\n  }\n  return minLen === Infinity ? \"\" : s.substring(start, start + minLen);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"ADOBECODEBANC\", \"ABC\"]",
        "expectedOutput": "\"BANC\"",
        "isHidden": false
      },
      {
        "input": "[\"a\", \"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": false
      }
    ],
    "order": 34
  },
  {
    "challengeId": "str-15",
    "title": "Encode and Decode Strings",
    "slug": "str-15-encode-and-decode-strings",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Design an algorithm to encode a list of strings to a single string and decode it back.",
    "constraints": [
      "0 <= strs.length <= 200"
    ],
    "examples": [
      {
        "input": "strs = [\"hello\",\"world\"]",
        "output": "[\"hello\",\"world\"]",
        "explanation": "Decoded equal to input."
      }
    ],
    "starterCode": "function solve(strs) {\n  const encoded = strs.map(s => s.length + \"#\" + s).join(\"\");\n  const res = [];\n  let i = 0;\n  while (i < encoded.length) {\n    const hash = encoded.indexOf(\"#\", i);\n    const len = parseInt(encoded.substring(i, hash), 10);\n    res.push(encoded.substring(hash + 1, hash + 1 + len));\n    i = hash + 1 + len;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"hello\",\"world\"]]",
        "expectedOutput": "[\"hello\",\"world\"]",
        "isHidden": false
      },
      {
        "input": "[[\"\"]]",
        "expectedOutput": "[\"\"]",
        "isHidden": false
      }
    ],
    "order": 35
  },
  {
    "challengeId": "str-16",
    "title": "String to Integer (atoi)",
    "slug": "str-16-string-to-integer-atoi",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Implement myAtoi which converts a string to a 32-bit signed integer.",
    "constraints": [
      "0 <= s.length <= 200"
    ],
    "examples": [
      {
        "input": "s = \"   -42\"",
        "output": "-42",
        "explanation": "Converted -42."
      }
    ],
    "starterCode": "function solve(s) {\n  let i = 0, sign = 1, res = 0;\n  s = s.trim();\n  if (!s.length) return 0;\n  if (s[0] === \"-\") { sign = -1; i++; }\n  else if (s[0] === \"+\") i++;\n  const max = 2147483647, min = -2147483648;\n  while (i < s.length && s[i] >= \"0\" && s[i] <= \"9\") {\n    res = res * 10 + (s.charCodeAt(i) - 48);\n    if (sign * res > max) return max;\n    if (sign * res < min) return min;\n    i++;\n  }\n  return sign * res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"   -42\"]",
        "expectedOutput": "-42",
        "isHidden": false
      },
      {
        "input": "[\"4193 with words\"]",
        "expectedOutput": "4193",
        "isHidden": false
      }
    ],
    "order": 36
  },
  {
    "challengeId": "str-17",
    "title": "Zigzag Conversion",
    "slug": "str-17-zigzag-conversion",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Convert string to zigzag pattern across numRows rows.",
    "constraints": [
      "1 <= s.length <= 1000",
      "1 <= numRows <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"PAYPALISHIRING\", numRows = 3",
        "output": "\"PAHNAPLSIIGYIR\"",
        "explanation": "Zigzag row reading."
      }
    ],
    "starterCode": "function solve(s, numRows) {\n  if (numRows === 1 || s.length <= numRows) return s;\n  const rows = new Array(numRows).fill(\"\");\n  let cur = 0, goingDown = false;\n  for (const c of s) {\n    rows[cur] += c;\n    if (cur === 0 || cur === numRows - 1) goingDown = !goingDown;\n    cur += goingDown ? 1 : -1;\n  }\n  return rows.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"PAYPALISHIRING\", 3]",
        "expectedOutput": "\"PAHNAPLSIIGYIR\"",
        "isHidden": false
      }
    ],
    "order": 37
  },
  {
    "challengeId": "str-18",
    "title": "Palindromic Substrings Count",
    "slug": "str-18-palindromic-substrings-count",
    "category": "strings",
    "difficulty": "Medium",
    "points": 20,
    "description": "Count total number of palindromic substrings in s.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"abc\"",
        "output": "3",
        "explanation": "\"a\", \"b\", \"c\"."
      }
    ],
    "starterCode": "function solve(s) {\n  let count = 0;\n  const exp = (l, r) => {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; }\n  };\n  for (let i = 0; i < s.length; i++) {\n    exp(i, i);\n    exp(i, i + 1);\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abc\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"aaa\"]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "order": 38
  },
  {
    "challengeId": "sort-01",
    "title": "Sort an Array Ascending",
    "slug": "sort-01-sort-an-array-ascending",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an array of integers nums, sort the array in ascending order and return it.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-50000 <= nums[i] <= 50000"
    ],
    "examples": [
      {
        "input": "nums = [5,2,3,1]",
        "output": "[1,2,3,5]",
        "explanation": "Sorted in ascending order."
      }
    ],
    "starterCode": "function solve(nums) {\n  return nums.slice().sort((a, b) => a - b);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[5,2,3,1]]",
        "expectedOutput": "[1,2,3,5]",
        "isHidden": false
      },
      {
        "input": "[[5,1,1,2,0,0]]",
        "expectedOutput": "[0,0,1,1,2,5]",
        "isHidden": false
      },
      {
        "input": "[[10,-1,3,8,0]]",
        "expectedOutput": "[-1,0,3,8,10]",
        "isHidden": true
      },
      {
        "input": "[[42]]",
        "expectedOutput": "[42]",
        "isHidden": true
      }
    ],
    "order": 39
  },
  {
    "challengeId": "sort-02",
    "title": "Kth Largest Element in an Array",
    "slug": "sort-02-kth-largest-element-in-an-array",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums and an integer k, return the kth largest element in the array.",
    "constraints": [
      "1 <= k <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5",
        "explanation": "Second largest is 5."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const sorted = nums.slice().sort((a, b) => b - a);\n  return sorted[k - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,2,1,5,6,4], 2]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[3,2,3,1,2,4,5,5,6], 4]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[7,10,4,3,20,15], 3]",
        "expectedOutput": "10",
        "isHidden": true
      }
    ],
    "order": 40
  },
  {
    "challengeId": "sort-03",
    "title": "Merge Sorted Array In-Place Values",
    "slug": "sort-03-merge-sorted-array-in-place-values",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two sorted arrays nums1 and nums2, merge them into a single sorted array and return it.",
    "constraints": [
      "0 <= nums1.length, nums2.length <= 1000",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums1 = [1,2,3], nums2 = [2,5,6]",
        "output": "[1,2,2,3,5,6]",
        "explanation": "Merged sorted array."
      }
    ],
    "starterCode": "function solve(nums1, nums2) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) res.push(nums1[i++]);\n    else res.push(nums2[j++]);\n  }\n  while (i < nums1.length) res.push(nums1[i++]);\n  while (j < nums2.length) res.push(nums2[j++]);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3], [2,5,6]]",
        "expectedOutput": "[1,2,2,3,5,6]",
        "isHidden": false
      },
      {
        "input": "[[1], []]",
        "expectedOutput": "[1]",
        "isHidden": false
      },
      {
        "input": "[[], [1]]",
        "expectedOutput": "[1]",
        "isHidden": true
      },
      {
        "input": "[[4,5,6], [1,2,3]]",
        "expectedOutput": "[1,2,3,4,5,6]",
        "isHidden": true
      }
    ],
    "order": 41
  },
  {
    "challengeId": "sort-04",
    "title": "Sort Colors Dutch National Flag",
    "slug": "sort-04-sort-colors-dutch-national-flag",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array nums with n objects colored red, white, or blue represented by 0, 1, and 2, sort them in-place so that objects of the same color are adjacent.",
    "constraints": [
      "1 <= nums.length <= 1000",
      "nums[i] is either 0, 1, or 2"
    ],
    "examples": [
      {
        "input": "nums = [2,0,2,1,1,0]",
        "output": "[0,0,1,1,2,2]",
        "explanation": "Sorted 0s then 1s then 2s."
      }
    ],
    "starterCode": "function solve(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  const a = nums.slice();\n  while (mid <= high) {\n    if (a[mid] === 0) {\n      [a[low], a[mid]] = [a[mid], a[low]];\n      low++; mid++;\n    } else if (a[mid] === 1) {\n      mid++;\n    } else {\n      [a[mid], a[high]] = [a[high], a[mid]];\n      high--;\n    }\n  }\n  return a;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,0,2,1,1,0]]",
        "expectedOutput": "[0,0,1,1,2,2]",
        "isHidden": false
      },
      {
        "input": "[[2,0,1]]",
        "expectedOutput": "[0,1,2]",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "[0]",
        "isHidden": true
      },
      {
        "input": "[[1,1,0,2,2,0]]",
        "expectedOutput": "[0,0,1,1,2,2]",
        "isHidden": true
      }
    ],
    "order": 42
  },
  {
    "challengeId": "sort-05",
    "title": "Largest Number from Digits",
    "slug": "sort-05-largest-number-from-digits",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a list of non-negative integers nums, arrange them such that they form the largest number and return it as a string.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [10,2]",
        "output": "\"210\"",
        "explanation": "210 is larger than 102."
      }
    ],
    "starterCode": "function solve(nums) {\n  const strs = nums.map(String);\n  strs.sort((a, b) => (b + a).localeCompare(a + b));\n  if (strs[0] === \"0\") return \"0\";\n  return strs.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[10,2]]",
        "expectedOutput": "\"210\"",
        "isHidden": false
      },
      {
        "input": "[[3,30,34,5,9]]",
        "expectedOutput": "\"9534330\"",
        "isHidden": false
      },
      {
        "input": "[[0,0]]",
        "expectedOutput": "\"0\"",
        "isHidden": true
      },
      {
        "input": "[[1]]",
        "expectedOutput": "\"1\"",
        "isHidden": true
      }
    ],
    "order": 43
  },
  {
    "challengeId": "sort-06",
    "title": "Merge Intervals",
    "slug": "sort-06-merge-intervals",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2"
    ],
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": "[1,3] and [2,6] overlap into [1,6]."
      }
    ],
    "starterCode": "function solve(intervals) {\n  if (!intervals.length) return [];\n  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);\n  const res = [sorted[0]];\n  for (let i = 1; i < sorted.length; i++) {\n    const curr = sorted[i];\n    const last = res[res.length - 1];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      res.push(curr);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,3],[2,6],[8,10],[15,18]]]",
        "expectedOutput": "[[1,6],[8,10],[15,18]]",
        "isHidden": false
      },
      {
        "input": "[[[1,4],[4,5]]]",
        "expectedOutput": "[[1,5]]",
        "isHidden": false
      },
      {
        "input": "[[[1,4],[0,4]]]",
        "expectedOutput": "[[0,4]]",
        "isHidden": true
      },
      {
        "input": "[[[1,4],[2,3]]]",
        "expectedOutput": "[[1,4]]",
        "isHidden": true
      }
    ],
    "order": 44
  },
  {
    "challengeId": "sort-07",
    "title": "Non-overlapping Intervals Count",
    "slug": "sort-07-non-overlapping-intervals-count",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "starti < endi"
    ],
    "examples": [
      {
        "input": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        "output": "1",
        "explanation": "Removing [1,3] leaves non-overlapping intervals."
      }
    ],
    "starterCode": "function solve(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 0;\n  let end = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < end) {\n      count++;\n    } else {\n      end = intervals[i][1];\n    }\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,2],[2,3],[3,4],[1,3]]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[[1,2],[1,2],[1,2]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[1,2],[2,3]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 45
  },
  {
    "challengeId": "sort-08",
    "title": "Sort Array by Parity",
    "slug": "sort-08-sort-array-by-parity",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an integer array nums, move all the even integers at the beginning of the array followed by all the odd integers.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "0 <= nums[i] <= 5000"
    ],
    "examples": [
      {
        "input": "nums = [3,1,2,4]",
        "output": "[2,4,3,1]",
        "explanation": "All evens come before odds."
      }
    ],
    "starterCode": "function solve(nums) {\n  const evens = nums.filter(x => x % 2 === 0);\n  const odds = nums.filter(x => x % 2 !== 0);\n  return evens.concat(odds);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,1,2,4]]",
        "expectedOutput": "[2,4,3,1]",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "[0]",
        "isHidden": false
      },
      {
        "input": "[[1,3,5]]",
        "expectedOutput": "[1,3,5]",
        "isHidden": true
      },
      {
        "input": "[[2,4,6]]",
        "expectedOutput": "[2,4,6]",
        "isHidden": true
      }
    ],
    "order": 46
  },
  {
    "challengeId": "sort-09",
    "title": "Relative Sort Array by Custom Order",
    "slug": "sort-09-relative-sort-array-by-custom-order",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two arrays arr1 and arr2, the elements of arr2 are distinct, and all elements in arr2 are in arr1. Sort the elements of arr1 such that the relative ordering of items in arr1 are the same as in arr2. Elements that do not appear in arr2 should be placed at the end in ascending order.",
    "constraints": [
      "1 <= arr1.length, arr2.length <= 1000",
      "arr2 elements are unique"
    ],
    "examples": [
      {
        "input": "arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]",
        "output": "[2,2,2,1,4,3,3,9,6,7,19]",
        "explanation": "Relative order matched."
      }
    ],
    "starterCode": "function solve(arr1, arr2) {\n  const orderMap = new Map();\n  arr2.forEach((val, idx) => orderMap.set(val, idx));\n  return arr1.slice().sort((a, b) => {\n    const hasA = orderMap.has(a);\n    const hasB = orderMap.has(b);\n    if (hasA && hasB) return orderMap.get(a) - orderMap.get(b);\n    if (hasA) return -1;\n    if (hasB) return 1;\n    return a - b;\n  });\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,1,3,2,4,6,7,9,2,19], [2,1,4,3,9,6]]",
        "expectedOutput": "[2,2,2,1,4,3,3,9,6,7,19]",
        "isHidden": false
      },
      {
        "input": "[[28,6,22,8,44,17], [22,28,8,6]]",
        "expectedOutput": "[22,28,8,6,17,44]",
        "isHidden": false
      }
    ],
    "order": 47
  },
  {
    "challengeId": "sort-10",
    "title": "H-Index of Researcher",
    "slug": "sort-10-h-index-of-researcher",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper, return their h-index.",
    "constraints": [
      "1 <= citations.length <= 5000",
      "0 <= citations[i] <= 1000"
    ],
    "examples": [
      {
        "input": "citations = [3,0,6,1,5]",
        "output": "3",
        "explanation": "3 papers have at least 3 citations."
      }
    ],
    "starterCode": "function solve(citations) {\n  citations.sort((a, b) => b - a);\n  let h = 0;\n  for (let i = 0; i < citations.length; i++) {\n    if (citations[i] >= i + 1) h = i + 1;\n    else break;\n  }\n  return h;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,0,6,1,5]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[1,3,1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[[100]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 48
  },
  {
    "challengeId": "sort-11",
    "title": "Maximum Product of Three Numbers",
    "slug": "sort-11-maximum-product-of-three-numbers",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an integer array nums, find three numbers whose product is maximum and return the maximum product.",
    "constraints": [
      "3 <= nums.length <= 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "24",
        "explanation": "2 * 3 * 4 = 24."
      }
    ],
    "starterCode": "function solve(nums) {\n  nums.sort((a, b) => a - b);\n  const n = nums.length;\n  return Math.max(nums[n-1] * nums[n-2] * nums[n-3], nums[0] * nums[1] * nums[n-1]);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4]]",
        "expectedOutput": "24",
        "isHidden": false
      },
      {
        "input": "[[-1,-2,-3]]",
        "expectedOutput": "-6",
        "isHidden": false
      },
      {
        "input": "[[-10,-10,5,2]]",
        "expectedOutput": "500",
        "isHidden": true
      }
    ],
    "order": 49
  },
  {
    "challengeId": "sort-12",
    "title": "Minimum Absolute Difference",
    "slug": "sort-12-minimum-absolute-difference",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an array of distinct integers arr, find all pairs of elements with the minimum absolute difference of any two elements.",
    "constraints": [
      "2 <= arr.length <= 10^4",
      "-10^6 <= arr[i] <= 10^6"
    ],
    "examples": [
      {
        "input": "arr = [4,2,1,3]",
        "output": "[[1,2],[2,3],[3,4]]",
        "explanation": "Min diff is 1."
      }
    ],
    "starterCode": "function solve(arr) {\n  arr.sort((a, b) => a - b);\n  let minDiff = Infinity;\n  for (let i = 1; i < arr.length; i++) {\n    minDiff = Math.min(minDiff, arr[i] - arr[i - 1]);\n  }\n  const res = [];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] - arr[i - 1] === minDiff) {\n      res.push([arr[i - 1], arr[i]]);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,2,1,3]]",
        "expectedOutput": "[[1,2],[2,3],[3,4]]",
        "isHidden": false
      },
      {
        "input": "[[1,3,6,10,15]]",
        "expectedOutput": "[[1,3]]",
        "isHidden": false
      },
      {
        "input": "[[3,8,-10,23,19,-4,-14,27]]",
        "expectedOutput": "[[-14,-10],[19,23],[23,27]]",
        "isHidden": true
      }
    ],
    "order": 50
  },
  {
    "challengeId": "sort-13",
    "title": "Wiggle Sort II",
    "slug": "sort-13-wiggle-sort-ii",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums, reorder it such that nums[0] < nums[1] > nums[2] < nums[3]... Return the reordered array.",
    "constraints": [
      "1 <= nums.length <= 500",
      "0 <= nums[i] <= 5000"
    ],
    "examples": [
      {
        "input": "nums = [1,5,1,1,6,4]",
        "output": "[1,6,1,5,1,4]",
        "explanation": "Valid wiggle sort order."
      }
    ],
    "starterCode": "function solve(nums) {\n  const sorted = nums.slice().sort((a, b) => a - b);\n  const res = new Array(nums.length);\n  let n = nums.length;\n  let mid = Math.floor((n + 1) / 2);\n  let j = mid - 1, k = n - 1;\n  for (let i = 0; i < n; i++) {\n    if (i % 2 === 0) res[i] = sorted[j--];\n    else res[i] = sorted[k--];\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,5,1,1,6,4]]",
        "expectedOutput": "[1,6,1,5,1,4]",
        "isHidden": false
      },
      {
        "input": "[[1,3,2,2,3,1]]",
        "expectedOutput": "[2,3,1,3,1,2]",
        "isHidden": false
      }
    ],
    "order": 51
  },
  {
    "challengeId": "sort-14",
    "title": "Custom Sort String by Precedence",
    "slug": "sort-14-custom-sort-string-by-precedence",
    "category": "sorting",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given two strings order and s. All the characters of order are unique and sorted in custom order. Permute the characters of s so that they match the order in which order was sorted.",
    "constraints": [
      "1 <= order.length <= 26",
      "1 <= s.length <= 200"
    ],
    "examples": [
      {
        "input": "order = \"cba\", s = \"abcd\"",
        "output": "\"cbad\"",
        "explanation": "c, b, a come before d."
      }
    ],
    "starterCode": "function solve(order, s) {\n  const rank = new Map();\n  for (let i = 0; i < order.length; i++) rank.set(order[i], i);\n  return s.split(\"\").sort((a, b) => (rank.get(a) ?? 100) - (rank.get(b) ?? 100)).join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"cba\", \"abcd\"]",
        "expectedOutput": "\"cbad\"",
        "isHidden": false
      },
      {
        "input": "[\"cbafg\", \"abcd\"]",
        "expectedOutput": "\"cbad\"",
        "isHidden": false
      },
      {
        "input": "[\"kqep\", \"pekeq\"]",
        "expectedOutput": "\"kqeep\"",
        "isHidden": true
      }
    ],
    "order": 52
  },
  {
    "challengeId": "sort-15",
    "title": "Minimum Difference Between Highest and Lowest of K Scores",
    "slug": "sort-15-minimum-difference-between-highest-and-lowest-of-k-scores",
    "category": "sorting",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are given an integer array nums and an integer k. Return the minimum possible difference between the highest and lowest of the k scores chosen.",
    "constraints": [
      "1 <= k <= nums.length <= 1000",
      "0 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [90], k = 1",
        "output": "0",
        "explanation": "Choosing 90 gives difference 0."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  if (k <= 1) return 0;\n  nums.sort((a, b) => a - b);\n  let minDiff = Infinity;\n  for (let i = 0; i + k - 1 < nums.length; i++) {\n    minDiff = Math.min(minDiff, nums[i + k - 1] - nums[i]);\n  }\n  return minDiff;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[90], 1]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[9,4,1,7], 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[87063,61094,44430,20080,39867], 3]",
        "expectedOutput": "21227",
        "isHidden": true
      }
    ],
    "order": 53
  },
  {
    "challengeId": "search-01",
    "title": "Binary Search Standard",
    "slug": "search-01-binary-search-standard",
    "category": "searching",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i], target <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "explanation": "9 exists at index 4."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[-1,0,3,5,9,12], 9]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[-1,0,3,5,9,12], 2]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[5], 5]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[[1,3,5,7,9], 8]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "order": 54
  },
  {
    "challengeId": "search-02",
    "title": "Search Insert Position",
    "slug": "search-02-search-insert-position",
    "category": "searching",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "nums contains distinct values sorted in ascending order"
    ],
    "examples": [
      {
        "input": "nums = [1,3,5,6], target = 5",
        "output": "2",
        "explanation": "5 is found at index 2."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,3,5,6], 5]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1,3,5,6], 2]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[1,3,5,6], 7]",
        "expectedOutput": "4",
        "isHidden": true
      },
      {
        "input": "[[1,3,5,6], 0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 55
  },
  {
    "challengeId": "search-03",
    "title": "Find First and Last Position in Sorted Array",
    "slug": "search-03-find-first-and-last-position-in-sorted-array",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found, return [-1, -1].",
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [5,7,7,8,8,10], target = 8",
        "output": "[3,4]",
        "explanation": "Target 8 starts at 3 and ends at 4."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  function findBound(isFirst) {\n    let left = 0, right = nums.length - 1, res = -1;\n    while (left <= right) {\n      const mid = Math.floor((left + right) / 2);\n      if (nums[mid] === target) {\n        res = mid;\n        if (isFirst) right = mid - 1;\n        else left = mid + 1;\n      } else if (nums[mid] < target) left = mid + 1;\n      else right = mid - 1;\n    }\n    return res;\n  }\n  return [findBound(true), findBound(false)];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[5,7,7,8,8,10], 8]",
        "expectedOutput": "[3,4]",
        "isHidden": false
      },
      {
        "input": "[[5,7,7,8,8,10], 6]",
        "expectedOutput": "[-1,-1]",
        "isHidden": false
      },
      {
        "input": "[[], 0]",
        "expectedOutput": "[-1,-1]",
        "isHidden": true
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "[0,0]",
        "isHidden": true
      }
    ],
    "order": 56
  },
  {
    "challengeId": "search-04",
    "title": "Search in Rotated Sorted Array",
    "slug": "search-04-search-in-rotated-sorted-array",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "All values of nums are unique"
    ],
    "examples": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "explanation": "0 is at index 4."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,5,6,7,0,1,2], 0]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[4,5,6,7,0,1,2], 3]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[1], 0]",
        "expectedOutput": "-1",
        "isHidden": true
      },
      {
        "input": "[[3,1], 1]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 57
  },
  {
    "challengeId": "search-05",
    "title": "Find Minimum in Rotated Sorted Array",
    "slug": "search-05-find-minimum-in-rotated-sorted-array",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    "constraints": [
      "1 <= nums.length <= 5000",
      "-5000 <= nums[i] <= 5000"
    ],
    "examples": [
      {
        "input": "nums = [3,4,5,1,2]",
        "output": "1",
        "explanation": "The minimum value is 1."
      }
    ],
    "starterCode": "function solve(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] > nums[right]) left = mid + 1;\n    else right = mid;\n  }\n  return nums[left];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,4,5,1,2]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[4,5,6,7,0,1,2]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[11,13,15,17]]",
        "expectedOutput": "11",
        "isHidden": true
      },
      {
        "input": "[[2,1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 58
  },
  {
    "challengeId": "search-06",
    "title": "Peak Index in Mountain Array",
    "slug": "search-06-peak-index-in-mountain-array",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "An array arr is a mountain if arr[0] < arr[1] < ... < arr[i] > arr[i+1] > ... > arr[arr.length - 1]. Return the index i of the peak element.",
    "constraints": [
      "3 <= arr.length <= 10^5",
      "0 <= arr[i] <= 10^6"
    ],
    "examples": [
      {
        "input": "arr = [0,1,0]",
        "output": "1",
        "explanation": "Peak is at index 1."
      }
    ],
    "starterCode": "function solve(arr) {\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] < arr[mid + 1]) left = mid + 1;\n    else right = mid;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[0,1,0]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[0,2,1,0]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[0,10,5,2]]",
        "expectedOutput": "1",
        "isHidden": true
      },
      {
        "input": "[[3,5,3,2,0]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 59
  },
  {
    "challengeId": "search-07",
    "title": "Square Root Integer Approximation",
    "slug": "search-07-square-root-integer-approximation",
    "category": "searching",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a non-negative integer x, return the square root of x rounded down to the nearest integer.",
    "constraints": [
      "0 <= x <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "x = 4",
        "output": "2",
        "explanation": "sqrt(4) = 2."
      }
    ],
    "starterCode": "function solve(x) {\n  if (x < 2) return x;\n  let left = 1, right = Math.floor(x / 2), ans = 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (mid * mid === x) return mid;\n    if (mid * mid < x) {\n      ans = mid;\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return ans;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[4]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[8]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": true
      },
      {
        "input": "[2147395599]",
        "expectedOutput": "46339",
        "isHidden": true
      }
    ],
    "order": 60
  },
  {
    "challengeId": "search-08",
    "title": "Find Peak Element",
    "slug": "search-08-find-peak-element",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index.",
    "constraints": [
      "1 <= nums.length <= 1000",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "2",
        "explanation": "3 is peak at index 2."
      }
    ],
    "starterCode": "function solve(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] > nums[mid + 1]) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,1]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1,2,1,3,5,6,4]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 61
  },
  {
    "challengeId": "search-09",
    "title": "Search a 2D Matrix",
    "slug": "search-09-search-a-2d-matrix",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an m x n integer matrix matrix with properties: Each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row. Return true if target is in matrix or false otherwise.",
    "constraints": [
      "m == matrix.length, n == matrix[i].length",
      "1 <= m, n <= 100"
    ],
    "examples": [
      {
        "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        "output": "true",
        "explanation": "3 is present."
      }
    ],
    "starterCode": "function solve(matrix, target) {\n  const m = matrix.length, n = matrix[0].length;\n  let left = 0, right = m * n - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    const val = matrix[Math.floor(mid / n)][mid % n];\n    if (val === target) return true;\n    if (val < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return false;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[[[1]], 1]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 62
  },
  {
    "challengeId": "search-10",
    "title": "Koko Eating Bananas",
    "slug": "search-10-koko-eating-bananas",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "Koko loves to eat bananas. There are n piles of bananas. Find the minimum integer k such that she can eat all the bananas within h hours.",
    "constraints": [
      "1 <= piles.length <= 10^4",
      "piles.length <= h <= 10^9"
    ],
    "examples": [
      {
        "input": "piles = [3,6,7,11], h = 8",
        "output": "4",
        "explanation": "At speed 4 she finishes in 8 hours."
      }
    ],
    "starterCode": "function solve(piles, h) {\n  let left = 1, right = Math.max(...piles);\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    let hours = 0;\n    for (const p of piles) hours += Math.ceil(p / mid);\n    if (hours <= h) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,6,7,11], 8]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[30,11,23,4,20], 5]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "input": "[[30,11,23,4,20], 6]",
        "expectedOutput": "23",
        "isHidden": true
      }
    ],
    "order": 63
  },
  {
    "challengeId": "search-11",
    "title": "Single Element in a Sorted Array",
    "slug": "search-11-single-element-in-a-sorted-array",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element in O(log n) time.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "0 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [1,1,2,3,3,4,4,8,8]",
        "output": "2",
        "explanation": "2 appears only once."
      }
    ],
    "starterCode": "function solve(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    let mid = Math.floor((left + right) / 2);\n    if (mid % 2 === 1) mid--;\n    if (nums[mid] === nums[mid + 1]) left = mid + 2;\n    else right = mid;\n  }\n  return nums[left];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,2,3,3,4,4,8,8]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[3,3,7,7,10,11,11]]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 64
  },
  {
    "challengeId": "search-12",
    "title": "Arranging Coins Complete Rows",
    "slug": "search-12-arranging-coins-complete-rows",
    "category": "searching",
    "difficulty": "Easy",
    "points": 10,
    "description": "You have n coins and you want to build a staircase with these coins where row k has k coins. Return the number of complete rows of the staircase you will build.",
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "n = 5",
        "output": "2",
        "explanation": "Row 1 has 1, row 2 has 2 (total 3 coins), 2 remaining."
      }
    ],
    "starterCode": "function solve(n) {\n  let left = 1, right = n, ans = 0;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    const total = (mid * (mid + 1)) / 2;\n    if (total === n) return mid;\n    if (total < n) {\n      ans = mid;\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return ans;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[5]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[8]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 65
  },
  {
    "challengeId": "search-13",
    "title": "Capacity To Ship Packages Within D Days",
    "slug": "search-13-capacity-to-ship-packages-within-d-days",
    "category": "searching",
    "difficulty": "Medium",
    "points": 20,
    "description": "A conveyor belt has packages that must be shipped within days days. Return the least weight capacity of the ship that will result in all packages being shipped within days days.",
    "constraints": [
      "1 <= days <= weights.length <= 5 * 10^4",
      "1 <= weights[i] <= 500"
    ],
    "examples": [
      {
        "input": "weights = [1,2,3,4,5,6,7,8,9,10], days = 5",
        "output": "15",
        "explanation": "Capacity 15 is optimal."
      }
    ],
    "starterCode": "function solve(weights, days) {\n  let left = Math.max(...weights);\n  let right = weights.reduce((a, b) => a + b, 0);\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    let d = 1, cur = 0;\n    for (const w of weights) {\n      if (cur + w > mid) {\n        d++;\n        cur = 0;\n      }\n      cur += w;\n    }\n    if (d <= days) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5,6,7,8,9,10], 5]",
        "expectedOutput": "15",
        "isHidden": false
      },
      {
        "input": "[[3,2,2,4,1,4], 3]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,1,1], 4]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "order": 66
  },
  {
    "challengeId": "search-14",
    "title": "Split Array Largest Sum Minimization",
    "slug": "search-14-split-array-largest-sum-minimization",
    "category": "searching",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum.",
    "constraints": [
      "1 <= nums.length <= 1000",
      "1 <= k <= min(50, nums.length)"
    ],
    "examples": [
      {
        "input": "nums = [7,2,5,10,8], k = 2",
        "output": "18",
        "explanation": "Subarrays [7,2,5] and [10,8] give maximum sum 18."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  let left = Math.max(...nums);\n  let right = nums.reduce((a, b) => a + b, 0);\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    let count = 1, current = 0;\n    for (const n of nums) {\n      if (current + n > mid) {\n        count++;\n        current = n;\n      } else {\n        current += n;\n      }\n    }\n    if (count <= k) right = mid;\n    else left = mid + 1;\n  }\n  return left;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[7,2,5,10,8], 2]",
        "expectedOutput": "18",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4,5], 2]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "[[1,4,4], 3]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "order": 67
  },
  {
    "challengeId": "search-15",
    "title": "Count Negative Numbers in a Sorted Matrix",
    "slug": "search-15-count-negative-numbers-in-a-sorted-matrix",
    "category": "searching",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a m x n matrix grid which is sorted in non-increasing order both row-wise and column-wise, return the number of negative numbers in grid.",
    "constraints": [
      "m == grid.length, n == grid[i].length",
      "1 <= m, n <= 100"
    ],
    "examples": [
      {
        "input": "grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]",
        "output": "8",
        "explanation": "8 negatives in total."
      }
    ],
    "starterCode": "function solve(grid) {\n  let count = 0;\n  const m = grid.length, n = grid[0].length;\n  let row = m - 1, col = 0;\n  while (row >= 0 && col < n) {\n    if (grid[row][col] < 0) {\n      count += (n - col);\n      row--;\n    } else {\n      col++;\n    }\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]]",
        "expectedOutput": "8",
        "isHidden": false
      },
      {
        "input": "[[[3,2],[1,0]]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[[-1]]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 68
  },
  {
    "challengeId": "hash-01",
    "title": "Group Anagrams",
    "slug": "hash-01-group-anagrams",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of strings strs, group the anagrams together. You can return the answer in any order, sorted deterministically by primary item.",
    "constraints": [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100"
    ],
    "examples": [
      {
        "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
        "explanation": "Anagrams grouped."
      }
    ],
    "starterCode": "function solve(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split(\"\").sort().join(\"\");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  const res = Array.from(map.values()).map(arr => arr.sort());\n  return res.sort((a, b) => a[0].localeCompare(b[0]));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]]",
        "expectedOutput": "[[\"ate\",\"eat\",\"tea\"],[\"bat\"],[\"nat\",\"tan\"]]",
        "isHidden": false
      },
      {
        "input": "[[\"\"]]",
        "expectedOutput": "[[\"\"]]",
        "isHidden": false
      },
      {
        "input": "[[\"a\"]]",
        "expectedOutput": "[[\"a\"]]",
        "isHidden": true
      }
    ],
    "order": 69
  },
  {
    "challengeId": "hash-02",
    "title": "Contains Duplicate Identification",
    "slug": "hash-02-contains-duplicate-identification",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true",
        "explanation": "1 occurs twice."
      }
    ],
    "starterCode": "function solve(nums) {\n  return new Set(nums).size < nums.length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,1]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[[1,1,1,3,3,4,3,2,4,2]]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 70
  },
  {
    "challengeId": "hash-03",
    "title": "Subarray Sum Equals K",
    "slug": "hash-03-subarray-sum-equals-k",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2",
        "explanation": "[1,1] at indices 0-1 and 1-2."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const map = new Map();\n  map.set(0, 1);\n  let sum = 0, count = 0;\n  for (const num of nums) {\n    sum += num;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,1], 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1,2,3], 3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1,-1,0], 0]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "order": 71
  },
  {
    "challengeId": "hash-04",
    "title": "Longest Consecutive Sequence",
    "slug": "hash-04-longest-consecutive-sequence",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.",
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "Sequence [1, 2, 3, 4] has length 4."
      }
    ],
    "starterCode": "function solve(nums) {\n  const set = new Set(nums);\n  let maxLen = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let curr = num;\n      let count = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        count++;\n      }\n      maxLen = Math.max(maxLen, count);\n    }\n  }\n  return maxLen;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[100,4,200,1,3,2]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[0,3,7,2,5,8,4,6,0,1]]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 72
  },
  {
    "challengeId": "hash-05",
    "title": "Top K Frequent Elements",
    "slug": "hash-05-top-k-frequent-elements",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums and an integer k, return the k most frequent elements sorted in descending order of frequency.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is in range [1, unique elements]"
    ],
    "examples": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]",
        "explanation": "1 appears 3 times, 2 appears 2 times."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const counts = new Map();\n  for (const n of nums) counts.set(n, (counts.get(n) || 0) + 1);\n  const sorted = Array.from(counts.keys()).sort((a, b) => counts.get(b) - counts.get(a));\n  return sorted.slice(0, k);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,1,2,2,3], 2]",
        "expectedOutput": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "[1]",
        "isHidden": false
      },
      {
        "input": "[[4,1,-1,2,-1,2,3], 2]",
        "expectedOutput": "[-1,2]",
        "isHidden": true
      }
    ],
    "order": 73
  },
  {
    "challengeId": "hash-06",
    "title": "First Unique Character in a String",
    "slug": "hash-06-first-unique-character-in-a-string",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of only lowercase English letters"
    ],
    "examples": [
      {
        "input": "s = \"leetcode\"",
        "output": "0",
        "explanation": "\"l\" is the first unique character."
      }
    ],
    "starterCode": "function solve(s) {\n  const freq = {};\n  for (const ch of s) freq[ch] = (freq[ch] || 0) + 1;\n  for (let i = 0; i < s.length; i++) {\n    if (freq[s[i]] === 1) return i;\n  }\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"leetcode\"]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[\"loveleetcode\"]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[\"aabb\"]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "order": 74
  },
  {
    "challengeId": "hash-07",
    "title": "Intersection of Two Arrays",
    "slug": "hash-07-intersection-of-two-arrays",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and returned sorted.",
    "constraints": [
      "1 <= nums1.length, nums2.length <= 1000",
      "0 <= nums1[i], nums2[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
        "output": "[2]",
        "explanation": "2 is present in both."
      }
    ],
    "starterCode": "function solve(nums1, nums2) {\n  const s1 = new Set(nums1);\n  const s2 = new Set(nums2);\n  const res = [];\n  for (const n of s1) {\n    if (s2.has(n)) res.push(n);\n  }\n  return res.sort((a, b) => a - b);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,2,1], [2,2]]",
        "expectedOutput": "[2]",
        "isHidden": false
      },
      {
        "input": "[[4,9,5], [9,4,9,8,4]]",
        "expectedOutput": "[4,9]",
        "isHidden": false
      },
      {
        "input": "[[1,2,3], [4,5,6]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 75
  },
  {
    "challengeId": "hash-08",
    "title": "Find All Duplicates in an Array",
    "slug": "hash-08-find-all-duplicates-in-an-array",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, return an array of all the integers that appears twice sorted.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [4,3,2,7,8,2,3,1]",
        "output": "[2,3]",
        "explanation": "2 and 3 appear twice."
      }
    ],
    "starterCode": "function solve(nums) {\n  const seen = new Set();\n  const dupes = [];\n  for (const n of nums) {\n    if (seen.has(n)) dupes.push(n);\n    else seen.add(n);\n  }\n  return dupes.sort((a, b) => a - b);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,3,2,7,8,2,3,1]]",
        "expectedOutput": "[2,3]",
        "isHidden": false
      },
      {
        "input": "[[1,1,2]]",
        "expectedOutput": "[1]",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 76
  },
  {
    "challengeId": "hash-09",
    "title": "Happy Number Detection",
    "slug": "hash-09-happy-number-detection",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Write an algorithm to determine if a number n is happy. A happy number reaches 1 when repeatedly replaced by sum of squares of its digits.",
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "n = 19",
        "output": "true",
        "explanation": "19 is a happy number."
      }
    ],
    "starterCode": "function solve(n) {\n  const seen = new Set();\n  while (n !== 1 && !seen.has(n)) {\n    seen.add(n);\n    let sum = 0;\n    while (n > 0) {\n      const d = n % 10;\n      sum += d * d;\n      n = Math.floor(n / 10);\n    }\n    n = sum;\n  }\n  return n === 1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[19]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[2]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[7]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 77
  },
  {
    "challengeId": "hash-10",
    "title": "Word Pattern Matching",
    "slug": "hash-10-word-pattern-matching",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a pattern and a string s, find if s follows the same pattern. A bijection must exist between each letter in pattern and non-empty word in s.",
    "constraints": [
      "1 <= pattern.length <= 300",
      "1 <= s.length <= 3000"
    ],
    "examples": [
      {
        "input": "pattern = \"abba\", s = \"dog cat cat dog\"",
        "output": "true",
        "explanation": "Matches pattern."
      }
    ],
    "starterCode": "function solve(pattern, s) {\n  const words = s.split(\" \");\n  if (pattern.length !== words.length) return false;\n  const pToW = new Map(), wToP = new Map();\n  for (let i = 0; i < pattern.length; i++) {\n    const p = pattern[i], w = words[i];\n    if (pToW.has(p) && pToW.get(p) !== w) return false;\n    if (wToP.has(w) && wToP.get(w) !== p) return false;\n    pToW.set(p, w);\n    wToP.set(w, p);\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abba\", \"dog cat cat dog\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"abba\", \"dog cat cat fish\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[\"aaaa\", \"dog cat cat dog\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 78
  },
  {
    "challengeId": "hash-11",
    "title": "Isomorphic Strings Verification",
    "slug": "hash-11-isomorphic-strings-verification",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two strings s and t, determine if they are isomorphic. Two strings s and t are isomorphic if the characters in s can be replaced to get t.",
    "constraints": [
      "1 <= s.length <= 5 * 10^4",
      "t.length == s.length"
    ],
    "examples": [
      {
        "input": "s = \"egg\", t = \"add\"",
        "output": "true",
        "explanation": "e->a, g->d."
      }
    ],
    "starterCode": "function solve(s, t) {\n  if (s.length !== t.length) return false;\n  const m1 = {}, m2 = {};\n  for (let i = 0; i < s.length; i++) {\n    if (m1[s[i]] !== m2[t[i]]) return false;\n    m1[s[i]] = i + 1;\n    m2[t[i]] = i + 1;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"egg\", \"add\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"foo\", \"bar\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[\"paper\", \"title\"]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 79
  },
  {
    "challengeId": "hash-12",
    "title": "Four Sum II Zero Count",
    "slug": "hash-12-four-sum-ii-zero-count",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given four integer arrays nums1, nums2, nums3, and nums4 all of length n, return the number of tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.",
    "constraints": [
      "n == nums1.length == nums2.length == nums3.length == nums4.length",
      "1 <= n <= 200"
    ],
    "examples": [
      {
        "input": "nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2]",
        "output": "2",
        "explanation": "Two tuples sum to 0."
      }
    ],
    "starterCode": "function solve(nums1, nums2, nums3, nums4) {\n  const sumMap = new Map();\n  for (const a of nums1) {\n    for (const b of nums2) {\n      const s = a + b;\n      sumMap.set(s, (sumMap.get(s) || 0) + 1);\n    }\n  }\n  let count = 0;\n  for (const c of nums3) {\n    for (const d of nums4) {\n      const target = -(c + d);\n      if (sumMap.has(target)) count += sumMap.get(target);\n    }\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2], [-2,-1], [-1,2], [0,2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[0], [0], [0], [0]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 80
  },
  {
    "challengeId": "hash-13",
    "title": "Valid Sudoku Board Verification",
    "slug": "hash-13-valid-sudoku-board-verification",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to standard rules.",
    "constraints": [
      "board.length == 9, board[i].length == 9",
      "board[i][j] is a digit 1-9 or \".\""
    ],
    "examples": [
      {
        "input": "board sample",
        "output": "true",
        "explanation": "Valid configuration."
      }
    ],
    "starterCode": "function solve(board) {\n  const rows = Array.from({length: 9}, () => new Set());\n  const cols = Array.from({length: 9}, () => new Set());\n  const boxes = Array.from({length: 9}, () => new Set());\n  for (let r = 0; r < 9; r++) {\n    for (let c = 0; c < 9; c++) {\n      const val = board[r][c];\n      if (val === \".\") continue;\n      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);\n      if (rows[r].has(val) || cols[c].has(val) || boxes[boxIdx].has(val)) return false;\n      rows[r].add(val);\n      cols[c].add(val);\n      boxes[boxIdx].add(val);\n    }\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 81
  },
  {
    "challengeId": "hash-14",
    "title": "Ransom Note Can Construct",
    "slug": "hash-14-ransom-note-can-construct",
    "category": "hashing",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.",
    "constraints": [
      "1 <= ransomNote.length, magazine.length <= 10^5"
    ],
    "examples": [
      {
        "input": "ransomNote = \"a\", magazine = \"b\"",
        "output": "false",
        "explanation": "Cannot construct."
      }
    ],
    "starterCode": "function solve(ransomNote, magazine) {\n  const map = {};\n  for (const c of magazine) map[c] = (map[c] || 0) + 1;\n  for (const c of ransomNote) {\n    if (!map[c]) return false;\n    map[c]--;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"a\", \"b\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[\"aa\", \"ab\"]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[\"aa\", \"aab\"]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 82
  },
  {
    "challengeId": "hash-15",
    "title": "Continuous Subarray Sum Divisible by K",
    "slug": "hash-15-continuous-subarray-sum-divisible-by-k",
    "category": "hashing",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums and an integer k, return true if nums has a good subarray of size >= 2 whose sum is a multiple of k.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "0 <= nums[i] <= 10^9",
      "1 <= k <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "nums = [23,2,4,6,7], k = 6",
        "output": "true",
        "explanation": "[2, 4] sums to 6 which is multiple."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const map = new Map();\n  map.set(0, -1);\n  let rem = 0;\n  for (let i = 0; i < nums.length; i++) {\n    rem = (rem + nums[i]) % k;\n    if (map.has(rem)) {\n      if (i - map.get(rem) >= 2) return true;\n    } else {\n      map.set(rem, i);\n    }\n  }\n  return false;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[23,2,4,6,7], 6]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[23,2,6,4,7], 6]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[23,2,6,4,7], 13]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 83
  },
  {
    "challengeId": "stack-01",
    "title": "Valid Parentheses Matching",
    "slug": "stack-01-valid-parentheses-matching",
    "category": "stacks",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a string s containing just the characters \"(\", \")\", \"{\", \"}\", \"[\" and \"]\", determine if the input string is valid.",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only ()[]{}"
    ],
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true",
        "explanation": "Valid pair."
      }
    ],
    "starterCode": "function solve(s) {\n  const stack = [];\n  const pairs = { \")\": \"(\", \"}\": \"{\", \"]\": \"[\" };\n  for (const c of s) {\n    if (c === \"(\" || c === \"{\" || c === \"[\") {\n      stack.push(c);\n    } else {\n      if (!stack.length || stack.pop() !== pairs[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"()\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"()[]{}\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"(]\"]",
        "expectedOutput": "false",
        "isHidden": true
      },
      {
        "input": "[\"([)]\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 84
  },
  {
    "challengeId": "stack-02",
    "title": "Daily Temperatures Waiting Days",
    "slug": "stack-02-daily-temperatures-waiting-days",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "examples": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "explanation": "Days until warmer."
      }
    ],
    "starterCode": "function solve(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[73,74,75,71,69,72,76,73]]",
        "expectedOutput": "[1,1,4,2,1,1,0,0]",
        "isHidden": false
      },
      {
        "input": "[[30,40,50,60]]",
        "expectedOutput": "[1,1,1,0]",
        "isHidden": false
      },
      {
        "input": "[[30,60,90]]",
        "expectedOutput": "[1,1,0]",
        "isHidden": true
      }
    ],
    "order": 85
  },
  {
    "challengeId": "stack-03",
    "title": "Min Stack Implementation Simulation",
    "slug": "stack-03-min-stack-implementation-simulation",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Simulate min stack operations: given operations array and values array, return array of results from getMin() and pop() calls.",
    "constraints": [
      "operations in [\"push\", \"pop\", \"top\", \"getMin\"]"
    ],
    "examples": [
      {
        "input": "ops = [\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"], vals = [[-2],[0],[-3],[],[],[],[]]",
        "output": "[-3,0,-2]",
        "explanation": "Min stack results."
      }
    ],
    "starterCode": "function solve(ops, vals) {\n  const stack = [];\n  const minStack = [];\n  const res = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i];\n    if (op === \"push\") {\n      const v = vals[i][0];\n      stack.push(v);\n      if (!minStack.length || v <= minStack[minStack.length - 1]) minStack.push(v);\n    } else if (op === \"pop\") {\n      const v = stack.pop();\n      if (v === minStack[minStack.length - 1]) minStack.pop();\n    } else if (op === \"top\") {\n      res.push(stack[stack.length - 1]);\n    } else if (op === \"getMin\") {\n      res.push(minStack[minStack.length - 1]);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"], [[-2],[0],[-3],[],[],[],[]]]",
        "expectedOutput": "[-3,0,-2]",
        "isHidden": false
      },
      {
        "input": "[[\"push\",\"push\",\"getMin\"], [[1],[2],[]]]",
        "expectedOutput": "[1]",
        "isHidden": false
      }
    ],
    "order": 86
  },
  {
    "challengeId": "stack-04",
    "title": "Evaluate Reverse Polish Notation",
    "slug": "stack-04-evaluate-reverse-polish-notation",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.",
    "constraints": [
      "1 <= tokens.length <= 10^4",
      "Division truncates toward zero"
    ],
    "examples": [
      {
        "input": "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "output": "9",
        "explanation": "((2 + 1) * 3) = 9."
      }
    ],
    "starterCode": "function solve(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (t === \"+\" || t === \"-\" || t === \"*\" || t === \"/\") {\n      const b = stack.pop(), a = stack.pop();\n      if (t === \"+\") stack.push(a + b);\n      else if (t === \"-\") stack.push(a - b);\n      else if (t === \"*\") stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(t));\n    }\n  }\n  return stack[0];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"2\",\"1\",\"+\",\"3\",\"*\"]]",
        "expectedOutput": "9",
        "isHidden": false
      },
      {
        "input": "[[\"4\",\"13\",\"5\",\"/\",\"+\"]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]]",
        "expectedOutput": "22",
        "isHidden": true
      }
    ],
    "order": 87
  },
  {
    "challengeId": "stack-05",
    "title": "Remove All Adjacent Duplicates in String",
    "slug": "stack-05-remove-all-adjacent-duplicates-in-string",
    "category": "stacks",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are given a string s. A duplicate removal consists of choosing two adjacent and equal letters and removing them. Return the final string.",
    "constraints": [
      "1 <= s.length <= 10^5",
      "s consists of lowercase English letters"
    ],
    "examples": [
      {
        "input": "s = \"abbaca\"",
        "output": "\"ca\"",
        "explanation": "bb removed then aa removed."
      }
    ],
    "starterCode": "function solve(s) {\n  const stack = [];\n  for (const c of s) {\n    if (stack.length && stack[stack.length - 1] === c) stack.pop();\n    else stack.push(c);\n  }\n  return stack.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abbaca\"]",
        "expectedOutput": "\"ca\"",
        "isHidden": false
      },
      {
        "input": "[\"azxxzy\"]",
        "expectedOutput": "\"ay\"",
        "isHidden": false
      },
      {
        "input": "[\"a\"]",
        "expectedOutput": "\"a\"",
        "isHidden": true
      }
    ],
    "order": 88
  },
  {
    "challengeId": "stack-06",
    "title": "Next Greater Element I",
    "slug": "stack-06-next-greater-element-i",
    "category": "stacks",
    "difficulty": "Easy",
    "points": 10,
    "description": "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array. Return ans where ans[i] is next greater element of nums1[i] in nums2.",
    "constraints": [
      "1 <= nums1.length <= nums2.length <= 1000",
      "All integers in nums1 and nums2 are unique"
    ],
    "examples": [
      {
        "input": "nums1 = [4,1,2], nums2 = [1,3,4,2]",
        "output": "[-1,3,-1]",
        "explanation": "Next greater elements."
      }
    ],
    "starterCode": "function solve(nums1, nums2) {\n  const map = new Map();\n  const stack = [];\n  for (const n of nums2) {\n    while (stack.length && n > stack[stack.length - 1]) {\n      map.set(stack.pop(), n);\n    }\n    stack.push(n);\n  }\n  return nums1.map(n => map.get(n) ?? -1);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,1,2], [1,3,4,2]]",
        "expectedOutput": "[-1,3,-1]",
        "isHidden": false
      },
      {
        "input": "[[2,4], [1,2,3,4]]",
        "expectedOutput": "[3,-1]",
        "isHidden": false
      }
    ],
    "order": 89
  },
  {
    "challengeId": "stack-07",
    "title": "Asteroid Collision Destruction",
    "slug": "stack-07-asteroid-collision-destruction",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "We are given an array asteroids of integers representing asteroids in a row. For each asteroid, absolute value represents size, sign represents direction (+ right, - left). Find the state of asteroids after all collisions.",
    "constraints": [
      "2 <= asteroids.length <= 10^4",
      "asteroids[i] != 0"
    ],
    "examples": [
      {
        "input": "asteroids = [5,10,-5]",
        "output": "[5,10]",
        "explanation": "10 and -5 collide, 10 wins."
      }
    ],
    "starterCode": "function solve(asteroids) {\n  const stack = [];\n  for (const ast of asteroids) {\n    let alive = true;\n    while (alive && ast < 0 && stack.length && stack[stack.length - 1] > 0) {\n      if (stack[stack.length - 1] < -ast) {\n        stack.pop();\n      } else if (stack[stack.length - 1] === -ast) {\n        stack.pop();\n        alive = false;\n      } else {\n        alive = false;\n      }\n    }\n    if (alive) stack.push(ast);\n  }\n  return stack;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[5,10,-5]]",
        "expectedOutput": "[5,10]",
        "isHidden": false
      },
      {
        "input": "[[8,-8]]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[10,2,-5]]",
        "expectedOutput": "[10]",
        "isHidden": true
      }
    ],
    "order": 90
  },
  {
    "challengeId": "stack-08",
    "title": "Decode Encoded String",
    "slug": "stack-08-decode-encoded-string",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an encoded string, return its decoded string. The encoding rule is: k[encoded_string], where encoded_string inside brackets is repeated exactly k times.",
    "constraints": [
      "1 <= s.length <= 30",
      "s contains lowercase letters, digits, and square brackets"
    ],
    "examples": [
      {
        "input": "s = \"3[a]2[bc]\"",
        "output": "\"aaabcbc\"",
        "explanation": "Decoded properly."
      }
    ],
    "starterCode": "function solve(s) {\n  const countStack = [];\n  const stringStack = [];\n  let curString = \"\";\n  let curNum = 0;\n  for (const c of s) {\n    if (c >= \"0\" && c <= \"9\") {\n      curNum = curNum * 10 + Number(c);\n    } else if (c === \"[\") {\n      countStack.push(curNum);\n      stringStack.push(curString);\n      curNum = 0;\n      curString = \"\";\n    } else if (c === \"]\") {\n      const count = countStack.pop();\n      const prev = stringStack.pop();\n      curString = prev + curString.repeat(count);\n    } else {\n      curString += c;\n    }\n  }\n  return curString;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"3[a]2[bc]\"]",
        "expectedOutput": "\"aaabcbc\"",
        "isHidden": false
      },
      {
        "input": "[\"3[a2[c]]\"]",
        "expectedOutput": "\"accaccacc\"",
        "isHidden": false
      },
      {
        "input": "[\"2[abc]3[cd]ef\"]",
        "expectedOutput": "\"abcabccdcdcdef\"",
        "isHidden": true
      }
    ],
    "order": 91
  },
  {
    "challengeId": "stack-09",
    "title": "Simplify Unix File Path",
    "slug": "stack-09-simplify-unix-file-path",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an absolute path for a Unix-style file system, simplify it according to standard rules and return canonical path.",
    "constraints": [
      "1 <= path.length <= 3000",
      "path starts with \"/\""
    ],
    "examples": [
      {
        "input": "path = \"/home/\"",
        "output": "\"/home\"",
        "explanation": "Canonical form."
      }
    ],
    "starterCode": "function solve(path) {\n  const parts = path.split(\"/\");\n  const stack = [];\n  for (const p of parts) {\n    if (p === \"\" || p === \".\") continue;\n    if (p === \"..\") {\n      if (stack.length) stack.pop();\n    } else {\n      stack.push(p);\n    }\n  }\n  return \"/\" + stack.join(\"/\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"/home/\"]",
        "expectedOutput": "\"/home\"",
        "isHidden": false
      },
      {
        "input": "[\"/../\"]",
        "expectedOutput": "\"/\"",
        "isHidden": false
      },
      {
        "input": "[\"/home//foo/\"]",
        "expectedOutput": "\"/home/foo\"",
        "isHidden": true
      }
    ],
    "order": 92
  },
  {
    "challengeId": "stack-10",
    "title": "Score of Parentheses Calculation",
    "slug": "stack-10-score-of-parentheses-calculation",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a balanced parentheses string s, return the score of the string: () has score 1, AB has score A + B, and (A) has score 2 * A.",
    "constraints": [
      "2 <= s.length <= 50",
      "s is a balanced parentheses string"
    ],
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "1",
        "explanation": "Score is 1."
      }
    ],
    "starterCode": "function solve(s) {\n  const stack = [0];\n  for (const c of s) {\n    if (c === \"(\") {\n      stack.push(0);\n    } else {\n      const v = stack.pop();\n      const top = stack.pop();\n      stack.push(top + Math.max(2 * v, 1));\n    }\n  }\n  return stack[0];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"()\"]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[\"(())\"]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[\"()()\"]",
        "expectedOutput": "2",
        "isHidden": true
      },
      {
        "input": "[\"(()(()))\"]",
        "expectedOutput": "6",
        "isHidden": true
      }
    ],
    "order": 93
  },
  {
    "challengeId": "stack-11",
    "title": "Largest Rectangle in Histogram",
    "slug": "stack-11-largest-rectangle-in-histogram",
    "category": "stacks",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given an array of integers heights representing the histogram bar height where width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "constraints": [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "heights = [2,1,5,6,2,3]",
        "output": "10",
        "explanation": "Bars 5 and 6 form rectangle of area 10."
      }
    ],
    "starterCode": "function solve(heights) {\n  const stack = [];\n  let maxArea = 0;\n  const h = heights.concat([0]);\n  for (let i = 0; i < h.length; i++) {\n    while (stack.length && h[i] < h[stack[stack.length - 1]]) {\n      const height = h[stack.pop()];\n      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,1,5,6,2,3]]",
        "expectedOutput": "10",
        "isHidden": false
      },
      {
        "input": "[[2,4]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 94
  },
  {
    "challengeId": "stack-12",
    "title": "Trapping Rain Water Height",
    "slug": "stack-12-trapping-rain-water-height",
    "category": "stacks",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4"
    ],
    "examples": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "explanation": "6 units of water trapped."
      }
    ],
    "starterCode": "function solve(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else water += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[0,1,0,2,1,0,1,3,2,1,2,1]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[4,2,0,3,2,5]]",
        "expectedOutput": "9",
        "isHidden": false
      }
    ],
    "order": 95
  },
  {
    "challengeId": "stack-13",
    "title": "Baseball Game Round Score",
    "slug": "stack-13-baseball-game-round-score",
    "category": "stacks",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are keeping score for a baseball game with strange rules. Given a list of operations, return the sum of all scores on the record.",
    "constraints": [
      "1 <= operations.length <= 1000"
    ],
    "examples": [
      {
        "input": "operations = [\"5\",\"2\",\"C\",\"D\",\"+\"]",
        "output": "30",
        "explanation": "Total score is 30."
      }
    ],
    "starterCode": "function solve(operations) {\n  const stack = [];\n  for (const op of operations) {\n    if (op === \"+\") stack.push(stack[stack.length - 1] + stack[stack.length - 2]);\n    else if (op === \"D\") stack.push(2 * stack[stack.length - 1]);\n    else if (op === \"C\") stack.pop();\n    else stack.push(Number(op));\n  }\n  return stack.reduce((a, b) => a + b, 0);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"5\",\"2\",\"C\",\"D\",\"+\"]]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "input": "[[\"5\",\"-2\",\"4\",\"C\",\"D\",\"9\",\"+\",\"+\"]]",
        "expectedOutput": "27",
        "isHidden": false
      },
      {
        "input": "[[\"1\",\"C\"]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 96
  },
  {
    "challengeId": "stack-14",
    "title": "Make The String Great",
    "slug": "stack-14-make-the-string-great",
    "category": "stacks",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a string s of lower and upper case English letters, a good string does not have two adjacent characters s[i] and s[i+1] where s[i] and s[i+1] are same letter with different case.",
    "constraints": [
      "1 <= s.length <= 100"
    ],
    "examples": [
      {
        "input": "s = \"leEeetcode\"",
        "output": "\"leetcode\"",
        "explanation": "eE removed."
      }
    ],
    "starterCode": "function solve(s) {\n  const stack = [];\n  for (const c of s) {\n    if (stack.length && Math.abs(stack[stack.length - 1].charCodeAt(0) - c.charCodeAt(0)) === 32) {\n      stack.pop();\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"leEeetcode\"]",
        "expectedOutput": "\"leetcode\"",
        "isHidden": false
      },
      {
        "input": "[\"abBAcC\"]",
        "expectedOutput": "\"\"",
        "isHidden": false
      },
      {
        "input": "[\"s\"]",
        "expectedOutput": "\"s\"",
        "isHidden": true
      }
    ],
    "order": 97
  },
  {
    "challengeId": "stack-15",
    "title": "Remove K Digits for Smallest Number",
    "slug": "stack-15-remove-k-digits-for-smallest-number",
    "category": "stacks",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given string num representing a non-negative integer, and an integer k, return the smallest possible integer after removing k digits from num.",
    "constraints": [
      "1 <= k <= num.length <= 10^5"
    ],
    "examples": [
      {
        "input": "num = \"1432219\", k = 3",
        "output": "\"1219\"",
        "explanation": "Removing 4, 3, 2 gives 1219."
      }
    ],
    "starterCode": "function solve(num, k) {\n  const stack = [];\n  for (const digit of num) {\n    while (k > 0 && stack.length && stack[stack.length - 1] > digit) {\n      stack.pop();\n      k--;\n    }\n    stack.push(digit);\n  }\n  while (k > 0) { stack.pop(); k--; }\n  let res = stack.join(\"\").replace(/^0+/, \"\");\n  return res === \"\" ? \"0\" : res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"1432219\", 3]",
        "expectedOutput": "\"1219\"",
        "isHidden": false
      },
      {
        "input": "[\"10200\", 1]",
        "expectedOutput": "\"200\"",
        "isHidden": false
      },
      {
        "input": "[\"10\", 2]",
        "expectedOutput": "\"0\"",
        "isHidden": true
      }
    ],
    "order": 98
  },
  {
    "challengeId": "queue-01",
    "title": "Implement Queue using Stacks",
    "slug": "queue-01-implement-queue-using-stacks",
    "category": "queues",
    "difficulty": "Easy",
    "points": 10,
    "description": "Simulate FIFO queue using stacks: given operations and values, return results array for peek() and pop().",
    "constraints": [
      "ops in [\"push\", \"pop\", \"peek\", \"empty\"]"
    ],
    "examples": [
      {
        "input": "ops = [\"push\",\"push\",\"peek\",\"pop\",\"empty\"], vals = [[1],[2],[],[],[]]",
        "output": "[1,1,false]",
        "explanation": "Queue simulation."
      }
    ],
    "starterCode": "function solve(ops, vals) {\n  const s1 = [], s2 = [];\n  const res = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i];\n    if (op === \"push\") {\n      s1.push(vals[i][0]);\n    } else if (op === \"pop\" || op === \"peek\") {\n      if (!s2.length) {\n        while (s1.length) s2.push(s1.pop());\n      }\n      if (op === \"pop\") res.push(s2.pop());\n      else res.push(s2[s2.length - 1]);\n    } else if (op === \"empty\") {\n      res.push(s1.length === 0 && s2.length === 0);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"push\",\"push\",\"peek\",\"pop\",\"empty\"], [[1],[2],[],[],[]]]",
        "expectedOutput": "[1,1,false]",
        "isHidden": false
      },
      {
        "input": "[[\"push\",\"pop\"], [[5],[]]]",
        "expectedOutput": "[5]",
        "isHidden": false
      }
    ],
    "order": 99
  },
  {
    "challengeId": "queue-02",
    "title": "Number of Recent Calls Counter",
    "slug": "queue-02-number-of-recent-calls-counter",
    "category": "queues",
    "difficulty": "Easy",
    "points": 10,
    "description": "Design a RecentCounter class that counts the number of recent requests within a certain time frame [t - 3000, t]. Given an array of request timestamps t, return counts array.",
    "constraints": [
      "1 <= t <= 10^9",
      "Each call to ping has strictly larger value of t than previous"
    ],
    "examples": [
      {
        "input": "t = [1, 100, 3001, 3002]",
        "output": "[1, 2, 3, 3]",
        "explanation": "Recent calls."
      }
    ],
    "starterCode": "function solve(tList) {\n  const q = [];\n  const res = [];\n  for (const t of tList) {\n    q.push(t);\n    while (q[0] < t - 3000) q.shift();\n    res.push(q.length);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1, 100, 3001, 3002]]",
        "expectedOutput": "[1, 2, 3, 3]",
        "isHidden": false
      },
      {
        "input": "[[1, 3001]]",
        "expectedOutput": "[1, 2]",
        "isHidden": false
      }
    ],
    "order": 100
  },
  {
    "challengeId": "queue-03",
    "title": "Sliding Window Maximum",
    "slug": "queue-03-sliding-window-maximum",
    "category": "queues",
    "difficulty": "Hard",
    "points": 30,
    "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window array.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "1 <= k <= nums.length"
    ],
    "examples": [
      {
        "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        "output": "[3,3,5,5,6,7]",
        "explanation": "Window maximums."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const q = []; // stores indices\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (q.length && q[0] <= i - k) q.shift();\n    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();\n    q.push(i);\n    if (i >= k - 1) res.push(nums[q[0]]);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,3,-1,-3,5,3,6,7], 3]",
        "expectedOutput": "[3,3,5,5,6,7]",
        "isHidden": false
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "[1]",
        "isHidden": false
      },
      {
        "input": "[[1,-1], 1]",
        "expectedOutput": "[1,-1]",
        "isHidden": true
      }
    ],
    "order": 101
  },
  {
    "challengeId": "queue-04",
    "title": "Dota2 Senate Voting Round",
    "slug": "queue-04-dota2-senate-voting-round",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "In the world of Dota2, there are two parties: Radiant and Dire. Given string senate representing senators in order, return \"Radiant\" or \"Dire\" indicating who announces victory.",
    "constraints": [
      "1 <= senate.length <= 10^4",
      "senate[i] is either \"R\" or \"D\""
    ],
    "examples": [
      {
        "input": "senate = \"RD\"",
        "output": "\"Radiant\"",
        "explanation": "R bans D."
      }
    ],
    "starterCode": "function solve(senate) {\n  const rQ = [], dQ = [];\n  const n = senate.length;\n  for (let i = 0; i < n; i++) {\n    if (senate[i] === \"R\") rQ.push(i);\n    else dQ.push(i);\n  }\n  while (rQ.length && dQ.length) {\n    const r = rQ.shift(), d = dQ.shift();\n    if (r < d) rQ.push(r + n);\n    else dQ.push(d + n);\n  }\n  return rQ.length ? \"Radiant\" : \"Dire\";\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"RD\"]",
        "expectedOutput": "\"Radiant\"",
        "isHidden": false
      },
      {
        "input": "[\"RDD\"]",
        "expectedOutput": "\"Dire\"",
        "isHidden": false
      }
    ],
    "order": 102
  },
  {
    "challengeId": "queue-05",
    "title": "Design Circular Queue Capacity Check",
    "slug": "queue-05-design-circular-queue-capacity-check",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "Simulate circular queue of capacity k. Return array of boolean/number results for given operations.",
    "constraints": [
      "1 <= k <= 1000"
    ],
    "examples": [
      {
        "input": "k = 3, ops = [\"enq\",\"enq\",\"enq\",\"enq\",\"Rear\",\"isFull\"], vals = [[1],[2],[3],[4],[],[]]",
        "output": "[true,true,true,false,3,true]",
        "explanation": "Circular queue ops."
      }
    ],
    "starterCode": "function solve(k, ops, vals) {\n  const q = [];\n  const res = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i];\n    if (op === \"enq\") {\n      if (q.length < k) { q.push(vals[i][0]); res.push(true); }\n      else res.push(false);\n    } else if (op === \"deq\") {\n      if (q.length > 0) { q.shift(); res.push(true); }\n      else res.push(false);\n    } else if (op === \"Front\") {\n      res.push(q.length ? q[0] : -1);\n    } else if (op === \"Rear\") {\n      res.push(q.length ? q[q.length - 1] : -1);\n    } else if (op === \"isEmpty\") {\n      res.push(q.length === 0);\n    } else if (op === \"isFull\") {\n      res.push(q.length === k);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[3, [\"enq\",\"enq\",\"enq\",\"enq\",\"Rear\",\"isFull\"], [[1],[2],[3],[4],[],[]]]",
        "expectedOutput": "[true,true,true,false,3,true]",
        "isHidden": false
      },
      {
        "input": "[2, [\"enq\",\"deq\",\"isEmpty\"], [[10],[],[]]]",
        "expectedOutput": "[true,true,true]",
        "isHidden": false
      }
    ],
    "order": 103
  },
  {
    "challengeId": "queue-06",
    "title": "First Unique Character in Stream",
    "slug": "queue-06-first-unique-character-in-stream",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a stream of characters, return string where each character is first unique character seen so far, or \"#\" if none.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "examples": [
      {
        "input": "s = \"aabc\"",
        "output": "\"a#bb\"",
        "explanation": "After a: a; after aa: #; after aab: b; after aabc: b."
      }
    ],
    "starterCode": "function solve(s) {\n  const counts = {};\n  const q = [];\n  let res = \"\";\n  for (const c of s) {\n    counts[c] = (counts[c] || 0) + 1;\n    q.push(c);\n    while (q.length && counts[q[0]] > 1) q.shift();\n    res += q.length ? q[0] : \"#\";\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"aabc\"]",
        "expectedOutput": "\"a#bb\"",
        "isHidden": false
      },
      {
        "input": "[\"zz\"]",
        "expectedOutput": "\"z#\"",
        "isHidden": false
      }
    ],
    "order": 104
  },
  {
    "challengeId": "queue-07",
    "title": "Time Needed to Buy Tickets",
    "slug": "queue-07-time-needed-to-buy-tickets",
    "category": "queues",
    "difficulty": "Easy",
    "points": 10,
    "description": "There are n people in a line queueing to buy tickets, where the 0th person is at the front. tickets[i] is the number of tickets the ith person wants. Return time taken for person at index k to finish.",
    "constraints": [
      "n == tickets.length",
      "1 <= n <= 100",
      "0 <= k < n"
    ],
    "examples": [
      {
        "input": "tickets = [2,3,2], k = 2",
        "output": "6",
        "explanation": "6 seconds elapsed."
      }
    ],
    "starterCode": "function solve(tickets, k) {\n  let time = 0;\n  for (let i = 0; i < tickets.length; i++) {\n    if (i <= k) time += Math.min(tickets[i], tickets[k]);\n    else time += Math.min(tickets[i], tickets[k] - 1);\n  }\n  return time;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,2], 2]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[5,1,1,1], 0]",
        "expectedOutput": "8",
        "isHidden": false
      }
    ],
    "order": 105
  },
  {
    "challengeId": "queue-08",
    "title": "Reveal Cards In Increasing Order",
    "slug": "queue-08-reveal-cards-in-increasing-order",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an integer array deck. There is a deck of cards with every card having a unique integer. Return an ordering of the deck that would reveal the cards in increasing order.",
    "constraints": [
      "1 <= deck.length <= 1000",
      "All deck[i] are unique"
    ],
    "examples": [
      {
        "input": "deck = [17,13,11,2,3,5,7]",
        "output": "[2,13,3,11,5,17,7]",
        "explanation": "Revealing order is 2,3,5,7,11,13,17."
      }
    ],
    "starterCode": "function solve(deck) {\n  deck.sort((a, b) => a - b);\n  const q = Array.from({length: deck.length}, (_, i) => i);\n  const res = new Array(deck.length);\n  for (const card of deck) {\n    res[q.shift()] = card;\n    if (q.length) q.push(q.shift());\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[17,13,11,2,3,5,7]]",
        "expectedOutput": "[2,13,3,11,5,17,7]",
        "isHidden": false
      },
      {
        "input": "[[1,1000]]",
        "expectedOutput": "[1,1000]",
        "isHidden": false
      }
    ],
    "order": 106
  },
  {
    "challengeId": "queue-09",
    "title": "Number of Students Unable to Eat Lunch",
    "slug": "queue-09-number-of-students-unable-to-eat-lunch",
    "category": "queues",
    "difficulty": "Easy",
    "points": 10,
    "description": "The school cafeteria offers circular and square sandwiches at lunch break. Given students preferences and sandwiches stack, return number of students unable to eat.",
    "constraints": [
      "1 <= students.length, sandwiches.length <= 100"
    ],
    "examples": [
      {
        "input": "students = [1,1,0,0], sandwiches = [0,1,0,1]",
        "output": "0",
        "explanation": "All students eat."
      }
    ],
    "starterCode": "function solve(students, sandwiches) {\n  let count = [0, 0];\n  for (const s of students) count[s]++;\n  for (const s of sandwiches) {\n    if (count[s] > 0) count[s]--;\n    else break;\n  }\n  return count[0] + count[1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,0,0], [0,1,0,1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[1,1,1,0,0,1], [1,0,0,0,1,1]]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "order": 107
  },
  {
    "challengeId": "queue-10",
    "title": "Design Hit Counter in Time Window",
    "slug": "queue-10-design-hit-counter-in-time-window",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "Design a hit counter which counts the number of hits received in the past 5 minutes (300 seconds). Return counts array for given hits and getHits queries.",
    "constraints": [
      "1 <= timestamp <= 2 * 10^9"
    ],
    "examples": [
      {
        "input": "ops = [\"hit\",\"hit\",\"hit\",\"getHits\",\"hit\",\"getHits\"], vals = [[1],[2],[3],[300],[300],[301]]",
        "output": "[3,3]",
        "explanation": "Hit counts."
      }
    ],
    "starterCode": "function solve(ops, vals) {\n  const q = [];\n  const res = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i], t = vals[i][0];\n    if (op === \"hit\") {\n      q.push(t);\n    } else if (op === \"getHits\") {\n      while (q.length && q[0] <= t - 300) q.shift();\n      res.push(q.length);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"hit\",\"hit\",\"hit\",\"getHits\",\"hit\",\"getHits\"], [[1],[2],[3],[300],[300],[301]]]",
        "expectedOutput": "[3,3]",
        "isHidden": false
      }
    ],
    "order": 108
  },
  {
    "challengeId": "queue-11",
    "title": "Open the Lock Minimum Turns",
    "slug": "queue-11-open-the-lock-minimum-turns",
    "category": "queues",
    "difficulty": "Medium",
    "points": 20,
    "description": "You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots 0-9. Return minimum total turns to open lock or -1 if impossible.",
    "constraints": [
      "1 <= deadends.length <= 500",
      "target != \"0000\""
    ],
    "examples": [
      {
        "input": "deadends = [\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target = \"0202\"",
        "output": "6",
        "explanation": "6 turns required."
      }
    ],
    "starterCode": "function solve(deadends, target) {\n  const dead = new Set(deadends);\n  if (dead.has(\"0000\")) return -1;\n  if (target === \"0000\") return 0;\n  const q = [[\"0000\", 0]];\n  const visited = new Set([\"0000\"]);\n  while (q.length) {\n    const [curr, steps] = q.shift();\n    if (curr === target) return steps;\n    for (let i = 0; i < 4; i++) {\n      const digit = Number(curr[i]);\n      for (const diff of [-1, 1]) {\n        const nextDigit = (digit + diff + 10) % 10;\n        const nextStr = curr.slice(0, i) + nextDigit + curr.slice(i + 1);\n        if (!dead.has(nextStr) && !visited.has(nextStr)) {\n          visited.add(nextStr);\n          q.push([nextStr, steps + 1]);\n        }\n      }\n    }\n  }\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], \"0202\"]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[\"8888\"], \"0009\"]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 109
  },
  {
    "challengeId": "queue-12",
    "title": "Shortest Subarray with Sum at Least K",
    "slug": "queue-12-shortest-subarray-with-sum-at-least-k",
    "category": "queues",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "1 <= k <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [1], k = 1",
        "output": "1",
        "explanation": "Length is 1."
      }
    ],
    "starterCode": "function solve(nums, k) {\n  const n = nums.length;\n  const prefix = new Array(n + 1).fill(0);\n  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];\n  let minLen = Infinity;\n  const q = [];\n  for (let i = 0; i <= n; i++) {\n    while (q.length && prefix[i] - prefix[q[0]] >= k) {\n      minLen = Math.min(minLen, i - q.shift());\n    }\n    while (q.length && prefix[i] <= prefix[q[q.length - 1]]) {\n      q.pop();\n    }\n    q.push(i);\n  }\n  return minLen === Infinity ? -1 : minLen;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1], 1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[1,2], 4]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[2,-1,2], 3]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "order": 110
  },
  {
    "challengeId": "list-01",
    "title": "Reverse Linked List Elements",
    "slug": "list-01-reverse-linked-list-elements",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the head of a singly linked list represented as an array of values, reverse the list, and return the reversed list.",
    "constraints": [
      "0 <= list.length <= 5000",
      "-5000 <= node.val <= 5000"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[5,4,3,2,1]",
        "explanation": "Reversed list."
      }
    ],
    "starterCode": "function solve(head) {\n  const res = [];\n  for (let i = head.length - 1; i >= 0; i--) res.push(head[i]);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5]]",
        "expectedOutput": "[5,4,3,2,1]",
        "isHidden": false
      },
      {
        "input": "[[1,2]]",
        "expectedOutput": "[2,1]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 111
  },
  {
    "challengeId": "list-02",
    "title": "Middle of the Linked List Node",
    "slug": "list-02-middle-of-the-linked-list-node",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the head of a singly linked list, return the middle node value and all following nodes. If there are two middle nodes, return the second middle node.",
    "constraints": [
      "1 <= list.length <= 100"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[3,4,5]",
        "explanation": "Middle is 3."
      }
    ],
    "starterCode": "function solve(head) {\n  const mid = Math.floor(head.length / 2);\n  return head.slice(mid);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5]]",
        "expectedOutput": "[3,4,5]",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4,5,6]]",
        "expectedOutput": "[4,5,6]",
        "isHidden": false
      }
    ],
    "order": 112
  },
  {
    "challengeId": "list-03",
    "title": "Merge Two Sorted Lists",
    "slug": "list-03-merge-two-sorted-lists",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return it.",
    "constraints": [
      "0 <= list1.length, list2.length <= 50"
    ],
    "examples": [
      {
        "input": "list1 = [1,2,4], list2 = [1,3,4]",
        "output": "[1,1,2,3,4,4]",
        "explanation": "Merged list."
      }
    ],
    "starterCode": "function solve(list1, list2) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < list1.length && j < list2.length) {\n    if (list1[i] <= list2[j]) res.push(list1[i++]);\n    else res.push(list2[j++]);\n  }\n  while (i < list1.length) res.push(list1[i++]);\n  while (j < list2.length) res.push(list2[j++]);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,4], [1,3,4]]",
        "expectedOutput": "[1,1,2,3,4,4]",
        "isHidden": false
      },
      {
        "input": "[[], []]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[], [0]]",
        "expectedOutput": "[0]",
        "isHidden": true
      }
    ],
    "order": 113
  },
  {
    "challengeId": "list-04",
    "title": "Remove Nth Node From End of List",
    "slug": "list-04-remove-nth-node-from-end-of-list",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    "constraints": [
      "1 <= list.length <= 30",
      "1 <= n <= list.length"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5], n = 2",
        "output": "[1,2,3,5]",
        "explanation": "Node 4 removed."
      }
    ],
    "starterCode": "function solve(head, n) {\n  const idxToRemove = head.length - n;\n  return head.filter((_, i) => i !== idxToRemove);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5], 2]",
        "expectedOutput": "[1,2,3,5]",
        "isHidden": false
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[1,2], 1]",
        "expectedOutput": "[1]",
        "isHidden": true
      }
    ],
    "order": 114
  },
  {
    "challengeId": "list-05",
    "title": "Palindrome Linked List Verification",
    "slug": "list-05-palindrome-linked-list-verification",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the head of a singly linked list, return true if it is a palindrome or false otherwise.",
    "constraints": [
      "1 <= list.length <= 10^5"
    ],
    "examples": [
      {
        "input": "head = [1,2,2,1]",
        "output": "true",
        "explanation": "Palindrome."
      }
    ],
    "starterCode": "function solve(head) {\n  let i = 0, j = head.length - 1;\n  while (i < j) {\n    if (head[i] !== head[j]) return false;\n    i++; j--;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,2,1]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 115
  },
  {
    "challengeId": "list-06",
    "title": "Delete Node in a Linked List by Value",
    "slug": "list-06-delete-node-in-a-linked-list-by-value",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a singly-linked list head and a value val, remove all the nodes of the linked list that has Node.val == val, and return the new head.",
    "constraints": [
      "0 <= list.length <= 10^4",
      "0 <= val <= 50"
    ],
    "examples": [
      {
        "input": "head = [1,2,6,3,4,5,6], val = 6",
        "output": "[1,2,3,4,5]",
        "explanation": "All 6s removed."
      }
    ],
    "starterCode": "function solve(head, val) {\n  return head.filter(x => x !== val);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,6,3,4,5,6], 6]",
        "expectedOutput": "[1,2,3,4,5]",
        "isHidden": false
      },
      {
        "input": "[[], 1]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[7,7,7,7], 7]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 116
  },
  {
    "challengeId": "list-07",
    "title": "Remove Duplicates from Sorted List",
    "slug": "list-07-remove-duplicates-from-sorted-list",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.",
    "constraints": [
      "0 <= list.length <= 300",
      "list is sorted in ascending order"
    ],
    "examples": [
      {
        "input": "head = [1,1,2]",
        "output": "[1,2]",
        "explanation": "Unique elements."
      }
    ],
    "starterCode": "function solve(head) {\n  return Array.from(new Set(head));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,2]]",
        "expectedOutput": "[1,2]",
        "isHidden": false
      },
      {
        "input": "[[1,1,2,3,3]]",
        "expectedOutput": "[1,2,3]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 117
  },
  {
    "challengeId": "list-08",
    "title": "Rotate List by K Positions",
    "slug": "list-08-rotate-list-by-k-positions",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the head of a linked list, rotate the list to the right by k places.",
    "constraints": [
      "0 <= list.length <= 500",
      "0 <= k <= 2 * 10^9"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5], k = 2",
        "output": "[4,5,1,2,3]",
        "explanation": "Rotated right 2."
      }
    ],
    "starterCode": "function solve(head, k) {\n  if (!head.length) return [];\n  const shift = k % head.length;\n  if (shift === 0) return head;\n  return head.slice(head.length - shift).concat(head.slice(0, head.length - shift));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5], 2]",
        "expectedOutput": "[4,5,1,2,3]",
        "isHidden": false
      },
      {
        "input": "[[0,1,2], 4]",
        "expectedOutput": "[2,0,1]",
        "isHidden": false
      },
      {
        "input": "[[], 1]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 118
  },
  {
    "challengeId": "list-09",
    "title": "Odd Even Linked List Grouping",
    "slug": "list-09-odd-even-linked-list-grouping",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.",
    "constraints": [
      "0 <= list.length <= 10^4"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5]",
        "output": "[1,3,5,2,4]",
        "explanation": "Odd indices then even indices."
      }
    ],
    "starterCode": "function solve(head) {\n  const odds = head.filter((_, i) => i % 2 === 0);\n  const evens = head.filter((_, i) => i % 2 === 1);\n  return odds.concat(evens);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5]]",
        "expectedOutput": "[1,3,5,2,4]",
        "isHidden": false
      },
      {
        "input": "[[2,1,3,5,6,4,7]]",
        "expectedOutput": "[2,3,6,7,1,5,4]",
        "isHidden": false
      }
    ],
    "order": 119
  },
  {
    "challengeId": "list-10",
    "title": "Swap Nodes in Pairs",
    "slug": "list-10-swap-nodes-in-pairs",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a linked list, swap every two adjacent nodes and return its head.",
    "constraints": [
      "0 <= list.length <= 100"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4]",
        "output": "[2,1,4,3]",
        "explanation": "Adjacent pairs swapped."
      }
    ],
    "starterCode": "function solve(head) {\n  const res = head.slice();\n  for (let i = 0; i < res.length - 1; i += 2) {\n    [res[i], res[i + 1]] = [res[i + 1], res[i]];\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4]]",
        "expectedOutput": "[2,1,4,3]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "[1]",
        "isHidden": true
      }
    ],
    "order": 120
  },
  {
    "challengeId": "list-11",
    "title": "Add Two Numbers as Linked Lists",
    "slug": "list-11-add-two-numbers-as-linked-lists",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given two non-empty linked lists representing two non-negative integers in reverse order. Add the two numbers and return the sum as a linked list in reverse order.",
    "constraints": [
      "1 <= l1.length, l2.length <= 100",
      "0 <= Node.val <= 9"
    ],
    "examples": [
      {
        "input": "l1 = [2,4,3], l2 = [5,6,4]",
        "output": "[7,0,8]",
        "explanation": "342 + 465 = 807."
      }
    ],
    "starterCode": "function solve(l1, l2) {\n  const res = [];\n  let carry = 0, i = 0, j = 0;\n  while (i < l1.length || j < l2.length || carry) {\n    const sum = (l1[i] || 0) + (l2[j] || 0) + carry;\n    res.push(sum % 10);\n    carry = Math.floor(sum / 10);\n    i++; j++;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,4,3], [5,6,4]]",
        "expectedOutput": "[7,0,8]",
        "isHidden": false
      },
      {
        "input": "[[0], [0]]",
        "expectedOutput": "[0]",
        "isHidden": false
      },
      {
        "input": "[[9,9,9], [1]]",
        "expectedOutput": "[0,0,0,1]",
        "isHidden": true
      }
    ],
    "order": 121
  },
  {
    "challengeId": "list-12",
    "title": "Partition List around Value X",
    "slug": "list-12-partition-list-around-value-x",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x, preserving relative order.",
    "constraints": [
      "0 <= list.length <= 200",
      "-100 <= x <= 100"
    ],
    "examples": [
      {
        "input": "head = [1,4,3,2,5,2], x = 3",
        "output": "[1,2,2,4,3,5]",
        "explanation": "Partitioned around 3."
      }
    ],
    "starterCode": "function solve(head, x) {\n  const less = head.filter(v => v < x);\n  const ge = head.filter(v => v >= x);\n  return less.concat(ge);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,4,3,2,5,2], 3]",
        "expectedOutput": "[1,2,2,4,3,5]",
        "isHidden": false
      },
      {
        "input": "[[2,1], 2]",
        "expectedOutput": "[1,2]",
        "isHidden": false
      }
    ],
    "order": 122
  },
  {
    "challengeId": "list-13",
    "title": "Reverse Nodes in K-Group",
    "slug": "list-13-reverse-nodes-in-k-group",
    "category": "linked-lists",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. If the number of nodes is not a multiple of k, left-out nodes remain as-is.",
    "constraints": [
      "1 <= k <= list.length <= 5000"
    ],
    "examples": [
      {
        "input": "head = [1,2,3,4,5], k = 2",
        "output": "[2,1,4,3,5]",
        "explanation": "Reversed in groups of 2."
      }
    ],
    "starterCode": "function solve(head, k) {\n  const res = [];\n  for (let i = 0; i < head.length; i += k) {\n    const chunk = head.slice(i, i + k);\n    if (chunk.length === k) res.push(...chunk.reverse());\n    else res.push(...chunk);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5], 2]",
        "expectedOutput": "[2,1,4,3,5]",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4,5], 3]",
        "expectedOutput": "[3,2,1,4,5]",
        "isHidden": false
      }
    ],
    "order": 123
  },
  {
    "challengeId": "list-14",
    "title": "Intersection of Two Linked Lists Value",
    "slug": "list-14-intersection-of-two-linked-lists-value",
    "category": "linked-lists",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the values of two linked lists that intersect at common tail values, return the value of the first intersecting node, or null if no intersection.",
    "constraints": [
      "1 <= listA.length, listB.length <= 3 * 10^4"
    ],
    "examples": [
      {
        "input": "listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], intersectVal = 8",
        "output": "8",
        "explanation": "Intersect at 8."
      }
    ],
    "starterCode": "function solve(listA, listB, intersectVal) {\n  return intersectVal !== 0 ? intersectVal : null;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,1,8,4,5], [5,6,1,8,4,5], 8]",
        "expectedOutput": "8",
        "isHidden": false
      },
      {
        "input": "[[2,6,4], [1,5], 0]",
        "expectedOutput": "null",
        "isHidden": false
      }
    ],
    "order": 124
  },
  {
    "challengeId": "list-15",
    "title": "Split Linked List in K Parts",
    "slug": "list-15-split-linked-list-in-k-parts",
    "category": "linked-lists",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the head of a singly linked list and an integer k, split the linked list into k consecutive parts. Length of each part should be as equal as possible.",
    "constraints": [
      "0 <= list.length <= 1000",
      "1 <= k <= 50"
    ],
    "examples": [
      {
        "input": "head = [1,2,3], k = 5",
        "output": "[[1],[2],[3],[],[]]",
        "explanation": "5 parts."
      }
    ],
    "starterCode": "function solve(head, k) {\n  const n = head.length;\n  const baseLen = Math.floor(n / k);\n  let extra = n % k;\n  const res = [];\n  let idx = 0;\n  for (let i = 0; i < k; i++) {\n    const len = baseLen + (extra > 0 ? 1 : 0);\n    if (extra > 0) extra--;\n    res.push(head.slice(idx, idx + len));\n    idx += len;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3], 5]",
        "expectedOutput": "[[1],[2],[3],[],[]]",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,4,5,6,7,8,9,10], 3]",
        "expectedOutput": "[[1,2,3,4],[5,6,7],[8,9,10]]",
        "isHidden": false
      }
    ],
    "order": 125
  },
  {
    "challengeId": "tree-01",
    "title": "Maximum Depth of Binary Tree",
    "slug": "tree-01-maximum-depth-of-binary-tree",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a binary tree as a level-order array, return its maximum depth.",
    "constraints": [
      "The number of nodes in tree is in range [0, 10^4]",
      "-100 <= Node.val <= 100"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "3",
        "explanation": "Depth is 3."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root || !root.length || root[0] === null) return 0;\n  let maxDepth = 0;\n  function dfs(idx, depth) {\n    if (idx >= root.length || root[idx] === null) return;\n    maxDepth = Math.max(maxDepth, depth);\n    dfs(2 * idx + 1, depth + 1);\n    dfs(2 * idx + 2, depth + 1);\n  }\n  dfs(0, 1);\n  return maxDepth;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,9,20,null,null,15,7]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[1,null,2]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 126
  },
  {
    "challengeId": "tree-02",
    "title": "Invert Binary Tree Left and Right",
    "slug": "tree-02-invert-binary-tree-left-and-right",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a binary tree as a level-order array, invert the tree, and return its root as a level-order array.",
    "constraints": [
      "The number of nodes in tree is in range [0, 100]"
    ],
    "examples": [
      {
        "input": "root = [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]",
        "explanation": "Inverted binary tree."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root.length) return [];\n  const res = root.slice();\n  let levelStart = 1, levelCount = 2;\n  while (levelStart < res.length) {\n    const slice = res.slice(levelStart, levelStart + levelCount);\n    slice.reverse();\n    for (let i = 0; i < slice.length; i++) res[levelStart + i] = slice[i];\n    levelStart += levelCount;\n    levelCount *= 2;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,2,7,1,3,6,9]]",
        "expectedOutput": "[4,7,2,9,6,3,1]",
        "isHidden": false
      },
      {
        "input": "[[2,1,3]]",
        "expectedOutput": "[2,3,1]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 127
  },
  {
    "challengeId": "tree-03",
    "title": "Symmetric Tree Mirror Check",
    "slug": "tree-03-symmetric-tree-mirror-check",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a binary tree as an array, check whether it is a mirror of itself (i.e., symmetric around its center).",
    "constraints": [
      "The number of nodes in the tree is in range [1, 1000]"
    ],
    "examples": [
      {
        "input": "root = [1,2,2,3,4,4,3]",
        "output": "true",
        "explanation": "Symmetric tree."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root.length) return true;\n  function isMirror(t1, t2) {\n    if (t1 >= root.length && t2 >= root.length) return true;\n    const v1 = t1 < root.length ? root[t1] : null;\n    const v2 = t2 < root.length ? root[t2] : null;\n    if (v1 === null && v2 === null) return true;\n    if (v1 === null || v2 === null || v1 !== v2) return false;\n    return isMirror(2 * t1 + 1, 2 * t2 + 2) && isMirror(2 * t1 + 2, 2 * t2 + 1);\n  }\n  return isMirror(1, 2);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,2,3,4,4,3]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,2,null,3,null,3]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 128
  },
  {
    "challengeId": "tree-04",
    "title": "Binary Tree Level Order Traversal",
    "slug": "tree-04-binary-tree-level-order-traversal",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary tree as an array, return the level order traversal of its nodes values as a 2D array.",
    "constraints": [
      "The number of nodes in the tree is in range [0, 2000]"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "[[3],[9,20],[15,7]]",
        "explanation": "Level by level."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root.length || root[0] === null) return [];\n  const res = [];\n  let level = [0];\n  while (level.length) {\n    const nextLevel = [];\n    const currentVals = [];\n    for (const idx of level) {\n      if (idx < root.length && root[idx] !== null && root[idx] !== undefined) {\n        currentVals.push(root[idx]);\n        nextLevel.push(2 * idx + 1);\n        nextLevel.push(2 * idx + 2);\n      }\n    }\n    if (currentVals.length) res.push(currentVals);\n    level = nextLevel.filter(i => i < root.length && root[i] !== null && root[i] !== undefined);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,9,20,null,null,15,7]]",
        "expectedOutput": "[[3],[9,20],[15,7]]",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "[[1]]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 129
  },
  {
    "challengeId": "tree-05",
    "title": "Validate Binary Search Tree",
    "slug": "tree-05-validate-binary-search-tree",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary tree as an array, determine if it is a valid binary search tree (BST).",
    "constraints": [
      "The number of nodes in the tree is in range [1, 10^4]"
    ],
    "examples": [
      {
        "input": "root = [2,1,3]",
        "output": "true",
        "explanation": "Valid BST."
      }
    ],
    "starterCode": "function solve(root) {\n  function isValid(idx, min, max) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return true;\n    const val = root[idx];\n    if (val <= min || val >= max) return false;\n    return isValid(2 * idx + 1, min, val) && isValid(2 * idx + 2, val, max);\n  }\n  return isValid(0, -Infinity, Infinity);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,1,3]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[5,1,4,null,null,3,6]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 130
  },
  {
    "challengeId": "tree-06",
    "title": "Kth Smallest Element in a BST",
    "slug": "tree-06-kth-smallest-element-in-a-bst",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary search tree as an array and an integer k, return the kth smallest value (1-indexed) in the tree.",
    "constraints": [
      "The number of nodes in tree is n",
      "1 <= k <= n <= 10^4"
    ],
    "examples": [
      {
        "input": "root = [3,1,4,null,2], k = 1",
        "output": "1",
        "explanation": "Smallest is 1."
      }
    ],
    "starterCode": "function solve(root, k) {\n  const sorted = root.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);\n  return sorted[k - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,1,4,null,2], 1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[5,3,6,2,4,null,null,1], 3]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "order": 131
  },
  {
    "challengeId": "tree-07",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "slug": "tree-07-lowest-common-ancestor-of-a-binary-search-tree",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a binary search tree (BST) as an array, find the lowest common ancestor (LCA) node value of two given values p and q.",
    "constraints": [
      "All node values are unique",
      "p != q"
    ],
    "examples": [
      {
        "input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
        "output": "6",
        "explanation": "LCA of 2 and 8 is 6."
      }
    ],
    "starterCode": "function solve(root, p, q) {\n  let curr = 0;\n  while (curr < root.length && root[curr] !== null) {\n    const val = root[curr];\n    if (p < val && q < val) curr = 2 * curr + 1;\n    else if (p > val && q > val) curr = 2 * curr + 2;\n    else return val;\n  }\n  return root[0];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[6,2,8,0,4,7,9,null,null,3,5], 2, 8]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[6,2,8,0,4,7,9,null,null,3,5], 2, 4]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 132
  },
  {
    "challengeId": "tree-08",
    "title": "Binary Tree Right Side View",
    "slug": "tree-08-binary-tree-right-side-view",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
    "constraints": [
      "The number of nodes in tree is in range [0, 100]"
    ],
    "examples": [
      {
        "input": "root = [1,2,3,null,5,null,4]",
        "output": "[1,3,4]",
        "explanation": "Right side view."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root.length || root[0] === null) return [];\n  const res = [];\n  let level = [0];\n  while (level.length) {\n    const valid = level.filter(i => i < root.length && root[i] !== null && root[i] !== undefined);\n    if (valid.length) res.push(root[valid[valid.length - 1]]);\n    const next = [];\n    for (const idx of valid) {\n      next.push(2 * idx + 1);\n      next.push(2 * idx + 2);\n    }\n    level = next;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,null,5,null,4]]",
        "expectedOutput": "[1,3,4]",
        "isHidden": false
      },
      {
        "input": "[[1,null,3]]",
        "expectedOutput": "[1,3]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": true
      }
    ],
    "order": 133
  },
  {
    "challengeId": "tree-09",
    "title": "Count Complete Tree Nodes",
    "slug": "tree-09-count-complete-tree-nodes",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a complete binary tree as an array, return the number of nodes in the tree.",
    "constraints": [
      "The number of nodes in the tree is in the range [0, 5 * 10^4]"
    ],
    "examples": [
      {
        "input": "root = [1,2,3,4,5,6]",
        "output": "6",
        "explanation": "6 nodes present."
      }
    ],
    "starterCode": "function solve(root) {\n  return root.filter(x => x !== null && x !== undefined).length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5,6]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 134
  },
  {
    "challengeId": "tree-10",
    "title": "Diameter of Binary Tree Path Length",
    "slug": "tree-10-diameter-of-binary-tree-path-length",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a binary tree as an array, return the length of the diameter of the tree (number of edges on longest path between two nodes).",
    "constraints": [
      "The number of nodes in tree is in range [1, 10^4]"
    ],
    "examples": [
      {
        "input": "root = [1,2,3,4,5]",
        "output": "3",
        "explanation": "Path length is 3 (edges 4-2, 2-1, 1-3)."
      }
    ],
    "starterCode": "function solve(root) {\n  let maxDiameter = 0;\n  function height(idx) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return 0;\n    const left = height(2 * idx + 1);\n    const right = height(2 * idx + 2);\n    maxDiameter = Math.max(maxDiameter, left + right);\n    return 1 + Math.max(left, right);\n  }\n  height(0);\n  return maxDiameter;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[1,2]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 135
  },
  {
    "challengeId": "tree-11",
    "title": "Balanced Binary Tree Height Test",
    "slug": "tree-11-balanced-binary-tree-height-test",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a binary tree as an array, determine if it is height-balanced (depth of two subtrees never differs by more than 1).",
    "constraints": [
      "The number of nodes in tree is in range [0, 5000]"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "true",
        "explanation": "Balanced."
      }
    ],
    "starterCode": "function solve(root) {\n  let balanced = true;\n  function check(idx) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return 0;\n    const l = check(2 * idx + 1), r = check(2 * idx + 2);\n    if (Math.abs(l - r) > 1) balanced = false;\n    return 1 + Math.max(l, r);\n  }\n  check(0);\n  return balanced;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,9,20,null,null,15,7]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,2,3,3,null,null,4,4]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 136
  },
  {
    "challengeId": "tree-12",
    "title": "Sum Root to Leaf Numbers",
    "slug": "tree-12-sum-root-to-leaf-numbers",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given the root of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path represents a number. Return the total sum of all root-to-leaf numbers.",
    "constraints": [
      "The number of nodes in tree is in range [1, 1000]",
      "0 <= Node.val <= 9"
    ],
    "examples": [
      {
        "input": "root = [1,2,3]",
        "output": "25",
        "explanation": "12 + 13 = 25."
      }
    ],
    "starterCode": "function solve(root) {\n  let total = 0;\n  function dfs(idx, cur) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return;\n    cur = cur * 10 + root[idx];\n    const left = 2 * idx + 1, right = 2 * idx + 2;\n    const isLeaf = (left >= root.length || root[left] === null) && (right >= root.length || root[right] === null);\n    if (isLeaf) { total += cur; return; }\n    dfs(left, cur);\n    dfs(right, cur);\n  }\n  dfs(0, 0);\n  return total;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "25",
        "isHidden": false
      },
      {
        "input": "[[4,9,0,5,1]]",
        "expectedOutput": "1026",
        "isHidden": false
      }
    ],
    "order": 137
  },
  {
    "challengeId": "tree-13",
    "title": "Path Sum Target Exists",
    "slug": "tree-13-path-sum-target-exists",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all values along path equals targetSum.",
    "constraints": [
      "The number of nodes in tree is in range [0, 5000]"
    ],
    "examples": [
      {
        "input": "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
        "output": "true",
        "explanation": "Path 5->4->11->2 sums to 22."
      }
    ],
    "starterCode": "function solve(root, targetSum) {\n  if (!root.length || root[0] === null) return false;\n  let found = false;\n  function dfs(idx, rem) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined || found) return;\n    rem -= root[idx];\n    const left = 2 * idx + 1, right = 2 * idx + 2;\n    const isLeaf = (left >= root.length || root[left] === null) && (right >= root.length || root[right] === null);\n    if (isLeaf && rem === 0) { found = true; return; }\n    dfs(left, rem);\n    dfs(right, rem);\n  }\n  dfs(0, targetSum);\n  return found;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[5,4,8,11,null,13,4,7,2,null,null,null,1], 22]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,3], 5]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 138
  },
  {
    "challengeId": "tree-14",
    "title": "Binary Tree Zigzag Level Order Traversal",
    "slug": "tree-14-binary-tree-zigzag-level-order-traversal",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary tree, return the zigzag level order traversal of its nodes values (left-to-right, then right-to-left alternate).",
    "constraints": [
      "The number of nodes in tree is in range [0, 2000]"
    ],
    "examples": [
      {
        "input": "root = [3,9,20,null,null,15,7]",
        "output": "[[3],[20,9],[15,7]]",
        "explanation": "Zigzag traversal."
      }
    ],
    "starterCode": "function solve(root) {\n  if (!root.length || root[0] === null) return [];\n  const res = [];\n  let level = [0];\n  let leftToRight = true;\n  while (level.length) {\n    const valid = level.filter(i => i < root.length && root[i] !== null && root[i] !== undefined);\n    if (!valid.length) break;\n    const vals = valid.map(i => root[i]);\n    if (!leftToRight) vals.reverse();\n    res.push(vals);\n    leftToRight = !leftToRight;\n    const next = [];\n    for (const i of valid) {\n      next.push(2 * i + 1);\n      next.push(2 * i + 2);\n    }\n    level = next;\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,9,20,null,null,15,7]]",
        "expectedOutput": "[[3],[20,9],[15,7]]",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "[[1]]",
        "isHidden": false
      }
    ],
    "order": 139
  },
  {
    "challengeId": "tree-15",
    "title": "Flatten Binary Tree to Preorder Array",
    "slug": "tree-15-flatten-binary-tree-to-preorder-array",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given the root of a binary tree, flatten the tree into a preorder traversal array representation.",
    "constraints": [
      "The number of nodes in tree is in range [0, 2000]"
    ],
    "examples": [
      {
        "input": "root = [1,2,5,3,4,null,6]",
        "output": "[1,2,3,4,5,6]",
        "explanation": "Preorder flattened."
      }
    ],
    "starterCode": "function solve(root) {\n  const res = [];\n  function preorder(idx) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return;\n    res.push(root[idx]);\n    preorder(2 * idx + 1);\n    preorder(2 * idx + 2);\n  }\n  preorder(0);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,5,3,4,null,6]]",
        "expectedOutput": "[1,2,3,4,5,6]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "order": 140
  },
  {
    "challengeId": "tree-16",
    "title": "Construct Binary Tree from Inorder and Postorder Length",
    "slug": "tree-16-construct-binary-tree-from-inorder-and-postorder-length",
    "category": "trees",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given two integer arrays inorder and postorder, return the total count of nodes in the reconstructed tree.",
    "constraints": [
      "1 <= inorder.length <= 3000",
      "postorder.length == inorder.length"
    ],
    "examples": [
      {
        "input": "inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]",
        "output": "5",
        "explanation": "5 nodes reconstructed."
      }
    ],
    "starterCode": "function solve(inorder, postorder) {\n  return inorder.length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[9,3,15,20,7], [9,15,7,20,3]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[-1], [-1]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 141
  },
  {
    "challengeId": "tree-17",
    "title": "Subtree of Another Tree Verification",
    "slug": "tree-17-subtree-of-another-tree-verification",
    "category": "trees",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given the roots of two binary trees root and subRoot as arrays, return true if there is a subtree of root with same structure and values as subRoot.",
    "constraints": [
      "The number of nodes in root is in range [1, 2000]"
    ],
    "examples": [
      {
        "input": "root = [3,4,5,1,2], subRoot = [4,1,2]",
        "output": "true",
        "explanation": "subRoot is subtree."
      }
    ],
    "starterCode": "function solve(root, subRoot) {\n  function serialize(arr, idx) {\n    if (idx >= arr.length || arr[idx] === null || arr[idx] === undefined) return \"#\";\n    return \",\" + arr[idx] + serialize(arr, 2 * idx + 1) + serialize(arr, 2 * idx + 2);\n  }\n  return serialize(root, 0).includes(serialize(subRoot, 0));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,4,5,1,2], [4,1,2]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,3], [2]]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "order": 142
  },
  {
    "challengeId": "tree-18",
    "title": "Maximum Path Sum in Binary Tree",
    "slug": "tree-18-maximum-path-sum-in-binary-tree",
    "category": "trees",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given the root of a binary tree, return the maximum path sum of any non-empty path.",
    "constraints": [
      "The number of nodes in the tree is in range [1, 3 * 10^4]",
      "-1000 <= Node.val <= 1000"
    ],
    "examples": [
      {
        "input": "root = [1,2,3]",
        "output": "6",
        "explanation": "Optimal path is 2 -> 1 -> 3 with sum 6."
      }
    ],
    "starterCode": "function solve(root) {\n  let maxSum = -Infinity;\n  function maxGain(idx) {\n    if (idx >= root.length || root[idx] === null || root[idx] === undefined) return 0;\n    const leftGain = Math.max(maxGain(2 * idx + 1), 0);\n    const rightGain = Math.max(maxGain(2 * idx + 2), 0);\n    const priceNewpath = root[idx] + leftGain + rightGain;\n    maxSum = Math.max(maxSum, priceNewpath);\n    return root[idx] + Math.max(leftGain, rightGain);\n  }\n  maxGain(0);\n  return maxSum;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[-10,9,20,null,null,15,7]]",
        "expectedOutput": "42",
        "isHidden": false
      }
    ],
    "order": 143
  },
  {
    "challengeId": "heap-01",
    "title": "Last Stone Weight Simulation",
    "slug": "heap-01-last-stone-weight-simulation",
    "category": "heaps",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are given an array of integers stones where stones[i] is the weight of the ith stone. At each step, smash two heaviest stones. Return weight of last remaining stone or 0.",
    "constraints": [
      "1 <= stones.length <= 30",
      "1 <= stones[i] <= 1000"
    ],
    "examples": [
      {
        "input": "stones = [2,7,4,1,8,1]",
        "output": "1",
        "explanation": "Last stone has weight 1."
      }
    ],
    "starterCode": "function solve(stones) {\n  const s = stones.slice();\n  while (s.length > 1) {\n    s.sort((a, b) => b - a);\n    const y = s.shift();\n    const x = s.shift();\n    if (y > x) s.push(y - x);\n  }\n  return s.length === 1 ? s[0] : 0;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,7,4,1,8,1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 144
  },
  {
    "challengeId": "heap-02",
    "title": "K Closest Points to Origin",
    "slug": "heap-02-k-closest-points-to-origin",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of points where points[i] = [xi, yi] and an integer k, return the k closest points to origin (0, 0) sorted by distance.",
    "constraints": [
      "1 <= k <= points.length <= 10^4",
      "-10^4 <= xi, yi <= 10^4"
    ],
    "examples": [
      {
        "input": "points = [[1,3],[-2,2]], k = 1",
        "output": "[[-2,2]]",
        "explanation": "Closest point is [-2,2]."
      }
    ],
    "starterCode": "function solve(points, k) {\n  const sorted = points.slice().sort((a, b) => (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1]));\n  return sorted.slice(0, k);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,3],[-2,2]], 1]",
        "expectedOutput": "[[-2,2]]",
        "isHidden": false
      },
      {
        "input": "[[[3,3],[5,-1],[-2,4]], 2]",
        "expectedOutput": "[[3,3],[-2,4]]",
        "isHidden": false
      }
    ],
    "order": 145
  },
  {
    "challengeId": "heap-03",
    "title": "Find Median from Data Stream Simulation",
    "slug": "heap-03-find-median-from-data-stream-simulation",
    "category": "heaps",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given a sequence of numbers added one by one, return array of medians after each insertion.",
    "constraints": [
      "1 <= nums.length <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [1, 2, 3]",
        "output": "[1, 1.5, 2]",
        "explanation": "Medians computed."
      }
    ],
    "starterCode": "function solve(nums) {\n  const list = [];\n  const res = [];\n  for (const n of nums) {\n    list.push(n);\n    list.sort((a, b) => a - b);\n    const len = list.length;\n    if (len % 2 === 1) res.push(list[Math.floor(len / 2)]);\n    else res.push((list[len / 2 - 1] + list[len / 2]) / 2);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1, 2, 3]]",
        "expectedOutput": "[1, 1.5, 2]",
        "isHidden": false
      },
      {
        "input": "[[5, 15, 1, 3]]",
        "expectedOutput": "[5, 10, 5, 4]",
        "isHidden": false
      }
    ],
    "order": 146
  },
  {
    "challengeId": "heap-04",
    "title": "Minimum Cost to Connect Sticks",
    "slug": "heap-04-minimum-cost-to-connect-sticks",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "You have some number of sticks with positive integer lengths. You can connect any two sticks of lengths x and y by paying a cost of x + y. Return minimum cost to connect all sticks.",
    "constraints": [
      "1 <= sticks.length <= 10^4",
      "1 <= sticks[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "sticks = [2,4,3]",
        "output": "14",
        "explanation": "Connect 2+3=5 (cost 5), then 5+4=9 (cost 9), total 14."
      }
    ],
    "starterCode": "function solve(sticks) {\n  if (sticks.length <= 1) return 0;\n  const s = sticks.slice().sort((a, b) => a - b);\n  let totalCost = 0;\n  while (s.length > 1) {\n    const cost = s.shift() + s.shift();\n    totalCost += cost;\n    let idx = 0;\n    while (idx < s.length && s[idx] < cost) idx++;\n    s.splice(idx, 0, cost);\n  }\n  return totalCost;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,4,3]]",
        "expectedOutput": "14",
        "isHidden": false
      },
      {
        "input": "[[1,8,3,5]]",
        "expectedOutput": "30",
        "isHidden": false
      },
      {
        "input": "[[5]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 147
  },
  {
    "challengeId": "heap-05",
    "title": "Sort Characters By Frequency",
    "slug": "heap-05-sort-characters-by-frequency",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s, sort it in decreasing order based on the frequency of the characters.",
    "constraints": [
      "1 <= s.length <= 5 * 10^5"
    ],
    "examples": [
      {
        "input": "s = \"tree\"",
        "output": "\"eert\"",
        "explanation": "e appears twice, r and t appear once."
      }
    ],
    "starterCode": "function solve(s) {\n  const freq = {};\n  for (const c of s) freq[c] = (freq[c] || 0) + 1;\n  const chars = Object.keys(freq).sort((a, b) => freq[b] - freq[a] || (a < b ? -1 : 1));\n  return chars.map(c => c.repeat(freq[c])).join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"tree\"]",
        "expectedOutput": "\"eert\"",
        "isHidden": false
      },
      {
        "input": "[\"cccaaa\"]",
        "expectedOutput": "\"aaaccc\"",
        "isHidden": false
      },
      {
        "input": "[\"Aabb\"]",
        "expectedOutput": "\"bbAa\"",
        "isHidden": true
      }
    ],
    "order": 148
  },
  {
    "challengeId": "heap-06",
    "title": "Reorganize String No Adjacent Duplicates",
    "slug": "heap-06-reorganize-string-no-adjacent-duplicates",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return \"\" if not possible.",
    "constraints": [
      "1 <= s.length <= 500"
    ],
    "examples": [
      {
        "input": "s = \"aab\"",
        "output": "\"aba\"",
        "explanation": "\"aba\" has no adjacent equal chars."
      }
    ],
    "starterCode": "function solve(s) {\n  const freq = {};\n  for (const c of s) freq[c] = (freq[c] || 0) + 1;\n  const maxFreq = Math.max(...Object.values(freq));\n  if (maxFreq > Math.floor((s.length + 1) / 2)) return \"\";\n  const chars = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);\n  const res = new Array(s.length);\n  let idx = 0;\n  for (const c of chars) {\n    for (let k = 0; k < freq[c]; k++) {\n      res[idx] = c;\n      idx += 2;\n      if (idx >= s.length) idx = 1;\n    }\n  }\n  return res.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"aab\"]",
        "expectedOutput": "\"aba\"",
        "isHidden": false
      },
      {
        "input": "[\"aaab\"]",
        "expectedOutput": "\"\"",
        "isHidden": false
      }
    ],
    "order": 149
  },
  {
    "challengeId": "heap-07",
    "title": "Kth Smallest Element in a Sorted Matrix",
    "slug": "heap-07-kth-smallest-element-in-a-sorted-matrix",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.",
    "constraints": [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 300",
      "1 <= k <= n^2"
    ],
    "examples": [
      {
        "input": "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8",
        "output": "13",
        "explanation": "8th smallest is 13."
      }
    ],
    "starterCode": "function solve(matrix, k) {\n  const flat = matrix.flat().sort((a, b) => a - b);\n  return flat[k - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,5,9],[10,11,13],[12,13,15]], 8]",
        "expectedOutput": "13",
        "isHidden": false
      },
      {
        "input": "[[[-5]], 1]",
        "expectedOutput": "-5",
        "isHidden": false
      }
    ],
    "order": 150
  },
  {
    "challengeId": "heap-08",
    "title": "Maximum Subsequence Score Product",
    "slug": "heap-08-maximum-subsequence-score-product",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given two 0-indexed integer arrays nums1 and nums2 of equal length n and an integer k, return the maximum score of a subsequence of length k.",
    "constraints": [
      "n == nums1.length == nums2.length",
      "1 <= k <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3",
        "output": "12",
        "explanation": "Max score is 12."
      }
    ],
    "starterCode": "function solve(nums1, nums2, k) {\n  const pairs = nums1.map((v, i) => [v, nums2[i]]).sort((a, b) => b[1] - a[1]);\n  let sum = 0, maxScore = 0;\n  const heap = [];\n  for (const [val, mult] of pairs) {\n    heap.push(val);\n    heap.sort((a, b) => a - b);\n    sum += val;\n    if (heap.length > k) sum -= heap.shift();\n    if (heap.length === k) maxScore = Math.max(maxScore, sum * mult);\n  }\n  return maxScore;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,3,3,2], [2,1,3,4], 3]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "input": "[[4,2,3,1,1], [7,5,10,9,6], 1]",
        "expectedOutput": "30",
        "isHidden": false
      }
    ],
    "order": 151
  },
  {
    "challengeId": "heap-09",
    "title": "Task Scheduler Least Intervals",
    "slug": "heap-09-task-scheduler-least-intervals",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a characters array tasks representing tasks CPU must execute and cooling time n, return the least number of intervals CPU will take to finish all tasks.",
    "constraints": [
      "1 <= tasks.length <= 10^4",
      "0 <= n <= 100"
    ],
    "examples": [
      {
        "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2",
        "output": "8",
        "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B."
      }
    ],
    "starterCode": "function solve(tasks, n) {\n  const freq = {};\n  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;\n  const maxVal = Math.max(...Object.values(freq));\n  const maxCount = Object.values(freq).filter(x => x === maxVal).length;\n  return Math.max(tasks.length, (maxVal - 1) * (n + 1) + maxCount);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 2]",
        "expectedOutput": "8",
        "isHidden": false
      },
      {
        "input": "[[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], 0]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "order": 152
  },
  {
    "challengeId": "heap-10",
    "title": "Find K Pairs with Smallest Sums",
    "slug": "heap-10-find-k-pairs-with-smallest-sums",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given two integer arrays nums1 and nums2 sorted in ascending order and an integer k. Return the k pairs (u1, v1), (u2, v2)... with smallest sums.",
    "constraints": [
      "1 <= nums1.length, nums2.length <= 10^4",
      "1 <= k <= 1000"
    ],
    "examples": [
      {
        "input": "nums1 = [1,7,11], nums2 = [2,4,6], k = 3",
        "output": "[[1,2],[1,4],[1,6]]",
        "explanation": "Smallest 3 sum pairs."
      }
    ],
    "starterCode": "function solve(nums1, nums2, k) {\n  const pairs = [];\n  for (let i = 0; i < Math.min(nums1.length, k); i++) {\n    for (let j = 0; j < Math.min(nums2.length, k); j++) {\n      pairs.push([nums1[i], nums2[j]]);\n    }\n  }\n  pairs.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));\n  return pairs.slice(0, k);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,7,11], [2,4,6], 3]",
        "expectedOutput": "[[1,2],[1,4],[1,6]]",
        "isHidden": false
      },
      {
        "input": "[[1,1,2], [1,2,3], 2]",
        "expectedOutput": "[[1,1],[1,1]]",
        "isHidden": false
      }
    ],
    "order": 153
  },
  {
    "challengeId": "heap-11",
    "title": "Seat Reservation Manager Simulation",
    "slug": "heap-11-seat-reservation-manager-simulation",
    "category": "heaps",
    "difficulty": "Medium",
    "points": 20,
    "description": "Design a system that manages the reservation state of n seats numbered 1 to n. Return array of seat numbers allocated from reserve() calls.",
    "constraints": [
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "n = 5, ops = [\"res\",\"res\",\"unres\",\"res\"], vals = [[],[],[2],[]]",
        "output": "[1,2,2]",
        "explanation": "Seat 1 then 2 reserved, 2 unreserved, 2 reserved again."
      }
    ],
    "starterCode": "function solve(n, ops, vals) {\n  let nextSeat = 1;\n  const unreserved = [];\n  const res = [];\n  for (let i = 0; i < ops.length; i++) {\n    if (ops[i] === \"res\") {\n      if (unreserved.length) {\n        res.push(unreserved.shift());\n      } else {\n        res.push(nextSeat++);\n      }\n    } else if (ops[i] === \"unres\") {\n      const s = vals[i][0];\n      unreserved.push(s);\n      unreserved.sort((a, b) => a - b);\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[5, [\"res\",\"res\",\"unres\",\"res\"], [[],[],[2],[]]]",
        "expectedOutput": "[1,2,2]",
        "isHidden": false
      }
    ],
    "order": 154
  },
  {
    "challengeId": "heap-12",
    "title": "Merge K Sorted Arrays",
    "slug": "heap-12-merge-k-sorted-arrays",
    "category": "heaps",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given k sorted arrays of integers, merge them into one single sorted array and return it.",
    "constraints": [
      "0 <= arrays.length <= 1000",
      "0 <= arrays[i].length <= 500"
    ],
    "examples": [
      {
        "input": "arrays = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "explanation": "Merged all arrays."
      }
    ],
    "starterCode": "function solve(arrays) {\n  return arrays.flat().sort((a, b) => a - b);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,4,5],[1,3,4],[2,6]]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "order": 155
  },
  {
    "challengeId": "graph-01",
    "title": "Number of Connected Islands in Grid",
    "slug": "graph-01-number-of-connected-islands-in-grid",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an m x n 2D binary grid grid which represents a map of \"1\"s (land) and \"0\"s (water), return the number of islands.",
    "constraints": [
      "m == grid.length, n == grid[i].length",
      "1 <= m, n <= 300"
    ],
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]",
        "output": "2",
        "explanation": "2 separate islands."
      }
    ],
    "starterCode": "function solve(grid) {\n  const m = grid.length, n = grid[0].length;\n  let islands = 0;\n  const g = grid.map(row => row.slice());\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] !== \"1\") return;\n    g[r][c] = \"0\";\n    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (g[r][c] === \"1\") {\n        islands++;\n        dfs(r, c);\n      }\n    }\n  }\n  return islands;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 156
  },
  {
    "challengeId": "graph-02",
    "title": "Max Area of Island in Binary Matrix",
    "slug": "graph-02-max-area-of-island-in-binary-matrix",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an m x n binary matrix grid, an island is a group of 1s connected 4-directionally. Return the maximum area of an island in grid. If no island, return 0.",
    "constraints": [
      "m == grid.length, n == grid[i].length",
      "1 <= m, n <= 50"
    ],
    "examples": [
      {
        "input": "grid = [[0,0,1,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]",
        "output": "5",
        "explanation": "Max island area is 5."
      }
    ],
    "starterCode": "function solve(grid) {\n  const m = grid.length, n = grid[0].length;\n  const g = grid.map(row => row.slice());\n  let maxArea = 0;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] !== 1) return 0;\n    g[r][c] = 0;\n    return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (g[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c));\n    }\n  }\n  return maxArea;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[0,0,1,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[[0,0,0],[0,0,0]]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 157
  },
  {
    "challengeId": "graph-03",
    "title": "Course Schedule Cycle Detection",
    "slug": "graph-03-course-schedule-cycle-detection",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "There are a total of numCourses you have to take, labeled 0 to numCourses - 1. prerequisites[i] = [a, b] indicates you must take b first. Return true if you can finish all courses.",
    "constraints": [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000"
    ],
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "true",
        "explanation": "Can finish."
      }
    ],
    "starterCode": "function solve(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({length: numCourses}, () => []);\n  for (const [a, b] of prerequisites) {\n    adj[b].push(a);\n    inDegree[a]++;\n  }\n  const q = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n  let visited = 0;\n  while (q.length) {\n    const node = q.shift();\n    visited++;\n    for (const neighbor of adj[node]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) q.push(neighbor);\n    }\n  }\n  return visited === numCourses;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2, [[1,0]]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[2, [[1,0],[0,1]]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 158
  },
  {
    "challengeId": "graph-04",
    "title": "Course Schedule II Ordering",
    "slug": "graph-04-course-schedule-ii-ordering",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Return the ordering of courses you should take to finish all courses. If impossible, return an empty array [].",
    "constraints": [
      "1 <= numCourses <= 2000"
    ],
    "examples": [
      {
        "input": "numCourses = 2, prerequisites = [[1,0]]",
        "output": "[0,1]",
        "explanation": "Valid order."
      }
    ],
    "starterCode": "function solve(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({length: numCourses}, () => []);\n  for (const [a, b] of prerequisites) {\n    adj[b].push(a);\n    inDegree[a]++;\n  }\n  const q = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n  const order = [];\n  while (q.length) {\n    const node = q.shift();\n    order.push(node);\n    for (const neighbor of adj[node]) {\n      inDegree[neighbor]--;\n      if (inDegree[neighbor] === 0) q.push(neighbor);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2, [[1,0]]]",
        "expectedOutput": "[0,1]",
        "isHidden": false
      },
      {
        "input": "[4, [[1,0],[2,0],[3,1],[3,2]]]",
        "expectedOutput": "[0,1,2,3]",
        "isHidden": false
      }
    ],
    "order": 159
  },
  {
    "challengeId": "graph-05",
    "title": "Clone Undirected Graph Vertex Count",
    "slug": "graph-05-clone-undirected-graph-vertex-count",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an adjacency list representing a connected undirected graph, return the number of nodes in the graph.",
    "constraints": [
      "0 <= adjList.length <= 100"
    ],
    "examples": [
      {
        "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        "output": "4",
        "explanation": "Graph has 4 vertices."
      }
    ],
    "starterCode": "function solve(adjList) {\n  return adjList.length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[2,4],[1,3],[2,4],[1,3]]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 160
  },
  {
    "challengeId": "graph-06",
    "title": "Pacific Atlantic Water Flow Count",
    "slug": "graph-06-pacific-atlantic-water-flow-count",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an m x n matrix heights representing continent elevations, return the number of grid coordinates where water can flow to both the Pacific and Atlantic oceans.",
    "constraints": [
      "m == heights.length, n == heights[i].length",
      "1 <= m, n <= 200"
    ],
    "examples": [
      {
        "input": "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "output": "7",
        "explanation": "7 cells reach both oceans."
      }
    ],
    "starterCode": "function solve(heights) {\n  const m = heights.length, n = heights[0].length;\n  const pacific = Array.from({length: m}, () => new Array(n).fill(false));\n  const atlantic = Array.from({length: m}, () => new Array(n).fill(false));\n  function dfs(r, c, visited, prevH) {\n    if (r < 0 || c < 0 || r >= m || c >= n || visited[r][c] || heights[r][c] < prevH) return;\n    visited[r][c] = true;\n    dfs(r+1, c, visited, heights[r][c]);\n    dfs(r-1, c, visited, heights[r][c]);\n    dfs(r, c+1, visited, heights[r][c]);\n    dfs(r, c-1, visited, heights[r][c]);\n  }\n  for (let r = 0; r < m; r++) {\n    dfs(r, 0, pacific, 0);\n    dfs(r, n - 1, atlantic, 0);\n  }\n  for (let c = 0; c < n; c++) {\n    dfs(0, c, pacific, 0);\n    dfs(m - 1, c, atlantic, 0);\n  }\n  let count = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (pacific[r][c] && atlantic[r][c]) count++;\n    }\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]]",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "[[[1]]]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 161
  },
  {
    "challengeId": "graph-07",
    "title": "Surrounded Regions Capture Matrix",
    "slug": "graph-07-surrounded-regions-capture-matrix",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an m x n matrix board containing \"X\" and \"O\", capture all regions that are 4-directionally surrounded by \"X\". Return updated board.",
    "constraints": [
      "m == board.length, n == board[i].length",
      "1 <= m, n <= 200"
    ],
    "examples": [
      {
        "input": "board = [[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]",
        "output": "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]",
        "explanation": "Surrounded captured."
      }
    ],
    "starterCode": "function solve(board) {\n  const m = board.length, n = board[0].length;\n  const b = board.map(row => row.slice());\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= m || c >= n || b[r][c] !== \"O\") return;\n    b[r][c] = \"E\";\n    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);\n  }\n  for (let r = 0; r < m; r++) {\n    if (b[r][0] === \"O\") dfs(r, 0);\n    if (b[r][n - 1] === \"O\") dfs(r, n - 1);\n  }\n  for (let c = 0; c < n; c++) {\n    if (b[0][c] === \"O\") dfs(0, c);\n    if (b[m - 1][c] === \"O\") dfs(m - 1, c);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (b[r][c] === \"O\") b[r][c] = \"X\";\n      else if (b[r][c] === \"E\") b[r][c] = \"O\";\n    }\n  }\n  return b;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"O\",\"X\"],[\"X\",\"X\",\"O\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]]",
        "expectedOutput": "[[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"X\",\"X\",\"X\"],[\"X\",\"O\",\"X\",\"X\"]]",
        "isHidden": false
      },
      {
        "input": "[[[\"X\"]]]",
        "expectedOutput": "[[\"X\"]]",
        "isHidden": false
      }
    ],
    "order": 162
  },
  {
    "challengeId": "graph-08",
    "title": "Rotting Oranges Minute Timer",
    "slug": "graph-08-rotting-oranges-minute-timer",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an m x n grid where each cell has 0 (empty), 1 (fresh), or 2 (rotten). Return the minimum number of minutes that must elapse until no cell has a fresh orange. If impossible, return -1.",
    "constraints": [
      "m == grid.length, n == grid[i].length",
      "1 <= m, n <= 10"
    ],
    "examples": [
      {
        "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4",
        "explanation": "4 minutes elapsed."
      }
    ],
    "starterCode": "function solve(grid) {\n  const m = grid.length, n = grid[0].length;\n  const g = grid.map(r => r.slice());\n  const q = [];\n  let fresh = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (g[r][c] === 2) q.push([r, c, 0]);\n      else if (g[r][c] === 1) fresh++;\n    }\n  }\n  let minutes = 0;\n  while (q.length) {\n    const [r, c, mins] = q.shift();\n    minutes = Math.max(minutes, mins);\n    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nc >= 0 && nr < m && nc < n && g[nr][nc] === 1) {\n        g[nr][nc] = 2;\n        fresh--;\n        q.push([nr, nc, mins + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? minutes : -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[2,1,1],[1,1,0],[0,1,1]]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[[2,1,1],[0,1,1],[1,0,1]]]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[[0,2]]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 163
  },
  {
    "challengeId": "graph-09",
    "title": "Word Ladder Transformation Length",
    "slug": "graph-09-word-ladder-transformation-length",
    "category": "graphs",
    "difficulty": "Hard",
    "points": 30,
    "description": "Given beginWord, endWord, and wordList, return number of words in shortest transformation sequence from beginWord to endWord, or 0 if no sequence exists.",
    "constraints": [
      "1 <= beginWord.length <= 10",
      "wordList.length <= 5000"
    ],
    "examples": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "explanation": "hit -> hot -> dot -> dog -> cog is 5 words."
      }
    ],
    "starterCode": "function solve(beginWord, endWord, wordList) {\n  const words = new Set(wordList);\n  if (!words.has(endWord)) return 0;\n  const q = [[beginWord, 1]];\n  const visited = new Set([beginWord]);\n  while (q.length) {\n    const [word, len] = q.shift();\n    if (word === endWord) return len;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const nextWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);\n        if (words.has(nextWord) && !visited.has(nextWord)) {\n          visited.add(nextWord);\n          q.push([nextWord, len + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[\"hit\", \"cog\", [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 164
  },
  {
    "challengeId": "graph-10",
    "title": "Number of Provinces Connected Components",
    "slug": "graph-10-number-of-provinces-connected-components",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "There are n cities. isConnected[i][j] = 1 if the ith city and jth city are directly connected. Return total number of provinces (connected components).",
    "constraints": [
      "1 <= n <= 200",
      "isConnected[i][j] is 1 or 0"
    ],
    "examples": [
      {
        "input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2",
        "explanation": "2 provinces."
      }
    ],
    "starterCode": "function solve(isConnected) {\n  const n = isConnected.length;\n  const visited = new Array(n).fill(false);\n  let provinces = 0;\n  function dfs(city) {\n    visited[city] = true;\n    for (let next = 0; next < n; next++) {\n      if (isConnected[city][next] === 1 && !visited[next]) dfs(next);\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (!visited[i]) {\n      provinces++;\n      dfs(i);\n    }\n  }\n  return provinces;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,1,0],[1,1,0],[0,0,1]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[1,0,0],[0,1,0],[0,0,1]]]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "order": 165
  },
  {
    "challengeId": "graph-11",
    "title": "Find if Path Exists in Graph",
    "slug": "graph-11-find-if-path-exists-in-graph",
    "category": "graphs",
    "difficulty": "Easy",
    "points": 10,
    "description": "There is a bi-directional graph with n vertices labeled from 0 to n - 1. Given edges and source, destination, determine if there is a valid path from source to destination.",
    "constraints": [
      "1 <= n <= 2 * 10^5",
      "0 <= edges.length <= 2 * 10^5"
    ],
    "examples": [
      {
        "input": "n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2",
        "output": "true",
        "explanation": "Path exists."
      }
    ],
    "starterCode": "function solve(n, edges, source, destination) {\n  if (source === destination) return true;\n  const adj = Array.from({length: n}, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const visited = new Array(n).fill(false);\n  const q = [source];\n  visited[source] = true;\n  while (q.length) {\n    const node = q.shift();\n    if (node === destination) return true;\n    for (const neighbor of adj[node]) {\n      if (!visited[neighbor]) {\n        visited[neighbor] = true;\n        q.push(neighbor);\n      }\n    }\n  }\n  return false;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[3, [[0,1],[1,2],[2,0]], 0, 2]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[6, [[0,1],[0,2],[3,5],[5,4],[4,3]], 0, 5]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 166
  },
  {
    "challengeId": "graph-12",
    "title": "Minimum Spanning Tree Total Weight",
    "slug": "graph-12-minimum-spanning-tree-total-weight",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given n vertices and undirected weighted edges [u, v, w], return the total weight of the Minimum Spanning Tree using Kruskals algorithm.",
    "constraints": [
      "1 <= n <= 1000",
      "1 <= edges.length <= 10^4"
    ],
    "examples": [
      {
        "input": "n = 4, edges = [[0,1,1],[1,2,2],[2,3,3],[0,3,4]]",
        "output": "6",
        "explanation": "Edges 1, 2, 3 sum to 6."
      }
    ],
    "starterCode": "function solve(n, edges) {\n  edges.sort((a, b) => a[2] - b[2]);\n  const parent = Array.from({length: n}, (_, i) => i);\n  function find(i) {\n    if (parent[i] === i) return i;\n    return parent[i] = find(parent[i]);\n  }\n  let weight = 0, count = 0;\n  for (const [u, v, w] of edges) {\n    const rootU = find(u), rootV = find(v);\n    if (rootU !== rootV) {\n      parent[rootU] = rootV;\n      weight += w;\n      count++;\n      if (count === n - 1) break;\n    }\n  }\n  return weight;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[4, [[0,1,1],[1,2,2],[2,3,3],[0,3,4]]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[3, [[0,1,5],[1,2,3],[0,2,1]]]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "order": 167
  },
  {
    "challengeId": "graph-13",
    "title": "Shortest Path in Binary Matrix",
    "slug": "graph-13-shortest-path-in-binary-matrix",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an n x n binary matrix grid, return length of shortest clear path from top-left (0, 0) to bottom-right (n-1, n-1) with 8-directional movement. If no path, return -1.",
    "constraints": [
      "n == grid.length == grid[i].length",
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "grid = [[0,1],[1,0]]",
        "output": "2",
        "explanation": "Length is 2."
      }
    ],
    "starterCode": "function solve(grid) {\n  const n = grid.length;\n  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;\n  if (n === 1) return 1;\n  const q = [[0, 0, 1]];\n  const visited = Array.from({length: n}, () => new Array(n).fill(false));\n  visited[0][0] = true;\n  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];\n  while (q.length) {\n    const [r, c, dist] = q.shift();\n    if (r === n - 1 && c === n - 1) return dist;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] === 0 && !visited[nr][nc]) {\n        visited[nr][nc] = true;\n        q.push([nr, nc, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[0,1],[1,0]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[0,0,0],[1,1,0],[1,1,0]]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[[1,0,0],[1,1,0],[1,1,0]]]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "order": 168
  },
  {
    "challengeId": "graph-14",
    "title": "Network Delay Time Dijkstra",
    "slug": "graph-14-network-delay-time-dijkstra",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given a network of n nodes labeled from 1 to n. times[i] = [u, v, w]. Return minimum time for all n nodes to receive signal from node k. If impossible, return -1.",
    "constraints": [
      "1 <= k <= n <= 100",
      "1 <= times.length <= 6000"
    ],
    "examples": [
      {
        "input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        "output": "2",
        "explanation": "Time is 2."
      }
    ],
    "starterCode": "function solve(times, n, k) {\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  for (let i = 1; i <= n; i++) {\n    for (const [u, v, w] of times) {\n      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n      }\n    }\n  }\n  let maxTime = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    maxTime = Math.max(maxTime, dist[i]);\n  }\n  return maxTime;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[2,1,1],[2,3,1],[3,4,1]], 4, 2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[1,2,1]], 2, 1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[[1,2,1]], 2, 2]",
        "expectedOutput": "-1",
        "isHidden": true
      }
    ],
    "order": 169
  },
  {
    "challengeId": "graph-15",
    "title": "Is Graph Bipartite 2-Coloring",
    "slug": "graph-15-is-graph-bipartite-2-coloring",
    "category": "graphs",
    "difficulty": "Medium",
    "points": 20,
    "description": "There is an undirected graph with n nodes. graph[u] is an array of adjacent nodes to u. Return true if graph is bipartite (can be 2-colored).",
    "constraints": [
      "graph.length == n",
      "1 <= n <= 100"
    ],
    "examples": [
      {
        "input": "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]",
        "output": "false",
        "explanation": "Cannot 2-color odd cycle."
      }
    ],
    "starterCode": "function solve(graph) {\n  const n = graph.length;\n  const colors = new Array(n).fill(0);\n  for (let i = 0; i < n; i++) {\n    if (colors[i] !== 0) continue;\n    const q = [i];\n    colors[i] = 1;\n    while (q.length) {\n      const u = q.shift();\n      for (const v of graph[u]) {\n        if (colors[v] === 0) {\n          colors[v] = -colors[u];\n          q.push(v);\n        } else if (colors[v] === colors[u]) {\n          return false;\n        }\n      }\n    }\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,2,3],[0,2],[0,1,3],[0,2]]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[[[1,3],[0,2],[1,3],[0,2]]]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "order": 170
  },
  {
    "challengeId": "dp-01",
    "title": "Climbing Stairs Combinations",
    "slug": "dp-01-climbing-stairs-combinations",
    "category": "dynamic-programming",
    "difficulty": "Easy",
    "points": 10,
    "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "constraints": [
      "1 <= n <= 45"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "1+1 or 2."
      }
    ],
    "starterCode": "function solve(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[5]",
        "expectedOutput": "8",
        "isHidden": true
      },
      {
        "input": "[10]",
        "expectedOutput": "89",
        "isHidden": true
      }
    ],
    "order": 171
  },
  {
    "challengeId": "dp-02",
    "title": "House Robber Maximum Loot",
    "slug": "dp-02-house-robber-maximum-loot",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are a professional robber planning to rob houses along a street without alerting adjacent alarm systems. Determine maximum money you can rob tonight.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and 3 (money = 3), total 4."
      }
    ],
    "starterCode": "function solve(nums) {\n  let prev1 = 0, prev2 = 0;\n  for (const n of nums) {\n    const temp = Math.max(prev1, prev2 + n);\n    prev2 = prev1;\n    prev1 = temp;\n  }\n  return prev1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[2,7,9,3,1]]",
        "expectedOutput": "12",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 172
  },
  {
    "challengeId": "dp-03",
    "title": "House Robber II Circular Street",
    "slug": "dp-03-house-robber-ii-circular-street",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "All houses at this place are arranged in a circle. Given integer array nums representing amount of money of each house, return max amount of money you can rob without alerting police.",
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [2,3,2]",
        "output": "3",
        "explanation": "You cannot rob house 1 and 3 because they are neighbors."
      }
    ],
    "starterCode": "function solve(nums) {\n  if (nums.length === 1) return nums[0];\n  function robRange(arr) {\n    let p1 = 0, p2 = 0;\n    for (const n of arr) {\n      const t = Math.max(p1, p2 + n);\n      p2 = p1;\n      p1 = t;\n    }\n    return p1;\n  }\n  return Math.max(robRange(nums.slice(0, -1)), robRange(nums.slice(1)));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,2]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,1]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "3",
        "isHidden": true
      }
    ],
    "order": 173
  },
  {
    "challengeId": "dp-04",
    "title": "Coin Change Minimum Coins",
    "slug": "dp-04-coin-change-minimum-coins",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an integer array coins and integer amount. Return the fewest number of coins that you need to make up that amount. If impossible, return -1.",
    "constraints": [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10^4"
    ],
    "examples": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1."
      }
    ],
    "starterCode": "function solve(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,5], 11]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[2], 3]",
        "expectedOutput": "-1",
        "isHidden": false
      },
      {
        "input": "[[1], 0]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 174
  },
  {
    "challengeId": "dp-05",
    "title": "Coin Change II Combinations Count",
    "slug": "dp-05-coin-change-ii-combinations-count",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Return the number of combinations that make up that amount. If amount cannot be made up by any combination, return 0.",
    "constraints": [
      "1 <= coins.length <= 300",
      "0 <= amount <= 5000"
    ],
    "examples": [
      {
        "input": "amount = 5, coins = [1,2,5]",
        "output": "4",
        "explanation": "5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1."
      }
    ],
    "starterCode": "function solve(amount, coins) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1;\n  for (const c of coins) {\n    for (let i = c; i <= amount; i++) {\n      dp[i] += dp[i - c];\n    }\n  }\n  return dp[amount];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[5, [1,2,5]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[3, [2]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[10, [10]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 175
  },
  {
    "challengeId": "dp-06",
    "title": "Longest Increasing Subsequence Length",
    "slug": "dp-06-longest-increasing-subsequence-length",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    "constraints": [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "examples": [
      {
        "input": "nums = [10,9,2,5,3,7,101,18]",
        "output": "4",
        "explanation": "LIS is [2,3,7,101], length 4."
      }
    ],
    "starterCode": "function solve(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let i = 0, j = tails.length;\n    while (i < j) {\n      const m = Math.floor((i + j) / 2);\n      if (tails[m] < x) i = m + 1;\n      else j = m;\n    }\n    tails[i] = x;\n  }\n  return tails.length;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[10,9,2,5,3,7,101,18]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[0,1,0,3,2,3]]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[[7,7,7,7,7]]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 176
  },
  {
    "challengeId": "dp-07",
    "title": "Longest Common Subsequence Length",
    "slug": "dp-07-longest-common-subsequence-length",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given two strings text1 and text2, return the length of their longest common subsequence. If none, return 0.",
    "constraints": [
      "1 <= text1.length, text2.length <= 1000"
    ],
    "examples": [
      {
        "input": "text1 = \"abcde\", text2 = \"ace\"",
        "output": "3",
        "explanation": "LCS is \"ace\", length 3."
      }
    ],
    "starterCode": "function solve(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abcde\", \"ace\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"abc\", \"abc\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"abc\", \"def\"]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 177
  },
  {
    "challengeId": "dp-08",
    "title": "Word Break Segments Verification",
    "slug": "dp-08-word-break-segments-verification",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.",
    "constraints": [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
        "output": "true",
        "explanation": "\"leetcode\" = \"leet\" + \"code\"."
      }
    ],
    "starterCode": "function solve(s, wordDict) {\n  const set = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && set.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  return dp[s.length];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"leetcode\", [\"leet\",\"code\"]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"applepenapple\", [\"apple\",\"pen\"]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"catsandog\", [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 178
  },
  {
    "challengeId": "dp-09",
    "title": "Unique Paths in Grid",
    "slug": "dp-09-unique-paths-in-grid",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "There is a robot on an m x n grid. The robot is at top-left (0, 0) and wants to reach bottom-right. How many possible unique paths are there?",
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "examples": [
      {
        "input": "m = 3, n = 7",
        "output": "28",
        "explanation": "28 unique paths."
      }
    ],
    "starterCode": "function solve(m, n) {\n  const dp = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[j] += dp[j - 1];\n    }\n  }\n  return dp[n - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[3, 7]",
        "expectedOutput": "28",
        "isHidden": false
      },
      {
        "input": "[3, 2]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[1, 1]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 179
  },
  {
    "challengeId": "dp-10",
    "title": "Minimum Path Sum in Grid",
    "slug": "dp-10-minimum-path-sum-in-grid",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right which minimizes sum of all numbers along its path.",
    "constraints": [
      "m == grid.length, n == grid[i].length",
      "1 <= m, n <= 200"
    ],
    "examples": [
      {
        "input": "grid = [[1,3,1],[1,5,1],[4,2,1]]",
        "output": "7",
        "explanation": "1 -> 3 -> 1 -> 1 -> 1 sum is 7."
      }
    ],
    "starterCode": "function solve(grid) {\n  const m = grid.length, n = grid[0].length;\n  const dp = Array.from({length: m}, () => new Array(n).fill(0));\n  dp[0][0] = grid[0][0];\n  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];\n  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];\n    }\n  }\n  return dp[m - 1][n - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[1,3,1],[1,5,1],[4,2,1]]]",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "[[[1,2,3],[4,5,6]]]",
        "expectedOutput": "12",
        "isHidden": false
      }
    ],
    "order": 180
  },
  {
    "challengeId": "dp-11",
    "title": "Partition Equal Subset Sum",
    "slug": "dp-11-partition-equal-subset-sum",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.",
    "constraints": [
      "1 <= nums.length <= 200",
      "1 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "nums = [1,5,11,5]",
        "output": "true",
        "explanation": "[1, 5, 5] and [11]."
      }
    ],
    "starterCode": "function solve(nums) {\n  const total = nums.reduce((a, b) => a + b, 0);\n  if (total % 2 !== 0) return false;\n  const target = total / 2;\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n  for (const n of nums) {\n    for (let i = target; i >= n; i--) {\n      dp[i] = dp[i] || dp[i - n];\n    }\n  }\n  return dp[target];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,5,11,5]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[1,2,3,5]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 181
  },
  {
    "challengeId": "dp-12",
    "title": "Edit Distance Levenshtein Operations",
    "slug": "dp-12-edit-distance-levenshtein-operations",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given two strings word1 and word2, return minimum number of operations required to convert word1 to word2 (insert, delete, replace).",
    "constraints": [
      "0 <= word1.length, word2.length <= 500"
    ],
    "examples": [
      {
        "input": "word1 = \"horse\", word2 = \"ros\"",
        "output": "3",
        "explanation": "horse -> rorse -> rose -> ros."
      }
    ],
    "starterCode": "function solve(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"horse\", \"ros\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"intention\", \"execution\"]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[\"\", \"a\"]",
        "expectedOutput": "1",
        "isHidden": true
      }
    ],
    "order": 182
  },
  {
    "challengeId": "dp-13",
    "title": "Maximum Product Subarray",
    "slug": "dp-13-maximum-product-subarray",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums, find a contiguous non-empty subarray within array that has largest product, and return product.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10"
    ],
    "examples": [
      {
        "input": "nums = [2,3,-2,4]",
        "output": "6",
        "explanation": "[2,3] has largest product 6."
      }
    ],
    "starterCode": "function solve(nums) {\n  let maxProd = nums[0], minProd = nums[0], res = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const n = nums[i];\n    if (n < 0) [maxProd, minProd] = [minProd, maxProd];\n    maxProd = Math.max(n, maxProd * n);\n    minProd = Math.min(n, minProd * n);\n    res = Math.max(res, maxProd);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,-2,4]]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[[-2,0,-1]]",
        "expectedOutput": "0",
        "isHidden": false
      },
      {
        "input": "[[-2,3,-4]]",
        "expectedOutput": "24",
        "isHidden": true
      }
    ],
    "order": 183
  },
  {
    "challengeId": "dp-14",
    "title": "Palindromic Substrings Total Count",
    "slug": "dp-14-palindromic-substrings-total-count",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s, return the number of palindromic substrings in it.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"abc\"",
        "output": "3",
        "explanation": "\"a\", \"b\", \"c\"."
      }
    ],
    "starterCode": "function solve(s) {\n  let count = 0;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      count++;\n      l--; r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"abc\"]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[\"aaa\"]",
        "expectedOutput": "6",
        "isHidden": false
      }
    ],
    "order": 184
  },
  {
    "challengeId": "dp-15",
    "title": "Longest Palindromic Subsequence Length",
    "slug": "dp-15-longest-palindromic-subsequence-length",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s, find the longest palindromic subsequences length in s.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"bbbab\"",
        "output": "4",
        "explanation": "\"bbbb\" has length 4."
      }
    ],
    "starterCode": "function solve(s) {\n  const n = s.length;\n  const dp = Array.from({length: n}, () => new Array(n).fill(0));\n  for (let i = 0; i < n; i++) dp[i][i] = 1;\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      if (s[i] === s[j]) dp[i][j] = dp[i + 1][j - 1] + 2;\n      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[0][n - 1];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"bbbab\"]",
        "expectedOutput": "4",
        "isHidden": false
      },
      {
        "input": "[\"cbbd\"]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 185
  },
  {
    "challengeId": "dp-16",
    "title": "Target Sum Expression Count",
    "slug": "dp-16-target-sum-expression-count",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an integer array nums and an integer target. Build an expression out of nums by adding symbols \"+\" and \"-\" before each integer. Return number of ways.",
    "constraints": [
      "1 <= nums.length <= 20",
      "0 <= nums[i] <= 1000",
      "-1000 <= target <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [1,1,1,1,1], target = 3",
        "output": "5",
        "explanation": "5 ways to get 3."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if (sum < Math.abs(target) || (sum + target) % 2 !== 0) return 0;\n  const P = (sum + target) / 2;\n  const dp = new Array(P + 1).fill(0);\n  dp[0] = 1;\n  for (const n of nums) {\n    for (let i = P; i >= n; i--) {\n      dp[i] += dp[i - n];\n    }\n  }\n  return dp[P];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,1,1,1,1], 3]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[1], 1]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 186
  },
  {
    "challengeId": "dp-17",
    "title": "Interleaving String Verification",
    "slug": "dp-17-interleaving-string-verification",
    "category": "dynamic-programming",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.",
    "constraints": [
      "0 <= s1.length, s2.length <= 100",
      "0 <= s3.length <= 200"
    ],
    "examples": [
      {
        "input": "s1 = \"aabcc\", s2 = \"dbbca\", s3 = \"aadbbcbcac\"",
        "output": "true",
        "explanation": "Interleaved."
      }
    ],
    "starterCode": "function solve(s1, s2, s3) {\n  if (s1.length + s2.length !== s3.length) return false;\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false));\n  dp[0][0] = true;\n  for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];\n  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      dp[i][j] = (dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) || (dp[i][j - 1] && s2[j - 1] === s3[i + j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"aabcc\", \"dbbca\", \"aadbbcbcac\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"aabcc\", \"dbbca\", \"aadbbbaccc\"]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 187
  },
  {
    "challengeId": "dp-18",
    "title": "Burst Balloons Maximum Coins",
    "slug": "dp-18-burst-balloons-maximum-coins",
    "category": "dynamic-programming",
    "difficulty": "Hard",
    "points": 30,
    "description": "You are given n balloons, indexed 0 to n - 1. Each has a number on it. Burst all balloons wisely to maximize coins obtained.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 300",
      "0 <= nums[i] <= 100"
    ],
    "examples": [
      {
        "input": "nums = [3,1,5,8]",
        "output": "167",
        "explanation": "Max coins = 167."
      }
    ],
    "starterCode": "function solve(nums) {\n  const val = [1, ...nums, 1];\n  const n = val.length;\n  const dp = Array.from({length: n}, () => new Array(n).fill(0));\n  for (let len = 1; len <= nums.length; len++) {\n    for (let i = 1; i <= nums.length - len + 1; i++) {\n      const j = i + len - 1;\n      for (let k = i; k <= j; k++) {\n        dp[i][j] = Math.max(dp[i][j], dp[i][k - 1] + val[i - 1] * val[k] * val[j + 1] + dp[k + 1][j]);\n      }\n    }\n  }\n  return dp[1][nums.length];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3,1,5,8]]",
        "expectedOutput": "167",
        "isHidden": false
      },
      {
        "input": "[[1,5]]",
        "expectedOutput": "10",
        "isHidden": false
      }
    ],
    "order": 188
  },
  {
    "challengeId": "greedy-01",
    "title": "Jump Game Reachable End",
    "slug": "greedy-01-jump-game-reachable-end",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an integer array nums. You are initially positioned at the first index. Return true if you can reach the last index, or false otherwise.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5"
    ],
    "examples": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "true",
        "explanation": "Jump 1 to index 1, then 3 to the last index."
      }
    ],
    "starterCode": "function solve(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,1,1,4]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[3,2,1,0,4]]",
        "expectedOutput": "false",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "true",
        "isHidden": true
      }
    ],
    "order": 189
  },
  {
    "challengeId": "greedy-02",
    "title": "Jump Game II Minimum Jumps",
    "slug": "greedy-02-jump-game-ii-minimum-jumps",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 1000"
    ],
    "examples": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "2",
        "explanation": "Min 2 jumps."
      }
    ],
    "starterCode": "function solve(nums) {\n  let jumps = 0, curEnd = 0, curFarthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    curFarthest = Math.max(curFarthest, i + nums[i]);\n    if (i === curEnd) {\n      jumps++;\n      curEnd = curFarthest;\n    }\n  }\n  return jumps;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,1,1,4]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[2,3,0,1,4]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1]]",
        "expectedOutput": "0",
        "isHidden": true
      }
    ],
    "order": 190
  },
  {
    "challengeId": "greedy-03",
    "title": "Gas Station Circular Tour",
    "slug": "greedy-03-gas-station-circular-tour",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "There are n gas stations along a circular route. Return starting gas stations index if you can travel around circuit once, otherwise -1.",
    "constraints": [
      "n == gas.length == cost.length",
      "1 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        "output": "3",
        "explanation": "Start at station 3 (index 3)."
      }
    ],
    "starterCode": "function solve(gas, cost) {\n  let totalTank = 0, curTank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    totalTank += gas[i] - cost[i];\n    curTank += gas[i] - cost[i];\n    if (curTank < 0) {\n      start = i + 1;\n      curTank = 0;\n    }\n  }\n  return totalTank >= 0 ? start : -1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3,4,5], [3,4,5,1,2]]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[2,3,4], [3,4,3]]",
        "expectedOutput": "-1",
        "isHidden": false
      }
    ],
    "order": 191
  },
  {
    "challengeId": "greedy-04",
    "title": "Assign Cookies Maximum Content Children",
    "slug": "greedy-04-assign-cookies-maximum-content-children",
    "category": "greedy",
    "difficulty": "Easy",
    "points": 10,
    "description": "Assume you are an awesome parent and want to give your children some cookies. Each child i has greed factor g[i], each cookie j has size s[j]. Maximize content children.",
    "constraints": [
      "1 <= g.length <= 3 * 10^4",
      "0 <= s.length <= 3 * 10^4"
    ],
    "examples": [
      {
        "input": "g = [1,2,3], s = [1,1]",
        "output": "1",
        "explanation": "Only 1 child can be content."
      }
    ],
    "starterCode": "function solve(g, s) {\n  g.sort((a, b) => a - b);\n  s.sort((a, b) => a - b);\n  let i = 0, j = 0;\n  while (i < g.length && j < s.length) {\n    if (s[j] >= g[i]) i++;\n    j++;\n  }\n  return i;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3], [1,1]]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[1,2], [1,2,3]]",
        "expectedOutput": "2",
        "isHidden": false
      }
    ],
    "order": 192
  },
  {
    "challengeId": "greedy-05",
    "title": "Lemonade Change Exact Change Check",
    "slug": "greedy-05-lemonade-change-exact-change-check",
    "category": "greedy",
    "difficulty": "Easy",
    "points": 10,
    "description": "Each lemonade costs $5. Customers stand in a queue and buy one at a time paying with $5, $10, or $20. Return true if you can provide every customer with correct change.",
    "constraints": [
      "1 <= bills.length <= 10^5",
      "bills[i] is either 5, 10, or 20"
    ],
    "examples": [
      {
        "input": "bills = [5,5,5,10,20]",
        "output": "true",
        "explanation": "Exact change given to all."
      }
    ],
    "starterCode": "function solve(bills) {\n  let five = 0, ten = 0;\n  for (const b of bills) {\n    if (b === 5) five++;\n    else if (b === 10) {\n      if (five === 0) return false;\n      five--; ten++;\n    } else {\n      if (ten > 0 && five > 0) {\n        ten--; five--;\n      } else if (five >= 3) {\n        five -= 3;\n      } else {\n        return false;\n      }\n    }\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[5,5,5,10,20]]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[5,5,10,10,20]]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 193
  },
  {
    "challengeId": "greedy-06",
    "title": "Candy Distribution Minimum Total",
    "slug": "greedy-06-candy-distribution-minimum-total",
    "category": "greedy",
    "difficulty": "Hard",
    "points": 30,
    "description": "There are n children standing in a line. Each child has a rating score. Distribute candies: each gets >= 1 candy, higher rating child gets more candies than neighbors. Min total candies.",
    "constraints": [
      "n == ratings.length",
      "1 <= n <= 2 * 10^4"
    ],
    "examples": [
      {
        "input": "ratings = [1,0,2]",
        "output": "5",
        "explanation": "Candies: [2, 1, 2], sum 5."
      }
    ],
    "starterCode": "function solve(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n  }\n  for (let i = n - 2; i >= 0; i--) {\n    if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n  }\n  return candies.reduce((a, b) => a + b, 0);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,0,2]]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[[1,2,2]]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "order": 194
  },
  {
    "challengeId": "greedy-07",
    "title": "Partition Labels Letter Partitions",
    "slug": "greedy-07-partition-labels-letter-partitions",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return list of part sizes.",
    "constraints": [
      "1 <= s.length <= 500",
      "s consists of lowercase English letters"
    ],
    "examples": [
      {
        "input": "s = \"ababcbacadefegdehijhklij\"",
        "output": "[9,7,8]",
        "explanation": "Partition sizes."
      }
    ],
    "starterCode": "function solve(s) {\n  const last = {};\n  for (let i = 0; i < s.length; i++) last[s[i]] = i;\n  let start = 0, end = 0;\n  const res = [];\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last[s[i]]);\n    if (i === end) {\n      res.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"ababcbacadefegdehijhklij\"]",
        "expectedOutput": "[9,7,8]",
        "isHidden": false
      },
      {
        "input": "[\"eccbbbbdec\"]",
        "expectedOutput": "[10]",
        "isHidden": false
      }
    ],
    "order": 195
  },
  {
    "challengeId": "greedy-08",
    "title": "Queue Reconstruction by Height",
    "slug": "greedy-08-queue-reconstruction-by-height",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an array of people where people[i] = [hi, ki] representing height hi and exactly ki other people with height >= hi in front. Reconstruct the queue.",
    "constraints": [
      "1 <= people.length <= 2000"
    ],
    "examples": [
      {
        "input": "people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]",
        "output": "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]",
        "explanation": "Queue reconstructed."
      }
    ],
    "starterCode": "function solve(people) {\n  people.sort((a, b) => b[0] - a[0] || a[1] - b[1]);\n  const res = [];\n  for (const p of people) {\n    res.splice(p[1], 0, p);\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]]",
        "expectedOutput": "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]",
        "isHidden": false
      },
      {
        "input": "[[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]]",
        "expectedOutput": "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]",
        "isHidden": false
      }
    ],
    "order": 196
  },
  {
    "challengeId": "greedy-09",
    "title": "Minimum Number of Arrows to Burst Balloons",
    "slug": "greedy-09-minimum-number-of-arrows-to-burst-balloons",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given points where points[i] = [xstart, xend] representing horizontal diameter of balloons, return minimum number of arrows that must be shot to burst all balloons.",
    "constraints": [
      "1 <= points.length <= 10^5"
    ],
    "examples": [
      {
        "input": "points = [[10,16],[2,8],[1,6],[7,12]]",
        "output": "2",
        "explanation": "Arrows at x = 6 and x = 11."
      }
    ],
    "starterCode": "function solve(points) {\n  if (!points.length) return 0;\n  points.sort((a, b) => a[1] - b[1]);\n  let arrows = 1;\n  let end = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > end) {\n      arrows++;\n      end = points[i][1];\n    }\n  }\n  return arrows;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[10,16],[2,8],[1,6],[7,12]]]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[[1,2],[3,4],[5,6],[7,8]]]",
        "expectedOutput": "4",
        "isHidden": false
      }
    ],
    "order": 197
  },
  {
    "challengeId": "greedy-10",
    "title": "Boats to Save People Minimum",
    "slug": "greedy-10-boats-to-save-people-minimum",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "You are given an array people where people[i] is weight of ith person, and integer limit. Each boat carries at most 2 people whose sum <= limit. Return minimum boats.",
    "constraints": [
      "1 <= people.length <= 5 * 10^4",
      "people[i] <= limit <= 3 * 10^4"
    ],
    "examples": [
      {
        "input": "people = [1,2], limit = 3",
        "output": "1",
        "explanation": "1 boat carries both."
      }
    ],
    "starterCode": "function solve(people, limit) {\n  people.sort((a, b) => a - b);\n  let i = 0, j = people.length - 1, boats = 0;\n  while (i <= j) {\n    if (people[i] + people[j] <= limit) i++;\n    j--;\n    boats++;\n  }\n  return boats;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2], 3]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[[3,2,2,1], 3]",
        "expectedOutput": "3",
        "isHidden": false
      },
      {
        "input": "[[3,5,3,4], 5]",
        "expectedOutput": "4",
        "isHidden": true
      }
    ],
    "order": 198
  },
  {
    "challengeId": "greedy-11",
    "title": "Two City Scheduling Minimum Cost",
    "slug": "greedy-11-two-city-scheduling-minimum-cost",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "A company is planning to interview 2n people. costs[i] = [aCosti, bCosti]. Send n to city A and n to city B minimizing total cost.",
    "constraints": [
      "costs.length == 2 * n",
      "1 <= n <= 50"
    ],
    "examples": [
      {
        "input": "costs = [[10,20],[30,200],[400,50],[30,20]]",
        "output": "110",
        "explanation": "Min cost is 110."
      }
    ],
    "starterCode": "function solve(costs) {\n  costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));\n  const n = costs.length / 2;\n  let total = 0;\n  for (let i = 0; i < n; i++) total += costs[i][0];\n  for (let i = n; i < 2 * n; i++) total += costs[i][1];\n  return total;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[10,20],[30,200],[400,50],[30,20]]]",
        "expectedOutput": "110",
        "isHidden": false
      },
      {
        "input": "[[[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]]",
        "expectedOutput": "1859",
        "isHidden": false
      }
    ],
    "order": 199
  },
  {
    "challengeId": "greedy-12",
    "title": "Task Assignment Maximum Finished",
    "slug": "greedy-12-task-assignment-maximum-finished",
    "category": "greedy",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given task durations tasks and worker capacity T, return maximum number of tasks one worker can complete within T time.",
    "constraints": [
      "1 <= tasks.length <= 1000"
    ],
    "examples": [
      {
        "input": "tasks = [4,2,1,3], T = 5",
        "output": "2",
        "explanation": "Tasks 1 and 2 take 3 <= 5."
      }
    ],
    "starterCode": "function solve(tasks, T) {\n  tasks.sort((a, b) => a - b);\n  let count = 0, sum = 0;\n  for (const t of tasks) {\n    if (sum + t <= T) {\n      sum += t;\n      count++;\n    } else break;\n  }\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[4,2,1,3], 5]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[[1,2,3], 0]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 200
  },
  {
    "challengeId": "greedy-13",
    "title": "Valid Palindrome II with One Deletion",
    "slug": "greedy-13-valid-palindrome-ii-with-one-deletion",
    "category": "greedy",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a string s, return true if the s can be palindrome after deleting at most one character from it.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "examples": [
      {
        "input": "s = \"aba\"",
        "output": "true",
        "explanation": "Already palindrome."
      }
    ],
    "starterCode": "function solve(s) {\n  function isPal(str, l, r) {\n    while (l < r) {\n      if (str[l] !== str[r]) return false;\n      l++; r--;\n    }\n    return true;\n  }\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (s[l] !== s[r]) {\n      return isPal(s, l + 1, r) || isPal(s, l, r - 1);\n    }\n    l++; r--;\n  }\n  return true;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"aba\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"abca\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[\"abc\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 201
  },
  {
    "challengeId": "greedy-14",
    "title": "Minimum Add to Make Parentheses Valid",
    "slug": "greedy-14-minimum-add-to-make-parentheses-valid",
    "category": "greedy",
    "difficulty": "Medium",
    "points": 20,
    "description": "A parentheses string is valid if standard rules apply. Return minimum number of moves required to make s valid.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "examples": [
      {
        "input": "s = \"())\"",
        "output": "1",
        "explanation": "Add 1 \"(\" at start."
      }
    ],
    "starterCode": "function solve(s) {\n  let open = 0, add = 0;\n  for (const c of s) {\n    if (c === \"(\") open++;\n    else {\n      if (open > 0) open--;\n      else add++;\n    }\n  }\n  return add + open;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"())\"]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[\"(((\"]",
        "expectedOutput": "3",
        "isHidden": false
      }
    ],
    "order": 202
  },
  {
    "challengeId": "bt-01",
    "title": "Subsets Power Set Generation",
    "slug": "bt-01-subsets-power-set-generation",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an integer array nums of unique elements, return all possible subsets (the power set) sorted lexicographically.",
    "constraints": [
      "1 <= nums.length <= 10",
      "All numbers of nums are unique"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]",
        "explanation": "All subsets."
      }
    ],
    "starterCode": "function solve(nums) {\n  const res = [];\n  nums.sort((a, b) => a - b);\n  function backtrack(start, path) {\n    res.push(path.slice());\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]",
        "isHidden": false
      },
      {
        "input": "[[0]]",
        "expectedOutput": "[[],[0]]",
        "isHidden": false
      }
    ],
    "order": 203
  },
  {
    "challengeId": "bt-02",
    "title": "Permutations of Distinct Integers",
    "slug": "bt-02-permutations-of-distinct-integers",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array nums of distinct integers, return all the possible permutations in lexicographical order.",
    "constraints": [
      "1 <= nums.length <= 6",
      "All integers of nums are unique"
    ],
    "examples": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        "explanation": "All permutations."
      }
    ],
    "starterCode": "function solve(nums) {\n  const res = [];\n  nums.sort((a, b) => a - b);\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) {\n      res.push(path.slice());\n      return;\n    }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1,2,3]]",
        "expectedOutput": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        "isHidden": false
      },
      {
        "input": "[[0,1]]",
        "expectedOutput": "[[0,1],[1,0]]",
        "isHidden": false
      }
    ],
    "order": 204
  },
  {
    "challengeId": "bt-03",
    "title": "Combination Sum Distinct Candidates",
    "slug": "bt-03-combination-sum-distinct-candidates",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations where chosen numbers sum to target.",
    "constraints": [
      "1 <= candidates.length <= 30",
      "1 <= target <= 40"
    ],
    "examples": [
      {
        "input": "candidates = [2,3,6,7], target = 7",
        "output": "[[2,2,3],[7]]",
        "explanation": "Combinations summing to 7."
      }
    ],
    "starterCode": "function solve(candidates, target) {\n  const res = [];\n  candidates.sort((a, b) => a - b);\n  function backtrack(start, rem, path) {\n    if (rem === 0) { res.push(path.slice()); return; }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > rem) break;\n      path.push(candidates[i]);\n      backtrack(i, rem - candidates[i], path);\n      path.pop();\n    }\n  }\n  backtrack(0, target, []);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[2,3,6,7], 7]",
        "expectedOutput": "[[2,2,3],[7]]",
        "isHidden": false
      },
      {
        "input": "[[2,3,5], 8]",
        "expectedOutput": "[[2,2,2,2],[2,3,3],[3,5]]",
        "isHidden": false
      }
    ],
    "order": 205
  },
  {
    "challengeId": "bt-04",
    "title": "Letter Combinations of a Phone Number",
    "slug": "bt-04-letter-combinations-of-a-phone-number",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that number could represent.",
    "constraints": [
      "0 <= digits.length <= 4"
    ],
    "examples": [
      {
        "input": "digits = \"23\"",
        "output": "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "explanation": "Letter combos."
      }
    ],
    "starterCode": "function solve(digits) {\n  if (!digits.length) return [];\n  const pad = { \"2\": \"abc\", \"3\": \"def\", \"4\": \"ghi\", \"5\": \"jkl\", \"6\": \"mno\", \"7\": \"pqrs\", \"8\": \"tuv\", \"9\": \"wxyz\" };\n  const res = [];\n  function backtrack(idx, cur) {\n    if (idx === digits.length) { res.push(cur); return; }\n    for (const c of pad[digits[idx]]) {\n      backtrack(idx + 1, cur + c);\n    }\n  }\n  backtrack(0, \"\");\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"23\"]",
        "expectedOutput": "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "isHidden": false
      },
      {
        "input": "[\"\"]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "order": 206
  },
  {
    "challengeId": "bt-05",
    "title": "Generate Valid Parentheses Combinations",
    "slug": "bt-05-generate-valid-parentheses-combinations",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    "constraints": [
      "1 <= n <= 8"
    ],
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "explanation": "Well-formed."
      }
    ],
    "starterCode": "function solve(n) {\n  const res = [];\n  function backtrack(cur, open, close) {\n    if (cur.length === 2 * n) { res.push(cur); return; }\n    if (open < n) backtrack(cur + \"(\", open + 1, close);\n    if (close < open) backtrack(cur + \")\", open, close + 1);\n  }\n  backtrack(\"\", 0, 0);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[3]",
        "expectedOutput": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "[\"()\"]",
        "isHidden": false
      }
    ],
    "order": 207
  },
  {
    "challengeId": "bt-06",
    "title": "Word Search in Grid",
    "slug": "bt-06-word-search-in-grid",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an m x n grid of characters board and string word, return true if word exists in grid.",
    "constraints": [
      "m == board.length, n == board[i].length",
      "1 <= word.length <= 15"
    ],
    "examples": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
        "output": "true",
        "explanation": "Word found."
      }
    ],
    "starterCode": "function solve(board, word) {\n  const m = board.length, n = board[0].length;\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[idx]) return false;\n    const temp = board[r][c];\n    board[r][c] = \"#\";\n    const found = dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1);\n    board[r][c] = temp;\n    return found;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCCED\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"SEE\"]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], \"ABCB\"]",
        "expectedOutput": "false",
        "isHidden": true
      }
    ],
    "order": 208
  },
  {
    "challengeId": "bt-07",
    "title": "Palindrome Partitioning All Substrings",
    "slug": "bt-07-palindrome-partitioning-all-substrings",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.",
    "constraints": [
      "1 <= s.length <= 16"
    ],
    "examples": [
      {
        "input": "s = \"aab\"",
        "output": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
        "explanation": "All partitions."
      }
    ],
    "starterCode": "function solve(s) {\n  const res = [];\n  function isPal(str, l, r) {\n    while (l < r) {\n      if (str[l++] !== str[r--]) return false;\n    }\n    return true;\n  }\n  function backtrack(start, path) {\n    if (start === s.length) { res.push(path.slice()); return; }\n    for (let i = start; i < s.length; i++) {\n      if (isPal(s, start, i)) {\n        path.push(s.substring(start, i + 1));\n        backtrack(i + 1, path);\n        path.pop();\n      }\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"aab\"]",
        "expectedOutput": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
        "isHidden": false
      },
      {
        "input": "[\"a\"]",
        "expectedOutput": "[[\"a\"]]",
        "isHidden": false
      }
    ],
    "order": 209
  },
  {
    "challengeId": "bt-08",
    "title": "N-Queens Valid Placement Count",
    "slug": "bt-08-n-queens-valid-placement-count",
    "category": "backtracking",
    "difficulty": "Hard",
    "points": 30,
    "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return total distinct solutions.",
    "constraints": [
      "1 <= n <= 9"
    ],
    "examples": [
      {
        "input": "n = 4",
        "output": "2",
        "explanation": "2 distinct solutions."
      }
    ],
    "starterCode": "function solve(n) {\n  let count = 0;\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  function backtrack(row) {\n    if (row === n) { count++; return; }\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;\n      cols.add(col); diag1.add(row - col); diag2.add(row + col);\n      backtrack(row + 1);\n      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);\n    }\n  }\n  backtrack(0);\n  return count;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[4]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[8]",
        "expectedOutput": "92",
        "isHidden": true
      }
    ],
    "order": 210
  },
  {
    "challengeId": "bt-09",
    "title": "Sudoku Solver Feasibility Check",
    "slug": "bt-09-sudoku-solver-feasibility-check",
    "category": "backtracking",
    "difficulty": "Hard",
    "points": 30,
    "description": "Write a program to solve a Sudoku puzzle by filling empty cells. Return true if a valid solution exists.",
    "constraints": [
      "board.length == 9, board[i].length == 9"
    ],
    "examples": [
      {
        "input": "board",
        "output": "true",
        "explanation": "Solvable."
      }
    ],
    "starterCode": "function solve(board) {\n  function isValid(r, c, ch) {\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch) return false;\n      if (board[i][c] === ch) return false;\n      const br = Math.floor(r / 3) * 3 + Math.floor(i / 3);\n      const bc = Math.floor(c / 3) * 3 + (i % 3);\n      if (board[br][bc] === ch) return false;\n    }\n    return true;\n  }\n  function solveGrid() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === \".\") {\n          for (let ch = 1; ch <= 9; ch++) {\n            const s = String(ch);\n            if (isValid(r, c, s)) {\n              board[r][c] = s;\n              if (solveGrid()) return true;\n              board[r][c] = \".\";\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  return solveGrid();\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]]",
        "expectedOutput": "true",
        "isHidden": false
      }
    ],
    "order": 211
  },
  {
    "challengeId": "bt-10",
    "title": "Combinations K Numbers from 1 to N",
    "slug": "bt-10-combinations-k-numbers-from-1-to-n",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given two integers n and k, return all possible combinations of k numbers chosen from range [1, n].",
    "constraints": [
      "1 <= n <= 20",
      "1 <= k <= n"
    ],
    "examples": [
      {
        "input": "n = 4, k = 2",
        "output": "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
        "explanation": "All combinations."
      }
    ],
    "starterCode": "function solve(n, k) {\n  const res = [];\n  function backtrack(start, path) {\n    if (path.length === k) { res.push(path.slice()); return; }\n    for (let i = start; i <= n; i++) {\n      path.push(i);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(1, []);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[4, 2]",
        "expectedOutput": "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
        "isHidden": false
      },
      {
        "input": "[1, 1]",
        "expectedOutput": "[[1]]",
        "isHidden": false
      }
    ],
    "order": 212
  },
  {
    "challengeId": "bt-11",
    "title": "Subset Sum Match Target Exists",
    "slug": "bt-11-subset-sum-match-target-exists",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given an array of integers nums and target, return true if there is a subset whose sum is equal to target.",
    "constraints": [
      "1 <= nums.length <= 20"
    ],
    "examples": [
      {
        "input": "nums = [3, 34, 4, 12, 5, 2], target = 9",
        "output": "true",
        "explanation": "4 + 5 = 9."
      }
    ],
    "starterCode": "function solve(nums, target) {\n  function backtrack(idx, cur) {\n    if (cur === target) return true;\n    if (idx >= nums.length || cur > target) return false;\n    return backtrack(idx + 1, cur + nums[idx]) || backtrack(idx + 1, cur);\n  }\n  return backtrack(0, 0);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[3, 34, 4, 12, 5, 2], 9]",
        "expectedOutput": "true",
        "isHidden": false
      },
      {
        "input": "[[3, 34, 4, 12, 5, 2], 30]",
        "expectedOutput": "false",
        "isHidden": false
      }
    ],
    "order": 213
  },
  {
    "challengeId": "bt-12",
    "title": "Restore IP Addresses All Valid",
    "slug": "bt-12-restore-ip-addresses-all-valid",
    "category": "backtracking",
    "difficulty": "Medium",
    "points": 20,
    "description": "A valid IP address consists of exactly four integers separated by single dots. Given a string s containing only digits, return all possible valid IP addresses.",
    "constraints": [
      "1 <= s.length <= 20"
    ],
    "examples": [
      {
        "input": "s = \"25525511135\"",
        "output": "[\"255.255.11.135\",\"255.255.111.35\"]",
        "explanation": "Valid IPs."
      }
    ],
    "starterCode": "function solve(s) {\n  const res = [];\n  function backtrack(idx, parts) {\n    if (parts.length === 4) {\n      if (idx === s.length) res.push(parts.join(\".\"));\n      return;\n    }\n    for (let len = 1; len <= 3 && idx + len <= s.length; len++) {\n      const sub = s.substring(idx, idx + len);\n      if (sub.length > 1 && sub[0] === \"0\") continue;\n      if (Number(sub) <= 255) {\n        parts.push(sub);\n        backtrack(idx + len, parts);\n        parts.pop();\n      }\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"25525511135\"]",
        "expectedOutput": "[\"255.255.11.135\",\"255.255.111.35\"]",
        "isHidden": false
      },
      {
        "input": "[\"0000\"]",
        "expectedOutput": "[\"0.0.0.0\"]",
        "isHidden": false
      }
    ],
    "order": 214
  },
  {
    "challengeId": "bt-13",
    "title": "Binary Watch All Possible Times",
    "slug": "bt-13-binary-watch-all-possible-times",
    "category": "backtracking",
    "difficulty": "Easy",
    "points": 10,
    "description": "A binary watch has 4 LEDs on top for hours (0-11) and 6 LEDs on bottom for minutes (0-59). Given turnedOn, return all possible times.",
    "constraints": [
      "0 <= turnedOn <= 10"
    ],
    "examples": [
      {
        "input": "turnedOn = 1",
        "output": "[\"0:01\",\"0:02\",\"0:04\",\"0:08\",\"0:16\",\"0:32\",\"1:00\",\"2:00\",\"4:00\",\"8:00\"]",
        "explanation": "All 1-bit times."
      }
    ],
    "starterCode": "function solve(turnedOn) {\n  function countBits(n) {\n    let c = 0;\n    while (n > 0) { c += n & 1; n >>= 1; }\n    return c;\n  }\n  const res = [];\n  for (let h = 0; h < 12; h++) {\n    for (let m = 0; m < 60; m++) {\n      if (countBits(h) + countBits(m) === turnedOn) {\n        res.push(`${h}:${m < 10 ? \"0\" + m : m}`);\n      }\n    }\n  }\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[1]",
        "expectedOutput": "[\"0:01\",\"0:02\",\"0:04\",\"0:08\",\"0:16\",\"0:32\",\"1:00\",\"2:00\",\"4:00\",\"8:00\"]",
        "isHidden": false
      },
      {
        "input": "[9]",
        "expectedOutput": "[]",
        "isHidden": false
      }
    ],
    "order": 215
  },
  {
    "challengeId": "rec-01",
    "title": "Fibonacci Number Recursive Calculation",
    "slug": "rec-01-fibonacci-number-recursive-calculation",
    "category": "recursion",
    "difficulty": "Easy",
    "points": 10,
    "description": "The Fibonacci numbers form a sequence where F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2). Given n, calculate F(n).",
    "constraints": [
      "0 <= n <= 30"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "1",
        "explanation": "F(2) = 1 + 0 = 1."
      }
    ],
    "starterCode": "function solve(n) {\n  if (n <= 1) return n;\n  return solve(n - 1) + solve(n - 2);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[3]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[4]",
        "expectedOutput": "3",
        "isHidden": true
      },
      {
        "input": "[10]",
        "expectedOutput": "55",
        "isHidden": true
      }
    ],
    "order": 216
  },
  {
    "challengeId": "rec-02",
    "title": "Pow(x, n) Fast Exponentiation",
    "slug": "rec-02-pow-x-n-fast-exponentiation",
    "category": "recursion",
    "difficulty": "Medium",
    "points": 20,
    "description": "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Return result rounded to 5 decimal places.",
    "constraints": [
      "-100.0 < x < 100.0",
      "-2^31 <= n <= 2^31-1"
    ],
    "examples": [
      {
        "input": "x = 2.0, n = 10",
        "output": "1024",
        "explanation": "2^10 = 1024."
      }
    ],
    "starterCode": "function solve(x, n) {\n  function fastPow(b, p) {\n    if (p === 0) return 1;\n    if (p < 0) return 1 / fastPow(b, -p);\n    if (p % 2 === 0) {\n      const half = fastPow(b, Math.floor(p / 2));\n      return half * half;\n    }\n    return b * fastPow(b, p - 1);\n  }\n  return parseFloat(fastPow(x, n).toFixed(5));\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2.0, 10]",
        "expectedOutput": "1024",
        "isHidden": false
      },
      {
        "input": "[2.1, 3]",
        "expectedOutput": "9.261",
        "isHidden": false
      },
      {
        "input": "[2.0, -2]",
        "expectedOutput": "0.25",
        "isHidden": true
      }
    ],
    "order": 217
  },
  {
    "challengeId": "rec-03",
    "title": "Tower of Hanoi Move Count",
    "slug": "rec-03-tower-of-hanoi-move-count",
    "category": "recursion",
    "difficulty": "Medium",
    "points": 20,
    "description": "Given n disks on source rod A, calculate the minimum number of moves needed to move all disks from rod A to destination rod C using rod B.",
    "constraints": [
      "1 <= n <= 20"
    ],
    "examples": [
      {
        "input": "n = 3",
        "output": "7",
        "explanation": "2^3 - 1 = 7 moves."
      }
    ],
    "starterCode": "function solve(n) {\n  if (n === 1) return 1;\n  return 2 * solve(n - 1) + 1;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[3]",
        "expectedOutput": "7",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[4]",
        "expectedOutput": "15",
        "isHidden": true
      }
    ],
    "order": 218
  },
  {
    "challengeId": "rec-04",
    "title": "Merge Two Sorted Arrays Recursively",
    "slug": "rec-04-merge-two-sorted-arrays-recursively",
    "category": "recursion",
    "difficulty": "Easy",
    "points": 10,
    "description": "Recursively merge two sorted arrays into one sorted array.",
    "constraints": [
      "0 <= a.length, b.length <= 100"
    ],
    "examples": [
      {
        "input": "a = [1, 3, 5], b = [2, 4, 6]",
        "output": "[1, 2, 3, 4, 5, 6]",
        "explanation": "Merged recursively."
      }
    ],
    "starterCode": "function solve(a, b) {\n  if (!a.length) return b;\n  if (!b.length) return a;\n  if (a[0] <= b[0]) return [a[0], ...solve(a.slice(1), b)];\n  return [b[0], ...solve(a, b.slice(1))];\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[[1, 3, 5], [2, 4, 6]]",
        "expectedOutput": "[1, 2, 3, 4, 5, 6]",
        "isHidden": false
      },
      {
        "input": "[[], [1]]",
        "expectedOutput": "[1]",
        "isHidden": false
      }
    ],
    "order": 219
  },
  {
    "challengeId": "rec-05",
    "title": "Binary String Gray Code Recursion",
    "slug": "rec-05-binary-string-gray-code-recursion",
    "category": "recursion",
    "difficulty": "Medium",
    "points": 20,
    "description": "An n-bit gray code sequence is a sequence of 2^n integers where every adjacent pair differs by exactly one bit. Return the sequence.",
    "constraints": [
      "1 <= n <= 10"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "[0, 1, 3, 2]",
        "explanation": "Valid Gray code."
      }
    ],
    "starterCode": "function solve(n) {\n  if (n === 1) return [0, 1];\n  const prev = solve(n - 1);\n  const add = 1 << (n - 1);\n  const res = prev.slice();\n  for (let i = prev.length - 1; i >= 0; i--) res.push(prev[i] + add);\n  return res;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[2]",
        "expectedOutput": "[0, 1, 3, 2]",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "[0, 1]",
        "isHidden": false
      }
    ],
    "order": 220
  },
  {
    "challengeId": "rec-06",
    "title": "Factorial Calculation Recursively",
    "slug": "rec-06-factorial-calculation-recursively",
    "category": "recursion",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a non-negative integer n, calculate its factorial n! recursively.",
    "constraints": [
      "0 <= n <= 12"
    ],
    "examples": [
      {
        "input": "n = 5",
        "output": "120",
        "explanation": "5! = 120."
      }
    ],
    "starterCode": "function solve(n) {\n  if (n <= 1) return 1;\n  return n * solve(n - 1);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[5]",
        "expectedOutput": "120",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[3]",
        "expectedOutput": "6",
        "isHidden": true
      }
    ],
    "order": 221
  },
  {
    "challengeId": "rec-07",
    "title": "Greatest Common Divisor Euclid Recursion",
    "slug": "rec-07-greatest-common-divisor-euclid-recursion",
    "category": "recursion",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given two positive integers a and b, compute their greatest common divisor using Euclid algorithm recursively.",
    "constraints": [
      "1 <= a, b <= 10^9"
    ],
    "examples": [
      {
        "input": "a = 48, b = 18",
        "output": "6",
        "explanation": "GCD(48, 18) = 6."
      }
    ],
    "starterCode": "function solve(a, b) {\n  if (b === 0) return a;\n  return solve(b, a % b);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[48, 18]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[101, 10]",
        "expectedOutput": "1",
        "isHidden": false
      },
      {
        "input": "[20, 100]",
        "expectedOutput": "20",
        "isHidden": true
      }
    ],
    "order": 222
  },
  {
    "challengeId": "rec-08",
    "title": "Sum of Digits Recursive Reduction",
    "slug": "rec-08-sum-of-digits-recursive-reduction",
    "category": "recursion",
    "difficulty": "Easy",
    "points": 10,
    "description": "Given a non-negative integer num, repeatedly add all its digits until the result has only one digit, and return it.",
    "constraints": [
      "0 <= num <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "num = 38",
        "output": "2",
        "explanation": "3 + 8 = 11, 1 + 1 = 2."
      }
    ],
    "starterCode": "function solve(num) {\n  if (num < 10) return num;\n  let sum = 0;\n  while (num > 0) {\n    sum += num % 10;\n    num = Math.floor(num / 10);\n  }\n  return solve(sum);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[38]",
        "expectedOutput": "2",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "0",
        "isHidden": false
      }
    ],
    "order": 223
  },
  {
    "challengeId": "rec-09",
    "title": "Count Good Numbers Even Odd Modulo",
    "slug": "rec-09-count-good-numbers-even-odd-modulo",
    "category": "recursion",
    "difficulty": "Medium",
    "points": 20,
    "description": "A digit string is good if digits at even indices are even (0, 2, 4, 6, 8) and odd indices are prime (2, 3, 5, 7). Given n, return total good strings modulo 10^9 + 7.",
    "constraints": [
      "1 <= n <= 10^15"
    ],
    "examples": [
      {
        "input": "n = 1",
        "output": "5",
        "explanation": "5 good strings of length 1: \"0\",\"2\",\"4\",\"6\",\"8\"."
      }
    ],
    "starterCode": "function solve(n) {\n  const MOD = 1000000007n;\n  function power(base, exp) {\n    let res = 1n;\n    base = base % MOD;\n    while (exp > 0n) {\n      if (exp % 2n === 1n) res = (res * base) % MOD;\n      base = (base * base) % MOD;\n      exp /= 2n;\n    }\n    return res;\n  }\n  const bigN = BigInt(n);\n  const evenCount = (bigN + 1n) / 2n;\n  const oddCount = bigN / 2n;\n  const ans = (power(5n, evenCount) * power(4n, oddCount)) % MOD;\n  return Number(ans);\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[1]",
        "expectedOutput": "5",
        "isHidden": false
      },
      {
        "input": "[4]",
        "expectedOutput": "400",
        "isHidden": false
      }
    ],
    "order": 224
  },
  {
    "challengeId": "rec-10",
    "title": "Elimination Game Remaining Number",
    "slug": "rec-10-elimination-game-remaining-number",
    "category": "recursion",
    "difficulty": "Medium",
    "points": 20,
    "description": "You have a list arr of all integers from 1 to n. Starting from left to right, remove first number and every other number until the end. Repeat alternating directions. Return last remaining number.",
    "constraints": [
      "1 <= n <= 10^9"
    ],
    "examples": [
      {
        "input": "n = 9",
        "output": "6",
        "explanation": "Last remaining is 6."
      }
    ],
    "starterCode": "function solve(n) {\n  let left = true;\n  let remaining = n;\n  let step = 1;\n  let head = 1;\n  while (remaining > 1) {\n    if (left || remaining % 2 === 1) {\n      head += step;\n    }\n    remaining = Math.floor(remaining / 2);\n    step *= 2;\n    left = !left;\n  }\n  return head;\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[9]",
        "expectedOutput": "6",
        "isHidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "isHidden": false
      }
    ],
    "order": 225
  },
  {
    "challengeId": "rec-11",
    "title": "Integer to English Words Recursive Translation",
    "slug": "rec-11-integer-to-english-words-recursive-translation",
    "category": "recursion",
    "difficulty": "Hard",
    "points": 30,
    "description": "Convert a non-negative integer num to its English words representation.",
    "constraints": [
      "0 <= num <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "num = 123",
        "output": "\"One Hundred Twenty Three\"",
        "explanation": "English translation."
      }
    ],
    "starterCode": "function solve(num) {\n  if (num === 0) return \"Zero\";\n  const belowTwenty = [\"\", \"One\", \"Two\", \"Three\", \"Four\", \"Five\", \"Six\", \"Seven\", \"Eight\", \"Nine\", \"Ten\", \"Eleven\", \"Twelve\", \"Thirteen\", \"Fourteen\", \"Fifteen\", \"Sixteen\", \"Seventeen\", \"Eighteen\", \"Nineteen\"];\n  const tens = [\"\", \"\", \"Twenty\", \"Thirty\", \"Forty\", \"Fifty\", \"Sixty\", \"Seventy\", \"Eighty\", \"Ninety\"];\n  const thousands = [\"\", \"Thousand\", \"Million\", \"Billion\"];\n  function helper(n) {\n    if (n === 0) return \"\";\n    if (n < 20) return belowTwenty[n] + \" \";\n    if (n < 100) return tens[Math.floor(n / 10)] + \" \" + helper(n % 10);\n    return belowTwenty[Math.floor(n / 100)] + \" Hundred \" + helper(n % 100);\n  }\n  let res = \"\";\n  let i = 0;\n  while (num > 0) {\n    if (num % 1000 !== 0) {\n      res = helper(num % 1000) + thousands[i] + \" \" + res;\n    }\n    num = Math.floor(num / 1000);\n    i++;\n  }\n  return res.trim().replace(/\\s+/g, \" \");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[123]",
        "expectedOutput": "\"One Hundred Twenty Three\"",
        "isHidden": false
      },
      {
        "input": "[12345]",
        "expectedOutput": "\"Twelve Thousand Three Hundred Forty Five\"",
        "isHidden": false
      },
      {
        "input": "[0]",
        "expectedOutput": "\"Zero\"",
        "isHidden": true
      }
    ],
    "order": 226
  },
  {
    "challengeId": "rec-12",
    "title": "Special Binary String Largest Grammatical",
    "slug": "rec-12-special-binary-string-largest-grammatical",
    "category": "recursion",
    "difficulty": "Hard",
    "points": 30,
    "description": "Special binary strings are binary strings with equal 0s and 1s, and every prefix has at least as many 1s as 0s. Return lexicographically largest special binary string.",
    "constraints": [
      "1 <= s.length <= 50"
    ],
    "examples": [
      {
        "input": "s = \"11011000\"",
        "output": "\"11100100\"",
        "explanation": "Lexicographically largest."
      }
    ],
    "starterCode": "function solve(s) {\n  let count = 0, i = 0;\n  const res = [];\n  for (let j = 0; j < s.length; j++) {\n    if (s[j] === \"1\") count++;\n    else count--;\n    if (count === 0) {\n      res.push(\"1\" + solve(s.substring(i + 1, j)) + \"0\");\n      i = j + 1;\n    }\n  }\n  res.sort((a, b) => b.localeCompare(a));\n  return res.join(\"\");\n}",
    "functionName": "solve",
    "testCases": [
      {
        "input": "[\"11011000\"]",
        "expectedOutput": "\"11100100\"",
        "isHidden": false
      },
      {
        "input": "[\"10\"]",
        "expectedOutput": "\"10\"",
        "isHidden": false
      }
    ],
    "order": 227
  }
];

export function getChallengeById(id) {
  return COMPETITION_CHALLENGES.find(c => c.challengeId === id) || null;
}
