import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pagesBasePath } from "./pages-options.mjs";

const require = createRequire(import.meta.url);
const isCloudflare = process.argv.includes("--cloudflare");
const basePath = isCloudflare ? "" : pagesBasePath();
const target = isCloudflare ? "cloudflare-pages" : "github-pages";

const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
  stdio: "inherit",
  env: { ...process.env, DEPLOY_TARGET: target, PAGES_BASE_PATH: basePath },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
// Static hosts would serve Next's validation-only 404 HTML with status 200.
// Omit that generated directory so static hosts return their real 404 instead.
rmSync("out/nieuws/__no-published-news__", { recursive: true, force: true });
writeFileSync("out/.nojekyll", "");
console.log(`${isCloudflare ? "Cloudflare" : "GitHub"} Pages export ready in out/ (base path: ${basePath || "/"}).`);
