import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

export default function HomeHeader() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="w-full bg-[#F8F5ED] border-b border-[#DED9CE] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Mark & Identity */}
        <Logo variant="header" href="/" />

        {/* Minimal Actions Bar */}
        <nav className="flex items-center space-x-3 sm:space-x-6">
          <a
            href="#algorithm-index"
            className="text-xs sm:text-sm font-medium text-[#69665F] hover:text-[#24231F] transition-colors hidden md:inline-block"
          >
            Explore Curriculum
          </a>

          <a
            href="#interactive-preview"
            className="text-xs sm:text-sm font-medium text-[#69665F] hover:text-[#24231F] transition-colors hidden lg:inline-block"
          >
            Live Demo
          </a>

          <Link
            href="/certificates/verify"
            className="inline-flex items-center rounded-lg border border-[#28533D]/25 px-2.5 sm:px-3 py-2 text-[10px] sm:text-sm font-semibold text-[#28533D] hover:bg-[#E4E9DD] transition-colors"
          >
            Verify Certificate
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-medium text-[#69665F] hover:text-[#24231F] transition-colors hidden sm:inline-block"
              >
                Dashboard
              </Link>
              <Link
                href="/app"
                className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue Learning</span>
                <span className="ml-1.5 font-bold">→</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#24231F] hover:text-[#EF592A] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
