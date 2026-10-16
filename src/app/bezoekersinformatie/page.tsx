import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, CircleHelp, Clock3, Map, ParkingSquare, Accessibility } from "lucide-react";
import { Breadcrumbs, PageHero } from "@/components/ui";
import { VisitorMap } from "@/components/floor-plan/visitor-map";
import { centreGoogleQuery, googleDirections, googleMapsSearch } from "@/lib/google-maps";
import { PracticalInformation } from "@/components/visitor-information";

export const metadata: Metadata = { title: "Bezoekersinformatie", description: "Bereid je bezoek aan De Vijfhoek Oldenzaal voor. Informatie over openingstijden, parkeren, bereikbaarheid, toegankelijkheid en de plattegrond." };

const topics = [
  { id: "openingstijden", title: "Openingstijden", description: "Bekijk de beschikbare informatie per winkel.", icon: Clock3 },
  { id: "bereikbaarheid", title: "Bereikbaarheid", description: "Informatie voor de reis naar De Vijfhoek.", icon: CarFront },
  { id: "parkeren", title: "Parkeren", description: "Informatie over parkeerlocaties en tarieven.", icon: ParkingSquare },
  { id: "plattegrond", title: "Plattegrond", description: "Zoek winkels en unitnummers op.", icon: Map },
  { id: "toegankelijkheid", title: "Toegankelijkheid", description: "Informatie over toegang en voorzieningen.", icon: Accessibility },
  { id: "veelgestelde-vragen", title: "Veelgestelde vragen", description: "Antwoorden op vragen over je bezoek.", icon: CircleHelp },
];

export default function VisitorPage() {
  return <><PageHero title="Bezoekersinformatie" description="Alle praktische informatie voor je bezoek op één plek." /><div className="container page-content"><Breadcrumbs items={[{ label: "Bezoekersinformatie" }]} />
    <nav aria-label="Onderwerpen bezoekersinformatie" className="visitor-grid">{topics.map(({ id, title, description, icon: Icon }) => <Link className="visitor-card" key={id} href={`#${id}`}><Icon size={29} strokeWidth={1.5} aria-hidden="true" /><div><h2>{title}</h2><p>{description}</p><ArrowRight size={17} aria-hidden="true" /></div></Link>)}</nav>
    <div className="visitor-sections"><section id="openingstijden"><div className="topic-heading"><Clock3 size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Openingstijden</h2></div><p>Openingstijden verschillen per winkel en voorziening. Via de winkelpagina’s kun je de beschikbare tijden op Google bekijken, ook voor een bezoek rond feestdagen.</p><Link href="/winkels" className="text-link">Zoek jouw winkel<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="bereikbaarheid"><div className="topic-heading"><CarFront size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Bereikbaarheid</h2></div><PracticalInformation topic="arrival" /><div className="travel-links">{[{ mode: "driving", label: "Met de auto" }, { mode: "bicycling", label: "Met de fiets" }, { mode: "transit", label: "Met het OV" }].map(({ mode, label }) => <a key={mode} href={googleDirections(centreGoogleQuery, mode as "driving" | "bicycling" | "transit")} className="button button-plain" target="_blank" rel="noopener noreferrer">{label}<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a>)}</div></section>
      <section id="parkeren"><div className="topic-heading"><ParkingSquare size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Parkeren</h2></div><PracticalInformation topic="parking" /><div className="travel-links"><a href={googleMapsSearch(`Parkeren bij ${centreGoogleQuery}`)} className="text-link" target="_blank" rel="noopener noreferrer">Zoek parkeerplaatsen<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a><a href="https://www.oldenzaal.nl/" className="text-link" target="_blank" rel="noopener noreferrer">Gemeente Oldenzaal<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></div></section>
      <section id="plattegrond"><div className="topic-heading"><Map size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Plattegrond</h2></div><p>Zoek een winkel of unitnummer, of kies een ruimte op de kaart. Bekijk de winkelinformatie en zoom in voor meer detail.</p><VisitorMap /></section>
      <section id="toegankelijkheid"><div className="topic-heading"><Accessibility size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Toegankelijkheid</h2></div><PracticalInformation topic="accessibility" /><p>Heb je voor je bezoek specifieke informatie nodig? Bekijk de beschikbare contactinformatie op de pagina van de betreffende winkel.</p><Link href="/winkels" className="text-link">Naar de winkelgids<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="veelgestelde-vragen"><div className="topic-heading"><CircleHelp size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Veelgestelde vragen</h2></div><div className="faq-list">
        <details><summary>Waar vind ik de openingstijden van een winkel?</summary><p>Open de winkelpagina in de winkelgids en kies Openingstijden op Google. Controleer ook eventuele afwijkende tijden voor de dag van je bezoek.</p></details>
        <details><summary>Is er een plattegrond beschikbaar?</summary><p>Onder Plattegrond kun je winkels en unitnummers opzoeken. Je kunt ruimtes aanklikken, inzoomen en verschuiven. Alleen bevestigde winkelkoppelingen hebben een winkelnaam; andere ruimtes tonen hun unitnummer.</p></details>
        <details><summary>Hoe neem ik contact op met een winkel?</summary><p>Open de winkelpagina en bekijk onder Contact de beschikbare gegevens. Via Winkelgegevens op Google kun je ook de vestiging, contactmogelijkheden en website opzoeken.</p></details>
      </div></section>
    </div>
  </div></>;
}
