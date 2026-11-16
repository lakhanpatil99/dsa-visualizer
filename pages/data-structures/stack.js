import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function StackPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Stack Data Structure (LIFO) - AlgoMania</title>
        <meta name="description" content="Interactive stack visualization: push, pop, peek, and pointer inspection." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="stack" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
