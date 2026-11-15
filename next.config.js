/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support static export for GitHub Pages only when explicitly requested
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export', trailingSlash: true } : {}),
  images: {
    unoptimized: true
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;

      // Do NOT set sideEffects = false globally: it causes Webpack to tree-shake
      // CSS stylesheets and React context providers, resulting in a blank screen.

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
