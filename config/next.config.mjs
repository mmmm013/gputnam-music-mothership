/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable static export for /mip so it always runs on-demand
    staleTimes: {
      '/mip': 0,
    },
  },
};

export default nextConfig;
