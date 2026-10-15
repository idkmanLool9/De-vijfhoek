export type FloorId = "ground" | "first";
export type Point = { x: number; y: number };
export type MapBounds = Point & { width: number; height: number };

export type MapGeometry = {
  path: string;
  label: Point;
  bounds: MapBounds;
};

export type MapUnit = {
  id: string;
  unitNumber: string;
  // Publish a shop allocation only after its location has been checked.
  shopSlug: string | null;
  geometry: MapGeometry | null;
};
export type PlacedMapUnit = MapUnit & { geometry: MapGeometry };

export type FloorPlan = {
  id: string;
  label: string;
  floor: FloorId | null;
  source: string;
  viewBox: MapBounds;
  // Preserve the original walls and proportions as the SVG's base layer.
  // Interactive paths overlay the exact source; they are not replacement walls.
  sourceImage: { src: string; width: number; height: number } | null;
  units: MapUnit[];
};

export const mapFloors: { id: FloorId; label: string }[] = [
  { id: "ground", label: "Begane grond" },
  { id: "first", label: "Eerste verdieping" },
];

// These official numbers were supplied by the owner. The cleaned image has no
// unit labels, so it cannot establish their boundaries or tenant positions.
// Geometry stays empty until the numbered original is supplied. Do not infer a
// floor for the complete drawing from a floor label on a particular section.
export const floorPlans: FloorPlan[] = [{
  id: "overview",
  label: "Volledige vastgoedplattegrond",
  floor: null,
  source: "Door de opdrachtgever aangeleverde vastgoedplattegrond",
  viewBox: { x: 0, y: 0, width: 1254, height: 1254 },
  sourceImage: null,
  units: ["1", "5", "9", "15", "17", "19", "33", "35", "75", "141"].map((unitNumber) => ({
    id: `unit-${unitNumber}`,
    unitNumber,
    shopSlug: null,
    geometry: null,
  })),
}];

export function isPlacedMapUnit(unit: MapUnit): unit is PlacedMapUnit {
  return unit.geometry !== null;
}
