// Door de opdrachtgever bevestigde winkel↔unitkoppelingen. De contouren zijn
// afzonderlijk gecontroleerd met de aangeleverde genummerde vastgoedtekening.
export const shopUnitAllocations = [
  { shopSlug: "action", unitNumbers: ["141"] },
  { shopSlug: "albert-heijn", unitNumbers: ["1"] },
  { shopSlug: "kruidvat", unitNumbers: ["15"] },
  { shopSlug: "scapino", unitNumbers: ["17", "19"] },
  { shopSlug: "bakkerij-nollen", unitNumbers: ["9"] },
  { shopSlug: "gall-en-gall", unitNumbers: ["5"] },
  { shopSlug: "wibra", unitNumbers: ["33", "35"] },
  { shopSlug: "bibliotheek-oldenzaal", unitNumbers: ["75"] },
] as const;

export function getShopUnitLabel(slug: string): string | null {
  const allocation = shopUnitAllocations.find((item) => item.shopSlug === slug);
  if (!allocation) return null;
  return `${allocation.unitNumbers.length === 1 ? "Unit" : "Units"} ${allocation.unitNumbers.join(" en ")}`;
}
