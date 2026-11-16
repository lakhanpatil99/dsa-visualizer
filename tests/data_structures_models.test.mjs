import test from 'node:test';
import assert from 'node:assert/strict';

import { StackModel } from '../src/data-structures/models/StackModel.js';
import { QueueModel } from '../src/data-structures/models/QueueModel.js';
import { LinkedListModel } from '../src/data-structures/models/LinkedListModel.js';
import { HeapModel } from '../src/data-structures/models/HeapModel.js';
import { HashTableModel } from '../src/data-structures/models/HashTableModel.js';
import { SearchingModel } from '../src/data-structures/models/SearchingModel.js';
import { Queue as LegacyQueue } from '../src/algorithms/dataStructures/queue.js';

// --- STACK TESTS ---
test('StackModel - LIFO correctness, capacity boundary, and underflow', () => {
  const stack = new StackModel(4);
  assert.equal(stack.isEmpty(), true);
  assert.equal(stack.isFull(), false);

  // Underflow test
  const underflowRes = stack.pop();
  assert.equal(underflowRes.success, false);
  assert.equal(underflowRes.error, 'UNDERFLOW');

  // Push operations
  assert.equal(stack.push(10).success, true);
  assert.equal(stack.push(20).success, true);
  assert.equal(stack.push(30).success, true);
  assert.equal(stack.push(40).success, true);

  // Overflow test
  assert.equal(stack.isFull(), true);
  const overflowRes = stack.push(50);
  assert.equal(overflowRes.success, false);
  assert.equal(overflowRes.error, 'OVERFLOW');

  // Peek test
  const peekRes = stack.peek();
  assert.equal(peekRes.success, true);
  assert.equal(peekRes.value, 40);

  // Pop LIFO order
  assert.equal(stack.pop().value, 40);
  assert.equal(stack.pop().value, 30);
  assert.equal(stack.pop().value, 20);
  assert.equal(stack.pop().value, 10);
  assert.equal(stack.isEmpty(), true);
});

// --- QUEUE TESTS ---
test('QueueModel - True O(1) circular buffer, wrap-around, and slot reuse', () => {
  const queue = new QueueModel(4);
  assert.equal(queue.isEmpty(), true);
  assert.equal(queue.dequeue().error, 'UNDERFLOW');

  // Fill buffer to capacity (4 elements)
  queue.enqueue(100);
  queue.enqueue(200);
  queue.enqueue(300);
  queue.enqueue(400);
  assert.equal(queue.isFull(), true);
  assert.equal(queue.enqueue(500).error, 'OVERFLOW');

  // FIFO Dequeue 2 elements
  assert.equal(queue.dequeue().value, 100);
  assert.equal(queue.dequeue().value, 200);
  assert.equal(queue.size(), 2);

  // Circular Wrap-around test: Enqueue 2 new elements into freed slots [0] and [1]
  const wrap1 = queue.enqueue(500);
  const wrap2 = queue.enqueue(600);
  assert.equal(wrap1.success, true);
  assert.equal(wrap2.success, true);
  assert.equal(queue.isFull(), true);

  // Verify FIFO order across the circular boundary: [300, 400, 500, 600]
  assert.deepEqual(queue.getOrderedItems(), [300, 400, 500, 600]);
  assert.equal(queue.dequeue().value, 300);
  assert.equal(queue.dequeue().value, 400);
  assert.equal(queue.dequeue().value, 500);
  assert.equal(queue.dequeue().value, 600);
  assert.equal(queue.isEmpty(), true);
});

test('Legacy Queue - Head-pointer compaction eliminates O(n) shift', () => {
  const q = new LegacyQueue();
  for (let i = 0; i < 200; i++) q.enqueue(i);
  assert.equal(q.size(), 200);
  assert.equal(q.front(), 0);
  assert.equal(q.dequeue(), 0);
  assert.equal(q.front(), 1);
  assert.equal(q.size(), 199);
});

// --- LINKED LIST TESTS ---
test('LinkedListModel - Singly, Doubly, and Circular pointer invariants', () => {
  // Singly Linked List
  const singly = new LinkedListModel('singly');
  singly.insertAtHead(20);
  singly.insertAtHead(10);
  singly.insertAtTail(30);
  singly.insertAtIndex(1, 15);
  // Expected order: 10 -> 15 -> 20 -> 30
  assert.deepEqual(singly.toArray().map(n => n.data), [10, 15, 20, 30]);

  singly.deleteAtHead(); // removes 10
  singly.deleteAtTail(); // removes 30
  assert.deepEqual(singly.toArray().map(n => n.data), [15, 20]);

  // Doubly Linked List with prev pointers
  const doubly = new LinkedListModel('doubly');
  doubly.insertAtHead(50);
  doubly.insertAtTail(60);
  doubly.insertAtTail(70);
  assert.equal(doubly.head.data, 50);
  assert.equal(doubly.tail.data, 70);
  assert.equal(doubly.tail.prev.data, 60);
  assert.equal(doubly.head.next.prev.data, 50);

  // Circular Linked List
  const circular = new LinkedListModel('circular');
  circular.insertAtTail(1);
  circular.insertAtTail(2);
  circular.insertAtTail(3);
  assert.equal(circular.tail.next, circular.head, 'Circular tail must loop to head');
  assert.equal(circular.toArray().length, 3, 'Safe traversal terminates without infinite loop');
});

// --- HEAP TESTS ---
test('HeapModel - Max-Heap and Min-Heap invariant verification', () => {
  const maxHeap = new HeapModel('max');
  [50, 20, 80, 10, 90, 70, 30].forEach(v => maxHeap.insert(v));
  assert.equal(maxHeap.verifyInvariant().valid, true, 'Max heap invariant must hold');
  assert.equal(maxHeap.peek().value, 90, 'Root must be maximum value');

  // Sequential extraction in descending order
  const maxExtracted = [];
  while (!maxHeap.isEmpty()) {
    maxExtracted.push(maxHeap.extractRoot().value);
  }
  assert.deepEqual(maxExtracted, [90, 80, 70, 50, 30, 20, 10]);

  // Min-Heap verification
  const minHeap = new HeapModel('min');
  minHeap.buildHeap([50, 20, 80, 10, 90, 70, 30]);
  assert.equal(minHeap.verifyInvariant().valid, true, 'Min heap invariant must hold');
  assert.equal(minHeap.peek().value, 10, 'Root must be minimum value');

  const minExtracted = [];
  while (!minHeap.isEmpty()) {
    minExtracted.push(minHeap.extractRoot().value);
  }
  assert.deepEqual(minExtracted, [10, 20, 30, 50, 70, 80, 90]);
});

// --- HASH TABLE TESTS ---
test('HashTableModel - Separate Chaining and Linear Probing with Tombstones', () => {
  // Separate Chaining
  const htChaining = new HashTableModel(5, 'separateChaining');
  htChaining.set('apple', 100);
  htChaining.set('banana', 200);
  htChaining.set('cherry', 300);
  assert.equal(htChaining.get('banana').value, 200);
  assert.equal(htChaining.delete('banana').success, true);
  assert.equal(htChaining.get('banana').found, false);

  // Linear Probing with Tombstone support
  const htProbing = new HashTableModel(5, 'linearProbing');
  htProbing.set('k1', 11);
  htProbing.set('k2', 22);
  htProbing.set('k3', 33);
  assert.equal(htProbing.get('k2').value, 22);

  // Delete middle element (creates tombstone)
  assert.equal(htProbing.delete('k2').success, true);
  // Subsequent elements must still be found past tombstone
  assert.equal(htProbing.get('k3').found, true);
  assert.equal(htProbing.get('k3').value, 33);
});

// --- SEARCHING ALGORITHMS TESTS ---
test('SearchingModel - Linear, Binary, Jump, and Interpolation searches', () => {
  const model = new SearchingModel([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

  // Linear Search
  const linFound = model.linearSearch(40);
  assert.equal(linFound.found, true);
  assert.equal(linFound.index, 3);
  assert.equal(model.linearSearch(999).found, false);

  // Binary Search
  const binFound = model.binarySearch(70);
  assert.equal(binFound.found, true);
  assert.equal(binFound.index, 6);
  assert.equal(model.binarySearch(15).found, false);

  // Unsorted rejection for Binary Search
  const unsortedModel = new SearchingModel([50, 10, 80, 20]);
  const unsortedRes = unsortedModel.binarySearch(10);
  assert.equal(unsortedRes.success, false);
  assert.equal(unsortedRes.error, 'UNSORTED_ARRAY');

  // Jump Search
  const jumpFound = model.jumpSearch(30);
  assert.equal(jumpFound.found, true);
  assert.equal(jumpFound.index, 2);

  // Interpolation Search
  const interpFound = model.interpolationSearch(80);
  assert.equal(interpFound.found, true);
  assert.equal(interpFound.index, 7);
});
