export function computePiTable(pattern) {
  const m = pattern.length;
  const pi = new Array(m).fill(0);
  let j = 0;

  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    pi[i] = j;
  }
  return pi;
}

export function kmpSearch(text, pattern) {
  const pi = computePiTable(pattern);
  const matches = [];
  const trace = [];
  let j = 0;
  let step = 1;

  for (let i = 0; i < text.length; i++) {
    trace.push({
      step: step++,
      textIdx: i,
      patternIdx: j,
      textChar: text[i],
      patternChar: pattern[j],
      type: 'compare',
      message: `Comparing text[${i}] ('${text[i]}') with pattern[${j}] ('${pattern[j]}')`
    });

    while (j > 0 && text[i] !== pattern[j]) {
      trace.push({
        step: step++,
        textIdx: i,
        patternIdx: j,
        type: 'shift',
        fallback: pi[j - 1],
        message: `Mismatch: jumping pattern index from ${j} to pi[${j-1}] = ${pi[j-1]}`
      });
      j = pi[j - 1];
    }

    if (text[i] === pattern[j]) {
      j++;
    }

    if (j === pattern.length) {
      const matchStart = i - pattern.length + 1;
      matches.push(matchStart);
      trace.push({
        step: step++,
        matchStart,
        type: 'match_found',
        message: `Full match discovered starting at text index ${matchStart}!`
      });
      j = pi[j - 1];
    }
  }

  return { matches, piTable: pi, trace };
}

export const kmpComplexity = {
  time: 'O(n + m)',
  space: 'O(m)',
  bestCase: 'O(n)',
  averageCase: 'O(n + m)',
  worstCase: 'O(n + m)'
};
