import test from 'node:test';
import assert from 'node:assert/strict';
import { bubbleSort } from '../src/algorithms/sorting/bubbleSort.js';
import { quickSort } from '../src/algorithms/sorting/quickSort.js';
import { mergeSort } from '../src/algorithms/sorting/mergeSort.js';
import { Graph } from '../src/algorithms/graphs/bfs.js';
import { BinarySearchTree } from '../src/algorithms/trees/bst.js';
import { Stack } from '../src/algorithms/dataStructures/stack.js';
import { Queue } from '../src/algorithms/dataStructures/queue.js';
import { LinkedList } from '../src/algorithms/dataStructures/linkedList.js';

test('Bubble Sort correctly sorts random array of numbers', async () => {
  const input = [64, 34, 25, 12, 22, 11, 90];
  const expected = [11, 12, 22, 25, 34, 64, 90];
  const noop = () => {};
  const sorted = await bubbleSort(input, noop, 100000);
  assert.deepEqual(sorted, expected);
});

test('Quick Sort correctly sorts array', async () => {
  const input = [10, 80, 30, 90, 40, 50, 70];
  const expected = [10, 30, 40, 50, 70, 80, 90];
  const noop = () => {};
  const sorted = await quickSort(input, noop, 100000);
  assert.deepEqual(sorted, expected);
});

test('Merge Sort correctly sorts array', async () => {
  const input = [12, 11, 13, 5, 6, 7];
  const expected = [5, 6, 7, 11, 12, 13];
  const noop = () => {};
  const sorted = await mergeSort(input, noop, 100000);
  assert.deepEqual(sorted, expected);
});

test('Graph BFS performs breadth-first traversal accurately', () => {
  const g = new Graph();
  g.addVertex('A');
  g.addVertex('B');
  g.addVertex('C');
  g.addVertex('D');
  g.addEdge('A', 'B');
  g.addEdge('A', 'C');
  g.addEdge('B', 'D');

  const bfsResult = g.breadthFirstSearch('A');
  assert.equal(bfsResult[0], 'A');
  assert.equal(bfsResult.includes('B'), true);
  assert.equal(bfsResult.includes('C'), true);
  assert.equal(bfsResult.includes('D'), true);

  const path = g.breadthFirstSearchWithPath('A', 'D');
  assert.deepEqual(path, ['A', 'B', 'D']);
});

test('BinarySearchTree inserts, searches, and traverses in order', () => {
  const bst = new BinarySearchTree();
  bst.insert(50);
  bst.insert(30);
  bst.insert(70);
  bst.insert(20);
  bst.insert(40);
  bst.insert(60);
  bst.insert(80);

  assert.equal(bst.search(50), true);
  assert.equal(bst.search(40), true);
  assert.equal(bst.search(999), false);

  const inorder = bst.inorder();
  assert.deepEqual(inorder, [20, 30, 40, 50, 60, 70, 80]);
});

test('Stack data structure LIFO operations function correctly', () => {
  const s = new Stack();
  assert.equal(s.isEmpty(), true);
  s.push(10);
  s.push(20);
  assert.equal(s.peek(), 20);
  assert.equal(s.size(), 2);
  const popped = s.pop();
  assert.equal(popped, 20);
  assert.equal(s.peek(), 10);
  assert.equal(s.pop(), 10);
  assert.equal(s.pop(), 'Underflow');
});

test('Queue data structure FIFO operations function correctly', () => {
  const q = new Queue();
  assert.equal(q.isEmpty(), true);
  q.enqueue('first');
  q.enqueue('second');
  assert.equal(q.front(), 'first');
  assert.equal(q.rear(), 'second');
  assert.equal(q.dequeue(), 'first');
  assert.equal(q.front(), 'second');
  assert.equal(q.dequeue(), 'second');
  assert.equal(q.dequeue(), 'Underflow');
});

test('LinkedList operations perform accurately', () => {
  const list = new LinkedList();
  list.insertAtBeginning(2);
  list.insertAtBeginning(1);
  list.insertAtEnd(3);
  assert.equal(list.size, 3);
  assert.equal(list.search(1), 0);
  assert.equal(list.search(2), 1);
  assert.equal(list.search(3), 2);
  list.deleteNode(2);
  assert.equal(list.size, 2);
  assert.equal(list.search(3), 1);
});
