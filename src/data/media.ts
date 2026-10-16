import savedMedia from "./media.json";
import { shops } from "./shops";
import { getPublishedNews } from "./news";
import type { MediaAsset } from "@/lib/media-schema";

export const publishedMedia: Record<string, MediaAsset> = savedMedia;

export const mediaSlots = [
  { id: "centrum-logo", label: "Logo De Vijfhoek", group: "Centrum & homepage", route: "/", hint: "Officieel logo, bij voorkeur een transparante PNG. Wordt in header en footer gebruikt.", kind: "logo" },
  { id: "centrum-hero", label: "Grote centrumfoto", group: "Centrum & homepage", route: "/", hint: "Brede liggende foto, bij voorkeur minimaal 2000 pixels breed. Ook gebruikt bovenaan de andere pagina’s.", kind: "photo" },
  { id: "home-winkels", label: "Homepage · Winkels", group: "Centrum & homepage", route: "/", hint: "Liggende centrum- of winkelfoto voor de eerste navigatiekaart.", kind: "photo" },
  { id: "home-eten", label: "Homepage · Eten & drinken", group: "Centrum & homepage", route: "/", hint: "Officiële liggende foto voor de tweede navigatiekaart.", kind: "photo" },
  { id: "home-bezoek", label: "Homepage · Bezoekersinfo", group: "Centrum & homepage", route: "/", hint: "Liggende centrumfoto voor de derde navigatiekaart.", kind: "photo" },
  { id: "over-centrum", label: "Bezoekersinfo · centrumfoto", group: "Overige pagina’s", route: "/bezoekersinformatie#bereikbaarheid", hint: "Centrumfoto naast de bereikbaarheid. De bestaande fotokeuze blijft behouden; op Over De Vijfhoek staat Google Maps.", kind: "photo" },
  { id: "eten-foto", label: "Eten & drinken · foto", group: "Overige pagina’s", route: "/eten-en-drinken", hint: "Gebruik een aangeleverde officiële foto. Deze keuze voegt geen onbevestigde horecazaken toe.", kind: "photo" },
  ...shops.flatMap((shop) => [
    { id: `winkel-${shop.slug}-foto`, label: `${shop.name} · winkelfoto`, group: "Winkels", route: `/winkels/${shop.slug}`, hint: "Dezelfde foto verschijnt in de winkelgids en op de detailpagina.", kind: "photo" },
    { id: `winkel-${shop.slug}-logo`, label: `${shop.name} · logo`, group: "Winkels", route: `/winkels/${shop.slug}`, hint: "Officieel winkellogo, bij voorkeur als transparante PNG.", kind: "logo" },
  ]),
  ...getPublishedNews().map((entry) => ({ id: `nieuws-${entry.slug}`, label: `${entry.title} · foto`, group: "Nieuws", route: `/nieuws/${entry.slug}`, hint: "Officiële foto bij dit gepubliceerde bericht.", kind: "photo" })),
];
