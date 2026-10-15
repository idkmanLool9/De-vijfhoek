import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { imageFormat, MAX_MEDIA_BYTES, MAX_PACKAGE_BYTES, type MediaPosition, type StoredMedia } from "./media-schema.ts";

type PackageEntry = { file: string; name: string; alt: string; position: MediaPosition; width: number; height: number };
type Manifest = { format: "de-vijfhoek-media"; version: 1; assets: Record<string, PackageEntry> };
export type ImportedMedia = PackageEntry & { id: string; bytes: Uint8Array; mime: string; extension: string };

// Keep each downloadable archive below common attachment limits, preserving
// original images. Separate packages merge when restored or imported.
export function groupMediaRecords(records: StoredMedia[]) {
  const groups: StoredMedia[][] = [];
  let group: StoredMedia[] = [];
  let size = 0;
  const limit = 24 * 1024 * 1024;
  for (const record of records) {
    if (record.blob.size > MAX_MEDIA_BYTES) throw new Error("Een afbeelding is groter dan 15 MB.");
    if (size + record.blob.size > limit && group.length) { groups.push(group); group = []; size = 0; }
    group.push(record); size += record.blob.size;
  }
  if (group.length) groups.push(group);
  return groups;
}

export async function createMediaPackage(records: StoredMedia[]) {
  if (!records.length) throw new Error("Kies eerst minimaal één foto of logo.");
  if (records.reduce((size, record) => size + record.blob.size, 0) > MAX_PACKAGE_BYTES) throw new Error("Het fotopakket is groter dan 200 MB. Kies kleinere bestanden voordat je exporteert.");
  const manifest: Manifest = { format: "de-vijfhoek-media", version: 1, assets: {} };
  const files: Record<string, Uint8Array> = {};
  for (const record of records) {
    const bytes = new Uint8Array(await record.blob.arrayBuffer());
    const format = imageFormat(bytes);
    if (!format) throw new Error(`Ongeldig beeldbestand bij ${record.id}.`);
    if (!record.alt.trim()) throw new Error(`Vul eerst een beeldbeschrijving in bij ${record.name}.`);
    const file = `assets/${record.id}.${format.extension}`;
    files[file] = bytes;
    manifest.assets[record.id] = { file, name: record.name, alt: record.alt, position: record.position, width: record.width, height: record.height };
  }
  files["media.json"] = strToU8(JSON.stringify(manifest, null, 2));
  return zipSync(files, { level: 0 });
}

function object(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }

export function readMediaPackage(bytes: Uint8Array): ImportedMedia[] {
  if (bytes.byteLength > MAX_PACKAGE_BYTES + 256 * 1024) throw new Error("Het pakket is groter dan 200 MB.");
  let total = 0;
  let count = 0;
  const files = unzipSync(bytes, { filter(file) {
    total += file.originalSize;
    count += 1;
    if (count > 101 || total > MAX_PACKAGE_BYTES + 256 * 1024 || file.originalSize > (file.name === "media.json" ? 256 * 1024 : MAX_MEDIA_BYTES)) throw new Error("Het pakket bevat te veel of te grote bestanden.");
    if (file.name !== "media.json" && !/^assets\/[a-z0-9][a-z0-9-]*\.(png|jpg|webp)$/.test(file.name)) throw new Error("Het pakket bevat een onverwacht bestand.");
    return true;
  } });
  if (!files["media.json"]) throw new Error("Dit is geen fotopakket van De Vijfhoek.");
  const manifest: unknown = JSON.parse(strFromU8(files["media.json"]));
  if (!object(manifest) || manifest.format !== "de-vijfhoek-media" || manifest.version !== 1 || !object(manifest.assets)) throw new Error("Onbekende versie van het fotopakket.");
  const entries = Object.entries(manifest.assets);
  if (!entries.length || entries.length > 100) throw new Error("Het pakket bevat geen geldige beeldkeuzes.");
  return entries.map(([id, value]) => {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id) || !object(value) || typeof value.file !== "string") throw new Error("Ongeldige fotoplek in het pakket.");
    const data = files[value.file];
    const format = data && imageFormat(data);
    if (!format || value.file !== `assets/${id}.${format.extension}`) throw new Error(`Het beeldbestand voor ${id} ontbreekt of heeft een ongeldig formaat.`);
    const position = value.position;
    if (typeof value.alt !== "string" || !value.alt.trim() || value.alt.length > 300 || typeof value.name !== "string" || value.name.length > 300 || !object(position) || ![position.x, position.y].every((number) => typeof number === "number" && Number.isFinite(number) && number >= 0 && number <= 100) || ![value.width, value.height].every((number) => typeof number === "number" && Number.isInteger(number) && number > 0)) throw new Error(`Ongeldige beeldinstellingen voor ${id}.`);
    return { id, bytes: data, mime: format.mime, extension: format.extension, file: value.file, name: value.name, alt: value.alt, position: { x: position.x as number, y: position.y as number }, width: value.width as number, height: value.height as number };
  });
}
