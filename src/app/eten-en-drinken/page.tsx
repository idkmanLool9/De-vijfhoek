import type { Metadata } from "next";
import { Coffee } from "lucide-react";
import { ActionLink, Breadcrumbs, PageHero, PhotoPlaceholder } from "@/components/ui";

export const metadata: Metadata = { title: "Eten & drinken", description: "Informatie over eten en drinken bij De Vijfhoek in Oldenzaal." };

export default function FoodPage() {
  return <><PageHero title="Eten & drinken" description="Informatie voor een moment tussendoor." /><div className="container page-content"><Breadcrumbs items={[{ label: "Eten & drinken" }]} />
    <section className="editorial-grid"><div><p className="eyebrow">In De Vijfhoek</p><h2>Even tijd voor jezelf.</h2><p>Op deze pagina vind je straks het bevestigde aanbod voor eten en drinken bij De Vijfhoek.</p><div className="inline-notice"><Coffee size={23} strokeWidth={1.5} aria-hidden="true" /><p>Er zijn nog geen horecazaken bevestigd voor deze website. Namen, openingstijden en contactgegevens volgen na bevestiging.</p></div><ActionLink href="/winkels" variant="plain">Ontdek de winkels</ActionLink></div><PhotoPlaceholder label="Eten & drinken bij De Vijfhoek" className="editorial-photo" mediaId="eten-foto" /></section>
  </div></>;
}
