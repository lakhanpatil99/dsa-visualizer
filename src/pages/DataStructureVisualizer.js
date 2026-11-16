import React from 'react';
import StackVisualizer from '../data-structures/visualizers/StackVisualizer';
import QueueVisualizer from '../data-structures/visualizers/QueueVisualizer';
import LinkedListVisualizer from '../data-structures/visualizers/LinkedListVisualizer';
import HeapVisualizer from '../data-structures/visualizers/HeapVisualizer';
import HashTableVisualizer from '../data-structures/visualizers/HashTableVisualizer';
import SearchingVisualizer from '../data-structures/visualizers/SearchingVisualizer';

export default function DataStructureVisualizer({ initialStructure = 'stack' }) {
  const norm = String(initialStructure).toLowerCase();

  switch (norm) {
    case 'stack':
      return <StackVisualizer />;
    case 'queue':
      return <QueueVisualizer />;
    case 'linkedlist':
    case 'linked-list':
      return <LinkedListVisualizer />;
    case 'heap':
      return <HeapVisualizer />;
    case 'hashtable':
    case 'hash-table':
      return <HashTableVisualizer />;
    case 'searching':
      return <SearchingVisualizer />;
    default:
      return <StackVisualizer />;
  }
}
