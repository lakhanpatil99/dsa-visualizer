export class MaxHeap {
  constructor() {
    this.heap = [];
    this.size = 0;
  }

  // Get parent index
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Get left child index
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Get right child index
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Check if node has parent
  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  // Check if node has left child
  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.size;
  }

  // Check if node has right child
  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.size;
  }

  // Get parent value
  getParent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  // Get left child value
  getLeftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  // Get right child value
  getRightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  // Swap two elements
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  // Insert element
  insert(value) {
    this.heap.push(value);
    this.size++;
    this.heapifyUp();
  }

  // Heapify up (bubble up)
  heapifyUp() {
    let currentIndex = this.size - 1;
    
    while (this.hasParent(currentIndex) && this.getParent(currentIndex) < this.heap[currentIndex]) {
      this.swap(this.getParentIndex(currentIndex), currentIndex);
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  // Extract max (remove root)
  extractMax() {
    if (this.size === 0) return null;
    
    const max = this.heap[0];
    this.heap[0] = this.heap[this.size - 1];
    this.heap.pop();
    this.size--;
    
    if (this.size > 0) {
      this.heapifyDown();
    }
    
    return max;
  }

  // Heapify down (bubble down)
  heapifyDown() {
    let currentIndex = 0;
    
    while (this.hasLeftChild(currentIndex)) {
      let largerChildIndex = this.getLeftChildIndex(currentIndex);
      
      if (this.hasRightChild(currentIndex) && this.getRightChild(currentIndex) > this.getLeftChild(currentIndex)) {
        largerChildIndex = this.getRightChildIndex(currentIndex);
      }
      
      if (this.heap[currentIndex] >= this.heap[largerChildIndex]) {
        break;
      }
      
      this.swap(currentIndex, largerChildIndex);
      currentIndex = largerChildIndex;
    }
  }

  // Build heap from array
  buildHeap(array) {
    this.heap = [...array];
    this.size = array.length;
    
    // Start from the last non-leaf node and heapify down
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
      this.heapifyDownFromIndex(i);
    }
  }

  // Heapify down from specific index
  heapifyDownFromIndex(index) {
    let currentIndex = index;
    
    while (this.hasLeftChild(currentIndex)) {
      let largerChildIndex = this.getLeftChildIndex(currentIndex);
      
      if (this.hasRightChild(currentIndex) && this.getRightChild(currentIndex) > this.getLeftChild(currentIndex)) {
        largerChildIndex = this.getRightChildIndex(currentIndex);
      }
      
      if (this.heap[currentIndex] >= this.heap[largerChildIndex]) {
        break;
      }
      
      this.swap(currentIndex, largerChildIndex);
      currentIndex = largerChildIndex;
    }
  }

  // Heap sort
  heapSort() {
    const sorted = [];
    const originalHeap = [...this.heap];
    const originalSize = this.size;
    
    while (this.size > 0) {
      sorted.unshift(this.extractMax());
    }
    
    // Restore original heap
    this.heap = originalHeap;
    this.size = originalSize;
    
    return sorted;
  }

  // Get heap as array
  toArray() {
    return [...this.heap];
  }

  // Get size
  getSize() {
    return this.size;
  }

  // Check if empty
  isEmpty() {
    return this.size === 0;
  }

  // Clear heap
  clear() {
    this.heap = [];
    this.size = 0;
  }

  // Get max value without removing
  peek() {
    return this.size > 0 ? this.heap[0] : null;
  }
}

export const heapPseudocode = `class MaxHeap:
  def __init__(self):
    self.heap = []
    self.size = 0
  
  def insert(self, value):
    self.heap.append(value)
    self.size += 1
    self.heapifyUp()
  
  def heapifyUp(self):
    current = self.size - 1
    while self.hasParent(current) and self.getParent(current) < self.heap[current]:
      self.swap(self.getParentIndex(current), current)
      current = self.getParentIndex(current)
  
  def extractMax(self):
    if self.size == 0:
      return None
    
    max_val = self.heap[0]
    self.heap[0] = self.heap[self.size - 1]
    self.heap.pop()
    self.size -= 1
    
    if self.size > 0:
      self.heapifyDown()
    
    return max_val
  
  def buildHeap(self, array):
    self.heap = array.copy()
    self.size = len(array)
    
    # Start from last non-leaf node
    for i in range(self.size // 2 - 1, -1, -1):
      self.heapifyDownFromIndex(i)`;

export const heapComplexity = {
  insert: 'O(log n)',
  extractMax: 'O(log n)',
  buildHeap: 'O(n)',
  heapSort: 'O(n log n)',
  space: 'O(1)',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)'
};
