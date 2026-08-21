import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, ".."),
  async redirects() {
    return [
      { source: "/product", destination: "/app", permanent: false },
      { source: "/feed", destination: "/app/feed", permanent: false },
      { source: "/court", destination: "/app/court", permanent: false },
      { source: "/catalog", destination: "/app/catalog", permanent: false },
      { source: "/case-studies", destination: "/app/heals", permanent: false },
    ];
  },
};

export default nextConfig;
