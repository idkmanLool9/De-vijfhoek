import type { StoredMedia } from "./media-schema";

let connection: Promise<IDBDatabase> | undefined;
function openDatabase() {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error("Deze browser ondersteunt de lokale foto-opslag niet."));
    const request = indexedDB.open("de-vijfhoek-foto-editor", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("media", { keyPath: "id" });
      request.result.createObjectStore("settings");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("De lokale foto-opslag kon niet worden geopend."));
    request.onblocked = () => reject(new Error("Sluit andere bewerktabbladen en probeer opnieuw."));
  });
  return connection;
}

export async function loadMedia() {
  const database = await openDatabase();
  return new Promise<{ records: StoredMedia[]; preview: boolean }>((resolve, reject) => {
    const transaction = database.transaction(["media", "settings"], "readonly");
    const records = transaction.objectStore("media").getAll();
    const preview = transaction.objectStore("settings").get("preview");
    transaction.oncomplete = () => resolve({ records: records.result, preview: preview.result === true });
    transaction.onerror = () => reject(new Error("Je bewaarde foto’s konden niet worden gelezen."));
  });
}

export async function writeMedia(records: StoredMedia[], removed: string[] = [], preview?: boolean) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(["media", "settings"], "readwrite");
    const media = transaction.objectStore("media");
    for (const record of records) media.put(record);
    for (const id of removed) media.delete(id);
    if (preview !== undefined) transaction.objectStore("settings").put(preview, "preview");
    transaction.oncomplete = () => resolve();
    transaction.onabort = transaction.onerror = () => reject(new Error("Je browser kon de foto’s niet bewaren. Er is mogelijk onvoldoende opslagruimte. Download je fotopakket als back-up."));
  });
}
