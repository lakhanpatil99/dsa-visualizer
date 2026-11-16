export function solveLCS(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const trace = [];
  let step = 1;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        trace.push({
          step: step++,
          i,
          j,
          char1: s1[i - 1],
          char2: s2[j - 1],
          match: true,
          val: dp[i][j],
          message: `Match '${s1[i - 1]}' at s1[${i - 1}], s2[${j - 1}]: dp[${i}][${j}] = ${dp[i][j]}`
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        trace.push({
          step: step++,
          i,
          j,
          char1: s1[i - 1],
          char2: s2[j - 1],
          match: false,
          val: dp[i][j],
          message: `Mismatch '${s1[i - 1]}' vs '${s2[j - 1]}': max(up, left) = ${dp[i][j]}`
        });
      }
    }
  }

  // Reconstruct subsequence
  let lcsStr = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcsStr = s1[i - 1] + lcsStr;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return {
    length: dp[m][n],
    sequence: lcsStr,
    dpTable: dp,
    trace
  };
}

export const lcsComplexity = {
  time: 'O(m · n)',
  space: 'O(m · n)',
  bestCase: 'O(m · n)',
  averageCase: 'O(m · n)',
  worstCase: 'O(m · n)'
};
