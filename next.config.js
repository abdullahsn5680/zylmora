/** @type {import('next').NextConfig} */
const nextConfig = {

  outputFileTracingRoot: __dirname,

  images: {
     remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**",
      },
    ],
    unoptimized: false,
    formats: ["image/avif", "image/webp"], 
    minimumCacheTTL: 60
  },


  poweredByHeader: false, // hides "X-Powered-By"
  reactStrictMode: true,  // extra checks in dev
  productionBrowserSourceMaps: false, // smaller bundles


};

module.exports = nextConfig;
