import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Serve official assets directly; no separate Cloudflare Images service is required.
  images: { unoptimized: true },
  // The browser checks use this loopback hostname rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
