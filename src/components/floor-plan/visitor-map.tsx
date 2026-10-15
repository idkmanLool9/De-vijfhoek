"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Map, Search, X } from "lucide-react";
import { floorPlans, isPlacedMapUnit, mapFloors, type FloorPlan } from "@/data/floor-plan";
import { shops as confirmedShops, type Shop } from "@/data/shops";
import { mapUnitName, matchesMapUnit, normalizeMapSearch } from "@/lib/floor-plan";
import { MapCanvas, type MapCanvasHandle } from "./map-canvas";
import { UnitDetails } from "./unit-details";
import "./floor-plan.css";

type Selection = { kind: "unit"; id: string } | { kind: "shop"; slug: string } | null;

export function VisitorMap({ plans = floorPlans, shops = confirmedShops }: { plans?: FloorPlan[]; shops?: Shop[] }) {
  const id = useId();
  const canvas = useRef<MapCanvasHandle>(null);
  const [level, setLevel] = useState(plans.find((plan) => plan.floor === null)?.id ?? plans[0]?.floor ?? "ground");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const plan = plans.find((plan) => plan.floor === level || (plan.floor === null && plan.id === level));
  const search = normalizeMapSearch(query);
  const selectedUnit = selection?.kind === "unit" ? plan?.units.find((unit) => unit.id === selection.id) : undefined;
  const selectedShop = shops.find((shop) => shop.slug === (selection?.kind === "shop" ? selection.slug : selectedUnit?.shopSlug));
  const units = (plan?.units ?? []).filter((unit) => matchesMapUnit(unit, search, shops.find((shop) => shop.slug === unit.shopSlug)));
  const matchingShops = search ? shops.filter((shop) => normalizeMapSearch(shop.name).includes(search) && !units.some((unit) => unit.shopSlug === shop.slug)) : [];
  const resultCount = units.length + matchingShops.length;
  const hasGeometry = !!plan && (plan.sourceImage !== null || plan.units.some(isPlacedMapUnit));
  const hasPlacedUnits = !!plan?.units.some(isPlacedMapUnit);
  const floorLabel = plan?.label ?? mapFloors.find((floor) => floor.id === level)?.label ?? "Plattegrond";
  const selectionAnnouncement = selectedUnit ? `${mapUnitName(selectedUnit, selectedShop)} geselecteerd.${!selectedUnit.geometry ? " Locatie op de kaart nog niet bevestigd." : ""}` : selectedShop ? `${selectedShop.name} geselecteerd. Locatie op de kaart nog niet bevestigd.` : "Geen winkel of unit geselecteerd.";

  function chooseUnit(unitId: string) {
    const unit = plan?.units.find((unit) => unit.id === unitId);
    if (!unit) return;
    setSelection({ kind: "unit", id: unit.id });
    if (isPlacedMapUnit(unit)) canvas.current?.reveal(unit);
  }

  return <div className="floor-map" role="region" aria-label="Bezoekersplattegrond">
    <div className="floor-map-toolbar">
      <div className="floor-map-search"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor={`${id}-search`}>Zoek op winkelnaam of unitnummer</label><input id={`${id}-search`} type="search" placeholder="Zoek winkel of unitnummer…" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" aria-controls={`${id}-results`} />{query && <button type="button" aria-label="Zoekopdracht op kaart wissen" onClick={() => setQuery("")}><X size={17} aria-hidden="true" /></button>}</div>
      <div className="floor-map-level"><label htmlFor={`${id}-floor`}>Kaart / verdieping</label><div><select id={`${id}-floor`} value={level} onChange={(event) => { setLevel(event.target.value); setSelection(null); }}>
        {plans.filter((plan) => plan.floor === null).map((plan) => <option key={plan.id} value={plan.id}>{plan.label}</option>)}
        {mapFloors.map((floor) => <option key={floor.id} value={floor.id}>{floor.label}</option>)}
      </select><ChevronDown size={16} aria-hidden="true" /></div></div>
    </div>
    <div className="floor-map-layout">
      <div className="floor-map-main">
        {hasGeometry && plan ? <><MapCanvas key={plan.id} plan={plan} shops={shops} selectedId={selectedUnit?.id ?? null} matchingIds={search ? units.map((unit) => unit.id) : null} onSelect={(unitId) => setSelection(unitId ? { kind: "unit", id: unitId } : null)} canvasRef={canvas} />{hasPlacedUnits && <div className="floor-map-legend" aria-label="Legenda"><span><i className="floor-map-swatch" />Winkelruimte</span><span><i className="floor-map-swatch selected" />Geselecteerd</span></div>}</> :
          <div className="floor-map-unavailable" role="status"><Map size={36} strokeWidth={1.2} aria-hidden="true" /><span className="floor-map-kicker">{floorLabel}</span><h3>Plattegrond nog niet beschikbaar</h3><p>{plan ? "De plattegrond wordt voorbereid. Je kunt alvast winkels en unitnummers opzoeken. Bevestigde winkelposities volgen." : "Er is nog geen bevestigde plattegrond voor deze verdieping beschikbaar."}</p></div>}
        {plan && <p className="floor-map-source-note">Verdiepingen en winkelposities worden nog bevestigd.</p>}
      </div>
      <aside className="floor-map-sidebar" aria-label="Winkels en units opzoeken">
        <UnitDetails unit={selectedUnit} shop={selectedShop} onClear={() => setSelection(null)} />
        <div className="floor-map-results" id={`${id}-results`}><div className="floor-map-results-heading"><h3>{search ? "Zoekresultaten" : "Units"}</h3><span role="status" aria-live="polite">{search ? `${resultCount} ${resultCount === 1 ? "resultaat" : "resultaten"}` : `${units.length} ${units.length === 1 ? "unitnummer" : "unitnummers"}`}</span></div>
          {(units.length || matchingShops.length) ? <ul aria-label="Gevonden winkels en units">{units.map((unit) => {
            const shop = shops.find((shop) => shop.slug === unit.shopSlug);
            return <li key={unit.id}><button type="button" aria-pressed={selectedUnit?.id === unit.id} onClick={() => chooseUnit(unit.id)}><span><strong>{mapUnitName(unit, shop)}</strong><small>{shop ? `Unit ${unit.unitNumber}` : "Winkel nog niet bevestigd"}{!unit.geometry ? " · locatie volgt" : ""}</small></span><ArrowUpRight size={16} aria-hidden="true" /></button></li>;
          })}{matchingShops.map((shop) => <li key={shop.slug}><button type="button" aria-pressed={selectedShop?.slug === shop.slug} onClick={() => setSelection({ kind: "shop", slug: shop.slug })}><span><strong>{shop.name}</strong><small>Locatie op de kaart nog niet bevestigd</small></span><ArrowUpRight size={16} aria-hidden="true" /></button></li>)}</ul> : <div className="floor-map-no-results"><p>{search ? "Geen winkels of units gevonden." : "Er zijn nog geen units voor deze verdieping beschikbaar."}</p>{search && <button type="button" onClick={() => setQuery("")}>Zoekopdracht wissen</button>}</div>}
        </div>
      </aside>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{selectionAnnouncement}</p>
  </div>;
}
