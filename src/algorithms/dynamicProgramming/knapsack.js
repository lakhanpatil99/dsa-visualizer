export function solve01Knapsack(items, capacity) {
  // items: [{ name: 'A', weight: 2, value: 3 }, ...]
  const n = items.length;
  const W = capacity;
  // (n+1) x (W+1) dp table
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const trace = [];
  let step = 1;

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= W; w++) {
      if (item.weight <= w) {
        const includeVal = item.value + dp[i - 1][w - item.weight];
        const excludeVal = dp[i - 1][w];
        dp[i][w] = Math.max(includeVal, excludeVal);

        trace.push({
          step: step++,
          i,
          w,
          item,
          includeVal,
          excludeVal,
          chosen: dp[i][w] === includeVal ? 'included' : 'excluded',
          val: dp[i][w],
          message: `Item ${item.name} (w=${item.weight}, v=${item.value}) at cap ${w}: max(${item.value} + ${dp[i-1][w-item.weight]}, ${excludeVal}) = ${dp[i][w]}`
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        trace.push({
          step: step++,
          i,
          w,
          item,
          chosen: 'too_heavy',
          val: dp[i][w],
          message: `Item ${item.name} (w=${item.weight}) exceeds cap ${w}; carry over ${dp[i-1][w]}`
        });
      }
    }
  }

  // Backtrack to find chosen items
  const selectedItems = [];
  let currW = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][currW] !== dp[i - 1][currW]) {
      selectedItems.push(items[i - 1]);
      currW -= items[i - 1].weight;
    }
  }

  return {
    maxValue: dp[n][W],
    selectedItems: selectedItems.reverse(),
    dpTable: dp,
    trace
  };
}

export const knapsackComplexity = {
  time: 'O(N · W)',
  space: 'O(N · W)',
  bestCase: 'O(N · W)',
  averageCase: 'O(N · W)',
  worstCase: 'O(N · W)'
};
