import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#080D1B] border-t border-white/[0.08] text-slate-400 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white text-base">
                A
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Algo<span className="text-cyan-400">Mania</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive Data Structures & Algorithms visual learning platform. Turn complex computer science concepts into intuitive step-by-step animations.
            </p>
            <div className="text-xs text-slate-500">
              Built for students, software engineers, and coding interview preparation.
            </div>
          </div>

          {/* Algorithms */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Algorithms
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/sorting" className="hover:text-cyan-400 transition-colors">
                  Sorting Visualizers
                </Link>
              </li>
              <li>
                <Link href="/graphs" className="hover:text-cyan-400 transition-colors">
                  Graph Traversal & BFS/DFS
                </Link>
              </li>
              <li>
                <Link href="/trees" className="hover:text-cyan-400 transition-colors">
                  Binary Search Trees & AVL
                </Link>
              </li>
              <li>
                <Link href="/data-structures/searching" className="hover:text-cyan-400 transition-colors">
                  Searching Algorithms
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Structures */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Data Structures
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/data-structures/linked-list" className="hover:text-cyan-400 transition-colors">
                  Linked Lists
                </Link>
              </li>
              <li>
                <Link href="/data-structures/stack" className="hover:text-cyan-400 transition-colors">
                  Stacks (LIFO)
                </Link>
              </li>
              <li>
                <Link href="/data-structures/queue" className="hover:text-cyan-400 transition-colors">
                  Queues (FIFO)
                </Link>
              </li>
              <li>
                <Link href="/data-structures/hash-table" className="hover:text-cyan-400 transition-colors">
                  Hash Tables
                </Link>
              </li>
              <li>
                <Link href="/data-structures/heap" className="hover:text-cyan-400 transition-colors">
                  Heaps & Priority Queues
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Learning Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-cyan-400 transition-colors">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} AlgoMania. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span>Interactive Learning Platform</span>
            <span>•</span>
            <span className="text-slate-400">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
