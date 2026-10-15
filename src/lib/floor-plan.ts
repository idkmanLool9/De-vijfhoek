import type { MapBounds, MapUnit, PlacedMapUnit, Point } from "../data/floor-plan";
import type { Shop } from "../data/shops";

export type MapCamera = { zoom: number; x: number; y: number };
export const initialCamera: MapCamera = { zoom: 1, x: 0, y: 0 };
export const maxMapZoom = 5;

export function normalizeMapSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("nl");
}

export function mapUnitName(unit: MapUnit, shop?: Shop) {
  return shop?.name ?? `Unit ${unit.unitNumber}`;
}

export function matchesMapUnit(unit: MapUnit, query: string, shop?: Shop) {
  const haystack = normalizeMapSearch([`Unit ${unit.unitNumber}`, shop?.name].filter(Boolean).join(" "));
  return haystack.includes(normalizeMapSearch(query));
}

export function clampCamera(camera: MapCamera, bounds: MapBounds): MapCamera {
  const zoom = Math.max(1, Math.min(maxMapZoom, camera.zoom));
  const marginX = bounds.width * .15;
  const marginY = bounds.height * .15;
  return {
    zoom,
    x: Math.max(bounds.x * (1 - zoom) + bounds.width * (1 - zoom) - marginX, Math.min(bounds.x * (1 - zoom) + marginX, camera.x)),
    y: Math.max(bounds.y * (1 - zoom) + bounds.height * (1 - zoom) - marginY, Math.min(bounds.y * (1 - zoom) + marginY, camera.y)),
  };
}

export function zoomCamera(camera: MapCamera, zoom: number, anchor: Point, bounds: MapBounds) {
  const nextZoom = Math.max(1, Math.min(maxMapZoom, zoom));
  if (nextZoom === 1) return { ...initialCamera };
  return clampCamera({ zoom: nextZoom, x: anchor.x - (anchor.x - camera.x) * nextZoom / camera.zoom, y: anchor.y - (anchor.y - camera.y) * nextZoom / camera.zoom }, bounds);
}

export function revealMapUnit(camera: MapCamera, unit: PlacedMapUnit, bounds: MapBounds) {
  const zoom = Math.max(camera.zoom, Math.min(3.5, bounds.width / (unit.geometry.bounds.width * 2), bounds.height / (unit.geometry.bounds.height * 2)));
  return clampCamera({
    zoom,
    x: bounds.x + bounds.width / 2 - (unit.geometry.bounds.x + unit.geometry.bounds.width / 2) * zoom,
    y: bounds.y + bounds.height / 2 - (unit.geometry.bounds.y + unit.geometry.bounds.height / 2) * zoom,
  }, bounds);
}

export function neighboringUnit(units: PlacedMapUnit[], current: PlacedMapUnit, direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown") {
  const horizontal = direction === "ArrowLeft" || direction === "ArrowRight";
  const sign = direction === "ArrowLeft" || direction === "ArrowUp" ? -1 : 1;
  return units.filter((unit) => {
    const delta = horizontal ? unit.geometry.label.x - current.geometry.label.x : unit.geometry.label.y - current.geometry.label.y;
    return unit.id !== current.id && delta * sign > 1;
  }).sort((a, b) => {
    function score(unit: PlacedMapUnit) {
      const dx = Math.abs(unit.geometry.label.x - current.geometry.label.x);
      const dy = Math.abs(unit.geometry.label.y - current.geometry.label.y);
      return horizontal ? dx + dy * 2 : dy + dx * 2;
    }
    return score(a) - score(b);
  })[0];
}
