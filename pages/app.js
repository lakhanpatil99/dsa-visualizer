import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import SortingVisualizer from '../src/pages/SortingVisualizer';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function App() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Visualizer Workspace - AlgoMania</title>
        <meta name="description" content="AlgoMania interactive visualizer workspace" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <SortingVisualizer />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
