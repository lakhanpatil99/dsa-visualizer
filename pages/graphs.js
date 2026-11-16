import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import GraphVisualizer from '../src/pages/GraphVisualizer';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function GraphsPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Graph Algorithms - AlgoMania Visual Lab</title>
        <meta name="description" content="Interactive graph algorithm laboratory. Build graphs, explore BFS, DFS, Dijkstra, A*, Kruskal's MST, and Topological Sort with live canvas animations." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <GraphVisualizer />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
