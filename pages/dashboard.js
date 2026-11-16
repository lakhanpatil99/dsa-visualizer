import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ProgressDashboard from '../src/components/ProgressDashboard';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Learning Dashboard - AlgoMania</title>
        <meta name="description" content="Track your computer science algorithms learning progress, completed simulations, and mastery across sorting, graphs, and trees." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-[#EF592A] uppercase font-bold">
              STUDENT WORKSPACE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Learning Dashboard.
            </h1>
            <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95]">
              Real-time synchronization of your completed algorithmic walkthroughs and asymptotic trade-off studies.
            </p>
          </div>

          <ProgressDashboard />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
