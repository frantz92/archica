import type { NextConfig } from 'next';

/**
 * The site is exported as plain static files (`out/`) and uploaded to SeoHost (Apache).
 * Next.js `headers()`/`redirects()` do not exist in a static export; the security headers,
 * the `/` -> `/pl/` redirect and the 404 page are written to `out/.htaccess` after the build
 * (scripts/build-htaccess.mjs) from the same definitions that the local server uses
 * (scripts/lib/site-config.mjs).
 */
const nextConfig: NextConfig = {
  output: 'export',
  // `/pl/` -> `pl/index.html`: works on any static host without rewrite rules.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // One 404.html for every unknown URL (the language is picked in the browser).
    globalNotFound: true,
  },
  images: {
    // No image server on static hosting: variants are generated before the build
    // (scripts/optimize-images.mjs) and addressed by this loader.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    // Quality values used by <Media> (the custom loader ignores them, Next.js still validates them).
    qualities: [75, 85],
  },
};

export default nextConfig;
