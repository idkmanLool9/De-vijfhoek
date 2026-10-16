import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MediaProvider } from "@/components/media-provider";
import { MediaPreviewNotice } from "@/components/media-preview-notice";
import { NavigationScroll } from "@/components/navigation-scroll";
import { VisitorInfoProvider } from "@/components/visitor-info-provider";
import { VisitorInfoPreviewNotice } from "@/components/visitor-info-preview-notice";
import "./globals.css";
import "./information.css";

export const metadata: Metadata = {
  title: { default: "De Vijfhoek Oldenzaal | Alles dichtbij", template: "%s | De Vijfhoek Oldenzaal" },
  description: "Ontdek de winkels en voorzieningen van Winkelcentrum In den Vijfhoek in Oldenzaal en bereid je bezoek voor.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl" data-scroll-behavior="smooth"><body>
    <a className="skip-link" href="#inhoud">Ga naar inhoud</a>
    <MediaProvider><VisitorInfoProvider><MediaPreviewNotice /><VisitorInfoPreviewNotice /><Header /><main id="inhoud" tabIndex={-1}>{children}</main><Footer /></VisitorInfoProvider></MediaProvider><NavigationScroll />
  </body></html>;
}
