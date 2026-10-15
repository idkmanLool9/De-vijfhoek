// Research leads supplied by the owner, NOT approved map allocations.
// Addresses still need current official verification; an address alone cannot
// establish which outline belongs to a unit. Keep this file out of client UI.
export const mapAllocationCandidates = [
  { unitNumbers: ["141"], shopName: "Action", shopSlug: "action" },
  { unitNumbers: ["1"], shopName: "Albert Heijn", shopSlug: "albert-heijn" },
  { unitNumbers: ["15"], shopName: "Kruidvat", shopSlug: "kruidvat" },
  { unitNumbers: ["17", "19"], shopName: "Scapino", shopSlug: "scapino" },
  { unitNumbers: ["9"], shopName: "Bakkerij Nollen", shopSlug: null },
  { unitNumbers: ["5"], shopName: "Gall & Gall", shopSlug: null },
  { unitNumbers: ["33", "35"], shopName: "Wibra", shopSlug: "wibra" },
  { unitNumbers: ["75"], shopName: "Bibliotheek Oldenzaal", shopSlug: "bibliotheek-oldenzaal" },
].map((candidate) => ({ ...candidate, status: "requires-verification" as const }));
