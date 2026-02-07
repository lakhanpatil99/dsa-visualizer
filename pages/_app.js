import '../styles/globals.css';
import AuthContext from "../context/AuthContext.js";
import ThemeContext from "../context/ThemeContext.js";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthContext>
      <ThemeContext>
        <Component {...pageProps} />
      </ThemeContext>
    </AuthContext>
  );
}
