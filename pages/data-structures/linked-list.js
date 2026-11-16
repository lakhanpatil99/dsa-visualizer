import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function LinkedListPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Linked List Data Structure - AlgoMania</title>
        <meta name="description" content="Interactive Linked List visualizer: Singly, Doubly, and Circular linked lists with node insertion and deletion." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="linkedList" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
