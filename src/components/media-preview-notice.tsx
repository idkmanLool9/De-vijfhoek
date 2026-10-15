"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaEditor } from "./media-provider";

export function MediaPreviewNotice() {
  const { preview, drafts, setPreview } = useMediaEditor();
  const pathname = usePathname();
  if (!preview || !Object.keys(drafts).length || pathname === "/bewerken" || pathname === "/bewerken/") return null;
  return <aside className="media-preview-notice" aria-label="Lokale fotovoorvertoning"><div className="container">
    <p><strong>Lokale fotovoorvertoning</strong><span>Alleen zichtbaar in deze browser. Nog niet gepubliceerd.</span></p>
    <div><Link href="/bewerken">Foto’s bewerken</Link><button type="button" onClick={() => void setPreview(false)}>Voorbeeld uitzetten</button></div>
  </div></aside>;
}
