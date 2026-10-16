"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { assetPath } from "@/lib/paths";
import { useMediaAsset } from "./media-provider";
import { responsiveMedia } from "@/lib/responsive-media";

export function MediaImage({ id, fallbackSrc, alt, className = "official-photo", fit = "cover", fallback }: {
  id: string; fallbackSrc?: string | null; alt: string; className?: string; fit?: "cover" | "contain"; fallback: ReactNode;
}) {
  const asset = useMediaAsset(id, fallbackSrc, alt);
  if (!asset) return fallback;
  const sizes = fit === "contain" ? (id === "centrum-logo" ? "160px" : "96px") : className.includes("shop-main-photo") || className.includes("editorial-photo") ? "(max-width: 639px) calc(100vw - 40px), 50vw" : "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 384px";
  return <div className={`site-media ${className}`} data-media-id={id}>
    <Image src={asset.local ? asset.src : assetPath(asset.src)} alt={asset.alt || alt} fill sizes={sizes} unoptimized {...responsiveMedia(asset.src, asset.local)} loading={id === "centrum-logo" || className.includes("shop-main-photo") ? "eager" : "lazy"} style={{ objectFit: fit, objectPosition: `${asset.position.x}% ${asset.position.y}%` }} />
  </div>;
}

export function MediaHero({ children, className, labelledBy }: { children: ReactNode; className: string; labelledBy?: string }) {
  const asset = useMediaAsset("centrum-hero");
  return <section className={`media-hero ${className}${asset ? " has-hero-image" : ""}`} aria-labelledby={labelledBy}>
    {asset && <><div className="hero-image" data-media-id="centrum-hero" aria-hidden="true"><Image src={asset.local ? asset.src : assetPath(asset.src)} alt="" fill sizes="100vw" unoptimized {...responsiveMedia(asset.src, asset.local)} preload={!asset.local} style={{ objectFit: "cover", objectPosition: `${asset.position.x}% ${asset.position.y}%` }} /></div><div className="hero-overlay" /></>}
    {children}
  </section>;
}

export function MediaPending({ id, children, fallbackSrc }: { id: string; children: ReactNode; fallbackSrc?: string | null }) {
  return useMediaAsset(id, fallbackSrc) ? null : children;
}
