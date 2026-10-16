import type { Metadata } from "next";
import { Building2, Mail, Users } from "lucide-react";
import { ActionLink, Breadcrumbs, PageHero } from "@/components/ui";
import { GoogleCentreMap } from "@/components/google-centre-map";
import { CentreHistoryText, CentreManagementInfo, CentreContactInfo, CentreEntrepreneursText } from "@/components/visitor-information";

export const metadata: Metadata = { title: "Over De Vijfhoek", description: "Maak kennis met Winkelcentrum In den Vijfhoek in Oldenzaal. Ontdek de winkels en voorzieningen." };

export default function AboutPage() {
  return <><PageHero title="Over De Vijfhoek" description="Winkels en voorzieningen. Midden in Oldenzaal." /><div className="container page-content"><Breadcrumbs items={[{ label: "Over De Vijfhoek" }]} />
    <section className="editorial-grid"><div><p className="eyebrow">In den Vijfhoek</p><h2>Een centraal punt in Oldenzaal</h2><p>Winkelcentrum In den Vijfhoek brengt winkels en voorzieningen samen in Oldenzaal. Van dagelijkse boodschappen tot een bezoek aan de bibliotheek: ontdek het aanbod in onze winkelgids.</p><p>Plan je route met Google Maps en gebruik de interactieve bezoekersplattegrond om een winkel in het centrum te vinden.</p><ActionLink href="/winkels" variant="plain">Ontdek de winkels</ActionLink></div><GoogleCentreMap /></section>
    <section className="about-history"><h2>Het verhaal van De Vijfhoek</h2><CentreHistoryText /></section>
    <div className="about-info-grid"><section className="info-card" id="beheer"><Building2 size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Beheer</h2><CentreManagementInfo /></div></section><section className="info-card" id="contact"><Mail size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Contact</h2><CentreContactInfo /></div></section><section className="info-card" id="ondernemers"><Users size={25} strokeWidth={1.5} aria-hidden="true" /><div><h2>Voor ondernemers</h2><CentreEntrepreneursText /></div></section></div>
  </div></>;
}
