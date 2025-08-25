export const mergeSort = async (array, callback, speed = 1) => {
  const arr = [...array];
  let step = 0;
  await mergeSortHelper(arr, 0, arr.length - 1, callback, speed, step);
  // Final callback to clear highlighting
  callback([...arr], -1, -1, -1, step + 1, false);
  return arr;
};

const mergeSortHelper = async (arr, left, right, callback, speed, step) => {
  if (left < right) {
    step++;
    const mid = Math.floor((left + right) / 2);
    
    await mergeSortHelper(arr, left, mid, callback, speed, step);
    await mergeSortHelper(arr, mid + 1, right, callback, speed, step);
    
    await merge(arr, left, mid, right, callback, speed, step);
  }
};

const merge = async (arr, left, mid, right, callback, speed, step) => {
  const leftArray = arr.slice(left, mid + 1);
  const rightArray = arr.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;
  
  while (i < leftArray.length && j < rightArray.length) {
    step++;
    callback([...arr], k, k, -1, step, false);
    
    if (leftArray[i] <= rightArray[j]) {
      arr[k] = leftArray[i];
      i++;
    } else {
      arr[k] = rightArray[j];
      j++;
    }
    
    callback([...arr], k, k, -1, step + 1, true);
    k++;
    
    await new Promise(resolve => setTimeout(resolve, 1000 / speed));
  }
  
  while (i < leftArray.length) {
    step++;
    arr[k] = leftArray[i];
    callback([...arr], k, k, -1, step, false);
    i++;
    k++;
    await new Promise(resolve => setTimeout(resolve, 1000 / speed));
  }
  
  while (j < rightArray.length) {
    step++;
    arr[k] = rightArray[j];
    callback([...arr], k, k, -1, step, false);
    j++;
    k++;
    await new Promise(resolve => setTimeout(resolve, 1000 / speed));
  }
};

export const mergeSortPseudocode = `function mergeSort(arr, left, right):
  if left < right:
    mid = (left + right) / 2
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)
    merge(arr, left, mid, right)

function merge(arr, left, mid, right):
  leftArray = arr[left:mid+1]
  rightArray = arr[mid+1:right+1]
  i = j = 0, k = left
  while i < leftArray.length and j < rightArray.length:
    if leftArray[i] <= rightArray[j]:
      arr[k] = leftArray[i]
      i++
    else:
      arr[k] = rightArray[j]
      j++
    k++
  // Copy remaining elements`;

export const mergeSortComplexity = {
  time: 'O(n log n)',
  space: 'O(n)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)'
};
