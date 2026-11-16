export const radixSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  if (n <= 1) return arr;

  let step = 0;
  const max = Math.max(...arr);

  const countSortForRadix = async (exp) => {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      step++;
      if (callback) {
        callback([...arr], i, -1, -1, step, false);
      }
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      step++;
      if (callback) {
        callback([...output], count[digit], i, -1, step, true);
      }
      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, 500 / speed));
      }
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countSortForRadix(exp);
  }

  if (callback) {
    callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const radixSortPseudocode = `function radixSort(arr):
  maxVal = max(arr)
  exp = 1
  while maxVal / exp > 0:
    countingSortByDigit(arr, exp)
    exp *= 10
  return arr`;

export const radixSortComplexity = {
  time: 'O(d · (n + b))',
  space: 'O(n + b)',
  bestCase: 'O(d · (n + b))',
  averageCase: 'O(d · (n + b))',
  worstCase: 'O(d · (n + b))'
};
