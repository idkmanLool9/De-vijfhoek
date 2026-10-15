"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Isolate the URL hook behind its own Suspense boundary so the map itself
// remains in the static HTML on GitHub Pages and Cloudflare Pages.
export function MapUrlSelection({ onSelect }: { onSelect: (unitNumber: string) => void }) {
  const params = useSearchParams();
  const unitNumber = params.get("unit");
  useEffect(() => {
    if (unitNumber) onSelect(unitNumber);
  }, [unitNumber, onSelect]);
  return null;
}
