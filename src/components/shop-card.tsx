import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Shop } from "@/data/shops";
import { assetPath } from "@/lib/paths";
import { PhotoPlaceholder } from "./ui";

export function ShopPhoto({ shop, className = "" }: { shop: Shop; className?: string }) {
  return shop.photo ? <div className={`official-photo ${className}`}><Image src={assetPath(shop.photo)} alt={`De winkel van ${shop.name}`} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" /></div> : <PhotoPlaceholder label={shop.name} className={className} />;
}

export function ShopLogo({ shop }: { shop: Shop }) {
  return <div className="shop-logo">{shop.logo ? <Image src={assetPath(shop.logo)} alt={`Logo ${shop.name}`} width={48} height={48} /> : <span>Logo<br />volgt</span>}</div>;
}

export function ShopCard({ shop }: { shop: Shop }) {
  return <Link href={`/winkels/${shop.slug}`} className="shop-card">
    <ShopPhoto shop={shop} />
    <div className="shop-card-body"><ShopLogo shop={shop} /><div><h2>{shop.name}</h2><p>{shop.categoryLabel}</p></div><ArrowRight size={17} aria-hidden="true" /></div>
  </Link>;
}
