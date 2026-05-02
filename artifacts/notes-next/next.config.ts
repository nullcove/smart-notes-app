import type { NextConfig } from "next";

const basePath = (process.env.BASE_PATH || "/notes-next/").replace(/\/$/, "");

const nextConfig: NextConfig = {
  basePath,
  trailingSlash: false,
  images: { unoptimized: true },
  allowedDevOrigins: ["*.replit.dev", "*.sisko.replit.dev", "*.repl.co"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:${process.env.API_PORT || 8080}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
