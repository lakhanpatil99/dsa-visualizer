/**
 * AlgoMania Stack Model
 * Mathematically rigorous, bounded/unbounded LIFO data structure
 * with immutable trace state snapshots and zero memory leaks.
 */

export class StackModel {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.items = [];
    this.pushCount = 0;
    this.popCount = 0;
    this.history = [];
  }

  isFull() {
    return this.capacity !== null && this.items.length >= this.capacity;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getCapacity() {
    return this.capacity;
  }

  setCapacity(newCapacity) {
    if (typeof newCapacity !== 'number' || newCapacity < 1) return false;
    this.capacity = newCapacity;
    return true;
  }

  peek() {
    if (this.isEmpty()) {
      return {
        success: false,
        value: null,
        message: 'Stack is empty; nothing to peek (Underflow condition).'
      };
    }
    const val = this.items[this.items.length - 1];
    return {
      success: true,
      value: val,
      index: this.items.length - 1,
      message: `Top element is ${val} at index [${this.items.length - 1}].`
    };
  }

  push(value) {
    const num = Number(value);
    if (isNaN(num)) {
      return {
        success: false,
        error: 'INVALID_INPUT',
        message: `Invalid element "${value}". Stack only accepts numeric values.`
      };
    }

    if (this.isFull()) {
      return {
        success: false,
        error: 'OVERFLOW',
        message: `Stack Overflow: maximum capacity of ${this.capacity} reached. Cannot push ${num}.`,
        currentSize: this.items.length,
        capacity: this.capacity
      };
    }

    const beforeState = [...this.items];
    this.items.push(num);
    this.pushCount++;
    const afterState = [...this.items];

    const opRecord = {
      type: 'PUSH',
      value: num,
      timestamp: Date.now(),
      targetIndex: this.items.length - 1,
      size: this.items.length,
      message: `Pushed ${num} onto the stack at TOP [${this.items.length - 1}].`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: num,
      action: 'push',
      targetIndex: this.items.length - 1,
      beforeState,
      afterState,
      message: opRecord.message
    };
  }

  pop() {
    if (this.isEmpty()) {
      return {
        success: false,
        error: 'UNDERFLOW',
        message: 'Stack Underflow: cannot pop from an empty stack.',
        currentSize: 0
      };
    }

    const beforeState = [...this.items];
    const removedValue = this.items.pop();
    this.popCount++;
    const afterState = [...this.items];

    const opRecord = {
      type: 'POP',
      value: removedValue,
      timestamp: Date.now(),
      targetIndex: beforeState.length - 1,
      size: this.items.length,
      message: `Popped ${removedValue} from the TOP of the stack.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: removedValue,
      action: 'pop',
      targetIndex: beforeState.length - 1,
      beforeState,
      afterState,
      message: opRecord.message
    };
  }

  clear() {
    this.items = [];
    this.history = [];
    return {
      success: true,
      message: 'Stack repository has been cleared.'
    };
  }

  toArray() {
    return [...this.items];
  }

  getMetrics() {
    return {
      size: this.items.length,
      capacity: this.capacity,
      pushCount: this.pushCount,
      popCount: this.popCount,
      topValue: this.isEmpty() ? null : this.items[this.items.length - 1],
      isFull: this.isFull(),
      isEmpty: this.isEmpty()
    };
  }

  getHistory() {
    return [...this.history];
  }
}

export default StackModel;
