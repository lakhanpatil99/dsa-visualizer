import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import SortingVisualizer from '../src/pages/SortingVisualizer';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function AppPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Sorting Laboratory - AlgoMania</title>
        <meta name="description" content="Interactive visual sorting algorithms laboratory. Observe Bubble, Quick, Merge, Heap, Counting, Radix, and Shell sort state transitions in real time." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors">
        <Navbar />
        <main className="flex-1">
          <SortingVisualizer />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
