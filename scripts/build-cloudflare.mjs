import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Keep the previously documented dashboard command working on Pages as well.
// Cloudflare sets CF_PAGES=1 for every Pages build (including previews).
const isPages = process.env.CF_PAGES === "1";
const entry = isPages
  ? new URL("./build-pages.mjs", import.meta.url)
  : new URL("../cli/index.js", import.meta.resolve("@opennextjs/cloudflare"));
const args = isPages
  ? ["--cloudflare"]
  : ["build", "--config", "wrangler.worker.jsonc", ...process.argv.slice(2)];

const result = spawnSync(process.execPath, [fileURLToPath(entry), ...args], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
