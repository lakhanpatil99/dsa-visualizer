import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { DarkModeContext } from '../context/ThemeContext';

export default function DataStructuresPage() {
  const { isDarkMode } = useContext(DarkModeContext);

  const modules = [
    {
      id: 'stack',
      title: 'Stack (LIFO)',
      desc: 'Last-In First-Out sequential storage with top pointer animations.',
      route: '/data-structures/stack',
      complexity: 'O(1) Push/Pop',
      icon: '📚'
    },
    {
      id: 'queue',
      title: 'Queue (FIFO)',
      desc: 'First-In First-Out linear buffer with front/rear pointer navigation.',
      route: '/data-structures/queue',
      complexity: 'O(1) Enqueue/Dequeue',
      icon: '🚶'
    },
    {
      id: 'linked-list',
      title: 'Linked List',
      desc: 'Dynamically allocated nodes connected by pointers (Singly and Doubly).',
      route: '/data-structures/linked-list',
      complexity: 'O(1) Insert / O(n) Access',
      icon: '🔗'
    },
    {
      id: 'heap',
      title: 'Binary Heap & Priority Queue',
      desc: 'Complete binary tree maintaining min/max heap property with sift-up/down.',
      route: '/data-structures/heap',
      complexity: 'O(log n) Insert/Extract',
      icon: '🌳'
    },
    {
      id: 'hash-table',
      title: 'Hash Table',
      desc: 'Key-value mapping using hashing functions and collision resolution.',
      route: '/data-structures/hash-table',
      complexity: 'O(1) Average Lookup',
      icon: '🗄️'
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      desc: 'Compare Linear, Binary, Jump, and Interpolation searches on arbitrary arrays.',
      route: '/data-structures/searching',
      complexity: 'O(1) to O(log n)',
      icon: '🔍'
    }
  ];

  return (
    <ProtectedRoute>
      <Head>
        <title>Data Structures Suite - AlgoMania Visual Lab</title>
        <meta name="description" content="Explore foundational data structures with animated operations: Stacks, Queues, Linked Lists, Binary Heaps, Hash Tables, and Searching Algorithms." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
          <div className="space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-[#EF592A] uppercase font-bold">
              02 // CORE MEMORY STRUCTURES
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Data Structures Hub.
            </h1>
            <p className="text-sm sm:text-base text-[#69665F] dark:text-[#A09D95] max-w-2xl leading-relaxed">
              Step through node insertions, deletions, pointer updates, and memory allocations in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-2xs hover:border-[#EF592A] transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                      {m.complexity}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold tracking-tight group-hover:text-[#EF592A] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-[#69665F] dark:text-[#A09D95] leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#DED9CE]/60 dark:border-[#383630]/60">
                  <Link
                    href={m.route}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#24231F] dark:bg-[#FFFDF8] text-[#FFFDF8] dark:text-[#24231F] hover:bg-[#EF592A] dark:hover:bg-[#EF592A] dark:hover:text-[#FFFDF8] transition-all shadow-xs"
                  >
                    <span>Launch Visualizer</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
