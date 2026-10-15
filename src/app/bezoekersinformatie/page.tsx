import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, CircleHelp, Clock3, Map, ParkingSquare, Accessibility } from "lucide-react";
import { Breadcrumbs, PageHero } from "@/components/ui";
import { VisitorMap } from "@/components/floor-plan/visitor-map";

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
    <div className="visitor-sections"><section id="openingstijden"><div className="topic-heading"><Clock3 size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Openingstijden</h2></div><p>Openingstijden kunnen per winkel of voorziening verschillen. Bevestigde tijden verschijnen op de individuele winkelpagina’s.</p><Link href="/winkels" className="text-link">Zoek jouw winkel<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="bereikbaarheid"><div className="topic-heading"><CarFront size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Bereikbaarheid</h2></div><p>De Vijfhoek ligt in Oldenzaal. Bevestigde informatie over het bezoekadres, de ingangen en routes met de auto, fiets en het openbaar vervoer wordt hier toegevoegd.</p></section>
      <section id="parkeren"><div className="topic-heading"><ParkingSquare size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Parkeren</h2></div><p>Informatie over parkeerlocaties, tarieven, openingstijden en eventuele laadpunten volgt zodra deze is bevestigd.</p></section>
      <section id="plattegrond"><div className="topic-heading"><Map size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Plattegrond</h2></div><p>Zoek een winkel of unitnummer, of kies een ruimte op de kaart. Bekijk de winkelinformatie en zoom in voor meer detail.</p><VisitorMap /></section>
      <section id="toegankelijkheid"><div className="topic-heading"><Accessibility size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Toegankelijkheid</h2></div><p>Bevestigde informatie over toegankelijke ingangen, rolstoeltoegang, toiletten en andere voorzieningen wordt hier gepubliceerd zodra deze beschikbaar is.</p><p>Heb je voor je bezoek specifieke informatie nodig? Bekijk de beschikbare contactinformatie op de pagina van de betreffende winkel.</p><Link href="/winkels" className="text-link">Naar de winkelgids<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="veelgestelde-vragen"><div className="topic-heading"><CircleHelp size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Veelgestelde vragen</h2></div><div className="faq-list">
        <details><summary>Waar vind ik de openingstijden van een winkel?</summary><p>Bekijk de detailpagina van de winkel in de winkelgids. Tijden worden pas getoond nadat ze voor deze vestiging zijn bevestigd.</p></details>
        <details><summary>Is er een plattegrond beschikbaar?</summary><p>Onder Plattegrond kun je winkels en unitnummers opzoeken. Je kunt ruimtes aanklikken, inzoomen en verschuiven. Alleen bevestigde winkelkoppelingen hebben een winkelnaam; andere ruimtes tonen hun unitnummer.</p></details>
        <details><summary>Hoe neem ik contact op met een winkel?</summary><p>Bevestigde contactgegevens komen op de individuele winkelpagina’s. Als daar nog geen contactgegevens staan, zijn deze nog niet beschikbaar voor deze website.</p></details>
      </div></section>
    </div>
  </div></>;
}
