export const quickSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  let step = 0;
  await quickSortHelper(arr, 0, arr.length - 1, callback, speed, step);
  // Final callback to clear highlighting
  callback([...arr], -1, -1, -1, step + 1, false);
  return arr;
};

const quickSortHelper = async (arr, low, high, callback, speed, step) => {
  if (low < high) {
    step++;
    const pi = await partition(arr, low, high, callback, speed, step);
    await quickSortHelper(arr, low, pi - 1, callback, speed, step);
    await quickSortHelper(arr, pi + 1, high, callback, speed, step);
  }
};

const partition = async (arr, low, high, callback, speed, step) => {
  const pivot = arr[high];
  step++;
  callback([...arr], -1, -1, high, step, false);
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    step++;
    callback([...arr], j, -1, high, step, false);
    
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      callback([...arr], j, -1, high, step + 1, true);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000 / speed));
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  callback([...arr], -1, -1, high, step + 1, true);
  
  return i + 1;
};

export const quickSortPseudocode = `function quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high - 1:
    if arr[j] < pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[high])
  return i + 1`;

export const quickSortComplexity = {
  time: 'O(n log n)',
  space: 'O(log n)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n²)'
};
