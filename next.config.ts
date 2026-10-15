import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The browser checks use this loopback hostname rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
