import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, CircleHelp, Clock3, Map, ParkingSquare, Accessibility } from "lucide-react";
import { Breadcrumbs, PageHero, PhotoPlaceholder } from "@/components/ui";
import { VisitorMap } from "@/components/floor-plan/visitor-map";
import { centreGoogleQuery, googleDirections, googleMapsSearch } from "@/lib/google-maps";
import { PracticalInformation } from "@/components/visitor-information";

export const metadata: Metadata = { title: "Bezoekersinformatie", description: "Bereid je bezoek aan De Vijfhoek Oldenzaal voor. Informatie over openingstijden, parkeren, bereikbaarheid, toegankelijkheid en de plattegrond." };

const topics = [
  { id: "openingstijden", title: "Openingstijden", description: "Per winkel", icon: Clock3 },
  { id: "bereikbaarheid", title: "Bereikbaarheid", description: "Plan je reis", icon: CarFront },
  { id: "parkeren", title: "Parkeren", description: "Locaties & tarieven", icon: ParkingSquare },
  { id: "plattegrond", title: "Plattegrond", description: "Vind je winkel", icon: Map },
  { id: "toegankelijkheid", title: "Toegankelijkheid", description: "Toegang & voorzieningen", icon: Accessibility },
  { id: "veelgestelde-vragen", title: "Veelgestelde vragen", description: "Handig om te weten", icon: CircleHelp },
];

export default function VisitorPage() {
  return <><PageHero title="Bezoekersinformatie" description="Goed voorbereid naar De Vijfhoek." /><div className="container page-content visitor-page"><Breadcrumbs items={[{ label: "Bezoekersinformatie" }]} />
    <div className="visit-welcome"><div><p className="eyebrow">Plan je bezoek</p><h2>Zo ben je er.<br />Zo vind je je weg.</h2><p>Je route, een parkeerplek of je favoriete winkel: vind hier wat je nodig hebt voor je bezoek.</p></div>
      <section id="openingstijden" className="opening-callout"><Clock3 size={27} strokeWidth={1.5} aria-hidden="true" /><div><h2>Wanneer kom je langs?</h2><p>Elke winkel heeft eigen openingstijden. Bekijk ze op de winkelpagina, ook rond feestdagen.</p><Link href="/winkels" className="text-link">Zoek jouw winkel<ArrowRight size={15} aria-hidden="true" /></Link></div></section>
    </div>
    <nav aria-label="Onderwerpen bezoekersinformatie" className="visitor-grid">{topics.map(({ id, title, description, icon: Icon }) => <Link className="visitor-card" key={id} href={`#${id}`}><Icon size={22} strokeWidth={1.5} aria-hidden="true" /><div><h2>{title}</h2><p>{description}</p></div><ArrowRight size={15} aria-hidden="true" /></Link>)}</nav>
    <div className="visitor-sections">
      <section id="bereikbaarheid"><div className="topic-heading"><CarFront size={25} strokeWidth={1.5} aria-hidden="true" /><div><p className="eyebrow">Onderweg naar De Vijfhoek</p><h2>Bereikbaarheid</h2></div></div>
        <PracticalInformation topic="arrival"><PhotoPlaceholder mediaId="over-centrum" label="Winkelcentrum In den Vijfhoek" className="arrival-photo editorial-photo" /></PracticalInformation>
        <div className="travel-links"><a href={googleDirections(centreGoogleQuery)} className="text-link" target="_blank" rel="noopener noreferrer">Plan je route met Google Maps<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></div>
      </section>
      <section id="parkeren"><div className="topic-heading"><ParkingSquare size={25} strokeWidth={1.5} aria-hidden="true" /><div><p className="eyebrow">Een plek voor je auto</p><h2>Parkeren</h2></div></div><PracticalInformation topic="parking" /><div className="travel-links"><a href={googleMapsSearch(`Parkeren bij ${centreGoogleQuery}`)} className="text-link" target="_blank" rel="noopener noreferrer">Zoek parkeerplaatsen<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a><a href="https://www.oldenzaal.nl/" className="text-link" target="_blank" rel="noopener noreferrer">Gemeente Oldenzaal<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></div></section>
      <section id="plattegrond"><div className="map-section-heading"><div className="topic-heading"><Map size={25} strokeWidth={1.5} aria-hidden="true" /><div><p className="eyebrow">Kijk alvast even rond</p><h2>Plattegrond</h2></div></div><p>Zoek een winkel of kies een ruimte op de kaart.</p></div><VisitorMap /></section>
      <section id="toegankelijkheid" className="accessibility-section"><div><div className="topic-heading"><Accessibility size={25} strokeWidth={1.5} aria-hidden="true" /><div><p className="eyebrow">Voor een prettig bezoek</p><h2>Toegankelijkheid</h2></div></div><p>Bekijk per onderwerp de informatie over toegang en voorzieningen.</p><Link href="/winkels" className="text-link">Contact met een winkel<ArrowRight size={15} aria-hidden="true" /></Link></div><PracticalInformation topic="accessibility" /></section>
      <section id="veelgestelde-vragen" className="visitor-faq"><div className="topic-heading"><CircleHelp size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Veelgestelde vragen</h2></div><div className="faq-list">
        <details><summary>Waar vind ik de openingstijden van een winkel?</summary><p>Open de winkelpagina in de winkelgids en kies Openingstijden op Google. Controleer ook eventuele afwijkende tijden voor de dag van je bezoek.</p></details>
        <details><summary>Is er een plattegrond beschikbaar?</summary><p>Onder Plattegrond kun je winkels en unitnummers opzoeken. Je kunt ruimtes aanklikken, inzoomen en verschuiven. Alleen bevestigde winkelkoppelingen hebben een winkelnaam; andere ruimtes tonen hun unitnummer.</p></details>
        <details><summary>Hoe neem ik contact op met een winkel?</summary><p>Open de winkelpagina en bekijk onder Contact de beschikbare gegevens. Via Winkelgegevens op Google kun je ook de vestiging, contactmogelijkheden en website opzoeken.</p></details>
      </div></section>
    </div>
  </div></>;
}
