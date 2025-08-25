import '../src/index.css';
import { AuthProvider } from '../src/contexts/AuthContext';
import { DarkModeContext } from '../src/App';
import { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setIsDarkMode(JSON.parse(saved));
    }
  }, []);

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
        <Component {...pageProps} />
      </AuthProvider>
    </DarkModeContext.Provider>
  );
}
