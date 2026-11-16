import '../styles/globals.css';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../src/audio/AudioProvider';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AudioProvider>
          <Component {...pageProps} />
        </AudioProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}


