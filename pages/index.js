import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import HomeHeader from '../src/components/home/HomeHeader';
import HeroEditorialGraphic from '../src/components/home/HeroEditorialGraphic';
import FeaturedInteractivePreview from '../src/components/home/FeaturedInteractivePreview';
import HomeFooter from '../src/components/home/HomeFooter';
import styles from '../styles/home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const curriculumIndex = [
    {
      index: '01',
      category: 'Sorting',
      title: 'Sorting Algorithms',
      description: 'Observe Bubble Sort, Quick Sort, Merge Sort, and Insertion Sort with step-by-step element comparisons, pointer indexing, and in-place swaps.',
      primaryHref: '/sorting',
      tag: 'O(n log n)',
      items: [
        { label: 'Bubble Sort', href: '/sorting' },
        { label: 'Quick Sort', href: '/sorting' },
        { label: 'Merge Sort', href: '/sorting' }
      ]
    },
    {
      index: '02',
      category: 'Graphs & Trees',
      title: 'Graph Traversals & Hierarchical Trees',
      description: 'Explore Breadth-First Search (BFS), Depth-First Search (DFS), shortest path algorithms, and animated Binary Search Tree insertions.',
      primaryHref: '/graphs',
      tag: 'Hierarchical',
      items: [
        { label: 'BFS & DFS', href: '/graphs' },
        { label: 'Binary Search Trees', href: '/trees' },
        { label: 'Tree Traversals', href: '/trees' }
      ]
    },
    {
      index: '03',
      category: 'Data Structures',
      title: 'Core Memory & Structures Hub',
      description: 'Inspect pointer manipulation across dynamic Linked Lists, Stacks (LIFO), Queues (FIFO), Binary Heaps, and Hash Tables.',
      primaryHref: '/data-structures',
      tag: 'Pointers & Memory',
      items: [
        { label: 'Linked Lists', href: '/data-structures/linked-list' },
        { label: 'Stacks & Queues', href: '/data-structures' },
        { label: 'Binary Heaps', href: '/data-structures/heap' },
        { label: 'Hash Tables', href: '/data-structures/hash-table' }
      ]
    },
    {
      index: '04',
      category: 'Searching & Complexity',
      title: 'Searching Algorithms & Asymptotic Bounds',
      description: 'Understand Linear Search vs. Binary Search interval dividing, Big-O worst-case boundaries, and space-time trade-offs.',
      primaryHref: '/data-structures/searching',
      tag: 'O(log n) Divide',
      items: [
        { label: 'Binary Search', href: '/data-structures/searching' },
        { label: 'Linear Search', href: '/data-structures/searching' },
        { label: 'Complexity Dashboard', href: '/dashboard' }
      ]
    }
  ];

  const capabilities = [
    {
      num: '01',
      title: 'Granular Step-by-Step Execution',
      desc: 'Pause at critical swap points, step forward one operation at a time, or run at variable speeds to observe asymptotic behavior.'
    },
    {
      num: '02',
      title: 'Real-Time State & Pointer Highlighting',
      desc: 'Color-coded indicators isolate comparing pointers, swap targets, and sorted boundaries directly on the data structure.'
    },
    {
      num: '03',
      title: 'Synchronized Code Highlighting',
      desc: 'Follow clean algorithm logic line-by-line as the active instruction lights up in tandem with the visual canvas.'
    },
    {
      num: '04',
      title: 'Asymptotic Complexity Analysis',
      desc: 'Inspect best-case, average-case, and worst-case Big-O bounds alongside real-time comparison and memory usage counts.'
    },
    {
      num: '05',
      title: 'Persistent Cloud Learning Progress',
      desc: 'Sign in to record completed algorithms, track mastery stats across categories, and resume your learning from any browser.'
    }
  ];

  return (
    <div className={styles.homeRoot}>
      <Head>
        <title>AlgoMania — A Visual Lab for Computer Science</title>
        <meta
          name="description"
          content="Make complex logic visible. Understand algorithms by watching every comparison, traversal and state transition happen, one step at a time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Homepage-Specific Minimal Header */}
      <HomeHeader />

      <main className="w-full">
        {/* ====================================================================
            HERO SECTION: Asymmetric Two-Panel Editorial Hero
            Left: Burnt-orange editorial DSA artwork
            Right: Warm ivory editorial typography & actions
            ==================================================================== */}
        <section className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* LEFT PANEL: Dominant Burnt Orange Custom DSA Illustration */}
            <div className="lg:col-span-6 flex">
              <HeroEditorialGraphic />
            </div>

            {/* RIGHT PANEL: Warm Ivory Editorial Copy & Primary Entry */}
            <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-6 lg:pl-4">
              <div className="space-y-6">
                {/* Eyebrow Label */}
                <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-mono tracking-widest text-[#69665F] uppercase border-b border-[#DED9CE] pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#EF592A]"></span>
                  <span>A Visual Lab for Computer Science</span>
                </div>

                {/* Primary Editorial Headline */}
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#24231F] leading-[1.05]">
                  Make complex <br />
                  <span className="text-[#EF592A]">logic visible.</span>
                </h1>

                {/* Supporting Description */}
                <p className="text-base sm:text-lg text-[#69665F] leading-relaxed max-w-xl font-normal">
                  Understand algorithms by watching every comparison, traversal and state transition happen, one step at a time.
                </p>

                {/* Call to Action Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/app"
                        className="px-7 py-3.5 rounded-lg text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                      >
                        Continue Learning →
                      </Link>
                      <Link
                        href="/dashboard"
                        className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#FFFDF8] hover:bg-[#F8F5ED] text-[#24231F] border border-[#DED9CE] hover:border-[#24231F] transition-all text-center"
                      >
                        View Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <a
                        href="#algorithm-index"
                        className="px-7 py-3.5 rounded-lg text-sm font-semibold bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                      >
                        Explore the Visual Lab
                      </a>
                      <Link
                        href="/register"
                        className="px-6 py-3.5 rounded-lg text-sm font-semibold bg-[#FFFDF8] hover:bg-[#F8F5ED] text-[#24231F] border border-[#DED9CE] hover:border-[#24231F] transition-all text-center"
                      >
                        Create Your Account
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Technical Value Metadata Indicators */}
              <div className="pt-10 mt-8 border-t border-[#DED9CE] grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-[#24231F]">01 // STEP ENGINE</div>
                  <div className="text-[11px] text-[#69665F] mt-0.5">Pause & step through logic</div>
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#28533D]">02 // POINTER TRACE</div>
                  <div className="text-[11px] text-[#69665F] mt-0.5">In-memory variable state</div>
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#EF592A]">03 // ASYMPTOTICS</div>
                  <div className="text-[11px] text-[#69665F] mt-0.5">Big-O trade-off curves</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION A: The Algorithm Index
            Curriculum grouped into 4 editorial rows with clear destination routes
            ==================================================================== */}
        <section id="algorithm-index" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#DED9CE]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase block mb-2">
                Curriculum Structure
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#24231F]">
                Find your next concept.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#69665F] max-w-md">
              Organized into four distinct algorithmic domains with step-by-step interactive animations and code synchronization.
            </p>
          </div>

          {/* 4 Editorial Curriculum Rows */}
          <div className="space-y-4">
            {curriculumIndex.map((item) => (
              <div
                key={item.index}
                className="w-full bg-[#FFFDF8] border border-[#DED9CE] hover:border-[#24231F] rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all hover:shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Category Index & Identifier */}
                  <div className="md:col-span-3 flex items-baseline space-x-3">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-[#EF592A]">
                      {item.index}
                    </span>
                    <div>
                      <div className="text-xs font-mono tracking-wider uppercase text-[#69665F]">
                        {item.category}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4E9DD] text-[#28533D] font-bold">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="md:col-span-6 space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[#24231F]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#69665F] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="text-[11px] font-mono bg-[#F8F5ED] hover:bg-[#F6DDD0] text-[#24231F] px-2.5 py-1 rounded border border-[#DED9CE] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Primary Link Action */}
                  <div className="md:col-span-3 flex md:justify-end">
                    <Link
                      href={item.primaryHref}
                      className="inline-flex items-center text-xs sm:text-sm font-bold text-[#24231F] hover:text-[#EF592A] group"
                    >
                      <span>Open Visualizer</span>
                      <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================================
            SECTION B: Featured Interactive Demonstration
            Interactive Bubble Sort live demo with playback controls & telemetry
            ==================================================================== */}
        <section id="interactive-preview" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#DED9CE]">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#28533D] uppercase block">
              Live Product Demonstration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#24231F]">
              See the work between the lines of code.
            </h2>
            <p className="text-sm sm:text-base text-[#69665F]">
              Interact with live comparison pointers, step through memory swaps, and inspect asymptotic execution behavior.
            </p>
          </div>

          <FeaturedInteractivePreview />
        </section>

        {/* ====================================================================
            SECTION C: Product Capabilities
            Restrained editorial list detailing actual platform engineering strengths
            ==================================================================== */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#DED9CE]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase block mb-2">
                Educational Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#24231F]">
                Engineered for deep comprehension.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#69665F] max-w-md">
              Replacing static textbook drawings with live, controllable algorithmic simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div
                key={cap.num}
                className="bg-[#FFFDF8] border border-[#DED9CE] rounded-xl p-6 sm:p-7 space-y-3 shadow-none hover:border-[#24231F] transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#EF592A]">
                  {cap.num} // CAPABILITY
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#24231F]">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#69665F] leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================================
            PUBLIC CREDENTIAL VERIFICATION
            Recruiters and visitors can verify without creating an account.
            ==================================================================== */}
        <section className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14 sm:py-20 border-t border-[#DED9CE]">
          <div className="rounded-3xl border border-[#C9D8C9] bg-[#FFFDF8] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex rounded-full bg-[#E4E9DD] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#28533D]">
                  Public credential registry
                </span>
                <h2 className="mt-4 text-2xl sm:text-4xl font-serif font-bold text-[#24231F]">
                  Every achievement has a verifiable record.
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[#69665F]">
                  Confirm an AlgoMania internship or algorithmic achievement certificate using its unique credential reference. No account or sign-in is required.
                </p>
              </div>
              <div className="lg:col-span-5">
                <form action="/certificates/verify" method="GET" className="space-y-3">
                  <label htmlFor="home-certificate-id" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#69665F]">
                    Certificate ID
                  </label>
                  <input
                    id="home-certificate-id"
                    name="id"
                    type="text"
                    required
                    minLength={3}
                    maxLength={96}
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Enter credential reference"
                    className="w-full rounded-xl border border-[#CFC9BC] bg-white px-4 py-3 text-sm font-mono uppercase text-[#24231F] outline-none focus:border-[#28533D] focus:ring-2 focus:ring-[#28533D]/15"
                  />
                  <button type="submit" className="w-full rounded-xl bg-[#28533D] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F4230]">
                    Verify Credential →
                  </button>
                  <p className="text-[11px] leading-relaxed text-[#888276]">
                    Public verification is available to recruiters, colleges and certificate recipients. Personal and payment details remain private.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION D: Final Call to Action
            Confident, high-contrast editorial banner in Burnt Orange
            ==================================================================== */}
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <div className="w-full bg-[#EF592A] text-[#FFFDF8] rounded-2xl lg:rounded-3xl p-8 sm:p-14 lg:p-16 text-center space-y-6 shadow-md relative overflow-hidden">
            {/* Subtle background coordinate line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#FFFDF8]/20"></div>

            <span className="text-[11px] font-mono tracking-widest uppercase text-[#FFFDF8]/80 font-bold block">
              Start Visualizing Algorithms
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FFFDF8] max-w-2xl mx-auto">
              Understand it. Then master it.
            </h2>

            <p className="text-sm sm:text-base text-[#FFFDF8]/90 max-w-xl mx-auto leading-relaxed">
              Your next algorithm starts with one visual step. Run, inspect, and master fundamental computer science logic today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              {isAuthenticated ? (
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-[#FFFDF8] hover:bg-[#F8F5ED] text-[#24231F] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continue Learning →
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-[#FFFDF8] hover:bg-[#F8F5ED] text-[#24231F] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-transparent hover:bg-[#FFFDF8]/10 text-[#FFFDF8] border border-[#FFFDF8]/40 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Homepage-Specific Minimal Warm Footer */}
      <HomeFooter />
    </div>
  );
}
