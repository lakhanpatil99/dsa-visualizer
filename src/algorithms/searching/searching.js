export class SearchingAlgorithms {
  constructor() {
    this.array = [];
    this.searchHistory = [];
    this.currentStep = 0;
  }

  // Set array to search in - preserve raw unsorted order unless autoSort is true
  setArray(array, autoSort = false) {
    if (autoSort) {
      this.array = [...array].sort((a, b) => a - b);
    } else {
      this.array = [...array];
    }
    this.searchHistory = [];
    this.currentStep = 0;
  }

  // Linear Search (works on unsorted arrays)
  linearSearch(target) {
    this.searchHistory = [];
    this.currentStep = 0;
    
    for (let i = 0; i < this.array.length; i++) {
      const isMatch = this.array[i] === target;
      this.searchHistory.push({
        step: i + 1,
        type: 'linear',
        currentIndex: i,
        currentValue: this.array[i],
        found: isMatch,
        message: `Checking element at index ${i}: ${this.array[i]}${isMatch ? ' - Found!' : ''}`
      });
      
      if (isMatch) {
        break;
      }
    }
    
    return this.searchHistory;
  }

  // Binary Search (requires sorted array)
  binarySearch(target) {
    this.searchHistory = [];
    this.currentStep = 0;
    
    let left = 0;
    let right = this.array.length - 1;
    let step = 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midValue = this.array[mid];
      
      this.searchHistory.push({
        step: step,
        type: 'binary',
        left: left,
        right: right,
        mid: mid,
        midValue: midValue,
        found: midValue === target,
        message: `Step ${step}: Checking middle element at index ${mid} (${midValue})`
      });
      
      if (midValue === target) {
        this.searchHistory[this.searchHistory.length - 1].message += ' - Found!';
        break;
      } else if (midValue < target) {
        left = mid + 1;
        this.searchHistory[this.searchHistory.length - 1].message += ` - Target ${target} > ${midValue}, searching right half [${left}...${right}]`;
      } else {
        right = mid - 1;
        this.searchHistory[this.searchHistory.length - 1].message += ` - Target ${target} < ${midValue}, searching left half [${left}...${right}]`;
      }
      
      step++;
    }
    
    if (left > right) {
      this.searchHistory.push({
        step: step,
        type: 'binary',
        left: left,
        right: right,
        mid: -1,
        midValue: null,
        found: false,
        message: `Target ${target} not found in the array`
      });
    }
    
    return this.searchHistory;
  }

  // Jump Search (requires sorted array)
  jumpSearch(target) {
    this.searchHistory = [];
    this.currentStep = 0;
    const n = this.array.length;
    if (n === 0) return this.searchHistory;

    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let historyStep = 1;

    while (this.array[Math.min(step, n) - 1] < target) {
      this.searchHistory.push({
        step: historyStep++,
        type: 'jump',
        currentIndex: Math.min(step, n) - 1,
        currentValue: this.array[Math.min(step, n) - 1],
        blockStart: prev,
        blockEnd: Math.min(step, n) - 1,
        found: false,
        message: `Jumped to block [${prev}...${Math.min(step, n) - 1}]. Element ${this.array[Math.min(step, n) - 1]} < ${target}`
      });
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) {
        this.searchHistory.push({
          step: historyStep,
          type: 'jump',
          currentIndex: -1,
          found: false,
          message: `Target ${target} not found (exceeded array boundary)`
        });
        return this.searchHistory;
      }
    }

    // Linear scan within block
    while (this.array[prev] < target) {
      this.searchHistory.push({
        step: historyStep++,
        type: 'jump',
        currentIndex: prev,
        currentValue: this.array[prev],
        found: false,
        message: `Scanning inside block: index ${prev} (${this.array[prev]}) < ${target}`
      });
      prev++;
      if (prev === Math.min(step, n)) {
        this.searchHistory.push({
          step: historyStep,
          type: 'jump',
          currentIndex: -1,
          found: false,
          message: `Target ${target} not found in block`
        });
        return this.searchHistory;
      }
    }

    const isMatch = this.array[prev] === target;
    this.searchHistory.push({
      step: historyStep,
      type: 'jump',
      currentIndex: prev,
      currentValue: this.array[prev],
      found: isMatch,
      message: isMatch ? `Target ${target} found at index ${prev}!` : `Target ${target} not found`
    });

    return this.searchHistory;
  }

  // Interpolation Search (for sorted, uniformly distributed arrays)
  interpolationSearch(target) {
    this.searchHistory = [];
    this.currentStep = 0;
    let low = 0;
    let high = this.array.length - 1;
    let historyStep = 1;

    while (low <= high && target >= this.array[low] && target <= this.array[high]) {
      if (low === high) {
        const isMatch = this.array[low] === target;
        this.searchHistory.push({
          step: historyStep,
          type: 'interpolation',
          currentIndex: low,
          found: isMatch,
          message: isMatch ? `Found at index ${low}!` : `Target ${target} not found`
        });
        return this.searchHistory;
      }

      // Probe position formula
      const pos = low + Math.floor(((target - this.array[low]) * (high - low)) / (this.array[high] - this.array[low]));
      const val = this.array[pos];

      this.searchHistory.push({
        step: historyStep++,
        type: 'interpolation',
        low,
        high,
        currentIndex: pos,
        currentValue: val,
        found: val === target,
        message: `Interpolation probe at estimated index ${pos} (${val})`
      });

      if (val === target) {
        return this.searchHistory;
      }

      if (val < target) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }

    this.searchHistory.push({
      step: historyStep,
      type: 'interpolation',
      currentIndex: -1,
      found: false,
      message: `Target ${target} outside range or not found`
    });

    return this.searchHistory;
  }

  // Navigation methods
  getCurrentStep() {
    return this.searchHistory[this.currentStep] || null;
  }

  nextStep() {
    if (this.currentStep < this.searchHistory.length - 1) {
      this.currentStep++;
      return this.getCurrentStep();
    }
    return null;
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.getCurrentStep();
    }
    return null;
  }

  reset() {
    this.currentStep = 0;
    return this.getCurrentStep();
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.searchHistory.length) {
      this.currentStep = stepIndex;
      return this.getCurrentStep();
    }
    return null;
  }
}

export const searchingPseudocode = {
  linear: `function linearSearch(arr, target):
  for i from 0 to length(arr) - 1:
    if arr[i] == target:
      return i
  return -1`,
  binary: `function binarySearch(arr, target):
  low = 0, high = length(arr) - 1
  while low <= high:
    mid = low + (high - low) / 2
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1`,
  jump: `function jumpSearch(arr, target):
  n = length(arr)
  step = floor(sqrt(n))
  prev = 0
  while arr[min(step, n) - 1] < target:
    prev = step
    step += floor(sqrt(n))
    if prev >= n: return -1
  while arr[prev] < target:
    prev += 1
    if prev == min(step, n): return -1
  return arr[prev] == target ? prev : -1`,
  interpolation: `function interpolationSearch(arr, target):
  low = 0, high = length(arr) - 1
  while low <= high and target >= arr[low] and target <= arr[high]:
    pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))
    if arr[pos] == target: return pos
    if arr[pos] < target: low = pos + 1
    else: high = pos - 1
  return -1`
};

export const linearSearchPseudocode = searchingPseudocode.linear;
export const binarySearchPseudocode = searchingPseudocode.binary;

export const searchingComplexity = {
  linear: {
    time: 'O(n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)'
  },
  binary: {
    time: 'O(log n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)'
  },
  jump: {
    time: 'O(√n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(√n)',
    worstCase: 'O(√n)'
  },
  interpolation: {
    time: 'O(log log n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(log log n)',
    worstCase: 'O(n)'
  }
};
