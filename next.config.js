/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support static export for GitHub Pages only when explicitly requested
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export', trailingSlash: true } : {}),
  images: {
    unoptimized: true
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production client-side optimizations only
    if (!dev && !isServer) {
      config.optimization.usedExports = true;

      // IMPORTANT: Do NOT set sideEffects to false globally.
      // Setting it to false causes webpack to tree-shake CSS imports,
      // React context providers, and other side-effectful modules,
      // resulting in a blank white screen in production.
      // Let webpack use each package's own sideEffects field from package.json.

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
