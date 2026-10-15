// The isolated canvas harness has no Next router. Real URL synchronization is
// covered by the visitor-page browser tests against the exported application.
export function useSearchParams() {
  return new URLSearchParams(window.location.search);
}
