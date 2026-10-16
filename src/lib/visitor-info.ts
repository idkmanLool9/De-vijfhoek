export const visitorFields = [
  { id: "visitAddress", label: "Bezoekadres", group: "Bereikbaarheid", type: "text", maxLength: 300, hint: "Het openbare bezoekadres van het winkelcentrum." },
  { id: "arrivalInfo", label: "Bereikbaarheid en ingangen", group: "Bereikbaarheid", type: "textarea", maxLength: 2000, hint: "Beschrijf hoe bezoekers het centrum bereiken en welke ingangen zij kunnen gebruiken." },
  { id: "publicTransportInfo", label: "Openbaar vervoer", group: "Bereikbaarheid", type: "textarea", maxLength: 1500, hint: "Vermeld bevestigde stations, haltes en eventuele loopinstructies." },
  { id: "parkingLocations", label: "Parkeerlocaties", group: "Parkeren", type: "textarea", maxLength: 2000, hint: "Namen en adressen van parkeerplaatsen of garages voor bezoekers." },
  { id: "parkingRates", label: "Parkeertarieven", group: "Parkeren", type: "textarea", maxLength: 1500, hint: "Vermeld de actuele tarieven en eventuele uitzonderingen." },
  { id: "parkingPaymentHours", label: "Betaaltijden parkeren", group: "Parkeren", type: "textarea", maxLength: 1500, hint: "Op welke dagen en tijden gelden de parkeertarieven?" },
  { id: "parkingExtra", label: "Overige parkeerinformatie", group: "Parkeren", type: "textarea", maxLength: 1500, hint: "Denk aan bevestigde hoogtebeperkingen, laadpunten of fietsparkeren." },
  { id: "accessibleEntrances", label: "Toegankelijke ingangen", group: "Toegankelijkheid", type: "textarea", maxLength: 2000, hint: "Geef aan welke ingangen toegankelijk zijn en of er drempels of andere beperkingen zijn." },
  { id: "liftInfo", label: "Lift", group: "Toegankelijkheid", type: "textarea", maxLength: 1500, hint: "Beschrijf de aanwezigheid en locatie van een lift, of vermeld expliciet dat deze er niet is." },
  { id: "toiletInfo", label: "Toiletten", group: "Toegankelijkheid", type: "textarea", maxLength: 1500, hint: "Vermeld waar toiletten zijn, voor wie ze toegankelijk zijn en eventuele voorwaarden." },
  { id: "accessibilityExtra", label: "Overige toegankelijkheidsinformatie", group: "Toegankelijkheid", type: "textarea", maxLength: 1500, hint: "Overige bevestigde voorzieningen of aandachtspunten voor een bezoek." },
  { id: "managementName", label: "Naam beheerder", group: "Beheer & contact", type: "text", maxLength: 200, hint: "De organisatie die als beheerder van het centrum genoemd mag worden." },
  { id: "managementInfo", label: "Informatie over het beheer", group: "Beheer & contact", type: "textarea", maxLength: 1500, hint: "Beschrijf waarvoor bezoekers of ondernemers bij de beheerder terechtkunnen." },
  { id: "contactEmail", label: "Openbaar e-mailadres", group: "Beheer & contact", type: "email", maxLength: 254, hint: "Het e-mailadres dat op de openbare website mag staan." },
  { id: "contactPhone", label: "Openbaar telefoonnummer", group: "Beheer & contact", type: "tel", maxLength: 60, hint: "Het telefoonnummer dat bezoekers mogen gebruiken." },
  { id: "contactWebsite", label: "Website beheerder", group: "Beheer & contact", type: "url", maxLength: 500, hint: "Een volledige openbare website-URL, beginnend met https:// of http://." },
  { id: "contactInfo", label: "Aanvullende contactinformatie", group: "Beheer & contact", type: "textarea", maxLength: 1500, hint: "Bijvoorbeeld wanneer de contactpersoon bereikbaar is of hoe meldingen kunnen worden gedaan." },
  { id: "history", label: "Het verhaal van De Vijfhoek", group: "Over het centrum", type: "textarea", maxLength: 4000, hint: "De bevestigde achtergrond en geschiedenis van het winkelcentrum." },
  { id: "entrepreneursInfo", label: "Informatie voor ondernemers", group: "Over het centrum", type: "textarea", maxLength: 2000, hint: "Openbare informatie over ondernemen of verhuur in het centrum." },
] as const;

export type VisitorFieldId = typeof visitorFields[number]["id"];
export type VisitorInfo = Record<VisitorFieldId, string>;
export type VisitorDrafts = Partial<VisitorInfo>;
export const MAX_INFO_PACKAGE_BYTES = 100_000;

export function emptyVisitorInfo(): VisitorInfo {
  return Object.fromEntries(visitorFields.map(({ id }) => [id, ""])) as VisitorInfo;
}

export function validInfoEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
export function validInfoPhone(value: string) { return /^\+?[0-9()\s./-]+$/.test(value) && value.replace(/\D/g, "").length >= 3; }
export function validInfoWebsite(value: string) {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}

// Drafts may contain incomplete contact fields while the owner is typing.
// Exports and publication imports require complete, valid contact values.
export function parseVisitorValues(input: unknown, contacts = false): VisitorDrafts {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("De bezoekersgegevens hebben een ongeldig formaat.");
  const result: VisitorDrafts = {};
  for (const [key, raw] of Object.entries(input)) {
    const field = visitorFields.find(({ id }) => id === key);
    if (!field || typeof raw !== "string") throw new Error("Het bestand bevat een onbekend of ongeldig informatieveld.");
    if (raw.length > field.maxLength) throw new Error(`${field.label} is te lang (maximaal ${field.maxLength} tekens).`);
    const value = contacts ? raw.trim() : raw;
    if (contacts && value) {
      if (field.type === "email" && !validInfoEmail(value)) throw new Error("Vul een geldig openbaar e-mailadres in.");
      if (field.type === "tel" && !validInfoPhone(value)) throw new Error("Vul een geldig openbaar telefoonnummer in.");
      if (field.type === "url" && !validInfoWebsite(value)) throw new Error("Vul een geldige website in die begint met https:// of http://.");
    }
    result[field.id] = value;
  }
  return result;
}

export function createVisitorPackage(values: VisitorDrafts) {
  const checked = parseVisitorValues(values, true);
  if (!Object.keys(checked).length) throw new Error("Er zijn nog geen gewijzigde gegevens om te downloaden.");
  return JSON.stringify({ format: "de-vijfhoek-bezoekersinformatie", version: 1, exportedAt: new Date().toISOString(), values: checked }, null, 2) + "\n";
}

export function readVisitorPackage(text: string): VisitorDrafts {
  if (new TextEncoder().encode(text).length > MAX_INFO_PACKAGE_BYTES) throw new Error("Dit informatiebestand is groter dan 100 kB.");
  let value;
  try { value = JSON.parse(text); } catch { throw new Error("Dit bestand bevat geen geldige bezoekersinformatie."); }
  if (!value || typeof value !== "object" || Array.isArray(value) || value.format !== "de-vijfhoek-bezoekersinformatie" || value.version !== 1 || Object.keys(value).some((key) => !["format", "version", "exportedAt", "values"].includes(key))) throw new Error("Kies een informatiebestand dat met deze bewerkmodus is gedownload.");
  const values = parseVisitorValues(value.values, true);
  if (!Object.keys(values).length) throw new Error("Dit informatiebestand bevat geen wijzigingen.");
  return values;
}
