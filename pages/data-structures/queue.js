import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function QueuePage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Queue Data Structure (FIFO) - AlgoMania</title>
        <meta name="description" content="Interactive FIFO queue visualization: enqueue, dequeue, and front/rear pointers." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="queue" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
