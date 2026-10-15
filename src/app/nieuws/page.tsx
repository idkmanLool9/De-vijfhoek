import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "@/components/ui";
import { NewsOverview } from "@/components/news-overview";
import { getPublishedNews } from "@/data/news";

export const metadata: Metadata = { title: "Nieuws & evenementen", description: "Bevestigde nieuwsberichten en evenementen van De Vijfhoek in Oldenzaal." };

export default function NewsPage() {
  return <><PageHero title="Nieuws & evenementen" description="Blijf op de hoogte van wat er speelt in De Vijfhoek." /><div className="container page-content"><Breadcrumbs items={[{ label: "Nieuws & evenementen" }]} /><NewsOverview entries={getPublishedNews()} /></div></>;
}
