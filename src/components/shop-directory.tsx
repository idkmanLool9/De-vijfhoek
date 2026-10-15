"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { categories, type Shop, type CategoryId } from "@/data/shops";
import { ShopCard } from "./shop-card";

export function ShopDirectory({ shops }: { shops: Shop[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const search = query.trim().toLocaleLowerCase("nl");
  const filtered = shops.filter((shop) => (category === "all" || shop.categories.includes(category)) && `${shop.name} ${shop.categoryLabel}`.toLocaleLowerCase("nl").includes(search));
  function reset() { setQuery(""); setCategory("all"); }

  return <div className="directory">
    <div className="search-field"><Search size={19} aria-hidden="true" /><label htmlFor="zoeken" className="sr-only">Zoek op winkelnaam of categorie</label><input type="search" id="zoeken" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek op winkelnaam of categorie…" autoComplete="off" aria-controls="winkelresultaten" />{query && <button type="button" className="icon-button" aria-label="Zoekopdracht wissen" onClick={() => setQuery("")}><X size={17} aria-hidden="true" /></button>}</div>
    <div className="filter-list" role="group" aria-label="Filter op winkelcategorie"><button type="button" className="filter-button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>Alle winkels</button>{categories.map((item) => <button type="button" key={item.id} className="filter-button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
    <div className="results-heading"><p role="status" aria-live="polite" aria-atomic="true">{filtered.length === 1 ? "1 winkel of voorziening" : `${filtered.length} winkels en voorzieningen`}{search || category !== "all" ? " gevonden" : " in deze gids"}</p>{(query || category !== "all") && <button type="button" className="reset-button" onClick={reset}>Wis filters<X size={13} aria-hidden="true" /></button>}</div>
    <div id="winkelresultaten">{filtered.length ? <div className="shop-grid">{filtered.map((shop) => <ShopCard shop={shop} key={shop.slug} />)}</div> : <div className="empty-state"><Search size={28} strokeWidth={1.4} aria-hidden="true" /><h2>Geen winkels gevonden</h2><p>Probeer een andere zoekterm of bekijk alle winkels.</p><button type="button" className="button button-dark" onClick={reset}>Toon alle winkels</button></div>}</div>
  </div>;
}
