// Door de opdrachtgever bevestigde winkel↔unitkoppelingen. De contouren zijn
// afzonderlijk gecontroleerd met de aangeleverde genummerde vastgoedtekening.
export const shopUnitAllocations = [
  { shopSlug: "action", unitNumbers: ["141"] },
  { shopSlug: "albert-heijn", unitNumbers: ["1"] },
  { shopSlug: "kruidvat", unitNumbers: ["15"] },
  { shopSlug: "scapino", unitNumbers: ["17", "19"] },
  { shopSlug: "bakkerij-nollen", unitNumbers: ["9"] },
  { shopSlug: "gw-rozemarijn", unitNumbers: ["13"] },
  { shopSlug: "gall-en-gall", unitNumbers: ["5"] },
  { shopSlug: "wibra", unitNumbers: ["33", "35"] },
  { shopSlug: "bibliotheek-oldenzaal", unitNumbers: ["75"] },
  { shopSlug: "candy-corner", unitNumbers: ["25"] },
  { shopSlug: "t-glashoes", unitNumbers: ["49"] },
] as const;

export function getShopUnitLabel(slug: string): string | null {
  const numbers = getShopUnitNumbers(slug);
  if (!numbers.length) return null;
  return `${numbers.length === 1 ? "Unit" : "Units"} ${numbers.join(" en ")}`;
}

export function getShopUnitNumbers(slug: string): readonly string[] {
  return shopUnitAllocations.find((item) => item.shopSlug === slug)?.unitNumbers ?? [];
}
