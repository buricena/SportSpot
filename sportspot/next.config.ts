import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  } as any, 
  reactStrictMode: true,
};

export default nextConfig;
