import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, CircleHelp, Clock3, Map, ParkingSquare, Accessibility, MapPin } from "lucide-react";
import { Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Bezoekersinformatie", description: "Bereid je bezoek aan De Vijfhoek Oldenzaal voor. Informatie over openingstijden, parkeren, bereikbaarheid, toegankelijkheid en de plattegrond." };

const topics = [
  { id: "openingstijden", title: "Openingstijden", description: "Bekijk de beschikbare informatie per winkel.", icon: Clock3 },
  { id: "bereikbaarheid", title: "Bereikbaarheid", description: "Informatie voor de reis naar De Vijfhoek.", icon: CarFront },
  { id: "parkeren", title: "Parkeren", description: "Informatie over parkeerlocaties en tarieven.", icon: ParkingSquare },
  { id: "plattegrond", title: "Plattegrond", description: "Vind straks je weg in het winkelcentrum.", icon: Map },
  { id: "toegankelijkheid", title: "Toegankelijkheid", description: "Informatie over toegang en voorzieningen.", icon: Accessibility },
  { id: "veelgestelde-vragen", title: "Veelgestelde vragen", description: "Antwoorden op vragen over je bezoek.", icon: CircleHelp },
];

export default function VisitorPage() {
  return <><PageHero title="Bezoekersinformatie" description="Alle praktische informatie voor je bezoek op één plek." /><div className="container page-content"><Breadcrumbs items={[{ label: "Bezoekersinformatie" }]} />
    <nav aria-label="Onderwerpen bezoekersinformatie" className="visitor-grid">{topics.map(({ id, title, description, icon: Icon }) => <Link className="visitor-card" key={id} href={`#${id}`}><Icon size={29} strokeWidth={1.5} aria-hidden="true" /><div><h2>{title}</h2><p>{description}</p><ArrowRight size={17} aria-hidden="true" /></div></Link>)}</nav>
    <div className="visitor-sections"><section id="openingstijden"><div className="topic-heading"><Clock3 size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Openingstijden</h2></div><p>Openingstijden kunnen per winkel of voorziening verschillen. Bevestigde tijden verschijnen op de individuele winkelpagina’s.</p><Link href="/winkels" className="text-link">Zoek jouw winkel<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="bereikbaarheid"><div className="topic-heading"><CarFront size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Bereikbaarheid</h2></div><p>De Vijfhoek ligt in Oldenzaal. Bevestigde informatie over het bezoekadres, de ingangen en routes met de auto, fiets en het openbaar vervoer wordt hier toegevoegd.</p></section>
      <section id="parkeren"><div className="topic-heading"><ParkingSquare size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Parkeren</h2></div><p>Informatie over parkeerlocaties, tarieven, openingstijden en eventuele laadpunten volgt zodra deze is bevestigd.</p></section>
      <section id="plattegrond"><div className="topic-heading"><Map size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Plattegrond</h2></div><p>De officiële plattegrond is nog niet beschikbaar op deze website.</p><div className="map-placeholder" role="img" aria-label="Placeholder voor de officiële plattegrond"><MapPin size={35} strokeWidth={1.25} aria-hidden="true" /><strong>Hier komt de officiële plattegrond</strong><span>Winkellocaties en ingangen volgen na bevestiging.</span></div></section>
      <section id="toegankelijkheid"><div className="topic-heading"><Accessibility size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Toegankelijkheid</h2></div><p>Bevestigde informatie over toegankelijke ingangen, rolstoeltoegang, toiletten en andere voorzieningen wordt hier gepubliceerd zodra deze beschikbaar is.</p><p>Heb je voor je bezoek specifieke informatie nodig? Bekijk de beschikbare contactinformatie op de pagina van de betreffende winkel.</p><Link href="/winkels" className="text-link">Naar de winkelgids<ArrowRight size={15} aria-hidden="true" /></Link></section>
      <section id="veelgestelde-vragen"><div className="topic-heading"><CircleHelp size={25} strokeWidth={1.5} aria-hidden="true" /><h2>Veelgestelde vragen</h2></div><div className="faq-list">
        <details><summary>Waar vind ik de openingstijden van een winkel?</summary><p>Bekijk de detailpagina van de winkel in de winkelgids. Tijden worden pas getoond nadat ze voor deze vestiging zijn bevestigd.</p></details>
        <details><summary>Is er een plattegrond beschikbaar?</summary><p>Er staat nog geen officiële plattegrond op deze website. Zodra deze beschikbaar is, vind je hem onder het onderwerp Plattegrond.</p></details>
        <details><summary>Hoe neem ik contact op met een winkel?</summary><p>Bevestigde contactgegevens komen op de individuele winkelpagina’s. Als daar nog geen contactgegevens staan, zijn deze nog niet beschikbaar voor deze website.</p></details>
      </div></section>
    </div>
  </div></>;
}
