/** @type {import('next').NextConfig} */
const nextConfig = {

  outputFileTracingRoot: __dirname,

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"], 
    minimumCacheTTL: 60
  },


  poweredByHeader: false, // hides "X-Powered-By"
  reactStrictMode: true,  // extra checks in dev
  productionBrowserSourceMaps: false, // smaller bundles


};

module.exports = nextConfig;
