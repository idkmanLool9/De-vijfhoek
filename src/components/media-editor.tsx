"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Download, Eye, ImagePlus, Upload, ArrowLeft, Check, Trash2 } from "lucide-react";
import { mediaSlots, publishedMedia } from "@/data/media";
import { assetPath } from "@/lib/paths";
import { MAX_PACKAGE_BYTES, type StoredMedia } from "@/lib/media-schema";
import { useMediaEditor, type MediaDraft } from "./media-provider";

type Slot = typeof mediaSlots[number];
const describeError = (error: unknown) => error instanceof Error ? error.message : "Dit bestand kon niet worden verwerkt.";

function MediaEditorCard({ slot, exportBusy }: { slot: Slot; exportBusy: boolean }) {
  const { drafts, addFile, update, remove, ready, pending } = useMediaEditor();
  const draft = drafts[slot.id];
  const published = publishedMedia[slot.id];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const src = draft?.previewUrl || (published && assetPath(published.src));
  const position = draft?.position || published?.position || { x: 50, y: 50 };

  async function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); setError("");
    try { await addFile(slot.id, file); } catch (cause) { setError(describeError(cause)); }
    finally { setBusy(false); }
  }

  async function removeFile() {
    setBusy(true); setError("");
    try { await remove(slot.id); } catch (cause) { setError(describeError(cause)); }
    finally { setBusy(false); }
  }

  return <article className="editor-card" aria-labelledby={`titel-${slot.id}`} data-editor-slot={slot.id}>
    <div className={`editor-card-preview${slot.kind === "logo" ? " editor-logo-preview" : ""}`}>
      {src ? <Image src={src} alt={draft?.alt || published?.alt || slot.label} fill sizes="(max-width: 639px) 100vw, 33vw" unoptimized style={{ objectFit: slot.kind === "logo" ? "contain" : "cover", objectPosition: `${position.x}% ${position.y}%` }} /> : <ImagePlus size={32} strokeWidth={1.25} aria-hidden="true" />}
    </div>
    <div className="editor-card-body"><div className="editor-card-heading"><h3 id={`titel-${slot.id}`}>{slot.label}</h3><span className={`editor-badge${draft ? " is-filled" : ""}`}>{draft ? <><Check size={12} aria-hidden="true" />Lokaal gekozen</> : published ? "Vast op website" : "Nog leeg"}</span></div>
      <p className="editor-hint">{slot.hint}</p>
      <label className="editor-label" htmlFor={`bestand-${slot.id}`}>{slot.kind === "logo" ? "Kies een logo" : "Kies een foto"}</label>
      <input id={`bestand-${slot.id}`} aria-label={`${slot.label} kiezen`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void selectFile(event)} disabled={!ready || busy || exportBusy || pending > 0} className="editor-file-input" />
      {draft && <p className="editor-filename">{draft.name} · {draft.width} × {draft.height} pixels</p>}
      {busy && <p role="status" className="editor-hint">Bestand verwerken…</p>}
      {error && <p role="alert" className="editor-error">{error}</p>}
      <fieldset disabled={!draft || busy || exportBusy}><legend className="sr-only">Beeldinstellingen voor {slot.label}</legend>
        <label className="editor-label" htmlFor={`alt-${slot.id}`}>Beschrijving van het beeld</label>
        <input id={`alt-${slot.id}`} type="text" value={draft?.alt || (!draft ? published?.alt || "" : "")} maxLength={300} onChange={(event) => update(slot.id, { alt: event.target.value })} placeholder="Bijvoorbeeld: het winkelpad in De Vijfhoek" />
        {slot.kind === "photo" && <div className="editor-position"><label htmlFor={`x-${slot.id}`}>Uitsnede horizontaal <span>{position.x}%</span></label><input id={`x-${slot.id}`} type="range" min="0" max="100" value={position.x} onChange={(event) => update(slot.id, { position: { ...position, x: Number(event.target.value) } })} /><label htmlFor={`y-${slot.id}`}>Uitsnede verticaal <span>{position.y}%</span></label><input id={`y-${slot.id}`} type="range" min="0" max="100" value={position.y} onChange={(event) => update(slot.id, { position: { ...position, y: Number(event.target.value) } })} /></div>}
      </fieldset>
      <div className="editor-card-actions"><Link href={slot.route}>Bekijk op de website<Eye size={14} aria-hidden="true" /></Link>{draft && <button type="button" onClick={() => void removeFile()} disabled={busy || exportBusy || pending > 0}><Trash2 size={14} aria-hidden="true" />Verwijder keuze</button>}</div>
    </div>
  </article>;
}

export function MediaEditor() {
  const { drafts, preview, setPreview, ready, pending, error, importRecords } = useMediaEditor();
  const [group, setGroup] = useState("Centrum & homepage");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [downloads, setDownloads] = useState<{ source: Record<string, MediaDraft>; parts: { url: string; name: string; count: number }[] } | null>(null);
  const downloadUrls = useRef<string[]>([]);
  useEffect(() => {
    const urls = downloadUrls.current;
    return () => { for (const url of urls) URL.revokeObjectURL(url); };
  }, []);
  const visibleDownloads = downloads?.source === drafts ? downloads.parts : [];
  const groups = [...new Set(mediaSlots.map((slot) => slot.group))];
  const count = Object.keys(drafts).length;
  const filled = mediaSlots.filter((slot) => drafts[slot.id] || publishedMedia[slot.id]).length;

  async function download() {
    setBusy(true); setActionError(""); setNotice("");
    try {
      const { createMediaPackage, groupMediaRecords } = await import("@/lib/media-package");
      for (const url of downloadUrls.current) URL.revokeObjectURL(url);
      downloadUrls.current.length = 0;
      setDownloads(null);
      const groups = groupMediaRecords(Object.values(drafts));
      const parts = [];
      for (const [index, records] of groups.entries()) {
        const bytes = await createMediaPackage(records);
        const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/zip" }));
        downloadUrls.current.push(url);
        parts.push({ url, name: groups.length === 1 ? "de-vijfhoek-fotos.zip" : `de-vijfhoek-fotos-deel-${index + 1}.zip`, count: records.length });
      }
      if (parts.length === 1) {
        const link = document.createElement("a");
        link.href = parts[0].url; link.download = parts[0].name;
        document.body.appendChild(link); link.click(); link.remove();
        setNotice("Download gestart. Bewaar het fotopakket als back-up en stuur het hier in het gesprek voor definitieve publicatie.");
      } else {
        setDownloads({ source: drafts, parts });
        setNotice(`Je foto’s zijn verdeeld over ${parts.length} kleinere ZIP-pakketten. Download en stuur alle delen; de originele beeldkwaliteit blijft behouden.`);
      }
    } catch (cause) { setActionError(describeError(cause)); }
    finally { setBusy(false); }
  }

  async function restore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); setActionError(""); setNotice("");
    try {
      if (file.size > MAX_PACKAGE_BYTES + 256 * 1024) throw new Error("Dit pakket is groter dan 200 MB.");
      const { readMediaPackage } = await import("@/lib/media-package");
      const entries = readMediaPackage(new Uint8Array(await file.arrayBuffer()));
      const incoming: StoredMedia[] = [];
      // Decode one photo at a time so a large backup also works on mobile.
      for (const entry of entries) {
        const blob = new Blob([new Uint8Array(entry.bytes)], { type: entry.mime });
        let bitmap;
        try { bitmap = await createImageBitmap(blob); } catch { throw new Error(`De afbeelding voor ${entry.id} is beschadigd.`); }
        const dimensions = { width: bitmap.width, height: bitmap.height }; bitmap.close();
        incoming.push({ id: entry.id, name: entry.name, alt: entry.alt, position: entry.position, blob, ...dimensions });
      }
      await importRecords(incoming);
      setNotice(`${incoming.length} beeldkeuzes uit het pakket zijn in deze browser bewaard. Keuzes voor andere plekken blijven behouden.`);
    } catch (cause) { setActionError(describeError(cause)); }
    finally { setBusy(false); }
  }

  return <div className="container editor-page"><Link href="/" className="editor-back"><ArrowLeft size={15} aria-hidden="true" />Terug naar de website</Link>
    <div className="editor-title"><div><p className="eyebrow">Tijdelijke bewerkmodus</p><h1>Foto’s & logo’s toevoegen</h1><p>Kies officiële beelden en bekijk meteen hoe ze op de website passen.</p></div><span className="editor-progress">{filled} van {mediaSlots.length} plekken ingevuld</span></div>
    <div className="editor-explanation"><strong>Je werkt aan een lokaal voorbeeld.</strong><p>Foto’s en instellingen worden op dit apparaat in deze browser bewaard. Ze zijn nog niet zichtbaar voor andere bezoekers. Download regelmatig je fotopakket als back-up; bij het wissen van browsergegevens kunnen lokale keuzes verloren gaan.</p><p>Klaar? Stuur het gedownloade ZIP-bestand (of alle delen) hier in het gesprek. Daarna zetten we de beelden vast op GitHub voor alle bezoekers en verwijderen we deze tijdelijke bewerkmodus.</p></div>
    <div className="editor-toolbar"><div className="editor-buttons"><button type="button" className="button button-dark" onClick={() => void download()} disabled={!count || busy || pending > 0}><Download size={16} aria-hidden="true" />Download fotopakket</button><label className="editor-import">Importeer fotopakket<input type="file" accept=".zip,application/zip" onChange={(event) => void restore(event)} disabled={!ready || busy || pending > 0} /></label><button type="button" className="button button-plain" aria-pressed={preview} onClick={() => void setPreview(!preview)} disabled={!ready || busy}><Eye size={16} aria-hidden="true" />{preview ? "Voorbeeld staat aan" : "Voorbeeld aanzetten"}</button></div><p className="editor-save-status" role="status" aria-live="polite">{!ready ? "Lokale keuzes laden…" : error ? "Opslaan is niet gelukt; download een back-up van je keuzes." : busy || pending > 0 ? "Bezig met verwerken en bewaren…" : count ? "Lokale wijzigingen bewaard in deze browser" : "Kies je eerste foto of logo"}</p></div>
    {(error || actionError) && <p role="alert" className="editor-error editor-alert">{error || actionError}</p>}
    {notice && <p role="status" className="editor-notice">{notice}</p>}
    {visibleDownloads.length > 0 && <div className="editor-downloads" aria-label="Fotopakketten downloaden">{visibleDownloads.map((part, index) => <a key={part.name} href={part.url} download={part.name}><Download size={15} aria-hidden="true" />Download deel {index + 1} van {visibleDownloads.length}<span>{part.count} beeldkeuzes</span></a>)}<p>Download alle delen. Maak na verdere wijzigingen opnieuw een export.</p></div>}
    <div className="filter-list" role="group" aria-label="Filter fotoplekken">{["Alle plekken", ...groups].map((name) => <button type="button" key={name} className="filter-button" aria-pressed={group === name} onClick={() => setGroup(name)}>{name}</button>)}</div>
    <p className="editor-formats"><Upload size={15} aria-hidden="true" />JPG, PNG of WebP · maximaal 15 MB per bestand · logo’s mogen transparant zijn</p>
    <div className="editor-grid">{mediaSlots.filter((slot) => group === "Alle plekken" || slot.group === group).map((slot) => <MediaEditorCard key={slot.id} slot={slot} exportBusy={busy} />)}</div>
  </div>;
}
