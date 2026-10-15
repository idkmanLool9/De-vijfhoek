import type { Metadata } from "next";
import { Breadcrumbs, PageHero } from "@/components/ui";
import { ShopDirectory } from "@/components/shop-directory";
import { shops } from "@/data/shops";

export const metadata: Metadata = { title: "Winkels", description: "Zoek winkels en voorzieningen in De Vijfhoek Oldenzaal. Filter op categorie en bekijk de beschikbare winkelinformatie." };

export default function ShopsPage() {
  return <><PageHero title="Winkels" description="Ontdek de winkels en voorzieningen in De Vijfhoek." /><div className="container page-content"><Breadcrumbs items={[{ label: "Winkels" }]} /><ShopDirectory shops={shops} /><p className="content-note">Deze gids toont de tot nu toe bevestigde winkels en voorzieningen. Het overzicht wordt aangevuld.</p></div></>;
}
