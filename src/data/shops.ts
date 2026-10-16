import { getShopUnitLabel } from "./shop-units";

export const categories = [
  { id: "supermarkt", label: "Supermarkt" },
  { id: "drogisterij", label: "Drogisterij" },
  { id: "mode", label: "Mode" },
  { id: "schoenen", label: "Schoenen" },
  { id: "huishoudelijk", label: "Huishoudelijk" },
  { id: "boeken-en-diensten", label: "Boeken & diensten" },
  { id: "eten-en-drinken", label: "Eten & drinken" },
  { id: "dranken", label: "Dranken" },
  { id: "gezondheid", label: "Gezondheid" },
] as const;

export type CategoryId = typeof categories[number]["id"];
export type Shop = {
  slug: string;
  name: string;
  // Compact kaartlabel; zoekresultaten en detailpagina houden de volledige naam.
  mapLabel?: string;
  categoryLabel: string;
  categories: CategoryId[];
  description: string;
  photo: string | null;
  logo: string | null;
  address: string | null;
  unit: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  openingHours: { day: string; hours: string }[] | null;
  facilities: string[] | null;
};

// Alleen door de opdrachtgever bevestigde namen. Null betekent: nog te
// bevestigen. Adressen uit de aangeleverde lijst staan expliciet bij de winkel;
// leid nooit een postadres af uit alleen een unitnummer.
const unconfirmed = {
  photo: null, logo: null, address: null, unit: null, phone: null, email: null,
  website: null, openingHours: null, facilities: null,
};

const confirmedShops: Shop[] = [
  { ...unconfirmed, slug: "albert-heijn", name: "Albert Heijn", address: "In den Vijfhoek 1", categoryLabel: "Supermarkt", categories: ["supermarkt"], description: "Albert Heijn in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "action", name: "Action", categoryLabel: "Huishoudelijk", categories: ["huishoudelijk"], description: "Action in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "kruidvat", name: "Kruidvat", categoryLabel: "Drogisterij", categories: ["drogisterij"], description: "Kruidvat in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "wibra", name: "Wibra", address: "In den Vijfhoek 33-35", categoryLabel: "Huishoudelijk", categories: ["huishoudelijk"], description: "Wibra in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "scapino", name: "Scapino", address: "In den Vijfhoek 17-19", categoryLabel: "Schoenen & mode", categories: ["schoenen", "mode"], description: "Scapino in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "bibliotheek-oldenzaal", name: "Bibliotheek Oldenzaal", categoryLabel: "Boeken & diensten", categories: ["boeken-en-diensten"], description: "Bibliotheek Oldenzaal in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan de bibliotheek." },
  { ...unconfirmed, slug: "bakkerij-nollen", name: "Bakkerij Nollen", address: "In den Vijfhoek 9", categoryLabel: "Bakkerij", categories: ["eten-en-drinken"], description: "Bakkerij Nollen in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "gall-en-gall", name: "Gall & Gall", categoryLabel: "Slijterij", categories: ["dranken"], description: "Gall & Gall in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "gw-rozemarijn", name: "G&W Gezondheidswinkel Rozemarijn", mapLabel: "G&W Rozemarijn", address: "In den Vijfhoek 13", categoryLabel: "Gezondheidswinkel", categories: ["gezondheid"], description: "G&W Gezondheidswinkel Rozemarijn in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "hebbez-ik-wil-mode", name: "Hebbez | Ik wil Mode", mapLabel: "Hebbez", categoryLabel: "Mode", categories: ["mode"], description: "Hebbez | Ik wil Mode in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  // Voor deze twee namen is nog geen specifieke branche bevestigd.
  { ...unconfirmed, slug: "t-glashoes", name: "'t Glashoes", categoryLabel: "Winkel", categories: [], description: "'t Glashoes in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek." },
  { ...unconfirmed, slug: "candy-corner", name: "Candy Corner", categoryLabel: "Winkel", categories: [], description: "Candy Corner in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
];

export const shops: Shop[] = confirmedShops.map((shop) => ({ ...shop, unit: getShopUnitLabel(shop.slug) }));

export function getShop(slug: string) { return shops.find((shop) => shop.slug === slug); }
