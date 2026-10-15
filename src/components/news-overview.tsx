"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { NewsEntry } from "@/data/news";
import { NewsCard } from "./news-card";

export function NewsOverview({ entries }: { entries: NewsEntry[] }) {
  const [category, setCategory] = useState("all");
  const filtered = entries.filter((entry) => category === "all" || entry.category === category);
  return <><div className="filter-list news-filters" role="group" aria-label="Filter berichten">{[{ id: "all", label: "Alle berichten" }, { id: "evenement", label: "Evenementen" }, { id: "nieuws", label: "Nieuws" }].map(({ id, label }) => <button type="button" key={id} className="filter-button" aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}</div>
    <div role="status" aria-live="polite" className="sr-only">{filtered.length} berichten gevonden</div>
    {filtered.length ? <div className="news-grid">{filtered.map((entry) => <NewsCard key={entry.slug} entry={entry} />)}</div> : <div className="empty-state"><CalendarDays size={32} strokeWidth={1.4} aria-hidden="true" /><p className="eyebrow">Blijf op de hoogte</p><h2>{category === "evenement" ? "Nog geen evenementen gepubliceerd" : category === "nieuws" ? "Nog geen nieuws gepubliceerd" : "Binnenkort meer uit De Vijfhoek"}</h2><p>Bevestigde nieuwsberichten en evenementen verschijnen hier zodra ze beschikbaar zijn.</p></div>}
  </>;
}
