export const isPages = process.env.E2E_PAGES === "1";
export const basePath = process.env.E2E_BASE_PATH || "";

export function sitePath(route: string) {
  const [path, fragment] = route.split("#");
  const pathname = isPages && !path.endsWith("/") ? `${path}/` : path;
  return `${basePath}${pathname}${fragment ? `#${fragment}` : ""}`;
}
