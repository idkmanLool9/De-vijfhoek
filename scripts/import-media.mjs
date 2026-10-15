import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readMediaPackage } from "../src/lib/media-package.ts";
import { MAX_PACKAGE_BYTES } from "../src/lib/media-schema.ts";

/** @param {Uint8Array} bytes @param {string} root */
export function importMediaPackage(bytes, root) {
  const entries = readMediaPackage(bytes);
  const manifestPath = resolve(root, "src/data/media.json");
  const saved = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  if (!saved || Array.isArray(saved) || typeof saved !== "object") throw new Error("Existing media.json is not a valid image manifest.");
  const output = resolve(root, "public/images/official");
  mkdirSync(output, { recursive: true });
  for (const entry of entries) {
    const filename = `${entry.id}.${entry.extension}`;
    writeFileSync(resolve(output, filename), entry.bytes);
    saved[entry.id] = { src: `/images/official/${filename}`, alt: entry.alt, position: entry.position };
  }
  mkdirSync(resolve(root, "src/data"), { recursive: true });
  writeFileSync(`${manifestPath}.tmp`, JSON.stringify(saved, null, 2) + "\n");
  renameSync(`${manifestPath}.tmp`, manifestPath);
  return entries.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run media:import -- /path/to/de-vijfhoek-fotos.zip");
  if (statSync(file).size > MAX_PACKAGE_BYTES + 256 * 1024) throw new Error("Media package exceeds 200 MB.");
  const root = resolve(import.meta.dirname, "..");
  const count = importMediaPackage(readFileSync(file), root);
  console.log(`Imported ${count} official image choices. Review public/images/official/ and src/data/media.json, then build and deploy.`);
}
