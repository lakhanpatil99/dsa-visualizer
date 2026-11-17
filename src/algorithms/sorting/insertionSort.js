export const insertionSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  let step = 0;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    step++;
    if (callback) {
      await callback([...arr], i, j, -1, step, false);
    }

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      step++;
      if (callback) {
        await callback([...arr], j, j + 1, -1, step, true);
      }
      j--;
      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      }
    }
    arr[j + 1] = key;
    step++;
    if (callback) {
      await callback([...arr], j + 1, -1, -1, step, false);
    }
  }

  if (callback) {
    await callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const insertionSortPseudocode = `function insertionSort(arr):
  for i from 1 to length(arr) - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j = j - 1
    arr[j + 1] = key
  return arr`;

export const insertionSortComplexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)'
};
