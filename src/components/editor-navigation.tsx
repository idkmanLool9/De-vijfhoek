"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function EditorNavigation() {
  const pathname = usePathname().replace(/\/$/, "");
  return <nav className="container editor-navigation" aria-label="Bewerkmodus"><Link href="/bewerken" aria-current={pathname === "/bewerken" ? "page" : undefined}>Foto’s & logo’s</Link><Link href="/bewerken/informatie" aria-current={pathname === "/bewerken/informatie" ? "page" : undefined}>Bezoekersinformatie</Link></nav>;
}
