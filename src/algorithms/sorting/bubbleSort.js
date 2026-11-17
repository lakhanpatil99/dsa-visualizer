export const bubbleSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  const n = arr.length;
  let step = 0;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      step++;
      
      // Call callback with current state (comparing arr[j] and arr[j+1])
      if (callback) {
        await callback([...arr], j, j + 1, -1, step, false);
      }
      
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        if (callback) {
          await callback([...arr], j, j + 1, -1, step + 1, true);
        }
      }
      
      // Delay for visualization if speed > 0
      if (speed > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      }
    }
    // Early termination if no two elements were swapped in this pass
    if (!swapped) {
      break;
    }
  }
  
  // Final callback to clear highlighting
  if (callback) {
    await callback([...arr], -1, -1, -1, step + 1);
  }
  return arr;
};

export const bubbleSortPseudocode = `function bubbleSort(arr):
  n = length(arr)
  for i from 0 to n-1:
    swapped = false
    for j from 0 to n-i-1:
      if arr[j] > arr[j+1]:
        swap(arr[j], arr[j+1])
        swapped = true
    if not swapped:
      break
  return arr`;

export const bubbleSortComplexity = {
  time: 'O(n²)',
  space: 'O(1)',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)'
};
