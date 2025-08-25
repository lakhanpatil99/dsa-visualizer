export class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
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

export const stackPseudocode = `class Stack:
  def __init__(self):
    self.items = []
  
  def push(self, element):
    self.items.append(element)
  
  def pop(self):
    if self.isEmpty():
      return "Underflow"
    return self.items.pop()
  
  def peek(self):
    if self.isEmpty():
      return "Stack is empty"
    return self.items[-1]
  
  def isEmpty(self):
    return len(self.items) == 0`;

export const stackComplexity = {
  push: 'O(1)',
  pop: 'O(1)',
  peek: 'O(1)',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(1)',
  worstCase: 'O(1)'
};
