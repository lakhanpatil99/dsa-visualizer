export const heapSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  let step = 0;

  const heapify = async (size, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    step++;
    if (callback) {
      callback([...arr], i, left < size ? left : -1, largest, step, false);
    }

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      step++;
      if (callback) {
        callback([...arr], i, largest, largest, step, true);
      }
      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      }
      await heapify(size, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extract elements one by one from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    step++;
    if (callback) {
      callback([...arr], 0, i, 0, step, true);
    }
    if (speed > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000 / speed));
    }
    await heapify(i, 0);
  }

  if (callback) {
    callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const heapSortPseudocode = `function heapSort(arr):
  buildMaxHeap(arr)
  for i from n - 1 down to 1:
    swap(arr[0], arr[i])
    maxHeapify(arr, 0, i)
  return arr`;

export const heapSortComplexity = {
  time: 'O(n log n)',
  space: 'O(1)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)'
};
