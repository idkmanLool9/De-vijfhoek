import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { emptyVisitorInfo, parseVisitorValues, readVisitorPackage, MAX_INFO_PACKAGE_BYTES } from "../src/lib/visitor-info.ts";

export function importVisitorInfo(text, root) {
  const incoming = readVisitorPackage(text);
  const filename = resolve(root, "src/data/visitor-info.json");
  const current = existsSync(filename) ? parseVisitorValues(JSON.parse(readFileSync(filename, "utf8")), true) : {};
  const next = { ...emptyVisitorInfo(), ...current, ...incoming };
  mkdirSync(resolve(root, "src/data"), { recursive: true });
  writeFileSync(`${filename}.tmp`, JSON.stringify(next, null, 2) + "\n");
  renameSync(`${filename}.tmp`, filename);
  return Object.keys(incoming).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npm run info:import -- /path/to/de-vijfhoek-bezoekersinformatie.json");
  if (statSync(file).size > MAX_INFO_PACKAGE_BYTES) throw new Error("Dit informatiebestand is groter dan 100 kB.");
  const count = importVisitorInfo(readFileSync(file, "utf8"), resolve(import.meta.dirname, ".."));
  console.log(`${count} informatievelden verwerkt. Controleer src/data/visitor-info.json, bouw en publiceer de website.`);
}
