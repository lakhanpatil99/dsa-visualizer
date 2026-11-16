export function solveCoinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  const coinUsed = new Array(amount + 1).fill(-1);
  const trace = [];

  dp[0] = 0;
  let step = 1;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0 && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        coinUsed[i] = coin;

        trace.push({
          step: step++,
          amount: i,
          coin,
          minCoins: dp[i],
          message: `Amount ${i}: Using coin ${coin} yields ${dp[i]} coins (via amount ${i - coin})`
        });
      }
    }
  }

  const combination = [];
  if (dp[amount] !== Infinity) {
    let curr = amount;
    while (curr > 0) {
      combination.push(coinUsed[curr]);
      curr -= coinUsed[curr];
    }
  }

  return {
    minCoins: dp[amount] === Infinity ? -1 : dp[amount],
    combination,
    dpArray: dp,
    trace
  };
}

export const coinChangeComplexity = {
  time: 'O(n · amount)',
  space: 'O(amount)',
  bestCase: 'O(1)',
  averageCase: 'O(n · amount)',
  worstCase: 'O(n · amount)'
};
