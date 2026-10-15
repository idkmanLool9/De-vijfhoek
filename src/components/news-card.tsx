import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, type NewsEntry } from "@/data/news";
import { PhotoPlaceholder } from "./ui";

export function NewsCard({ entry }: { entry: NewsEntry }) {
  return <article className="news-card"><Link href={`/nieuws/${entry.slug}`}>
    <PhotoPlaceholder label={entry.photoAlt || entry.title} mediaId={`nieuws-${entry.slug}`} src={entry.photo} />
    <div className="news-card-body"><span className="badge">{entry.category === "evenement" ? "Evenement" : "Nieuws"}</span><h2>{entry.title}</h2><p className="news-date"><time dateTime={entry.publishedAt}>{formatDate(entry.publishedAt)}</time></p><p>{entry.summary}</p><span className="text-link">Lees meer<ArrowRight size={15} aria-hidden="true" /></span></div>
  </Link></article>;
}
