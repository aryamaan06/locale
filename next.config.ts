import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
