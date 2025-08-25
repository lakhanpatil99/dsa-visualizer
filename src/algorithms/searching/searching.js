export class SearchingAlgorithms {
  constructor() {
    this.array = [];
    this.searchHistory = [];
    this.currentStep = 0;
  }

  // Set array to search in
  setArray(array) {
    this.array = [...array].sort((a, b) => a - b); // Sort for binary search
    this.searchHistory = [];
    this.currentStep = 0;
  }

  // Linear Search
  linearSearch(target) {
    this.searchHistory = [];
    this.currentStep = 0;
    
    for (let i = 0; i < this.array.length; i++) {
      this.searchHistory.push({
        step: i + 1,
        type: 'linear',
        currentIndex: i,
        currentValue: this.array[i],
        found: this.array[i] === target,
        message: `Checking element at index ${i}: ${this.array[i]}`
      });
      
      if (this.array[i] === target) {
        this.searchHistory[this.searchHistory.length - 1].message += ' - Found!';
        break;
      }
    }
    
    return this.searchHistory;
  }

  // Binary Search
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
        message: `Step ${step}: Target ${target} not found in array`
      });
    }
    
    return this.searchHistory;
  }

  // Get current step
  getCurrentStep() {
    return this.currentStep;
  }

  // Get total steps
  getTotalSteps() {
    return this.searchHistory.length;
  }

  // Go to next step
  nextStep() {
    if (this.currentStep < this.searchHistory.length - 1) {
      this.currentStep++;
    }
    return this.getCurrentStepData();
  }

  // Go to previous step
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
    return this.getCurrentStepData();
  }

  // Go to specific step
  goToStep(step) {
    if (step >= 0 && step < this.searchHistory.length) {
      this.currentStep = step;
    }
    return this.getCurrentStepData();
  }

  // Get current step data
  getCurrentStepData() {
    return this.searchHistory[this.currentStep] || null;
  }

  // Get all steps
  getAllSteps() {
    return this.searchHistory;
  }

  // Reset to beginning
  reset() {
    this.currentStep = 0;
    return this.getCurrentStepData();
  }

  // Get array
  getArray() {
    return [...this.array];
  }

  // Get array size
  getArraySize() {
    return this.array.length;
  }

  // Check if array is sorted (required for binary search)
  isSorted() {
    for (let i = 1; i < this.array.length; i++) {
      if (this.array[i] < this.array[i - 1]) {
        return false;
      }
    }
    return true;
  }

  // Clear array and history
  clear() {
    this.array = [];
    this.searchHistory = [];
    this.currentStep = 0;
  }
}

export const linearSearchPseudocode = `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found at index i
    return -1  # Not found

# Time Complexity: O(n)
# Space Complexity: O(1)`;

export const binarySearchPseudocode = `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found at index mid
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Not found

# Time Complexity: O(log n)
# Space Complexity: O(1)
# Note: Array must be sorted`;

export const searchingComplexity = {
  linearSearch: {
    time: 'O(n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)'
  },
  binarySearch: {
    time: 'O(log n)',
    space: 'O(1)',
    bestCase: 'O(1)',
    averageCase: 'O(log n)',
    worstCase: 'O(log n)'
  }
};
