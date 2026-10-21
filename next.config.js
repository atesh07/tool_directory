/** @type {import('next').NextConfig} */

// Public URL used for canonical links, the sitemap and share images.
// Order: explicit NEXT_PUBLIC_SITE_URL, then the production URL Vercel provides automatically, then a placeholder.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://toolstree.com");

const nextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
