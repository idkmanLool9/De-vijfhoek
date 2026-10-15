export type MediaPosition = { x: number; y: number };
export type MediaAsset = { src: string; alt: string; position: MediaPosition };
export type StoredMedia = {
  id: string;
  name: string;
  blob: Blob;
  alt: string;
  position: MediaPosition;
  width: number;
  height: number;
};
export const MAX_MEDIA_BYTES = 15 * 1024 * 1024;
export const MAX_PACKAGE_BYTES = 200 * 1024 * 1024;

export function imageFormat(bytes: Uint8Array) {
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)) return { mime: "image/png", extension: "png" };
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return { mime: "image/jpeg", extension: "jpg" };
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return { mime: "image/webp", extension: "webp" };
  return null;
}
