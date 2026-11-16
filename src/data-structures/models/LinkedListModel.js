/**
 * AlgoMania Linked List Model
 * Rigorous pointer-based node architecture supporting Singly, Doubly,
 * and Circular linked lists with immutable traversal and mutation traces.
 */

export class LinkedListNode {
  constructor(data, id = null) {
    this.id = id || `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export class LinkedListModel {
  constructor(type = 'singly') {
    this.type = type; // 'singly' | 'doubly' | 'circular'
    this.head = null;
    this.tail = null;
    this.count = 0;
    this.history = [];
  }

  setType(type) {
    if (this.type === type) return;
    const currentValues = this.toArray().map(n => n.data);
    this.type = type;
    this.clear();
    currentValues.forEach(val => this.insertAtTail(val));
  }

  isEmpty() {
    return this.head === null;
  }

  size() {
    return this.count;
  }

  // --- Insertions ---

  insertAtHead(value) {
    const num = Number(value);
    if (isNaN(num)) return { success: false, error: 'INVALID_INPUT', message: 'Value must be numeric.' };

    const newNode = new LinkedListNode(num);
    const trace = [];

    trace.push({
      step: 1,
      desc: `Allocated new node with value ${num}.`,
      action: 'ALLOCATE',
      nodeId: newNode.id
    });

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      if (this.type === 'circular') {
        newNode.next = newNode;
        if (this.type === 'doubly') newNode.prev = newNode;
      }
      this.count = 1;
      trace.push({
        step: 2,
        desc: `List was empty. Set HEAD and TAIL to node [${num}].`,
        action: 'SET_HEAD_TAIL'
      });
    } else {
      newNode.next = this.head;
      trace.push({
        step: 2,
        desc: `Set newNode.next = previous HEAD [${this.head.data}].`,
        action: 'LINK_NEXT'
      });

      if (this.type === 'doubly') {
        this.head.prev = newNode;
        trace.push({
          step: 3,
          desc: `Set previous HEAD.prev = newNode [${num}].`,
          action: 'LINK_PREV'
        });
      }

      if (this.type === 'circular') {
        this.tail.next = newNode;
        if (this.type === 'doubly') newNode.prev = this.tail;
        trace.push({
          step: 4,
          desc: `Maintained circular pointer: TAIL.next = newNode [${num}].`,
          action: 'LINK_CIRCULAR'
        });
      }

      this.head = newNode;
      this.count++;
      trace.push({
        step: 5,
        desc: `Assigned HEAD = newNode [${num}]. Insertion complete in O(1).`,
        action: 'UPDATE_HEAD'
      });
    }

    const opRecord = {
      type: 'INSERT_HEAD',
      value: num,
      timestamp: Date.now(),
      size: this.count,
      message: `Inserted ${num} at HEAD in O(1) time.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: num,
      action: 'insertHead',
      trace,
      nodes: this.toArray(),
      message: opRecord.message
    };
  }

  insertAtTail(value) {
    const num = Number(value);
    if (isNaN(num)) return { success: false, error: 'INVALID_INPUT', message: 'Value must be numeric.' };

    if (this.isEmpty()) {
      return this.insertAtHead(num);
    }

    const newNode = new LinkedListNode(num);
    const trace = [];

    trace.push({
      step: 1,
      desc: `Allocated new node with value ${num}.`,
      action: 'ALLOCATE',
      nodeId: newNode.id
    });

    this.tail.next = newNode;
    trace.push({
      step: 2,
      desc: `Linked current TAIL [${this.tail.data}].next to newNode [${num}].`,
      action: 'LINK_NEXT'
    });

    if (this.type === 'doubly') {
      newNode.prev = this.tail;
      trace.push({
        step: 3,
        desc: `Linked newNode.prev to current TAIL [${this.tail.data}].`,
        action: 'LINK_PREV'
      });
    }

    this.tail = newNode;

    if (this.type === 'circular') {
      this.tail.next = this.head;
      if (this.type === 'doubly') this.head.prev = this.tail;
      trace.push({
        step: 4,
        desc: `Maintained circular invariant: new TAIL.next = HEAD [${this.head.data}].`,
        action: 'LINK_CIRCULAR'
      });
    }

    this.count++;
    trace.push({
      step: 5,
      desc: `Assigned TAIL = newNode [${num}]. Insertion complete in O(1).`,
      action: 'UPDATE_TAIL'
    });

    const opRecord = {
      type: 'INSERT_TAIL',
      value: num,
      timestamp: Date.now(),
      size: this.count,
      message: `Inserted ${num} at TAIL in O(1) time.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: num,
      action: 'insertTail',
      trace,
      nodes: this.toArray(),
      message: opRecord.message
    };
  }

  insertAtIndex(index, value) {
    const idx = Number(index);
    const num = Number(value);
    if (isNaN(idx) || isNaN(num) || idx < 0 || idx > this.count) {
      return { success: false, error: 'OUT_OF_BOUNDS', message: `Invalid index ${index}. Must be between 0 and ${this.count}.` };
    }

    if (idx === 0) return this.insertAtHead(num);
    if (idx === this.count) return this.insertAtTail(num);

    let curr = this.head;
    for (let i = 0; i < idx - 1; i++) {
      curr = curr.next;
    }

    const newNode = new LinkedListNode(num);
    newNode.next = curr.next;
    if (this.type === 'doubly' && curr.next) {
      curr.next.prev = newNode;
      newNode.prev = curr;
    }
    curr.next = newNode;
    this.count++;

    return {
      success: true,
      value: num,
      index: idx,
      action: 'insertIndex',
      nodes: this.toArray(),
      message: `Inserted ${num} at index [${idx}] after node [${curr.data}].`
    };
  }

  // --- Deletions ---

  deleteAtHead() {
    if (this.isEmpty()) {
      return { success: false, error: 'UNDERFLOW', message: 'Cannot delete from an empty linked list.' };
    }

    const removedValue = this.head.data;

    if (this.count === 1) {
      this.head = null;
      this.tail = null;
      this.count = 0;
    } else {
      const nextHead = this.head.next;
      if (this.type === 'doubly') {
        nextHead.prev = this.type === 'circular' ? this.tail : null;
      }
      if (this.type === 'circular') {
        this.tail.next = nextHead;
      }
      this.head = nextHead;
      this.count--;
    }

    const opRecord = {
      type: 'DELETE_HEAD',
      value: removedValue,
      timestamp: Date.now(),
      size: this.count,
      message: `Deleted HEAD node containing value ${removedValue}.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: removedValue,
      action: 'deleteHead',
      nodes: this.toArray(),
      message: opRecord.message
    };
  }

  deleteAtTail() {
    if (this.isEmpty()) {
      return { success: false, error: 'UNDERFLOW', message: 'Cannot delete from an empty linked list.' };
    }

    if (this.count === 1) {
      return this.deleteAtHead();
    }

    const removedValue = this.tail.data;

    if (this.type === 'doubly') {
      const newTail = this.tail.prev;
      newTail.next = this.type === 'circular' ? this.head : null;
      if (this.type === 'circular') this.head.prev = newTail;
      this.tail = newTail;
    } else {
      let curr = this.head;
      while (curr.next !== this.tail) {
        curr = curr.next;
      }
      curr.next = this.type === 'circular' ? this.head : null;
      this.tail = curr;
    }

    this.count--;

    const opRecord = {
      type: 'DELETE_TAIL',
      value: removedValue,
      timestamp: Date.now(),
      size: this.count,
      message: `Deleted TAIL node containing value ${removedValue}.`
    };
    this.history.unshift(opRecord);
    if (this.history.length > 20) this.history.pop();

    return {
      success: true,
      value: removedValue,
      action: 'deleteTail',
      nodes: this.toArray(),
      message: opRecord.message
    };
  }

  deleteNode(value) {
    if (this.isEmpty()) {
      return { success: false, error: 'UNDERFLOW', message: 'List is empty.' };
    }

    const num = Number(value);
    if (this.head.data === num) {
      return this.deleteAtHead();
    }
    if (this.tail.data === num) {
      return this.deleteAtTail();
    }

    let curr = this.head;
    let prev = null;
    let found = false;

    for (let i = 0; i < this.count; i++) {
      if (curr.data === num) {
        found = true;
        break;
      }
      prev = curr;
      curr = curr.next;
    }

    if (!found) {
      return { success: false, error: 'NOT_FOUND', message: `Node with value ${num} not found.` };
    }

    prev.next = curr.next;
    if (this.type === 'doubly' && curr.next) {
      curr.next.prev = prev;
    }
    this.count--;

    return {
      success: true,
      value: num,
      action: 'deleteNode',
      nodes: this.toArray(),
      message: `Deleted interior node containing value ${num}.`
    };
  }

  search(value) {
    const num = Number(value);
    let curr = this.head;
    let index = 0;

    for (let i = 0; i < this.count; i++) {
      if (curr.data === num) {
        return {
          success: true,
          found: true,
          index,
          nodeId: curr.id,
          message: `Value ${num} found at index [${index}].`
        };
      }
      curr = curr.next;
      index++;
    }

    return {
      success: true,
      found: false,
      index: -1,
      message: `Value ${num} is not present in the linked list.`
    };
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.count = 0;
    this.history = [];
    return {
      success: true,
      message: 'Linked List has been reset.'
    };
  }

  // Returns safe array representation with link pointers for visualizer canvas
  toArray() {
    if (this.isEmpty()) return [];

    const nodes = [];
    let curr = this.head;
    let safetyCounter = 0;

    while (curr && safetyCounter < this.count) {
      nodes.push({
        id: curr.id,
        data: curr.data,
        isHead: curr === this.head,
        isTail: curr === this.tail,
        nextData: curr.next ? curr.next.data : null,
        prevData: curr.prev ? curr.prev.data : null
      });

      curr = curr.next;
      safetyCounter++;
      if (this.type !== 'circular' && !curr) break;
    }

    return nodes;
  }

  getMetrics() {
    return {
      size: this.count,
      type: this.type,
      headValue: this.head ? this.head.data : null,
      tailValue: this.tail ? this.tail.data : null,
      isEmpty: this.isEmpty()
    };
  }

  getHistory() {
    return [...this.history];
  }
}

export default LinkedListModel;
