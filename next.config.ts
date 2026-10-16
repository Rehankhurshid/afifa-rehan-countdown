import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Static, self-contained pages served from /public/for-rehan
      { source: "/for-rehan", destination: "/for-rehan/index.html" },
      { source: "/for-rehan/game", destination: "/for-rehan/index.html" },
    ];
  },
};

export default nextConfig;
