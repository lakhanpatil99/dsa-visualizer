import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../src/contexts/AuthContext';
import { DarkModeContext } from '../context/ThemeContext';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

// Dynamically load Three.js component on the client only to prevent SSR/hydration issues
const ThreeHeroUniverse = dynamic(
  () => import('../src/components/ThreeHeroUniverse'),
  { ssr: false }
);

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  const visualizerCards = [
    {
      title: 'Sorting Algorithms',
      description: 'Observe Bubble Sort, Quick Sort, Merge Sort, and more with step-by-step element comparisons and real-time color state transitions.',
      href: '/sorting',
      icon: '📊',
      badge: 'Interactive',
      tags: ['Bubble', 'Quick', 'Merge', 'O(n log n)']
    },
    {
      title: 'Graph Algorithms',
      description: 'Explore Breadth-First Search (BFS), Depth-First Search (DFS), and shortest path discovery across dynamic procedural graph networks.',
      href: '/graphs',
      icon: '🕸️',
      badge: 'Visual Traversal',
      tags: ['BFS', 'DFS', 'Dijkstra', 'Pathfinding']
    },
    {
      title: 'Tree Structures',
      description: 'Animate Binary Search Trees (BST), AVL self-balancing trees, and tree traversals (inorder, preorder, postorder) with animated node insertions.',
      href: '/trees',
      icon: '🌳',
      badge: 'Hierarchical',
      tags: ['BST', 'Inorder', 'Preorder', 'Balancing']
    },
    {
      title: 'Data Structures Hub',
      description: 'Explore fundamental building blocks: Stacks (LIFO), Queues (FIFO), Linked Lists, Hash Tables, and Heaps with memory pointer visualization.',
      href: '/data-structures',
      icon: '🧱',
      badge: 'Core CS',
      tags: ['Linked List', 'Stack', 'Queue', 'Heap']
    },
    {
      title: 'Searching Algorithms',
      description: 'Understand Linear Search vs. Binary Search divides with interactive interval highlighting and logarithmic search comparisons.',
      href: '/data-structures/searching',
      icon: '🔍',
      badge: 'Divide & Conquer',
      tags: ['Binary Search', 'Linear Search', 'O(log n)']
    },
    {
      title: 'Complexity Analysis',
      description: 'Analyze time and space complexity with Big-O notations, best-case, worst-case, and average-case performance comparisons.',
      href: '/dashboard',
      icon: '📈',
      badge: 'Interview Ready',
      tags: ['Time Complexity', 'Space Complexity', 'Big-O']
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Select an Algorithm or Data Structure',
      description: 'Choose from sorting, graph traversals, trees, linked lists, stacks, queues, and heaps organized by category and difficulty.'
    },
    {
      step: '02',
      title: 'Control Step-by-Step Execution',
      description: 'Use the interactive controls to play, pause, step forward, reverse, and adjust playback speed while inspecting variables and pointers in real time.'
    },
    {
      step: '03',
      title: 'Master Complexity and Intuition',
      description: 'Build mental models of algorithmic patterns and complexity trade-offs that prepare you for real-world software engineering and coding interviews.'
    }
  ];

  const benefits = [
    {
      title: 'Visual Memory Encoding',
      description: 'Visualizing algorithm pointer movements and state transitions transforms abstract code into persistent intuition.',
      icon: '💡'
    },
    {
      title: 'Zero Setup & In-Browser Execution',
      description: 'No environment configuration or compilation steps required. Run algorithms directly in your browser with zero latency.',
      icon: '⚡'
    },
    {
      title: 'Granular Execution Control',
      description: 'Pause at critical swap points, step forward one operation at a time, or run at high speed to observe asymptotic behavior.',
      icon: '⏱️'
    },
    {
      title: 'Personal Progress Tracking',
      description: 'Save your completed algorithms, track mastery stats across categories, and resume seamlessly from any device.',
      icon: '🎯'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080D1B] text-[#F8FAFC] selection:bg-blue-500/30 selection:text-cyan-300 font-sans antialiased overflow-x-hidden">
      <Head>
        <title>AlgoMania — Interactive Algorithm & Data Structure Visualizer</title>
        <meta
          name="description"
          content="Master Data Structures & Algorithms through interactive visual learning. Step-by-step animations for sorting, graphs, trees, and core data structures."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Three.js Interactive 3D Background */}
        <ThreeHeroUniverse />

        {/* Ambient Radial Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Release Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md shadow-inner text-xs sm:text-sm font-medium text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Next-Generation Visual Learning Platform</span>
            <span className="text-white/30">•</span>
            <span className="text-cyan-400 font-semibold">Interactive 3D Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Master Algorithms Through{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Interactive Visual Learning.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore algorithms, visualize every state transition, understand asymptotic complexity, and turn difficult data structure concepts into intuitive interactive experiences.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-blue-500/25 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Visualizer Workspace →
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/sorting"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Explore Visualizers
                </Link>
              </>
            )}
          </div>

          {/* Value Proof Indicator Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <div className="text-cyan-400 text-sm font-semibold mb-0.5">Interactive Engine</div>
              <div className="text-xs text-slate-400">Step-by-step playback & speed</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <div className="text-blue-400 text-sm font-semibold mb-0.5">Real-Time State</div>
              <div className="text-xs text-slate-400">Pointer & array highlighting</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <div className="text-indigo-400 text-sm font-semibold mb-0.5">Complexity Analysis</div>
              <div className="text-xs text-slate-400">Big-O time & space breakdown</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
              <div className="text-cyan-300 text-sm font-semibold mb-0.5">Cloud Progress</div>
              <div className="text-xs text-slate-400">Saved milestones across devices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0A1022] relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-cyan-400">
              Platform Modules
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Explore Our Visualizers
            </h3>
            <p className="text-base sm:text-lg text-slate-400">
              Comprehensive interactive suites covering the entire computer science algorithm curriculum.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visualizerCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-white/[0.08] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-300">
                      {card.badge}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                    <span>Open Visualizer</span>
                    <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#080D1B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-blue-400">
              Interactive Workflow
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How AlgoMania Works
            </h3>
            <p className="text-base sm:text-lg text-slate-400">
              Master complex algorithmic concepts in three intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md space-y-4"
              >
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AlgoMania Benefits Section */}
      <section id="why-algomania" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-[#0A1022]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-indigo-400">
              Why AlgoMania
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Designed for Intuitive Mastery
            </h3>
            <p className="text-base sm:text-lg text-slate-400">
              Engineered to replace dry textbook diagrams with live, controllable algorithmic simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3"
              >
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <h4 className="text-lg font-bold text-white">{benefit.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-gradient-to-b from-[#080D1B] to-[#0A1022] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-cyan-500/5 to-indigo-600/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Ready to Master Data Structures & Algorithms?
          </h3>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Join AlgoMania today. Experiment with live code animations, monitor algorithmic state, and level up your software engineering skills.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                Launch Visualizer
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Coherent Footer */}
      <Footer />
    </div>
  );
}
