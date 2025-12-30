import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // swcMinify: true, // Force SWC minification (default in Next 13+)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
