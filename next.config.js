const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  // Simple offline fallback
  fallbacks: {
    document: '/offline',
  },
});

const nextConfig = {
  // Basic image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);