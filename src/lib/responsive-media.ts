import optimizedMedia from "@/data/media-optimized.json";
import { assetPath } from "./paths";

type OptimizedAsset = { variants: { width: number; src: string; bytes: number }[] };
const images: Record<string, OptimizedAsset> = optimizedMedia;

export function responsiveMedia(src: string, local = false) {
  const asset = !local ? images[src] : undefined;
  if (!asset) return {};
  return {
    unoptimized: false,
    loader: ({ width }: { width: number }) => assetPath((asset.variants.find((variant) => variant.width >= width) ?? asset.variants.at(-1)!).src),
  };
}
