import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Required for OpenNext Cloudflare adapter
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
