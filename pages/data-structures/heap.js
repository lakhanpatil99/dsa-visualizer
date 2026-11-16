import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function HeapPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Binary Heap & Priority Queue - AlgoMania</title>
        <meta name="description" content="Interactive Max Heap and Min Heap visualizer: insertion, extraction, and heapify sift operations." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="heap" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
