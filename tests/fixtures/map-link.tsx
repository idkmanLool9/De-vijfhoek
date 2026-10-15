import type { ComponentProps } from "react";

// The isolated canvas harness does not run a Next.js router. Real Next links
// and deployment base paths are covered separately on the visitor page.
export default function MapTestLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
