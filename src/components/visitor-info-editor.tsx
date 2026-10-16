"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, Download, Eye, Undo2 } from "lucide-react";
import { publishedVisitorInfo } from "@/data/visitor-info";
import { createVisitorPackage, readVisitorPackage, visitorFields, MAX_INFO_PACKAGE_BYTES } from "@/lib/visitor-info";
import { useVisitorInfoEditor } from "./visitor-info-provider";

export function VisitorInfoEditor() {
  const { drafts, preview, ready, error, update, reset, importValues, setPreview } = useVisitorInfoEditor();
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const downloadUrl = useRef("");
  const alert = useRef<HTMLParagraphElement>(null);
  useEffect(() => () => { if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current); }, []);
  useEffect(() => { if (actionError) alert.current?.focus(); }, [actionError]);
  const count = Object.keys(drafts).length;
  const filled = visitorFields.filter(({ id }) => (drafts[id] ?? publishedVisitorInfo[id]).trim()).length;
  const groups = [...new Set(visitorFields.map(({ group }) => group))];

  function download() {
    setActionError(""); setNotice("");
    try {
      const content = createVisitorPackage(drafts);
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
      downloadUrl.current = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = downloadUrl.current; link.download = "de-vijfhoek-bezoekersinformatie.json";
      document.body.appendChild(link); link.click(); link.remove();
      setNotice("Download gestart. Bewaar dit bestand als back-up en stuur het hier in het gesprek om de informatie voor alle bezoekers te publiceren.");
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Downloaden is niet gelukt."); }
  }
  async function restore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setBusy(true); setActionError(""); setNotice("");
    try {
      if (file.size > MAX_INFO_PACKAGE_BYTES) throw new Error("Dit informatiebestand is groter dan 100 kB.");
      const incoming = readVisitorPackage(await file.text());
      importValues(incoming);
      setNotice(`${Object.keys(incoming).length} informatievelden teruggezet. Andere informatievelden en je foto’s blijven behouden.`);
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Importeren is niet gelukt."); }
    finally { setBusy(false); }
  }

  return <div className="container editor-page information-editor"><Link href="/" className="editor-back"><ArrowLeft size={15} aria-hidden="true" />Terug naar de website</Link>
    <div className="editor-title"><div><p className="eyebrow">Tijdelijke bewerkmodus</p><h1>Bezoekersinformatie invullen</h1><p>Vul de praktische gegevens in en bekijk je lokale voorbeeld op de website.</p></div><span className="editor-progress">{filled} van {visitorFields.length} velden ingevuld</span></div>
    <div className="editor-explanation"><strong>Je wijzigingen worden automatisch in deze browser bewaard.</strong><p>Vul alleen bevestigde gegevens in die op de openbare website mogen staan. Laat onbekende informatie leeg. Met een lege invoer bevestig je niet dat een voorziening ontbreekt.</p><p>Je voorbeeld is alleen op dit apparaat in deze browser zichtbaar. Download regelmatig je informatiebestand als back-up. Klaar? Stuur het gedownloade bestand hier in het gesprek; daarna publiceren we de gegevens via GitHub. Je foto’s hebben hun eigen fotopakket en blijven behouden.</p></div>
    <div className="editor-toolbar"><div className="editor-buttons"><button type="button" className="button button-dark" onClick={download} disabled={!ready || !count || busy}><Download size={16} aria-hidden="true" />Download informatiebestand</button><label className="editor-import">Importeer informatiebestand<input type="file" accept=".json,application/json" disabled={!ready || busy} onChange={(event) => void restore(event)} /></label><button type="button" className="button button-plain" disabled={!ready || busy} aria-pressed={preview} onClick={() => setPreview(!preview)}><Eye size={16} aria-hidden="true" />{preview ? "Informatievoorbeeld staat aan" : "Informatievoorbeeld aanzetten"}</button></div><p className="editor-save-status" role="status" aria-live="polite">{!ready ? "Bewaarde informatie laden…" : busy ? "Informatiebestand verwerken…" : error ? "Opslaan is niet gelukt; download je informatie als back-up." : count ? "Informatie bewaard in deze browser" : "Nog geen lokale wijzigingen"}</p></div>
    {error && <p className="editor-error editor-alert" role="alert">{error}</p>}{actionError && <p className="editor-error editor-alert" role="alert" ref={alert} tabIndex={-1}>{actionError}</p>}{notice && <p role="status" className="editor-notice">{notice}</p>}
    <div className="information-preview-links"><Link href="/bezoekersinformatie">Bekijk bezoekersinformatie<Eye size={15} aria-hidden="true" /></Link><Link href="/over-de-vijfhoek#beheer">Bekijk beheer & contact<Eye size={15} aria-hidden="true" /></Link></div>
    <div className="information-editor-groups">{groups.map((group) => <fieldset className="information-group" key={group} disabled={!ready || busy}><legend>{group}</legend><div className="information-fields">{visitorFields.filter((field) => field.group === group).map((field) => {
      const value = drafts[field.id] ?? publishedVisitorInfo[field.id];
      const changed = Object.hasOwn(drafts, field.id);
      const inputId = `info-${field.id}`;
      return <div className={`information-field${field.type === "textarea" ? " information-field-wide" : ""}`} key={field.id} data-info-field={field.id}>
        <label htmlFor={inputId}>{field.label}</label>
        <p id={`${inputId}-hint`} className="editor-hint">{field.hint}</p>
        {field.type === "textarea" ? <textarea id={inputId} rows={4} maxLength={field.maxLength} value={value} aria-describedby={`${inputId}-hint`} onChange={(event) => update(field.id, event.target.value)} /> : <input id={inputId} type={field.type} maxLength={field.maxLength} value={value} autoComplete="off" aria-describedby={`${inputId}-hint`} onChange={(event) => update(field.id, event.target.value)} />}
        <div className="information-field-footer"><span>{changed ? "Lokaal aangepast" : value ? "Gepubliceerd" : "Nog leeg"}</span>{changed && <button type="button" aria-label={`Herstel ${field.label}`} onClick={() => reset(field.id)}><Undo2 size={13} aria-hidden="true" />Herstel gepubliceerd</button>}</div>
      </div>;
    })}</div></fieldset>)}</div>
  </div>;
}
