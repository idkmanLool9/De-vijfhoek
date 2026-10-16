import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock3, MapPin, Phone, ListChecks, ExternalLink, Mail } from "lucide-react";
import { shops, getShop } from "@/data/shops";
import { getShopUnitNumbers } from "@/data/shop-units";
import { Breadcrumbs } from "@/components/ui";
import { ShopLogo, ShopPhoto } from "@/components/shop-card";
import { MediaPending } from "@/components/media-image";
import { googleDirections, googleMapsSearch, googleReviews, shopGoogleQuery } from "@/lib/google-maps";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return shops.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = getShop((await params).slug);
  return shop ? { title: shop.name, description: shop.description } : { title: "Winkel niet gevonden" };
}

export default async function ShopPage({ params }: Props) {
  const shop = getShop((await params).slug);
  if (!shop) notFound();
  const unitNumber = getShopUnitNumbers(shop.slug)[0];
  const mapHref = `/bezoekersinformatie${unitNumber ? `?unit=${encodeURIComponent(unitNumber)}` : ""}#plattegrond`;
  const googleQuery = shopGoogleQuery(shop);
  const googleHref = googleMapsSearch(googleQuery);
  return <div className="container page-content"><Breadcrumbs items={[{ label: "Winkels", href: "/winkels" }, { label: shop.name }]} />
    <div className="shop-detail-top"><div className="shop-gallery"><ShopPhoto shop={shop} className="shop-main-photo" /><MediaPending id={`winkel-${shop.slug}-foto`} fallbackSrc={shop.photo}><p className="content-note">Officiële winkelfoto’s worden hier toegevoegd zodra ze beschikbaar zijn.</p></MediaPending></div>
      <div className="shop-introduction"><div className="shop-title"><ShopLogo shop={shop} /><div><h1>{shop.name}</h1><p>{shop.categoryLabel}</p></div></div><p className="shop-description">{shop.description}</p>
        <div className="shop-actions"><Link href={mapHref} className="button button-dark"><MapPin size={17} aria-hidden="true" />{unitNumber ? "Bekijk op de plattegrond" : "Bekijk de plattegrond"}</Link>{shop.website && <a href={shop.website} className="button button-plain" target="_blank" rel="noopener noreferrer">Naar de website<span className="sr-only"> (opent in een nieuw tabblad)</span><ExternalLink size={16} aria-hidden="true" /></a>}</div>
        <section className="hours-panel" aria-labelledby="hours-title"><h2 id="hours-title"><Clock3 size={22} strokeWidth={1.5} aria-hidden="true" />Openingstijden</h2>{shop.openingHours?.length ? <dl className="hours-list">{shop.openingHours.map(({ day, hours }) => <div key={day}><dt>{day}</dt><dd>{hours}</dd></div>)}</dl> : <p>Bekijk de winkel op Google voor de beschikbare openingstijden. Controleer voor vertrek ook eventuele afwijkende tijden.</p>}<a href={googleHref} className="text-link" target="_blank" rel="noopener noreferrer">Openingstijden op Google<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></section>
        <section className="shop-google-panel" aria-labelledby="google-title"><h2 id="google-title">Bezoek deze winkel</h2><p>Plan je route en bekijk reviews en winkelfoto’s op Google.</p><div><a href={googleDirections(googleQuery)} className="button button-plain" target="_blank" rel="noopener noreferrer">Route met Google Maps<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a><a href={googleReviews(googleQuery)} className="text-link" target="_blank" rel="noopener noreferrer">Reviews op Google<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></div></section>
      </div>
    </div>
    <div className="shop-info-grid"><section className="info-card"><MapPin size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Locatie</h2><p>{shop.address || "De Vijfhoek, Oldenzaal"}{shop.unit && <><br />{shop.unit}</>}</p>{!shop.address && <p className="muted">Het exacte winkeladres volgt na bevestiging.</p>}{!unitNumber && <p className="muted">De locatie op de plattegrond is nog niet bevestigd.</p>}<Link href={mapHref} className="text-link">{unitNumber ? "Toon deze winkel op de kaart" : "Bekijk de plattegrond"}<ArrowRight size={15} aria-hidden="true" /></Link></div></section>
      <section className="info-card"><Phone size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Contact</h2>{shop.phone && <a className="contact-link" href={`tel:${shop.phone.replace(/\s/g, "")}`}>{shop.phone}</a>}{shop.email && <a className="contact-link" href={`mailto:${shop.email}`}><Mail size={15} aria-hidden="true" />{shop.email}</a>}{!shop.phone && !shop.email && <><p>Zoek de beschikbare contactgegevens en website van deze vestiging op Google Maps.</p><a className="text-link" href={googleHref} target="_blank" rel="noopener noreferrer">Winkelgegevens op Google<ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></>}{shop.website && <a className="text-link" href={shop.website}>Naar de website<ExternalLink size={15} aria-hidden="true" /></a>}</div></section>
      <section className="info-card"><ListChecks size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Voorzieningen</h2>{shop.facilities?.length ? <ul>{shop.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul> : <p>Er zijn nog geen bevestigde voorzieningen voor deze vestiging gepubliceerd.</p>}</div></section>
    </div>
    <div className="back-row"><Link href="/winkels" className="text-link">Bekijk alle winkels<ArrowRight size={15} aria-hidden="true" /></Link></div>
  </div>;
}
