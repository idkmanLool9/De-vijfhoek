// Synthetic geometry for isolated component tests. This is NOT a site plan of
// De Vijfhoek, is outside the App Router, and is never included in a deployment.
import { createRoot } from "react-dom/client";
import { VisitorMap } from "../../src/components/floor-plan/visitor-map";
import type { FloorPlan } from "../../src/data/floor-plan";

const plan: FloorPlan = {
  id: "overview",
  label: "Volledige vastgoedplattegrond",
  floor: null,
  source: "Synthetic test fixture",
  viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
  sourceImage: { src: "/original.svg", width: 1000, height: 1000 },
  units: [
    { id: "unit-1", unitNumber: "1", shopSlug: "albert-heijn", geometry: { path: "M80 80H450V450H80Z", label: { x: 265, y: 265 }, bounds: { x: 80, y: 80, width: 370, height: 370 } } },
    { id: "unit-141", unitNumber: "141", shopSlug: "action", geometry: { path: "M520 80H910V450H690V330H520Z", label: { x: 760, y: 245 }, bounds: { x: 520, y: 80, width: 390, height: 370 } } },
    { id: "unit-17", unitNumber: "17", shopSlug: "scapino", geometry: { path: "M80 540H270V900H80Z", label: { x: 175, y: 720 }, bounds: { x: 80, y: 540, width: 190, height: 360 } } },
    { id: "unit-19", unitNumber: "19", shopSlug: "scapino", geometry: { path: "M270 540H450V900H270Z", label: { x: 360, y: 720 }, bounds: { x: 270, y: 540, width: 180, height: 360 } } },
    { id: "unit-999", unitNumber: "999", shopSlug: null, geometry: { path: "M520 540H910V900H520Z M650 650H750V750H650Z", label: { x: 820, y: 790 }, bounds: { x: 520, y: 540, width: 390, height: 360 } } },
  ],
};

createRoot(document.getElementById("root")!).render(<main><h1>Testkaart</h1><VisitorMap plans={[plan]} /></main>);
