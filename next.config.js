const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // 1. API calls - always network, no cache
    {
      urlPattern: /^\/api\/.*$/,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'api-cache',
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // 2. Images - CacheFirst, cache for 30 days
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico|bmp|tiff|jfif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // 3. Static assets like JS, CSS - StaleWhileRevalidate
    {
      urlPattern: /\.(?:js|css|woff2?|eot|ttf|otf)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // 4. Page navigations (HTML) - StaleWhileRevalidate
    {
      urlPattern: /^\/$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'html-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
        cacheableResponse: {
          statuses: [0, 200],
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

module.exports = withPWA(nextConfig);
