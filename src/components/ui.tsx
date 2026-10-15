import Link from "next/link";
import { ArrowRight, ChevronRight, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";
import { MediaImage, MediaHero, MediaPending } from "./media-image";

export function ActionLink({ href, children, variant = "dark", className = "" }: {
  href: string; children: ReactNode; variant?: "dark" | "light" | "outline" | "plain"; className?: string;
}) {
  return <Link href={href} className={`button button-${variant} ${className}`}>
    {children}<ArrowRight size={16} aria-hidden="true" />
  </Link>;
}

export function PhotoPlaceholder({ label, dark = false, className = "", mediaId, src }: {
  label: string; dark?: boolean; className?: string; mediaId?: string; src?: string | null;
}) {
  const placeholder = <div className={`photo-placeholder ${dark ? "photo-dark" : ""} ${className}`} role="img" aria-label={`Fotoplaceholder: ${label}`}>
    <ImageIcon size={24} strokeWidth={1.25} aria-hidden="true" />
    <span>{label}<small>Officiële foto volgt</small></span>
  </div>;
  return mediaId ? <MediaImage id={mediaId} fallbackSrc={src} alt={label} className={`official-photo ${className}`} fallback={placeholder} /> : placeholder;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Kruimelpad" className="breadcrumbs">
    <ol><li><Link href="/">Home</Link></li>{items.map((item) => <li key={item.label}>
      <ChevronRight size={13} aria-hidden="true" />
      {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
    </li>)}</ol>
  </nav>;
}

export function PageHero({ title, description }: { title: string; description: string }) {
  return <MediaHero className="page-hero">
    <div className="container"><h1>{title}</h1><p>{description}</p>
      <MediaPending id="centrum-hero"><span className="hero-photo-label"><ImageIcon size={14} aria-hidden="true" /> Officiële centrumfoto volgt</span></MediaPending>
    </div>
  </MediaHero>;
}

export function SectionHeading({ eyebrow, title, description, children }: {
  eyebrow?: string; title: string; description?: string; children?: ReactNode;
}) {
  return <div className="section-heading"><div>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p className="muted">{description}</p>}
  </div>{children}</div>;
}
