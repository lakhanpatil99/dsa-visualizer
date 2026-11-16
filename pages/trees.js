import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import TreeVisualizer from '../src/pages/TreeVisualizer';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function TreesPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Tree Algorithms - AlgoMania Visual Lab</title>
        <meta name="description" content="Master Binary Search Trees, AVL balancing, and Inorder, Preorder, Postorder, and Level Order traversals interactively." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <TreeVisualizer />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
