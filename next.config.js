/** @type {import('next').NextConfig} */

// Public URL used for canonical links, the sitemap and share images.
// Order: explicit NEXT_PUBLIC_SITE_URL, then the production domain Vercel provides automatically (it switches to your
// custom domain as soon as you add one), then localhost for local work. Never a domain we do not own.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const nextConfig = {
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  poweredByHeader: false,
  // Short address people may type: send it to the tool page
  async redirects() {
    return [
      { source: "/resize-image-under-100kb", destination: "/tools/resize-image-under-100kb", permanent: true },
      { source: "/passport-size-photo-maker", destination: "/tools/passport-size-photo-maker", permanent: true },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
