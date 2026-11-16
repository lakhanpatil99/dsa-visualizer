import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function HashTablePage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Hash Table Data Structure - AlgoMania</title>
        <meta name="description" content="Interactive Hash Table visualizer: key-value storage, separate chaining, and linear probing collision resolution." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="hashTable" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
