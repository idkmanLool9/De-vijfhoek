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
] as const;

export type CategoryId = typeof categories[number]["id"];
export type Shop = {
  slug: string;
  name: string;
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
// bevestigen. Vul vestigingsgegevens en officiële media pas na verificatie in.
const unconfirmed = {
  photo: null, logo: null, address: null, unit: null, phone: null, email: null,
  website: null, openingHours: null, facilities: null,
};

const confirmedShops: Shop[] = [
  { ...unconfirmed, slug: "albert-heijn", name: "Albert Heijn", categoryLabel: "Supermarkt", categories: ["supermarkt"], description: "Albert Heijn in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "action", name: "Action", categoryLabel: "Huishoudelijk", categories: ["huishoudelijk"], description: "Action in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "kruidvat", name: "Kruidvat", categoryLabel: "Drogisterij", categories: ["drogisterij"], description: "Kruidvat in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "wibra", name: "Wibra", categoryLabel: "Huishoudelijk", categories: ["huishoudelijk"], description: "Wibra in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "scapino", name: "Scapino", categoryLabel: "Schoenen & mode", categories: ["schoenen", "mode"], description: "Scapino in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "bibliotheek-oldenzaal", name: "Bibliotheek Oldenzaal", categoryLabel: "Boeken & diensten", categories: ["boeken-en-diensten"], description: "Bibliotheek Oldenzaal in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan de bibliotheek." },
  { ...unconfirmed, slug: "bakkerij-nollen", name: "Bakkerij Nollen", categoryLabel: "Bakkerij", categories: ["eten-en-drinken"], description: "Bakkerij Nollen in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
  { ...unconfirmed, slug: "gall-en-gall", name: "Gall & Gall", categoryLabel: "Slijterij", categories: ["dranken"], description: "Gall & Gall in De Vijfhoek. Hier vind je de beschikbare informatie voor je bezoek aan deze winkel." },
];

export const shops: Shop[] = confirmedShops.map((shop) => ({ ...shop, unit: getShopUnitLabel(shop.slug) }));

export function getShop(slug: string) { return shops.find((shop) => shop.slug === slug); }
