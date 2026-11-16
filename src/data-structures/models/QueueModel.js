/**
 * AlgoMania Queue Model
 * High-performance circular-buffer FIFO implementation with strict O(1) enqueue and dequeue.
 * Solves the O(n) Array.prototype.shift() architectural flaw.
 */

export class QueueModel {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
    this.head = 0; // Index of the front element
    this.tail = 0; // Index where next incoming element will be stored
    this.count = 0;
    this.enqueueCount = 0;
    this.dequeueCount = 0;
    this.history = [];
  }

  isFull() {
    return this.count >= this.capacity;
  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }

  getCapacity() {
    return this.capacity;
  }

  peekFront() {
    if (this.isEmpty()) {
      return {
        success: false,
        value: null,
        message: 'Queue is empty; nothing to peek at FRONT (Underflow).'
      };
    }
    const val = this.buffer[this.head];
    return {
      success: true,
      value: val,
      index: this.head,
      message: `Front element is ${val} at circular slot [${this.head}].`
    };
  }

  peekRear() {
    if (this.isEmpty()) {
      return {
        success: false,
        value: null,
        message: 'Queue is empty; nothing to peek at REAR (Underflow).'
      };
    }
    const rearIdx = (this.tail - 1 + this.capacity) % this.capacity;
    const val = this.buffer[rearIdx];
    return {
      success: true,
      value: val,
      index: rearIdx,
      message: `Rear element is ${val} at circular slot [${rearIdx}].`
    };
  }

  enqueue(value) {
    const num = Number(value);
    if (isNaN(num)) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        message: `Invalid queue element "${value}". Only numeric inputs are supported.`
      };
    }

    if (this.isFull()) {
      return {
        success: false,
        error: 'OVERFLOW',
        message: `Queue Overflow: circular buffer reached maximum capacity (${this.capacity}). Dequeue elements first.`,
        currentSize: this.count,
        capacity: this.capacity
      };
    }

    const assignedIndex = this.tail;
    const wrapped = (this.tail + 1 >= this.capacity && this.count + 1 < this.capacity);
    const beforeOrdered = this.getOrderedItems();

    this.buffer[this.tail] = num;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
    this.enqueueCount++;

    const afterOrdered = this.getOrderedItems();

    const opRecord = {
      type: 'ENQUEUE',
      value: num,
      timestamp: Date.now(),
      slotIndex: assignedIndex,
      isWrapped: wrapped,
      size: this.count,
      message: `Enqueued ${num} into REAR slot [${assignedIndex}] in O(1) time.${wrapped ? ' (Circular wrap-around occurred).' : ''}`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: num,
      action: 'enqueue',
      slotIndex: assignedIndex,
      isWrapped: wrapped,
      beforeState: beforeOrdered,
      afterState: afterOrdered,
      message: opRecord.message
    };
  }

  dequeue() {
    if (this.isEmpty()) {
      return {
        success: false,
        error: 'UNDERFLOW',
        message: 'Queue Underflow: cannot dequeue from an empty queue.',
        currentSize: 0
      };
    }

    const removedIndex = this.head;
    const removedValue = this.buffer[this.head];
    const beforeOrdered = this.getOrderedItems();

    // Clear slot to prevent obsolete references / memory retention
    this.buffer[this.head] = null;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    this.dequeueCount++;

    const afterOrdered = this.getOrderedItems();

    const opRecord = {
      type: 'DEQUEUE',
      value: removedValue,
      timestamp: Date.now(),
      slotIndex: removedIndex,
      size: this.count,
      message: `Dequeued ${removedValue} from FRONT slot [${removedIndex}] in true O(1) time.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: removedValue,
      action: 'dequeue',
      slotIndex: removedIndex,
      beforeState: beforeOrdered,
      afterState: afterOrdered,
      message: opRecord.message
    };
  }

  clear() {
    this.buffer = new Array(this.capacity).fill(null);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
    this.history = [];
    return {
      success: true,
      message: 'Queue buffer has been reset to empty.'
    };
  }

  // Returns items in strict FIFO arrival order (from head to rear)
  getOrderedItems() {
    const items = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.head + i) % this.capacity;
      items.push(this.buffer[idx]);
    }
    return items;
  }

  // Returns all circular buffer slots with metadata for circular visualization
  getBufferSlots() {
    return this.buffer.map((val, idx) => {
      const isHead = this.count > 0 && idx === this.head;
      const isTail = idx === this.tail;
      const isOccupied = val !== null;
      return {
        index: idx,
        value: val,
        isHead,
        isTail,
        isOccupied
      };
    });
  }

  getMetrics() {
    return {
      size: this.count,
      capacity: this.capacity,
      headIndex: this.head,
      tailIndex: this.tail,
      enqueueCount: this.enqueueCount,
      dequeueCount: this.dequeueCount,
      frontValue: this.isEmpty() ? null : this.buffer[this.head],
      rearValue: this.isEmpty() ? null : this.buffer[(this.tail - 1 + this.capacity) % this.capacity],
      isFull: this.isFull(),
      isEmpty: this.isEmpty()
    };
  }

  getHistory() {
    return [...this.history];
  }
}

export default QueueModel;
