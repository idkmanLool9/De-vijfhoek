export function pagesBasePath() {
  const repository = process.env.GITHUB_REPOSITORY || "idkmanLool9/De-vijfhoek";
  const name = repository.split("/").at(-1);
  const basePath = process.env.PAGES_BASE_PATH ?? (name.endsWith(".github.io") ? "" : `/${name}`);
  if (basePath !== "" && !/^\/[A-Za-z0-9_.-]+$/.test(basePath)) {
    throw new Error("PAGES_BASE_PATH must be empty or a single path such as /De-vijfhoek.");
  }
  return basePath;
}
