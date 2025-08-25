export class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class DoublyNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export class CircularNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insertAtBeginning(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  insertAtEnd(data) {
    const newNode = new Node(data);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  deleteNode(data) {
    if (!this.head) return;
    
    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    
    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      this.size--;
    }
  }

  search(data) {
    let current = this.head;
    let index = 0;
    
    while (current) {
      if (current.data === data) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  clear() {
    this.head = null;
    this.size = 0;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  insertAtHead(data) {
    const newNode = new DoublyNode(data);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  insertAtTail(data) {
    const newNode = new DoublyNode(data);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  deleteNode(data) {
    if (!this.head) return;
    
    let current = this.head;
    
    // Find the node to delete
    while (current && current.data !== data) {
      current = current.next;
    }
    
    if (!current) return; // Node not found
    
    // If deleting head
    if (current === this.head) {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null; // List is now empty
      }
    }
    // If deleting tail
    else if (current === this.tail) {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    // If deleting middle node
    else {
      current.prev.next = current.next;
      current.next.prev = current.prev;
    }
    
    this.size--;
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

export class CircularLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insertAtHead(data) {
    const newNode = new CircularNode(data);
    
    if (!this.head) {
      newNode.next = newNode; // Point to itself
      this.head = newNode;
    } else {
      // Find the last node
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      
      newNode.next = this.head;
      current.next = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  insertAtTail(data) {
    const newNode = new CircularNode(data);
    
    if (!this.head) {
      newNode.next = newNode; // Point to itself
      this.head = newNode;
    } else {
      // Find the last node
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      
      newNode.next = this.head;
      current.next = newNode;
    }
    this.size++;
  }

  deleteNode(data) {
    if (!this.head) return;
    
    let current = this.head;
    let prev = null;
    
    // Find the node to delete
    do {
      if (current.data === data) {
        break;
      }
      prev = current;
      current = current.next;
    } while (current !== this.head);
    
    if (!current || current.data !== data) return; // Node not found
    
    // If only one node
    if (current.next === this.head && current === this.head) {
      this.head = null;
    }
    // If deleting head
    else if (current === this.head) {
      // Find the last node to update its next pointer
      let last = this.head;
      while (last.next !== this.head) {
        last = last.next;
      }
      this.head = this.head.next;
      last.next = this.head;
    }
    // If deleting other node
    else {
      prev.next = current.next;
    }
    
    this.size--;
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0;
  }

  toArray() {
    const result = [];
    if (!this.head) return result;
    
    let current = this.head;
    do {
      result.push(current.data);
      current = current.next;
    } while (current !== this.head);
    
    return result;
  }

  clear() {
    this.head = null;
    this.size = 0;
  }
}

export const linkedListPseudocode = `class Node:
  def __init__(self, data):
    self.data = data
    self.next = None

class LinkedList:
  def __init__(self):
    self.head = None
    self.size = 0
  
  def insertAtBeginning(self, data):
    newNode = Node(data)
    newNode.next = self.head
    self.head = newNode
    self.size += 1
  
  def insertAtEnd(self, data):
    newNode = Node(data)
    if not self.head:
      self.head = newNode
    else:
      current = self.head
      while current.next:
        current = current.next
      current.next = newNode
    self.size += 1`;

export const doublyLinkedListPseudocode = `class DoublyNode:
  def __init__(self, data):
    self.data = data
    self.next = None
    self.prev = None

class DoublyLinkedList:
  def __init__(self):
    self.head = None
    self.tail = None
    self.size = 0
  
  def insertAtHead(self, data):
    newNode = DoublyNode(data)
    if not self.head:
      self.head = newNode
      self.tail = newNode
    else:
      newNode.next = self.head
      self.head.prev = newNode
      self.head = newNode
    self.size += 1
  
  def insertAtTail(self, data):
    newNode = DoublyNode(data)
    if not self.head:
      self.head = newNode
      self.tail = newNode
    else:
      newNode.prev = self.tail
      self.tail.next = newNode
      self.tail = newNode
    self.size += 1`;

export const circularLinkedListPseudocode = `class CircularNode:
  def __init__(self, data):
    self.data = data
    self.next = None

class CircularLinkedList:
  def __init__(self):
    self.head = None
    self.size = 0
  
  def insertAtHead(self, data):
    newNode = CircularNode(data)
    if not self.head:
      newNode.next = newNode
      self.head = newNode
    else:
      current = self.head
      while current.next != self.head:
        current = current.next
      newNode.next = self.head
      current.next = newNode
      self.head = newNode
    self.size += 1
  
  def insertAtTail(self, data):
    newNode = CircularNode(data)
    if not self.head:
      newNode.next = newNode
      self.head = newNode
    else:
      current = self.head
      while current.next != self.head:
        current = current.next
      newNode.next = self.head
      current.next = newNode
    self.size += 1`;

export const linkedListComplexity = {
  insertAtBeginning: 'O(1)',
  insertAtEnd: 'O(n)',
  delete: 'O(n)',
  search: 'O(n)',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)'
};

export const doublyLinkedListComplexity = {
  insertAtHead: 'O(1)',
  insertAtTail: 'O(1)',
  delete: 'O(n)',
  search: 'O(n)',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)'
};

export const circularLinkedListComplexity = {
  insertAtHead: 'O(n)',
  insertAtTail: 'O(n)',
  delete: 'O(n)',
  search: 'O(n)',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)'
};
