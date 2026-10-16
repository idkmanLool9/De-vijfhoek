"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { publishedVisitorInfo } from "@/data/visitor-info";
import { parseVisitorValues, type VisitorDrafts, type VisitorFieldId, type VisitorInfo } from "@/lib/visitor-info";

const STORAGE_KEY = "de-vijfhoek-bezoekersinformatie-v1";
type State = { drafts: VisitorDrafts; preview: boolean };
type Editor = State & {
  values: VisitorInfo; ready: boolean; error: string;
  update: (id: VisitorFieldId, value: string) => void;
  reset: (id: VisitorFieldId) => void;
  setPreview: (preview: boolean) => void;
  importValues: (values: VisitorDrafts) => void;
};
const Context = createContext<Editor | null>(null);

export function VisitorInfoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ drafts: {}, preview: false });
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        let next: State = { drafts: {}, preview: false };
        if (raw) {
          const stored = JSON.parse(raw);
          if (stored.version !== 1 || typeof stored.preview !== "boolean") throw new Error("invalid");
          const values = parseVisitorValues(stored.drafts);
          next = { drafts: Object.fromEntries(Object.entries(values).filter(([key, value]) => publishedVisitorInfo[key as VisitorFieldId] !== value)), preview: stored.preview };
        }
        current.current = next; setState(next); setError("");
      } catch { setError("Je browser kon de bewaarde informatie niet laden. Je kunt nieuwe wijzigingen invoeren en downloaden als back-up."); }
      setReady(true);
    }
    function onStorage(event: StorageEvent) { if (event.key === STORAGE_KEY || event.key === null) load(); }
    load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function save(next: State) {
    current.current = next; setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...next })); setError(""); }
    catch { setError("Bewaren in deze browser is niet gelukt. Je invoer staat nog in beeld: download het informatiebestand als back-up."); }
  }
  function update(id: VisitorFieldId, value: string) {
    const checked = parseVisitorValues({ [id]: value });
    const drafts = { ...current.current.drafts, ...checked };
    if (value === publishedVisitorInfo[id]) delete drafts[id];
    save({ drafts, preview: true });
  }
  function reset(id: VisitorFieldId) { const drafts = { ...current.current.drafts }; delete drafts[id]; save({ ...current.current, drafts }); }
  function importValues(values: VisitorDrafts) {
    const incoming = parseVisitorValues(values, true);
    const drafts = { ...current.current.drafts, ...incoming };
    for (const key of Object.keys(drafts) as VisitorFieldId[]) if (drafts[key] === publishedVisitorInfo[key]) delete drafts[key];
    save({ drafts, preview: true });
  }
  const values = Object.fromEntries(Object.entries({ ...publishedVisitorInfo, ...(state.preview ? state.drafts : {}) }).map(([key, value]) => [key, value.trim()])) as VisitorInfo;
  return <Context.Provider value={{ ...state, values, ready, error, update, reset, importValues, setPreview: (preview) => save({ ...current.current, preview }) }}>{children}</Context.Provider>;
}

export function useVisitorInfoEditor() {
  const context = useContext(Context);
  if (!context) throw new Error("De informatiebewerker is niet beschikbaar.");
  return context;
}

export function useVisitorInfo() { return useContext(Context)?.values ?? publishedVisitorInfo; }
