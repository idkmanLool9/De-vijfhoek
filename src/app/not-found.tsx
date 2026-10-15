import { ActionLink } from "@/components/ui";

export default function NotFound() {
  return <div className="container not-found"><p className="eyebrow">Pagina niet gevonden · 404</p><h1>Even de weg kwijt?</h1><p>Deze pagina bestaat niet of is nog niet gepubliceerd.</p><div className="hero-buttons"><ActionLink href="/">Terug naar home</ActionLink><ActionLink href="/winkels" variant="plain">Bekijk de winkels</ActionLink></div></div>;
}
