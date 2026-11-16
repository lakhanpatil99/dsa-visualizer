import React, { useState, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { DarkModeContext } from '../context/ThemeContext';
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../src/engine/AlgorithmRegistry';

export default function AlgorithmsCatalogPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Object.values(ALGORITHM_CATEGORIES)];

  const filteredAlgorithms = ALGORITHMS.filter(algo => {
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchesSearch =
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.timeComplexity.worst.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
      <Head>
        <title>Curriculum Catalog - AlgoMania</title>
        <meta name="description" content="Explore AlgoMania's complete curriculum of Data Structures & Algorithms with asymptotic Big-O breakdowns and interactive visualizers." />
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Editorial Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest uppercase text-[#EF592A] font-bold">
            <span>01 // COMPLETE REPERTOIRE</span>
            <span>·</span>
            <span>{ALGORITHMS.length} Interactive Algorithms</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#24231F] dark:text-[#FFFDF8]">
            Algorithm Catalog.
          </h1>
          <p className="text-sm sm:text-base text-[#69665F] dark:text-[#A09D95] max-w-2xl leading-relaxed">
            Search, filter, and launch interactive step-by-step visualizations across all core computer science domains.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-[#69665F] dark:text-[#A09D95] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by algorithm name, Big-O, or concept..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3] dark:bg-[#1D1C19] text-xs font-mono font-medium outline-none focus:border-[#EF592A] transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center overflow-x-auto space-x-1.5 pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#EF592A] text-[#FFFDF8] shadow-xs'
                    : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#69665F] dark:text-[#A09D95] hover:text-[#24231F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algo) => (
            <div
              key={algo.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] shadow-2xs hover:border-[#EF592A] transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-[#EF592A] font-bold uppercase">
                    {algo.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    algo.difficulty === 'Beginner'
                      ? 'bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]'
                      : algo.difficulty === 'Intermediate'
                      ? 'bg-[#FDEDEA] dark:bg-[#3D251D] text-[#EF592A]'
                      : 'bg-[#ECEAE4] dark:bg-[#2D2A24] text-[#24231F] dark:text-[#FFFDF8]'
                  }`}>
                    {algo.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold tracking-tight text-[#24231F] dark:text-[#FFFDF8] group-hover:text-[#EF592A] transition-colors">
                  {algo.name}
                </h3>

                <p className="text-xs text-[#69665F] dark:text-[#A09D95] leading-relaxed line-clamp-2">
                  {algo.description}
                </p>

                {/* Big-O Specs Card */}
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#69665F] dark:text-[#A09D95]">Worst Time:</span>
                    <strong className="text-[#EF592A]">{algo.timeComplexity.worst}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#69665F] dark:text-[#A09D95]">Best Time:</span>
                    <strong className="text-[#28533D] dark:text-[#E4E9DD]">{algo.timeComplexity.best}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#69665F] dark:text-[#A09D95]">Space:</span>
                    <strong>{algo.spaceComplexity}</strong>
                  </div>
                </div>
              </div>

              {/* Launch Visualizer Link */}
              <div className="pt-5 mt-5 border-t border-[#DED9CE]/60 dark:border-[#383630]/60">
                <Link
                  href={algo.route}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#24231F] dark:bg-[#FFFDF8] text-[#FFFDF8] dark:text-[#24231F] hover:bg-[#EF592A] dark:hover:bg-[#EF592A] dark:hover:text-[#FFFDF8] transition-all shadow-xs"
                >
                  <span>Launch Visualizer</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-16 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-8 space-y-2">
            <div className="text-3xl">🔍</div>
            <h3 className="text-lg font-bold">No matching algorithms found</h3>
            <p className="text-xs text-[#69665F] dark:text-[#A09D95]">
              Try searching with another query or reset your category filter.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
