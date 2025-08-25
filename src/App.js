import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SortingVisualizer from './pages/SortingVisualizer';
import DataStructureVisualizer from './pages/DataStructureVisualizer';
import TreeVisualizer from './pages/TreeVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import Login from './pages/Login';
import Register from './pages/Register';
import ProgressDashboard from './components/ProgressDashboard';
import { AuthProvider } from './contexts/AuthContext';

// Dark mode context
export const DarkModeContext = React.createContext();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <AuthProvider>
        <div className={`min-h-screen transition-all duration-300 ${
          isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
        }`}>
          <Router>
            <Navbar />
            <main className="pt-16 h-screen">
              <Routes>
                <Route path="/" element={<SortingVisualizer />} />
                <Route path="/data-structures" element={<DataStructureVisualizer />} />
                <Route path="/trees" element={<TreeVisualizer />} />
                <Route path="/graphs" element={<GraphVisualizer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/progress" element={<ProgressDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            {/* Footer with Copyright */}
            <footer className={`py-4 text-center text-sm transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className="container mx-auto">
                <p>© Lakhansing Reserved 2025 - AlgoMania</p>
                <p className="mt-1">Interactive Algorithm and Data Structure Visualizer</p>
              </div>
            </footer>
          </Router>
        </div>
      </AuthProvider>
    </DarkModeContext.Provider>
  );
};

export default App;
