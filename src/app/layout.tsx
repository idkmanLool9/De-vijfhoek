import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "De Vijfhoek Oldenzaal | Alles dichtbij", template: "%s | De Vijfhoek Oldenzaal" },
  description: "Ontdek de winkels en voorzieningen van Winkelcentrum In den Vijfhoek in Oldenzaal en bereid je bezoek voor.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>
    <a className="skip-link" href="#inhoud">Ga naar inhoud</a>
    <Header /><main id="inhoud" tabIndex={-1}>{children}</main><Footer />
  </body></html>;
}
