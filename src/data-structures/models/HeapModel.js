/**
 * AlgoMania Binary Heap & Priority Queue Model
 * Supports Max-Heap, Min-Heap, Sift-Up, Sift-Down, Floyd's Build-Heap,
 * and Invariant Verification with detailed step-by-step traces.
 */

export class HeapModel {
  constructor(type = 'max') {
    this.type = type; // 'max' | 'min'
    this.heap = [];
    this.comparisonCount = 0;
    this.swapCount = 0;
    this.history = [];
  }

  setType(type) {
    if (this.type === type) return;
    this.type = type;
    if (this.heap.length > 1) {
      this.buildHeap([...this.heap]);
    }
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    if (this.isEmpty()) {
      return { success: false, value: null, message: 'Heap is empty.' };
    }
    return {
      success: true,
      value: this.heap[0],
      message: `Root ${this.type === 'max' ? 'maximum' : 'minimum'} is ${this.heap[0]}.`
    };
  }

  // Compare according to heap type
  // For max-heap: returns true if a should be higher priority than b (a > b)
  // For min-heap: returns true if a should be higher priority than b (a < b)
  compare(a, b) {
    this.comparisonCount++;
    return this.type === 'max' ? a > b : a < b;
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  leftChild(i) {
    return 2 * i + 1;
  }

  rightChild(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    this.swapCount++;
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  insert(value) {
    const num = Number(value);
    if (isNaN(num)) return { success: false, error: 'INVALID_INPUT', message: 'Value must be numeric.' };

    const trace = [];
    this.heap.push(num);
    let currentIdx = this.heap.length - 1;

    trace.push({
      step: 1,
      type: 'INSERT',
      index: currentIdx,
      value: num,
      array: [...this.heap],
      desc: `Inserted ${num} at the next complete tree slot (index [${currentIdx}]).`
    });

    // Sift-up
    let stepNum = 2;
    while (currentIdx > 0) {
      const parentIdx = this.parent(currentIdx);
      const isParentViolated = this.compare(this.heap[currentIdx], this.heap[parentIdx]);

      trace.push({
        step: stepNum++,
        type: 'COMPARE',
        index: currentIdx,
        parentIndex: parentIdx,
        array: [...this.heap],
        desc: `Compared child ${this.heap[currentIdx]} at [${currentIdx}] with parent ${this.heap[parentIdx]} at [${parentIdx}].`
      });

      if (isParentViolated) {
        this.swap(currentIdx, parentIdx);
        trace.push({
          step: stepNum++,
          type: 'SWAP',
          index: parentIdx,
          swappedWith: currentIdx,
          array: [...this.heap],
          desc: `Swapped child ${this.heap[parentIdx]} up to parent position [${parentIdx}] to satisfy ${this.type}-heap invariant.`
        });
        currentIdx = parentIdx;
      } else {
        trace.push({
          step: stepNum++,
          type: 'SETTLED',
          index: currentIdx,
          array: [...this.heap],
          desc: `Heap invariant satisfied at slot [${currentIdx}].`
        });
        break;
      }
    }

    const opRecord = {
      type: 'INSERT',
      value: num,
      timestamp: Date.now(),
      size: this.heap.length,
      message: `Inserted ${num} and restored ${this.type}-heap property in O(log n) time.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: num,
      action: 'insert',
      trace,
      heap: [...this.heap],
      message: opRecord.message
    };
  }

  extractRoot() {
    if (this.isEmpty()) {
      return { success: false, error: 'UNDERFLOW', message: 'Cannot extract from an empty heap.' };
    }

    const rootValue = this.heap[0];
    const trace = [];

    if (this.heap.length === 1) {
      this.heap.pop();
      return {
        success: true,
        value: rootValue,
        action: 'extract',
        trace: [{ step: 1, type: 'EXTRACT_SINGLE', value: rootValue, array: [], desc: `Extracted only node ${rootValue}.` }],
        heap: [],
        message: `Extracted root value ${rootValue}. Heap is now empty.`
      };
    }

    const lastValue = this.heap.pop();
    this.heap[0] = lastValue;

    trace.push({
      step: 1,
      type: 'REPLACE_ROOT',
      value: lastValue,
      extracted: rootValue,
      array: [...this.heap],
      desc: `Extracted root ${rootValue}. Moved last element ${lastValue} to root position.`
    });

    // Sift-down
    let currentIdx = 0;
    let stepNum = 2;

    while (this.leftChild(currentIdx) < this.heap.length) {
      const left = this.leftChild(currentIdx);
      const right = this.rightChild(currentIdx);
      let targetIdx = left;

      if (right < this.heap.length && this.compare(this.heap[right], this.heap[left])) {
        targetIdx = right;
      }

      trace.push({
        step: stepNum++,
        type: 'COMPARE',
        index: currentIdx,
        childIndex: targetIdx,
        array: [...this.heap],
        desc: `Comparing parent ${this.heap[currentIdx]} at [${currentIdx}] with dominant child ${this.heap[targetIdx]} at [${targetIdx}].`
      });

      if (this.compare(this.heap[targetIdx], this.heap[currentIdx])) {
        this.swap(currentIdx, targetIdx);
        trace.push({
          step: stepNum++,
          type: 'SWAP',
          index: targetIdx,
          swappedWith: currentIdx,
          array: [...this.heap],
          desc: `Swapped parent down to index [${targetIdx}] to satisfy ${this.type}-heap invariant.`
        });
        currentIdx = targetIdx;
      } else {
        trace.push({
          step: stepNum++,
          type: 'SETTLED',
          index: currentIdx,
          array: [...this.heap],
          desc: `Node settled at [${currentIdx}]. Heap property fully restored.`
        });
        break;
      }
    }

    const opRecord = {
      type: 'EXTRACT',
      value: rootValue,
      timestamp: Date.now(),
      size: this.heap.length,
      message: `Extracted ${this.type === 'max' ? 'max' : 'min'} root ${rootValue} in O(log n) time.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: rootValue,
      action: 'extract',
      trace,
      heap: [...this.heap],
      message: opRecord.message
    };
  }

  // True Floyd's bottom-up linear time buildHeap O(n)
  buildHeap(array) {
    if (!Array.isArray(array)) return;
    this.heap = [...array.map(Number).filter(n => !isNaN(n))];

    const startIdx = Math.floor(this.heap.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      this.siftDown(i);
    }

    return {
      success: true,
      heap: [...this.heap],
      message: `Built ${this.type}-heap from array in O(n) bottom-up time.`
    };
  }

  siftDown(i) {
    let current = i;
    while (this.leftChild(current) < this.heap.length) {
      const left = this.leftChild(current);
      const right = this.rightChild(current);
      let target = left;

      if (right < this.heap.length && this.compare(this.heap[right], this.heap[left])) {
        target = right;
      }

      if (this.compare(this.heap[target], this.heap[current])) {
        this.swap(current, target);
        current = target;
      } else {
        break;
      }
    }
  }

  verifyInvariant() {
    for (let i = 0; i < this.heap.length; i++) {
      const left = this.leftChild(i);
      const right = this.rightChild(i);

      if (left < this.heap.length) {
        if (this.compare(this.heap[left], this.heap[i])) {
          return { valid: false, violatedAt: i, child: left };
        }
      }
      if (right < this.heap.length) {
        if (this.compare(this.heap[right], this.heap[i])) {
          return { valid: false, violatedAt: i, child: right };
        }
      }
    }
    return { valid: true };
  }

  clear() {
    this.heap = [];
    this.history = [];
    this.comparisonCount = 0;
    this.swapCount = 0;
    return { success: true, message: 'Heap has been cleared.' };
  }

  toArray() {
    return [...this.heap];
  }

  getMetrics() {
    return {
      size: this.heap.length,
      type: this.type,
      rootValue: this.isEmpty() ? null : this.heap[0],
      height: this.isEmpty() ? 0 : Math.floor(Math.log2(this.heap.length)) + 1,
      comparisons: this.comparisonCount,
      swaps: this.swapCount,
      isValid: this.verifyInvariant().valid
    };
  }

  getHistory() {
    return [...this.history];
  }
}

export default HeapModel;
