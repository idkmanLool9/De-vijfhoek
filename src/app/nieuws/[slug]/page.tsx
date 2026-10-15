import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { ActionLink, Breadcrumbs, PhotoPlaceholder } from "@/components/ui";
import { getNewsEntry, getPublishedNews, formatDate } from "@/data/news";
import { assetPath } from "@/lib/paths";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  const params = getPublishedNews().map(({ slug }) => ({ slug }));
  // Next's static export requires a validation path even when no news exists.
  // The page calls notFound() for this path, so no article is published.
  return params.length ? params : [{ slug: "__no-published-news__" }];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getNewsEntry((await params).slug);
  return entry ? { title: entry.title, description: entry.summary, openGraph: { type: "article", title: entry.title, description: entry.summary, publishedTime: entry.publishedAt } } : { title: "Bericht niet gevonden" };
}

export default async function NewsDetailPage({ params }: Props) {
  const entry = getNewsEntry((await params).slug);
  if (!entry) notFound();
  return <div className="container page-content"><Breadcrumbs items={[{ label: "Nieuws & evenementen", href: "/nieuws" }, { label: entry.title }]} />
    <article className="article"><header><span className="badge">{entry.category === "evenement" ? "Evenement" : "Nieuws"}</span><h1>{entry.title}</h1><p className="news-date">Gepubliceerd op <time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time></p><p className="article-lead">{entry.summary}</p></header>
      {entry.photo ? <div className="official-photo article-photo"><Image src={assetPath(entry.photo)} alt={entry.photoAlt || entry.title} fill sizes="(max-width: 800px) 100vw, 800px" /></div> : <PhotoPlaceholder label={entry.title} className="article-photo" />}
      {entry.event && <div className="event-details"><p><CalendarDays size={19} aria-hidden="true" />{entry.event.dateLabel}</p>{entry.event.location && <p><MapPin size={19} aria-hidden="true" />{entry.event.location}</p>}</div>}
      <div className="article-copy">{entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <ActionLink href="/nieuws" variant="plain">Alle nieuws & evenementen</ActionLink>
    </article>
  </div>;
}
