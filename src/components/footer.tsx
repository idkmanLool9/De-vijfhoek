import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { navigation } from "@/data/navigation";
import { CentreContactInfo } from "./visitor-information";

export function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-grid"><div><Brand /><p className="footer-description">Alles dichtbij.<br />Midden in Oldenzaal.</p></div>
      <div><h2>Ontdek De Vijfhoek</h2><nav aria-label="Footernavigatie">{navigation.map(({ href, label }) => <Link key={href} href={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}</nav></div>
      <div><h2>Een bezoek begint hier</h2><p className="muted">Winkels, voorzieningen en praktische informatie op één plek.</p><Link className="text-link" href="/bezoekersinformatie">Plan je bezoek<ArrowUpRight size={15} aria-hidden="true" /></Link><CentreContactInfo compact /></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} De Vijfhoek Oldenzaal</span><span>Website in ontwikkeling.</span></div>
  </div></footer>;
}
