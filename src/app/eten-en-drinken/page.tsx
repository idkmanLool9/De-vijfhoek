import type { Metadata } from "next";
import { Coffee } from "lucide-react";
import { ActionLink, Breadcrumbs, PageHero, PhotoPlaceholder } from "@/components/ui";
import { ShopCard } from "@/components/shop-card";
import { shops } from "@/data/shops";

export const metadata: Metadata = { title: "Eten & drinken", description: "Ontdek Bakkerij Nollen en Gall & Gall in De Vijfhoek in Oldenzaal. Bekijk de beschikbare winkelinformatie." };

const foodShops = shops.filter((shop) => shop.categories.includes("eten-en-drinken") || shop.categories.includes("dranken"));

export default function FoodPage() {
  return <><PageHero title="Eten & drinken" description="Informatie voor een moment tussendoor." /><div className="container page-content"><Breadcrumbs items={[{ label: "Eten & drinken" }]} />
    <section className="editorial-grid"><div><p className="eyebrow">In De Vijfhoek</p><h2>Even tijd voor jezelf.</h2><p>Ontdek het bevestigde winkelaanbod voor eten en drinken bij De Vijfhoek. Op de winkelpagina’s vind je de locatie op de plattegrond en de beschikbare winkelinformatie.</p><div className="inline-notice"><Coffee size={23} strokeWidth={1.5} aria-hidden="true" /><p>Openingstijden en contactgegevens worden aangevuld zodra ze voor de vestiging zijn gecontroleerd. Overig aanbod voor eten en drinken voegen we toe na bevestiging.</p></div><ActionLink href="/winkels" variant="plain">Bekijk alle winkels</ActionLink></div><PhotoPlaceholder label="Eten & drinken bij De Vijfhoek" className="editorial-photo" mediaId="eten-foto" /></section>
    <section className="section-spacing" aria-label="Bevestigd aanbod voor eten en drinken"><div className="section-heading"><div><h2>Eten & drinken in De Vijfhoek</h2><p className="muted">De tot nu toe bevestigde winkels voor eten en drinken.</p></div></div><div className="shop-grid">{foodShops.map((shop) => <ShopCard key={shop.slug} shop={shop} />)}</div></section>
  </div></>;
}
