import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
      {
        protocol: 'https',
        hostname: 'dkcojubsjpbunwxqxnwh.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
