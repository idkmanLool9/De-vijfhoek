"use client";

import { useCallback, useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent, type Ref } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Maximize2, Minus, Plus } from "lucide-react";
import { isPlacedMapUnit, type FloorPlan, type PlacedMapUnit, type Point } from "@/data/floor-plan";
import type { Shop } from "@/data/shops";
import { clampCamera, initialCamera, mapUnitName, maxMapZoom, neighboringUnit, revealMapUnit, zoomCamera, type MapCamera } from "@/lib/floor-plan";
import { assetPath } from "@/lib/paths";

export type MapCanvasHandle = { reveal: (unit: PlacedMapUnit) => void };
type Drag = { pointerId: number; start: Point; camera: MapCamera; moved: boolean };

function labelLines(name: string): string[] {
  return name.split(" ").reduce<string[]>((lines, word) => {
    const last = lines.at(-1);
    if (last && `${last} ${word}`.length <= 12) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
    return lines;
  }, []);
}

export function MapCanvas({ plan, shops, selectedId, matchingIds, onSelect, canvasRef }: {
  plan: FloorPlan;
  shops: Shop[];
  selectedId: string | null;
  matchingIds: string[] | null;
  onSelect: (id: string | null) => void;
  canvasRef?: Ref<MapCanvasHandle>;
}) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useRef(new Map<string, SVGPathElement>());
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const cameraRef = useRef<MapCamera>({ ...initialCamera });
  const [camera, setCamera] = useState<MapCamera>({ ...initialCamera });
  const units = plan.units.filter(isPlacedMapUnit);
  const [focusId, setFocusId] = useState(units[0]?.id ?? null);
  const bounds = plan.viewBox;
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };

  const updateCamera = useCallback((update: (previous: MapCamera) => MapCamera) => {
    setCamera((previous) => {
      const next = update(previous);
      cameraRef.current = next;
      return next;
    });
  }, []);

  useImperativeHandle(canvasRef, () => ({
    reveal(unit) {
      setFocusId(unit.id);
      updateCamera((previous) => revealMapUnit(previous, unit, bounds));
    },
  }), [bounds, updateCamera]);

  function svgPoint(clientX: number, clientY: number): Point | null {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    return point.matrixTransform(matrix.inverse());
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function wheel(event: WheelEvent) {
      // Ordinary scrolling keeps moving the page, including on trackpads.
      if (!event.ctrlKey || !svg?.contains(document.activeElement)) return;
      event.preventDefault();
      const point = svgPoint(event.clientX, event.clientY);
      if (point) updateCamera((previous) => zoomCamera(previous, previous.zoom * Math.exp(-event.deltaY * .004), point, bounds));
    }
    svg.addEventListener("wheel", wheel, { passive: false });
    return () => svg.removeEventListener("wheel", wheel);
  }, [bounds, updateCamera]);

  function zoom(factor: number) {
    updateCamera((previous) => zoomCamera(previous, previous.zoom * factor, center, bounds));
  }

  function pan(x: number, y: number) {
    updateCamera((previous) => clampCamera({ ...previous, x: previous.x + x * bounds.width * .12, y: previous.y + y * bounds.height * .12 }, bounds));
  }

  function reset() {
    updateCamera(() => ({ ...initialCamera }));
  }

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    suppressClick.current = false;
    if (event.button !== 0 || cameraRef.current.zoom === 1 || drag.current) return;
    const point = svgPoint(event.clientX, event.clientY);
    if (point) drag.current = { pointerId: event.pointerId, start: point, camera: cameraRef.current, moved: false };
  }

  function pointerMove(event: PointerEvent<SVGSVGElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const point = svgPoint(event.clientX, event.clientY);
    if (!point) return;
    const dx = point.x - current.start.x;
    const dy = point.y - current.start.y;
    // A tap or small tremor must still select the unit, rather than drag it.
    const screenScale = event.currentTarget.getScreenCTM()?.a ?? 1;
    if (!current.moved && Math.hypot(dx, dy) * screenScale < 6) return;
    current.moved = true;
    suppressClick.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateCamera(() => clampCamera({ ...current.camera, x: current.camera.x + dx, y: current.camera.y + dy }, bounds));
  }

  function endPointer(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function focusUnit(unit: PlacedMapUnit) {
    setFocusId(unit.id);
    updateCamera((previous) => {
      const shape = unit.geometry.bounds;
      const x = shape.x * previous.zoom + previous.x;
      const y = shape.y * previous.zoom + previous.y;
      if (x >= bounds.x && y >= bounds.y && x + shape.width * previous.zoom <= bounds.x + bounds.width && y + shape.height * previous.zoom <= bounds.y + bounds.height) return previous;
      return clampCamera({ ...previous, x: center.x - unit.geometry.label.x * previous.zoom, y: center.y - unit.geometry.label.y * previous.zoom }, bounds);
    });
  }

  function unitKeys(event: KeyboardEvent<SVGPathElement>, unit: PlacedMapUnit) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      const next = event.key === "Home" ? units[0] : event.key === "End" ? units.at(-1) : neighboringUnit(units, unit, event.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown");
      if (next) paths.current.get(next.id)?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      onSelect(unit.id);
    }
  }

  function mapKeys(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === "Escape") {
      onSelect(null);
      return;
    }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1.35); }
    else if (event.key === "-") { event.preventDefault(); zoom(1 / 1.35); }
    else if (event.target === event.currentTarget) {
      const directions: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
      if (directions[event.key]) { event.preventDefault(); pan(directions[event.key].x, directions[event.key].y); }
      else if (event.key === "Home") { event.preventDefault(); reset(); }
    }
  }

  return <div className="floor-map-canvas">
    <div className="floor-map-viewport" data-zoom={camera.zoom.toFixed(2)}>
      <svg ref={svgRef} className={`floor-map-svg ${camera.zoom > 1 ? "is-zoomed" : ""}`} viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
        role="group" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description ${id}-help`} tabIndex={0}
        onKeyDown={mapKeys} onPointerDown={pointerDown} onPointerMove={pointerMove}
        onPointerUp={endPointer} onPointerCancel={endPointer} onLostPointerCapture={() => { drag.current = null; }}
        onPointerLeave={() => { if (drag.current && !drag.current.moved) drag.current = null; }}>
        <title id={`${id}-title`}>Interactieve plattegrond — {plan.label}</title>
        <desc id={`${id}-description`}>{units.length ? "Winkelruimtes zijn als knoppen te bedienen. Er zijn geen looproutes of voorzieningen toegevoegd." : "Aangeleverde vastgoedplattegrond met zoom en verplaatsknoppen. Winkelposities op de tekening zijn nog niet bevestigd. Gebruik de zoeklijst voor winkelinformatie."}</desc>
        <g className="floor-map-drawing" transform={`translate(${camera.x} ${camera.y}) scale(${camera.zoom})`}>
          {plan.sourceImage && <image className="floor-map-source" href={assetPath(plan.sourceImage.src)} x={0} y={0} width={plan.sourceImage.width} height={plan.sourceImage.height} aria-hidden="true" />}
          {units.map((unit) => {
            const shop = shops.find((shop) => shop.slug === unit.shopSlug);
            const name = mapUnitName(unit, shop);
            const lines = shop ? labelLines(shop.name) : [];
            return <g key={unit.id} className={`floor-map-unit ${plan.sourceImage ? "has-source" : ""} ${selectedId === unit.id ? "is-selected" : ""} ${matchingIds && !matchingIds.includes(unit.id) ? "is-dimmed" : ""}`}>
              <path ref={(element) => { if (element) paths.current.set(unit.id, element); else paths.current.delete(unit.id); }}
                d={unit.geometry.path} fillRule="evenodd" vectorEffect="non-scaling-stroke" role="button" tabIndex={focusId === unit.id ? 0 : -1}
                data-unit-id={unit.id} aria-label={`${name}${shop ? `, unit ${unit.unitNumber}` : ", winkel nog niet bevestigd"}`}
                aria-pressed={selectedId === unit.id} onFocus={() => focusUnit(unit)} onKeyDown={(event) => unitKeys(event, unit)}
                onClick={() => { if (!suppressClick.current) onSelect(unit.id); }} />
              <text className={shop ? "floor-map-shop-label" : "floor-map-number-label"} x={unit.geometry.label.x} y={unit.geometry.label.y} textAnchor="middle" dominantBaseline="middle" aria-hidden="true">
                {shop ? <>{lines.map((line, index) => <tspan key={index} x={unit.geometry.label.x} y={unit.geometry.label.y + (index - (lines.length - 1) / 2) * 21 - 8}>{line}</tspan>)}<tspan className="floor-map-label-number" x={unit.geometry.label.x} y={unit.geometry.label.y + (lines.length - 1) / 2 * 21 + 15}>Unit {unit.unitNumber}</tspan></> : `Unit ${unit.unitNumber}`}
              </text>
            </g>;
          })}
        </g>
      </svg>
    </div>
    <div className="floor-map-controls">
      <div role="group" aria-label="Zoom en overzicht" className="floor-map-control-group">
        <button type="button" aria-label="Uitzoomen" disabled={camera.zoom <= 1} onClick={() => zoom(1 / 1.35)}><Minus size={18} aria-hidden="true" /></button>
        <output aria-label="Zoomniveau" aria-live="polite">{Math.round(camera.zoom * 100)}%</output>
        <button type="button" aria-label="Inzoomen" disabled={camera.zoom >= maxMapZoom} onClick={() => zoom(1.35)}><Plus size={18} aria-hidden="true" /></button>
        <button type="button" aria-label="Volledige kaart tonen" onClick={reset}><Maximize2 size={17} aria-hidden="true" /></button>
      </div>
      <div role="group" aria-label="Kaart verschuiven" className="floor-map-control-group">
        {([{ label: "Kaart naar links verschuiven", icon: ArrowLeft, x: -1, y: 0 }, { label: "Kaart omhoog verschuiven", icon: ArrowUp, x: 0, y: -1 }, { label: "Kaart omlaag verschuiven", icon: ArrowDown, x: 0, y: 1 }, { label: "Kaart naar rechts verschuiven", icon: ArrowRight, x: 1, y: 0 }]).map(({ label, icon: Icon, x, y }) =>
          <button type="button" key={label} aria-label={label} disabled={camera.zoom <= 1} onClick={() => pan(x, y)}><Icon size={17} aria-hidden="true" /></button>)}
      </div>
    </div>
    <p className="floor-map-help" id={`${id}-help`}>Zoom in met + en sleep om te verschuiven. Je kunt ook de pijlknoppen gebruiken.</p>
    <details className="floor-map-keyboard"><summary>Bediening met het toetsenbord</summary><p>Tab opent de kaart en de knoppen. Op de kaart: + en − om te zoomen, pijltjestoetsen om te verschuiven en Home voor het overzicht. {units.length > 0 && "Bij een winkelruimte: pijltjestoetsen om naar een andere ruimte te gaan, Enter of spatie om te kiezen. "}Escape wist de selectie. Met Tab verlaat je de kaart.</p></details>
  </div>;
}
