import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import type { MapUnit } from "@/data/floor-plan";
import type { Shop } from "@/data/shops";
import { mapUnitName } from "@/lib/floor-plan";

export function UnitDetails({ id, unit, shop, onClear }: { id?: string; unit?: MapUnit; shop?: Shop; onClear: () => void }) {
  return <section id={id} tabIndex={-1} className="floor-map-details" aria-label="Informatie over de selectie">
    <div className="floor-map-details-content" key={unit?.id ?? shop?.slug ?? "empty"}>
      {unit || shop ? <>
        <div className="floor-map-details-top"><span className="floor-map-kicker">{unit ? `Unit ${unit.unitNumber}` : shop?.unit ?? "Winkelinformatie"}</span><button type="button" className="floor-map-close" aria-label="Selectie wissen" onClick={onClear}><X size={17} aria-hidden="true" /></button></div>
        <h3>{unit ? mapUnitName(unit, shop) : shop!.name}</h3>
        <dl><div><dt>Categorie</dt><dd>{shop?.categoryLabel ?? "Nog niet bevestigd"}</dd></div></dl>
        {!unit?.geometry && <p>Locatie op de plattegrond nog niet bevestigd.</p>}
        {unit && !shop && <p>De winkel in deze unit is nog niet bevestigd.</p>}
        {shop && <Link className="text-link" href={`/winkels/${shop.slug}`}>Bekijk de winkelpagina<ArrowRight size={15} aria-hidden="true" /></Link>}
      </> : <><MapPin size={23} strokeWidth={1.5} aria-hidden="true" /><h3>Kies een winkel of unit</h3><p>Zoek op naam of unitnummer. Beschikbare winkelinformatie verschijnt hier.</p></>}
    </div>
  </section>;
}
