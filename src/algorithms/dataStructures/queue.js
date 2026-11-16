/**
 * High-performance Queue with O(1) Enqueue and O(1) Dequeue.
 * Employs head-pointer indexing with compaction to eliminate O(n) Array.shift().
 */
export class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    const element = this.items[this.head];
    this.items[this.head] = null; // Prevent memory retention
    this.head++;

    // Periodic compaction when dead space exceeds threshold
    if (this.head > 64 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return element;
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[this.head];
  }

  rear() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.head >= this.items.length;
  }

  size() {
    return Math.max(0, this.items.length - this.head);
  }

  clear() {
    this.items = [];
    this.head = 0;
  }

  getItems() {
    return this.items.slice(this.head).filter(x => x !== null);
  }
}

export const queuePseudocode = `class Queue:
  def __init__(self):
    self.items = []
    self.head = 0

  def enqueue(self, item):
    self.items.append(item)

  def dequeue(self):
    if self.is_empty():
      return "Underflow"
    item = self.items[self.head]
    self.head += 1
    return item

  def front(self):
    if self.is_empty():
      return "Queue is empty"
    return self.items[self.head]

  def is_empty(self):
    return self.head >= len(self.items)

  def size(self):
    return len(self.items) - self.head`;

export const queueComplexity = {
  timeComplexity: {
    enqueue: "O(1)",
    dequeue: "O(1)",
    front: "O(1)",
    isEmpty: "O(1)",
    size: "O(1)"
  },
  spaceComplexity: "O(n)"
};
