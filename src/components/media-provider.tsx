"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { mediaSlots, publishedMedia } from "@/data/media";
import { imageFormat, MAX_MEDIA_BYTES, type MediaAsset, type StoredMedia } from "@/lib/media-schema";
import { loadMedia, writeMedia } from "@/lib/media-storage";

export type MediaDraft = StoredMedia & { previewUrl: string };
type MediaContextValue = {
  drafts: Record<string, MediaDraft>;
  preview: boolean;
  ready: boolean;
  pending: number;
  error: string;
  addFile: (id: string, file: File) => Promise<void>;
  update: (id: string, changes: Pick<StoredMedia, "alt"> | Pick<StoredMedia, "position">) => void;
  remove: (id: string) => Promise<void>;
  importRecords: (records: StoredMedia[]) => Promise<void>;
  setPreview: (enabled: boolean) => Promise<void>;
};
const MediaContext = createContext<MediaContextValue | null>(null);
const knownIds = new Set(mediaSlots.map(({ id }) => id));
const message = (error: unknown) => error instanceof Error ? error.message : "Er is iets misgegaan met de lokale foto-opslag.";
function stored(draft: MediaDraft): StoredMedia {
  return { id: draft.id, name: draft.name, blob: draft.blob, alt: draft.alt, position: draft.position, width: draft.width, height: draft.height };
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Record<string, MediaDraft>>({});
  const records = useRef<Record<string, MediaDraft>>({});
  const urls = useRef(new Map<string, string>());
  const [preview, setPreviewState] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState("");

  const adopt = useCallback((incoming: StoredMedia[]) => {
    const next = { ...records.current };
    for (const record of incoming) {
      if (!knownIds.has(record.id)) continue;
      let previewUrl = next[record.id]?.previewUrl;
      if (!previewUrl || next[record.id].blob !== record.blob) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(record.blob);
        urls.current.set(record.id, previewUrl);
      }
      next[record.id] = { ...record, previewUrl };
    }
    records.current = next;
    setDrafts(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const objectUrls = urls.current;
    loadMedia().then((state) => {
      if (cancelled) return;
      adopt(state.records);
      setPreviewState(state.preview);
      setReady(true);
    }).catch((cause) => { if (!cancelled) { setError(message(cause)); setReady(true); } });
    return () => { cancelled = true; for (const url of objectUrls.values()) URL.revokeObjectURL(url); objectUrls.clear(); };
  }, [adopt]);

  async function importRecords(incoming: StoredMedia[]) {
    if (incoming.some(({ id }) => !knownIds.has(id))) throw new Error("Dit pakket bevat een onbekende fotoplek. Gebruik de nieuwste versie van de website.");
    setPending((count) => count + 1);
    try {
      await writeMedia(incoming, [], true);
      adopt(incoming);
      setPreviewState(true);
      setError("");
    } finally { setPending((count) => count - 1); }
  }

  async function addFile(id: string, file: File) {
    if (!knownIds.has(id)) throw new Error("Onbekende fotoplek.");
    if (file.size > MAX_MEDIA_BYTES) throw new Error("Kies een afbeelding van maximaal 15 MB.");
    const format = imageFormat(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
    if (!format) throw new Error("Kies een echte JPG-, PNG- of WebP-afbeelding. Logo’s kunnen als transparante PNG worden toegevoegd.");
    let dimensions;
    try {
      const bitmap = await createImageBitmap(file);
      dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
    } catch { throw new Error("Deze afbeelding kan niet worden geopend. Probeer een andere JPG, PNG of WebP."); }
    const slot = mediaSlots.find((slot) => slot.id === id)!;
    await importRecords([{ id, name: file.name, blob: new Blob([file], { type: format.mime }), alt: publishedMedia[id]?.alt || slot.label, position: { x: 50, y: 50 }, ...dimensions }]);
  }

  function update(id: string, changes: Pick<StoredMedia, "alt"> | Pick<StoredMedia, "position">) {
    const current = records.current[id];
    if (!current) return;
    const record = { ...stored(current), ...changes };
    adopt([record]);
    setPending((count) => count + 1);
    writeMedia([record]).then(() => setError("")).catch((cause) => setError(message(cause))).finally(() => setPending((count) => count - 1));
  }

  async function remove(id: string) {
    setPending((count) => count + 1);
    try {
      await writeMedia([], [id]);
      const next = { ...records.current };
      delete next[id];
      const url = urls.current.get(id);
      if (url) URL.revokeObjectURL(url);
      urls.current.delete(id);
      records.current = next;
      setDrafts(next);
    } finally { setPending((count) => count - 1); }
  }

  async function setPreview(enabled: boolean) {
    try { await writeMedia([], [], enabled); setPreviewState(enabled); }
    catch (cause) { setError(message(cause)); }
  }

  return <MediaContext.Provider value={{ drafts, preview, ready, pending, error, addFile, update, remove, importRecords, setPreview }}>{children}</MediaContext.Provider>;
}

export function useMediaEditor() {
  const context = useContext(MediaContext);
  if (!context) throw new Error("De bewerkmodus is niet beschikbaar.");
  return context;
}

export function useMediaAsset(id: string, fallbackSrc?: string | null, fallbackAlt = ""): (MediaAsset & { local?: boolean }) | undefined {
  const context = useContext(MediaContext);
  const draft = context?.preview ? context.drafts[id] : undefined;
  if (draft) return { src: draft.previewUrl, alt: draft.alt, position: draft.position, local: true };
  return publishedMedia[id] || (fallbackSrc ? { src: fallbackSrc, alt: fallbackAlt, position: { x: 50, y: 50 } } : undefined);
}
