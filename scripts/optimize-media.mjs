import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, basename, extname } from "node:path";
import sharp from "sharp";

// Derivatives only: keep the uploaded originals and all editor crop settings.
const root = resolve(import.meta.dirname, "..");
const manifestPath = resolve(root, "src/data/media-optimized.json");
const source = JSON.parse(await readFile(resolve(root, "src/data/media.json"), "utf8"));
const previous = JSON.parse(await readFile(manifestPath, "utf8").catch(() => "{}"));
const output = {};
await mkdir(resolve(root, "public/images/optimized"), { recursive: true });
for (const [id, asset] of Object.entries(source).sort(([a], [b]) => a.localeCompare(b))) {
  if (!asset.src.startsWith("/images/official/") || asset.src.includes("..")) throw new Error(`Invalid official asset: ${id}`);
  if (output[asset.src]) continue;
  const bytes = await readFile(resolve(root, `public${asset.src}`));
  const logo = id.endsWith("logo");
  const hash = createHash("sha256").update(bytes).update(`responsive-v1-${sharp.versions.sharp}-${logo}`).digest("hex").slice(0, 16);
  const existing = previous[asset.src];
  if (existing?.hash === hash && (await Promise.all(existing.variants.map((variant) => access(resolve(root, `public${variant.src}`)).then(() => true, () => false)))).every(Boolean)) {
    output[asset.src] = existing;
    continue;
  }
  const metadata = await sharp(bytes).metadata();
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  if (!width || !height) throw new Error(`Missing image dimensions: ${id}`);
  const widths = [...new Set((logo ? [160, 320] : id === "centrum-hero" ? [480, 960, 1600, 2400] : [480, 960, 1600]).map((target) => Math.min(target, width)))];
  const variants = [];
  for (const size of widths) {
    const filename = `${basename(asset.src, extname(asset.src))}-${hash}-${size}.webp`;
    const src = `/images/optimized/${filename}`;
    const info = await sharp(bytes).rotate().resize({ width: size, withoutEnlargement: true }).webp(logo ? { lossless: true, effort: 5 } : { quality: 80, effort: 5 }).toFile(resolve(root, `public${src}`));
    variants.push({ width: info.width, src, bytes: info.size });
  }
  output[asset.src] = { hash, width, height, originalBytes: bytes.length, variants };
}
const json = JSON.stringify(output, null, 2) + "\n";
if (JSON.stringify(previous, null, 2) + "\n" !== json) await writeFile(manifestPath, json);
const originals = Object.values(output).reduce((total, asset) => total + asset.originalBytes, 0);
const largest = Object.values(output).reduce((total, asset) => total + asset.variants.at(-1).bytes, 0);
console.log(`Responsive media: ${Object.keys(output).length} images; originals ${(originals / 1e6).toFixed(2)} MB, largest display variants ${(largest / 1e6).toFixed(2)} MB. Originals preserved.`);
