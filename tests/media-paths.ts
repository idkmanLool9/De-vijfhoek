import optimized from "../src/data/media-optimized.json";

const images: Record<string, { variants: { src: string }[] }> = optimized;

export function publishedImageSrc(src: string) {
  return images[src]?.variants.at(-1)?.src ?? src;
}
