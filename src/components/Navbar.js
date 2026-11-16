import React, { useState, useContext, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const curriculumCategories = [
    { label: 'Sorting Algorithms', href: '/sorting', badge: 'O(n log n)' },
    { label: 'Graph Algorithms', href: '/graphs', badge: 'BFS / DFS / Dijkstra' },
    { label: 'Route Laboratory', href: '/graphs/route-lab', badge: 'Map Simulation' },
    { label: 'Tree Structures', href: '/trees', badge: 'BST & AVL' },
    { label: 'Data Structures Hub', href: '/data-structures', badge: 'Lists / Stacks / Heaps' },
    { label: 'Searching Algorithms', href: '/data-structures/searching', badge: 'Binary & Jump' },
    { label: 'Dynamic Programming', href: '/dynamic-programming', badge: '0/1 Knapsack / LCS' },
    { label: 'String Matching', href: '/strings', badge: 'KMP & Rabin-Karp' },
    { label: 'Backtracking Lab', href: '/backtracking', badge: 'N-Queens & Sudoku' },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F8F5ED] dark:bg-[#1C1B18] border-b border-[#DED9CE] dark:border-[#2E2C27] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EF592A] flex items-center justify-center text-[#FFFDF8] font-black text-lg tracking-tight shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#24231F] dark:text-[#FFFDF8]">
                Algo<span className="text-[#EF592A]">Mania</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase -mt-1 hidden sm:block">
                Visual Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 sm:space-x-2">
            {/* Curriculum Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                  dropdownOpen
                    ? 'bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]'
                    : 'text-[#24231F] dark:text-[#EAE7DF] hover:bg-[#EAE5D8] dark:hover:bg-[#272622]'
                }`}
              >
                <span>Curriculum</span>
                <span className={`text-[10px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-xl shadow-lg p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#69665F] dark:text-[#8E8B83] border-b border-[#DED9CE] dark:border-[#383630] mb-1">
                    Algorithm Domains
                  </div>
                  {curriculumCategories.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#F8F5ED] dark:hover:bg-[#2F2E29] transition-colors group"
                    >
                      <span className="font-semibold group-hover:text-[#EF592A] transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link
              href="/algorithms"
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                isActive('/algorithms')
                  ? 'bg-[#EF592A] text-[#FFFDF8]'
                  : 'text-[#24231F] dark:text-[#EAE7DF] hover:bg-[#EAE5D8] dark:hover:bg-[#272622]'
              }`}
            >
              Catalog
            </Link>

            <Link
              href="/compare"
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                isActive('/compare')
                  ? 'bg-[#EF592A] text-[#FFFDF8]'
                  : 'text-[#24231F] dark:text-[#EAE7DF] hover:bg-[#EAE5D8] dark:hover:bg-[#272622]'
              }`}
            >
              Compare
            </Link>

            <Link
              href="/graphs/route-lab"
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                isActive('/graphs/route-lab')
                  ? 'bg-[#EF592A] text-[#FFFDF8]'
                  : 'text-[#24231F] dark:text-[#EAE7DF] hover:bg-[#EAE5D8] dark:hover:bg-[#272622]'
              }`}
            >
              Route Lab
            </Link>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-[#69665F] dark:text-[#A09D95] hover:text-[#24231F] dark:hover:text-[#FFFDF8] hover:bg-[#EAE5D8] dark:hover:bg-[#272622] transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-[#24231F] text-[#FFFDF8]'
                      : 'text-[#69665F] dark:text-[#A09D95] hover:text-[#24231F] dark:hover:text-[#FFFDF8]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/app"
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Workspace
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#69665F] dark:text-[#A09D95] hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#24231F] dark:text-[#EAE7DF] hover:text-[#EF592A] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8] dark:hover:bg-[#272622]"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#DED9CE] dark:border-[#2E2C27] space-y-2 animate-fadeIn">
            <div className="px-3 py-1 text-[11px] font-mono font-bold uppercase text-[#69665F] dark:text-[#8E8B83]">
              Algorithm Laboratories
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-2">
              {curriculumCategories.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-xs font-semibold text-[#24231F] dark:text-[#FFFDF8] bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#DED9CE] dark:border-[#2E2C27] flex items-center justify-between px-3">
              <Link
                href="/algorithms"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#24231F] dark:text-[#FFFDF8]"
              >
                Full Catalog →
              </Link>
              <Link
                href="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-[#EF592A]"
              >
                Compare Mode →
              </Link>
            </div>

            <div className="pt-2 px-3">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-bold bg-[#24231F] text-[#FFFDF8] rounded-lg"
                  >
                    View Learning Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 font-mono py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-bold bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] text-[#24231F] dark:text-[#FFFDF8] rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-bold bg-[#EF592A] text-[#FFFDF8] rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
