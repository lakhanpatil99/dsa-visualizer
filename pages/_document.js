import { Html, Head, Main, NextScript } from "next/document";
import { ALGOMANIA_INTRO_SCRIPT } from "../src/components/intro/algoManiaIntroSource.js";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* AlgoMania Animated Intro Sequence (Synchronous head gatekeeper prevents flash of unstyled content / homepage) */}
        <script
          id="am-intro-gatekeeper"
          dangerouslySetInnerHTML={{
            __html: ALGOMANIA_INTRO_SCRIPT
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EF592A" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-860233070445192"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
