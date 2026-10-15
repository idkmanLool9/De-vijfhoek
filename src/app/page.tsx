import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ActionLink, PhotoPlaceholder, SectionHeading } from "@/components/ui";
import { getPublishedNews } from "@/data/news";
import { NewsCard } from "@/components/news-card";
import { MediaHero, MediaPending } from "@/components/media-image";

const shortcuts = [
  { title: "Winkels", description: "Van dagelijkse boodschappen tot mode en huishoudelijke artikelen.", href: "/winkels", image: "Winkelen in De Vijfhoek", mediaId: "home-winkels" },
  { title: "Eten & drinken", description: "Bekijk de informatie over eten en drinken in het centrum.", href: "/eten-en-drinken", image: "Eten & drinken", mediaId: "home-eten" },
  { title: "Bezoekersinfo", description: "Bereid je bezoek voor met praktische informatie.", href: "/bezoekersinformatie", image: "Een bezoek aan De Vijfhoek", mediaId: "home-bezoek" },
];

export default function Home() {
  const news = getPublishedNews().slice(0, 3);
  return <>
    <MediaHero className="home-hero" labelledBy="home-title"><div className="container hero-content">
      <p className="eyebrow">Winkelcentrum In den Vijfhoek</p>
      <h1 id="home-title">Alles dichtbij.<br />Midden in Oldenzaal.</h1>
      <p className="hero-intro">Van dagelijkse boodschappen tot winkels en voorzieningen.<br className="desktop-break" /> Ontdek het aanbod van De Vijfhoek.</p>
      <div className="hero-buttons"><ActionLink href="/winkels" variant="light">Ontdek de winkels</ActionLink><ActionLink href="/bezoekersinformatie" variant="outline">Plan je bezoek</ActionLink></div>
      <MediaPending id="centrum-hero"><div className="hero-photo-label"><span className="placeholder-dot" />Fotoplaceholder · Officiële centrumfoto volgt</div></MediaPending>
    </div></MediaHero>
    <div className="container">
      <section className="shortcut-grid" aria-label="Ontdek het centrum">{shortcuts.map((card) => <Link className="shortcut-card" key={card.href} href={card.href}>
        <PhotoPlaceholder label={card.image} mediaId={card.mediaId} /><div className="shortcut-body"><h2>{card.title}<ArrowRight size={18} aria-hidden="true" /></h2><p>{card.description}</p></div>
      </Link>)}</section>
      <section className="home-news section-spacing">
        <SectionHeading eyebrow="Actueel" title="Wat is er te doen?" description="Nieuws en evenementen van De Vijfhoek.">
          <Link className="text-link" href="/nieuws">Bekijk alle berichten<ArrowRight size={16} aria-hidden="true" /></Link>
        </SectionHeading>
        {news.length ? <div className="news-grid">{news.map((entry) => <NewsCard key={entry.slug} entry={entry} />)}</div> : <div className="news-empty"><div className="empty-icon"><CalendarDays size={25} strokeWidth={1.5} aria-hidden="true" /></div><div><h3>Binnenkort meer uit De Vijfhoek</h3><p>Er zijn op dit moment nog geen bevestigde nieuwsberichten of evenementen gepubliceerd.</p></div></div>}
      </section>
    </div>
  </>;
}
