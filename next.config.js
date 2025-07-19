const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      // ✅ Cloudinary images
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cloudinary-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // 🛡️ Do NOT cache API routes
      urlPattern: /^\/api\/.*$/,
      handler: 'NetworkOnly',
    },
    {
      // ✅ Cache other pages/static files
      urlPattern: /^\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

const shouldUsePWA =
  process.env.NODE_ENV === 'production' || !process.argv.includes('--turbo');

module.exports = shouldUsePWA ? withPWA(nextConfig) : nextConfig;
