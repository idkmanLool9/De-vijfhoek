import type { Shop } from "@/data/shops";

export const centreGoogleQuery = "Winkelcentrum In den Vijfhoek Oldenzaal";

export function shopGoogleQuery(shop: Pick<Shop, "name" | "address">) {
  return `${shop.name.replace(/\s*\|\s*/g, " ")} ${shop.address ?? "Winkelcentrum In den Vijfhoek"} Oldenzaal`;
}

export function googleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
}

export function googleDirections(destination: string, travelmode?: "driving" | "bicycling" | "transit" | "walking") {
  const params = new URLSearchParams({ api: "1", destination });
  if (travelmode) params.set("travelmode", travelmode);
  return `https://www.google.com/maps/dir/?${params}`;
}

export function googleReviews(query: string) {
  return `https://www.google.com/search?${new URLSearchParams({ q: `${query} reviews` })}`;
}

export const centreMapEmbed = `https://www.google.com/maps?${new URLSearchParams({ q: centreGoogleQuery, output: "embed", hl: "nl" })}`;
