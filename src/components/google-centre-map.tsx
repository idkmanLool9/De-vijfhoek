import { ArrowUpRight, Navigation } from "lucide-react";
import { centreGoogleQuery, centreMapEmbed, googleDirections, googleMapsSearch } from "@/lib/google-maps";

export function GoogleCentreMap() {
  return <section className="google-centre-map" aria-label="Locatie van De Vijfhoek op Google Maps">
    <iframe title="Google Maps — Winkelcentrum In den Vijfhoek, Oldenzaal" src={centreMapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    <div className="google-map-links"><a href={googleMapsSearch(centreGoogleQuery)} target="_blank" rel="noopener noreferrer">Open in Google Maps<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a><a href={googleDirections(centreGoogleQuery)} target="_blank" rel="noopener noreferrer"><Navigation size={15} aria-hidden="true" />Plan je route<span className="sr-only"> (opent in een nieuw tabblad)</span></a></div>
  </section>;
}
