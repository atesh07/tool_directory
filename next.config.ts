/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Redirects canvas lookups to a null module in Turbopack
        canvas: './empty.js',
      },
    },
  },
  webpack: (config) => {
    // Standard webpack alias for canvas
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;