export const selectionSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  let step = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      step++;
      if (callback) {
        callback([...arr], minIdx, j, -1, step, false);
      }

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        if (callback) {
          callback([...arr], minIdx, j, -1, step, false);
        }
      }

      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      step++;
      if (callback) {
        callback([...arr], i, minIdx, -1, step, true);
      }
    }
  }

  if (callback) {
    callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const selectionSortPseudocode = `function selectionSort(arr):
  n = length(arr)
  for i from 0 to n - 2:
    minIdx = i
    for j from i + 1 to n - 1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    if minIdx != i:
      swap(arr[i], arr[minIdx])
  return arr`;

export const selectionSortComplexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)'
};
