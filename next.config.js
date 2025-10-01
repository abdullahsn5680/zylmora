const nextConfig = {
  outputFileTracingRoot: __dirname, // Ensures correct tracing of serverless function deps
  images: {
    unoptimized: false, // Enables Next.js image optimization (default)
  },
  compress: true, // Enables gzip compression for responses
  poweredByHeader: false, // Hides "X-Powered-By: Next.js" header (security best practice)
  reactStrictMode: true, // Helps detect issues during development
};

module.exports = nextConfig;
