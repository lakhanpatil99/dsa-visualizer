export class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  getItems() {
    return [...this.items];
  }
}

export const queuePseudocode = `class Queue:
  def __init__(self):
    self.items = []
  
  def enqueue(self, element):
    self.items.append(element)
  
  def dequeue(self):
    if self.isEmpty():
      return "Underflow"
    return self.items.pop(0)
  
  def front(self):
    if self.isEmpty():
      return "Queue is empty"
    return self.items[0]
  
  def rear(self):
    if self.isEmpty():
      return "Queue is empty"
    return self.items[-1]
  
  def isEmpty(self):
    return len(self.items) == 0`;

export const queueComplexity = {
  enqueue: 'O(1)',
  dequeue: 'O(1)',
  front: 'O(1)',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(1)',
  worstCase: 'O(1)'
};
