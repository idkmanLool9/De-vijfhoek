"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useVisitorInfoEditor } from "./visitor-info-provider";

export function VisitorInfoPreviewNotice() {
  const { preview, drafts, setPreview } = useVisitorInfoEditor();
  const pathname = usePathname();
  if (!preview || !Object.keys(drafts).length || pathname === "/bewerken" || pathname.startsWith("/bewerken/")) return null;
  return <aside className="media-preview-notice" aria-label="Lokale informatievoorvertoning"><div className="container"><p><strong>Lokale informatievoorvertoning</strong><span>Alleen zichtbaar in deze browser. Nog niet gepubliceerd.</span></p><div><Link href="/bewerken/informatie">Informatie bewerken</Link><button type="button" onClick={() => setPreview(false)}>Informatievoorbeeld uitzetten</button></div></div></aside>;
}
