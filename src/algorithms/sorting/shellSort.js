export const shellSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  let step = 0;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      step++;
      if (callback) {
        callback([...arr], i, j - gap, -1, step, false);
      }

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        step++;
        if (callback) {
          callback([...arr], j, j - gap, -1, step, true);
        }
        j -= gap;
        if (speed > 0) {
          await new Promise(resolve => setTimeout(resolve, 600 / speed));
        }
      }
      arr[j] = temp;
      step++;
      if (callback) {
        callback([...arr], j, -1, -1, step, false);
      }
    }
  }

  if (callback) {
    callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const shellSortPseudocode = `function shellSort(arr):
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
  return arr`;

export const shellSortComplexity = {
  time: 'O(n log n)',
  space: 'O(1)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n^(4/3))',
  worstCase: 'O(n²)'
};
