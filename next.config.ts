import type { NextConfig } from "next";

const deployTarget = process.env.DEPLOY_TARGET
  ?? (process.env.CF_PAGES === "1" ? "cloudflare-pages" : undefined);
const isGitHubPages = deployTarget === "github-pages";
const isStaticExport = isGitHubPages || deployTarget === "cloudflare-pages";
const basePath = isGitHubPages ? (process.env.PAGES_BASE_PATH ?? "/De-vijfhoek") : "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  // Custom loaders serve pre-generated WebP files on both static hosts.
  // Local editor blobs and unknown assets stay unoptimized per component.
  images: { deviceSizes: [480, 960, 1600, 2400], imageSizes: [160, 320] },
  // The browser checks use this loopback hostname rather than localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
