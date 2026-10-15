const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// next/link adds basePath automatically; next/image needs it explicitly.
export function assetPath(src: string) {
  return src.startsWith("/") && !src.startsWith("//") ? `${basePath}${src}` : src;
}
