import React from 'react';
import dynamic from 'next/dynamic';

function VisualizerSkeleton({ title = 'Visualizer' }) {
  return (
    <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-8 text-[#69665F] dark:text-[#A09D95] font-mono">
      <div className="w-10 h-10 border-4 border-[#EF592A] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xs uppercase tracking-widest font-bold">Initializing {title}...</p>
    </div>
  );
}

const StackVisualizer = dynamic(() => import('../data-structures/visualizers/StackVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Stack (LIFO)" />
});

const QueueVisualizer = dynamic(() => import('../data-structures/visualizers/QueueVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Queue (FIFO)" />
});

const LinkedListVisualizer = dynamic(() => import('../data-structures/visualizers/LinkedListVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Linked List" />
});

const HeapVisualizer = dynamic(() => import('../data-structures/visualizers/HeapVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Binary Heap" />
});

const HashTableVisualizer = dynamic(() => import('../data-structures/visualizers/HashTableVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Hash Table" />
});

const SearchingVisualizer = dynamic(() => import('../data-structures/visualizers/SearchingVisualizer'), {
  ssr: false,
  loading: () => <VisualizerSkeleton title="Searching Algorithms" />
});

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
