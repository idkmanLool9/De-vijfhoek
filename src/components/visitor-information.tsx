"use client";

import { ExternalLink } from "lucide-react";
import { validInfoEmail, validInfoPhone, validInfoWebsite, visitorFields, type VisitorFieldId } from "@/lib/visitor-info";
import { useVisitorInfo } from "./visitor-info-provider";

const topics = {
  arrival: { fields: ["visitAddress", "arrivalInfo", "publicTransportInfo"], fallback: "Plan je reis naar Winkelcentrum In den Vijfhoek in Oldenzaal met Google Maps. Kies de auto, fiets of het openbaar vervoer en stel je eigen vertrekpunt in." },
  parking: { fields: ["parkingLocations", "parkingRates", "parkingPaymentHours", "parkingExtra"], fallback: "Zoek parkeerlocaties in de omgeving via Google Maps. Controleer de geldende parkeertijden, tarieven en voorwaarden ter plaatse of bij de gemeente Oldenzaal." },
  accessibility: { fields: ["accessibleEntrances", "liftInfo", "toiletInfo", "accessibilityExtra"], fallback: "Bevestigde informatie over toegankelijke ingangen, rolstoeltoegang, toiletten en andere voorzieningen wordt hier gepubliceerd zodra deze beschikbaar is." },
} satisfies Record<string, { fields: VisitorFieldId[]; fallback: string }>;

export function PracticalInformation({ topic }: { topic: keyof typeof topics }) {
  const info = useVisitorInfo();
  const config = topics[topic];
  const fields = config.fields.filter((id) => info[id].trim());
  if (!fields.length) return <p>{config.fallback}</p>;
  return <div className="visitor-facts">{fields.map((id) => <div className="visitor-fact" key={id}><h3>{visitorFields.find((field) => field.id === id)!.label}</h3><p className="visitor-info-copy">{info[id]}</p></div>)}</div>;
}

export function CentreHistoryText() {
  const { history } = useVisitorInfo();
  return <p className="visitor-info-copy">{history || "Meer over de achtergrond en geschiedenis van het winkelcentrum volgt na bevestiging van de informatie."}</p>;
}

export function CentreManagementInfo() {
  const { managementName, managementInfo } = useVisitorInfo();
  if (!managementName && !managementInfo) return <p>Informatie over het beheer van het winkelcentrum volgt na bevestiging.</p>;
  return <>{managementName && <p className="visitor-info-copy"><strong>{managementName}</strong></p>}{managementInfo && <p className="visitor-info-copy">{managementInfo}</p>}</>;
}

export function CentreContactInfo({ compact = false }: { compact?: boolean }) {
  const { contactPhone, contactEmail, contactWebsite, contactInfo } = useVisitorInfo();
  if (compact && !contactPhone && !contactEmail) return null;
  if (!contactPhone && !contactEmail && !contactWebsite && !contactInfo) return <p>Officiële contactgegevens van het centrum worden hier toegevoegd zodra ze zijn bevestigd.</p>;
  return <>{!compact && contactInfo && <p className="visitor-info-copy">{contactInfo}</p>}<div className="centre-contact-links">
    {contactEmail && (validInfoEmail(contactEmail.trim()) ? <a className="contact-link" href={`mailto:${contactEmail.trim()}`}>{contactEmail}</a> : <p className="visitor-info-copy">{contactEmail}</p>)}
    {contactPhone && (validInfoPhone(contactPhone.trim()) ? <a className="contact-link" href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}>{contactPhone}</a> : <p className="visitor-info-copy">{contactPhone}</p>)}
    {!compact && contactWebsite && (validInfoWebsite(contactWebsite.trim()) ? <a className="contact-link" href={contactWebsite.trim()} target="_blank" rel="noopener noreferrer">Website beheerder<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a> : <p className="visitor-info-copy">{contactWebsite}</p>)}
  </div></>;
}

export function CentreEntrepreneursText() {
  const { entrepreneursInfo } = useVisitorInfo();
  return <p className="visitor-info-copy">{entrepreneursInfo || "Informatie voor ondernemers en eventuele verhuurmogelijkheden volgt na bevestiging."}</p>;
}
