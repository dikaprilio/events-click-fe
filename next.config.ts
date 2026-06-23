import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable image optimization for local files (use static files directly)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'api.eventsclick.id',
      },
    ],
  },
};

export default nextConfig;
