export type NewsEntry = {
  slug: string;
  title: string;
  summary: string;
  paragraphs: string[];
  category: "nieuws" | "evenement";
  publishedAt: string;
  status: "draft" | "published";
  verified: boolean;
  photo: string | null;
  photoAlt: string | null;
  event: { dateLabel: string; location: string | null } | null;
};

// Voeg uitsluitend redactioneel bevestigde berichten toe. De gebeurtenissen,
// data en eigendomsinformatie in de ontwerpreferentie zijn geen brongegevens.
export const newsEntries: NewsEntry[] = [];
export function getPublishedNews() {
  return newsEntries.filter((entry) => entry.verified && entry.status === "published").sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export function getNewsEntry(slug: string) { return getPublishedNews().find((entry) => entry.slug === slug); }
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" }).format(new Date(date));
}
