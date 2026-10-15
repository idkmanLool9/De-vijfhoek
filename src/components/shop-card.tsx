import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Shop } from "@/data/shops";
import { PhotoPlaceholder } from "./ui";
import { MediaImage } from "./media-image";

export function ShopPhoto({ shop, className = "" }: { shop: Shop; className?: string }) {
  return <PhotoPlaceholder label={shop.name} className={className} mediaId={`winkel-${shop.slug}-foto`} src={shop.photo} />;
}

export function ShopLogo({ shop }: { shop: Shop }) {
  return <div className="shop-logo"><MediaImage id={`winkel-${shop.slug}-logo`} fallbackSrc={shop.logo} alt={`Logo ${shop.name}`} className="shop-logo-media" fit="contain" fallback={<span>Logo<br />volgt</span>} /></div>;
}

export function ShopCard({ shop }: { shop: Shop }) {
  return <Link href={`/winkels/${shop.slug}`} className="shop-card">
    <ShopPhoto shop={shop} />
    <div className="shop-card-body"><ShopLogo shop={shop} /><div><h2>{shop.name}</h2><p>{shop.categoryLabel}{shop.unit && <><span aria-hidden="true"> · </span><span className="sr-only">, </span>{shop.unit}</>}</p></div><ArrowRight size={17} aria-hidden="true" /></div>
  </Link>;
}
