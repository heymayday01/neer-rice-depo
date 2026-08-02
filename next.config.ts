import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow Z.ai preview panel to load /_next/* assets (cross-origin in dev)
  allowedDevOrigins: ["*.space-z.ai", "*.z.ai", "localhost"],
};

export default nextConfig;
