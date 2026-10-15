"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./brand";
import { navigation } from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    }
    function onPointerDown(event: PointerEvent) {
      if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onPointerDown); };
  }, [open]);

  function close() { setOpen(false); }
  return <header className="site-header"><div className="container header-inner">
    <Brand />
    <nav className="desktop-nav" aria-label="Hoofdnavigatie">{navigation.map(({ href, label }) =>
      <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}</Link>
    )}</nav>
    <div className="header-actions">
      <Link href="/winkels#zoeken" className="icon-button desktop-search" aria-label="Zoek een winkel"><Search size={19} aria-hidden="true" /></Link>
      <Link href="/bezoekersinformatie" className="button button-dark header-visit">Plan je bezoek<ArrowRight size={15} aria-hidden="true" /></Link>
      <button type="button" className="icon-button menu-toggle" ref={toggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Menu sluiten" : "Menu openen"} onClick={() => setOpen(!open)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </div>
    <div id="mobile-navigation" className="mobile-menu" ref={menu} hidden={!open}>
      <nav aria-label="Mobiele hoofdnavigatie">{navigation.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={pathname.startsWith(href) ? "page" : undefined}>{label}<ArrowRight size={16} aria-hidden="true" /></Link>)}
        <Link href="/winkels#zoeken" onClick={close}>Zoek een winkel<Search size={17} aria-hidden="true" /></Link>
      </nav>
    </div>
  </div></header>;
}
