import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Logo from '../src/components/Logo';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#24231F] flex flex-col justify-between selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
      <Head>
        <title>404 — Page Not Found | AlgoMania</title>
        <meta name="description" content="The requested page could not be found." />
      </Head>

      {/* Header Bar */}
      <header className="w-full bg-[#F8F5ED] border-b border-[#DED9CE] px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        <Logo variant="auth" href="/" />
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#69665F] hover:text-[#24231F] px-3.5 py-1.5 rounded-lg border border-[#DED9CE] hover:border-[#24231F] bg-[#FFFDF8] transition-all"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </header>

      {/* 404 Body */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg bg-[#FFFDF8] p-8 sm:p-12 rounded-2xl border border-[#DED9CE] shadow-sm">
          <span className="inline-block text-xs font-mono font-bold tracking-widest text-[#EF592A] uppercase mb-2">
            ERROR // 404
          </span>
          <div className="text-6xl sm:text-7xl font-black text-[#24231F] mb-4 tracking-tight">
            404
          </div>
          <h1 className="text-2xl font-bold text-[#24231F] mb-3">
            Laboratory Resource Not Found
          </h1>
          <p className="text-[#69665F] text-sm mb-8 leading-relaxed max-w-md mx-auto">
            The algorithm laboratory, visualization page, or resource you are looking for does not exist or may have been relocated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-[#EF592A] text-[#FFFDF8] hover:bg-[#d64b20] shadow-sm transition-all hover:scale-[1.02]"
            >
              Return to AlgoMania Home
            </Link>
            <Link
              href="/algorithms"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold border border-[#DED9CE] hover:border-[#24231F] text-[#24231F] bg-white transition-all"
            >
              Browse Curriculum
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs font-mono text-[#69665F] border-t border-[#DED9CE]">
        AlgoMania • A Visual Lab for Computer Science
      </footer>
    </div>
  );
}
