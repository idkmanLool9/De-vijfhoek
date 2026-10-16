"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const path = (value: string) => value.replace(/\/$/, "") || "/";
type Destination = { pathname: string; search: string };

// Reset only explicit internal link navigations. Direct hash links and browser
// back/forward keep the router's own anchor and scroll-restoration behaviour.
export function NavigationScroll() {
  const pathname = usePathname();
  const destination = useRef<Destination | null>(null);

  useEffect(() => {
    let samePageFrame = 0;
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      destination.current = null;
      if (url.hash) return;
      destination.current = { pathname: path(url.pathname), search: url.search };
      // Clicking Home while already on Home does not change usePathname.
      if (path(url.pathname) === path(window.location.pathname) && url.search === window.location.search) {
        cancelAnimationFrame(samePageFrame);
        samePageFrame = requestAnimationFrame(() => {
          if (!window.location.hash && path(window.location.pathname) === path(url.pathname) && window.location.search === url.search) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          destination.current = null;
        });
      }
    }
    function onPopState() { destination.current = null; cancelAnimationFrame(samePageFrame); }
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("popstate", onPopState); cancelAnimationFrame(samePageFrame); };
  }, []);

  useLayoutEffect(() => {
    const target = destination.current;
    destination.current = null;
    if (!target || window.location.hash || path(window.location.pathname) !== target.pathname || window.location.search !== target.search) return;
    function reset() {
      if (!window.location.hash && path(window.location.pathname) === target!.pathname && window.location.search === target!.search) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    reset();
    // Cancel an in-flight smooth anchor scroll after the router's commit too.
    const frame = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
