import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F8F5ED] dark:bg-[#1A1916] border-t border-[#DED9CE] dark:border-[#2E2C27] py-12 sm:py-16 text-[#24231F] dark:text-[#FFFDF8] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#DED9CE] dark:border-[#2E2C27]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="footer" href="/" />
            <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95] max-w-sm leading-relaxed">
              An interactive visual laboratory for exploring data structures and algorithms through step-by-step state simulation and execution modeling.
            </p>
            <div className="pt-1 text-[11px] font-mono text-[#69665F] dark:text-[#8E8B83]">
              Curated for software engineers, computer science students, and interview preparation.
            </div>
          </div>

          {/* Column 1: Algorithms */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
              Algorithms
            </h4>
            <ul className="space-y-2 text-xs text-[#69665F] dark:text-[#A09D95]">
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
                <Link href="/graphs/route-lab" className="hover:text-[#EF592A] transition-colors">
                  Route &amp; Pathfinding Lab
                </Link>
              </li>
              <li>
                <Link href="/trees" className="hover:text-[#EF592A] transition-colors">
                  Binary Search Trees
                </Link>
              </li>
              <li>
                <Link href="/data-structures/searching" className="hover:text-[#EF592A] transition-colors">
                  Searching Algorithms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Advanced Labs */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
              Advanced Labs
            </h4>
            <ul className="space-y-2 text-xs text-[#69665F] dark:text-[#A09D95]">
              <li>
                <Link href="/dynamic-programming" className="hover:text-[#EF592A] transition-colors">
                  Dynamic Programming
                </Link>
              </li>
              <li>
                <Link href="/strings" className="hover:text-[#EF592A] transition-colors">
                  String Pattern Matching
                </Link>
              </li>
              <li>
                <Link href="/backtracking" className="hover:text-[#EF592A] transition-colors">
                  Backtracking &amp; Recursion
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#EF592A] transition-colors">
                  Algorithm Compare Mode
                </Link>
              </li>
              <li>
                <Link href="/algorithms" className="hover:text-[#EF592A] transition-colors">
                  Curriculum Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
              Platform &amp; Account
            </h4>
            <ul className="space-y-2 text-xs text-[#69665F] dark:text-[#A09D95]">
              <li>
                <Link href="/app" className="hover:text-[#EF592A] transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#EF592A] transition-colors">
                  Learning Dashboard
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#69665F] dark:text-[#8E8B83] gap-4">
          <div className="font-mono">
            © {new Date().getFullYear()} AlgoMania. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span>Next.js 14 + React 18</span>
            <span>•</span>
            <span className="text-[#28533D] dark:text-[#76A889] font-bold">Deterministic Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
