/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support static export only when explicitly requested
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export', trailingSlash: true } : {}),
  images: {
    unoptimized: true
  },
  reactStrictMode: true
};

module.exports = nextConfig;
