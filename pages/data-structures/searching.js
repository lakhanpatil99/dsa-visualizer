import Head from 'next/head';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function SearchingPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Searching Algorithms - Data Structures | AlgoMania</title>
        <meta name="description" content="Interactive searching algorithms visualization: Linear Search, Binary Search, Jump Search, and Interpolation Search." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <DataStructureVisualizer initialStructure="searching" />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
