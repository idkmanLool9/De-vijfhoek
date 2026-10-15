import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = isGitHubPages ? (process.env.PAGES_BASE_PATH ?? "/De-vijfhoek") : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export", trailingSlash: true } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  // Serve official assets directly; no separate Cloudflare Images service is required.
  images: { unoptimized: true },
  // The browser checks use this loopback hostname rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
