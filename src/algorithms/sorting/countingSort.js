export const countingSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  if (n <= 1) return arr;

  let step = 0;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(n).fill(0);

  // Store count of each element
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    step++;
    if (callback) {
      await callback([...arr], i, -1, -1, step, false);
    }
    if (speed > 0) {
      await new Promise(resolve => setTimeout(resolve, 600 / speed));
    }
  }

  // Change count[i] so it contains actual position in output
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const outIdx = count[val - min] - 1;
    output[outIdx] = val;
    count[val - min]--;
    step++;
    if (callback) {
      await callback([...output], outIdx, i, -1, step, true);
    }
    if (speed > 0) {
      await new Promise(resolve => setTimeout(resolve, 600 / speed));
    }
  }

  // Copy output to arr
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }

  if (callback) {
    await callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const countingSortPseudocode = `function countingSort(arr, maxVal):
  count = array of zeros of size maxVal + 1
  for x in arr:
    count[x] += 1
  for i from 1 to maxVal:
    count[i] += count[i - 1]
  output = array of size length(arr)
  for i from length(arr) - 1 down to 0:
    output[count[arr[i]] - 1] = arr[i]
    count[arr[i]] -= 1
  return output`;

export const countingSortComplexity = {
  time: 'O(n + k)',
  space: 'O(k)',
  bestCase: 'O(n + k)',
  averageCase: 'O(n + k)',
  worstCase: 'O(n + k)'
};
