import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in a parent directory confuses workspace-root inference
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
