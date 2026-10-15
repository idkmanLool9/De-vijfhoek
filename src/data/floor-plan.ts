import unitGeometry from "./floor-plan-geometry.json";
import { shopUnitAllocations } from "./shop-units";

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
  // Null for units whose occupant has not been confirmed by the owner.
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

// Display the supplied SVG unchanged, including its original coordinate system.
// Unit identities come from the owner's numbered reference. Interactive paths
// follow the interiors of the existing walls in the unchanged cleaned image,
// including columns and enclosed rooms as holes (even-odd fill). They do not
// replace any wall. Unnumbered detached sections remain without allocations.
// Do not infer a floor for the whole drawing from a local floor annotation.
export const floorPlans: FloorPlan[] = [{
  id: "overview",
  label: "Volledige vastgoedplattegrond",
  floor: null,
  source: "Door de opdrachtgever aangeleverde vastgoedplattegrond",
  viewBox: { x: 0, y: 0, width: 1286.25, height: 1284.749967 },
  sourceImage: { src: "/maps/de-vijfhoek-vastgoedplattegrond.svg", width: 1286.25, height: 1284.749967 },
  units: Object.entries(unitGeometry).map(([unitNumber, geometry]) => ({
    id: `unit-${unitNumber}`,
    unitNumber,
    shopSlug: shopUnitAllocations.find((allocation) => (allocation.unitNumbers as readonly string[]).includes(unitNumber))?.shopSlug ?? null,
    geometry,
  })),
}];

export function isPlacedMapUnit(unit: MapUnit): unit is PlacedMapUnit {
  return unit.geometry !== null;
}
