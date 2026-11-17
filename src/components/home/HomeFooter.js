import React from 'react';
import Link from 'next/link';
import Logo from '../Logo';

export default function HomeFooter() {
  return (
    <footer className="w-full bg-[#F8F5ED] border-t border-[#DED9CE] py-14 sm:py-16 text-[#24231F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DED9CE]">
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="footer" href="/" />
            <p className="text-xs sm:text-sm text-[#69665F] max-w-sm leading-relaxed">
              An interactive visual laboratory for understanding computer science algorithms and data structures through step-by-step state simulation.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#69665F]">
              <span>Curated for students, engineers, and technical interviews.</span>
            </div>
          </div>

          {/* Column 1: Algorithms */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F]">
              Algorithms
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#69665F]">
              <li>
                <Link href="/sorting" className="hover:text-[#EF592A] transition-colors">
                  Sorting Algorithms
                </Link>
              </li>
              <li>
                <Link href="/graphs" className="hover:text-[#EF592A] transition-colors">
                  Graph Traversals (BFS/DFS)
                </Link>
              </li>
              <li>
                <Link href="/trees" className="hover:text-[#EF592A] transition-colors">
                  Binary Search Trees
                </Link>
              </li>
              <li>
                <Link href="/data-structures/searching" className="hover:text-[#EF592A] transition-colors">
                  Searching & Divide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Data Structures */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F]">
              Data Structures
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#69665F]">
              <li>
                <Link href="/data-structures/linked-list" className="hover:text-[#EF592A] transition-colors">
                  Linked Lists
                </Link>
              </li>
              <li>
                <Link href="/data-structures" className="hover:text-[#EF592A] transition-colors">
                  Stacks & Queues
                </Link>
              </li>
              <li>
                <Link href="/data-structures/heap" className="hover:text-[#EF592A] transition-colors">
                  Binary Heaps
                </Link>
              </li>
              <li>
                <Link href="/data-structures/hash-table" className="hover:text-[#EF592A] transition-colors">
                  Hash Tables
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F]">
              Platform & Access
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#69665F]">
              <li>
                <Link href="/certificates/verify" className="hover:text-[#EF592A] transition-colors">
                  Verify a Certificate
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-[#EF592A] transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#EF592A] transition-colors">
                  Progress Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#EF592A] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#EF592A] transition-colors">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#69665F] gap-4">
          <div className="font-mono">
            © 2026–2027 AlgoMania. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
