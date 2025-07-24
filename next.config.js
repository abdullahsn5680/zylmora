const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  // Add fallback for offline pages
  fallbacks: {
    document: '/offline', // fallback for HTML pages
    // image: '/static/images/fallback.png', // Optional: fallback for images
    // audio: '/static/audio/fallback.mp3', // Optional: fallback for audio
    // video: '/static/video/fallback.mp4', // Optional: fallback for video
  },
  
  // MAXIMUM caching - Cache everything possible
  runtimeCaching: [
    // API routes - Cache first with very long expiration
    {
      urlPattern: /^\/api\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200, 201, 202, 203, 204, 300, 301, 302, 304, 404],
        },
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // Cache API requests for longer by removing timestamp params
              const url = new URL(request.url);
              url.searchParams.delete('t');
              url.searchParams.delete('timestamp');
              url.searchParams.delete('_');
              return url.toString();
            },
          },
        ],
      },
    },
    
    // All images - Maximum caching
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico|bmp|tiff|jfif|heic|heif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 2000,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        },
        cacheableResponse: {
          statuses: [0, 200, 206, 304],
        },
      },
    },
    
    // All external images and CDNs
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|avif|ico|bmp|tiff|jfif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'external-images',
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        },
        cacheableResponse: {
          statuses: [0, 200, 206, 304],
        },
      },
    },
    
    // Cloudinary and other CDNs
    {
      urlPattern: /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com|cdn\.|assets\.|static\.).*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 1500,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        },
        cacheableResponse: {
          statuses: [0, 200, 206, 304],
        },
      },
    },
    
    // All static assets - Maximum caching
    {
      urlPattern: /\.(?:js|css|woff2?|eot|ttf|otf|wasm)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 2, // 2 years
        },
        cacheableResponse: {
          statuses: [0, 200, 304],
        },
      },
    },
    
    // Next.js chunks and static files
    {
      urlPattern: /^\/_next\/static\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nextjs-static',
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 5, // 5 years (they're versioned)
        },
        cacheableResponse: {
          statuses: [0, 200, 304],
        },
      },
    },
    
    // Next.js webpack chunks
    {
      urlPattern: /^\/_next\/webpack\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'nextjs-webpack',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 5, // 5 years
        },
        cacheableResponse: {
          statuses: [0, 200, 304],
        },
      },
    },
    
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 5, // 5 years
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60 * 5, // 5 years
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    
    // JSON and data files
    {
      urlPattern: /\.(?:json|xml|txt|csv)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'data-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200, 304],
        },
      },
    },
    
    // HTML pages - Cache everything
    {
      urlPattern: /^\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'html-pages',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200, 304],
        },
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // Remove query params that don't affect content
              const url = new URL(request.url);
              url.searchParams.delete('utm_source');
              url.searchParams.delete('utm_medium');
              url.searchParams.delete('utm_campaign');
              url.searchParams.delete('fbclid');
              url.searchParams.delete('gclid');
              return url.toString();
            },
          },
        ],
      },
    },
  ],
  
  // Exclude files that change frequently
  buildExcludes: [
    /middleware-manifest\.json$/,
    /build-manifest\.json$/,
  ],
  
  // Pre-cache everything possible
  additionalManifestEntries: [
    { url: '/', revision: null },
    { url: '/offline', revision: null },
    { url: '/favicon.ico', revision: null },
  ],
});

const nextConfig = {
  // Image optimization with maximum caching
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
    ],
    minimumCacheTTL: 31536000 * 2, // 2 years
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features for better caching
  // experimental: {
  //   optimizeCss: true, // Disabled - requires 'critters' package
  // },
  
  // Maximum caching headers with SIMPLE syntax
  async headers() {
    return [
      // Next.js static files - 5 years
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=157680000, immutable', // 5 years
          },
        ],
      },
      // Public static files - 2 years
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=63072000, immutable', // 2 years
          },
        ],
      },
      // Offline page - cache for 1 year
      {
        source: '/offline',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Individual image extensions
      {
        source: '/:path*.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.jpeg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.gif',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.avif',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      // Individual font extensions
      {
        source: '/:path*.woff',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.woff2',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.eot',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.ttf',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      {
        source: '/:path*.otf',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=63072000, immutable' }],
      },
      // Individual JS/CSS extensions
      {
        source: '/:path*.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.css',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // API routes - short cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400', // 1 hour
          },
        ],
      },
    ];
  },
  
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
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

module.exports = withPWA(nextConfig);