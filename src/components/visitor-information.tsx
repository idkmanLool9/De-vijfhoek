"use client";

import type { ReactNode } from "react";
import { Bike, Building2, CarFront, ChevronDown, ExternalLink, Mail, MapPin, Phone, TrainFront } from "lucide-react";
import { validInfoEmail, validInfoPhone, validInfoWebsite, type VisitorFieldId } from "@/lib/visitor-info";
import { informationSections } from "@/lib/information-text";
import { centreGoogleQuery, googleDirections, googleMapsSearch } from "@/lib/google-maps";
import { useVisitorInfo } from "./visitor-info-provider";

/** Render editor paragraphs and bullets semantically; never interpret markup. */
export function InformationText({ text }: { text: string }) {
  return <div className="information-copy">{informationSections(text).map((section, index) => <div className="information-copy-section" key={index}>
    {section.title && <h4>{section.title}</h4>}
    {section.paragraphs.map((paragraph, paragraphIndex) => {
      const groups: { bullet: boolean; lines: string[] }[] = [];
      for (const line of paragraph.split("\n")) {
        const bullet = /^[•*-]\s/.test(line.trim());
        const last = groups[groups.length - 1];
        if (last?.bullet === bullet) last.lines.push(line);
        else groups.push({ bullet, lines: [line] });
      }
      return <div key={paragraphIndex}>{groups.map((group, groupIndex) => group.bullet
        ? <ul key={groupIndex}>{group.lines.map((line, lineIndex) => <li key={lineIndex}>{line.trim().replace(/^[•*-]\s*/, "")}</li>)}</ul>
        : <p className="visitor-info-copy" key={groupIndex}>{group.lines.join("\n")}</p>)}</div>;
    })}
  </div>)}</div>;
}

function InformationDetails({ title, hint, text }: { title: string; hint?: string; text: string }) {
  if (!text.trim()) return null;
  return <details className="information-details"><summary><span><strong>{title}</strong>{hint && <small>{hint}</small>}</span><ChevronDown size={19} aria-hidden="true" /></summary><div className="information-details-body"><InformationText text={text} /></div></details>;
}

const fallback = {
  arrival: "Plan je reis naar Winkelcentrum In den Vijfhoek in Oldenzaal met Google Maps. Kies de auto, fiets of het openbaar vervoer en stel je eigen vertrekpunt in.",
  parking: "Zoek parkeerlocaties in de omgeving via Google Maps. Controleer de geldende parkeertijden, tarieven en voorwaarden ter plaatse of bij de gemeente Oldenzaal.",
  accessibility: "Bevestigde informatie over toegankelijke ingangen, rolstoeltoegang, toiletten en andere voorzieningen wordt hier gepubliceerd zodra deze beschikbaar is.",
};

export function PracticalInformation({ topic, children }: { topic: keyof typeof fallback; children?: ReactNode }) {
  const info = useVisitorInfo();
  if (topic === "arrival") {
    const travel = informationSections(info.publicTransportInfo);
    const modes = {
      "met de auto": { icon: CarFront, mode: "driving", link: "Autoroute plannen" },
      "met de fiets": { icon: Bike, mode: "bicycling", link: "Fietsroute plannen" },
      "met het ov": { icon: TrainFront, mode: "transit", link: "OV-reis plannen" },
    } as const;
    return <>
      <div className="arrival-intro"><div>
        {info.visitAddress && <div className="visit-address"><MapPin size={20} aria-hidden="true" /><div><span>Je bestemming</span><strong>{info.visitAddress}</strong></div></div>}
        <InformationText text={info.arrivalInfo || fallback.arrival} />
      </div>{children}</div>
      {!!travel.length && <div className="travel-cards">{travel.map((section, index) => {
        const key = section.title.toLowerCase();
        const mode = Object.hasOwn(modes, key) ? modes[key as keyof typeof modes] : undefined;
        const Icon = mode?.icon ?? TrainFront;
        return <article className="travel-card" key={index}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{section.title || "Openbaar vervoer"}</h3><InformationText text={section.paragraphs.join("\n\n")} />{mode && <a href={googleDirections(centreGoogleQuery, mode.mode)} className="text-link" target="_blank" rel="noopener noreferrer">{mode.link}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a>}</article>;
      })}</div>}
    </>;
  }
  if (topic === "parking") {
    const locations = informationSections(info.parkingLocations);
    return <>
      {!!locations.length && <div className="parking-locations">{locations.map((location, index) => <article className="parking-location" key={index}><span className="location-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{location.title || "Bij het winkelcentrum"}</h3><InformationText text={location.paragraphs.join("\n\n")} /><a className="text-link" href={googleMapsSearch(location.title ? `${location.title} Oldenzaal` : `Parkeren bij ${centreGoogleQuery}`)} target="_blank" rel="noopener noreferrer">Bekijk op Google Maps<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a></article>)}</div>}
      {!locations.length && <p>{fallback.parking}</p>}
      <div className="parking-practical"><InformationDetails title="Parkeertarieven" hint="Tarieven, dagkaarten en uitzonderingen" text={info.parkingRates} /><InformationDetails title="Betaaltijden parkeren" hint="Dagen en tijden voor betaald parkeren" text={info.parkingPaymentHours} /><InformationDetails title="Goed om te weten" hint="Overige parkeerinformatie" text={info.parkingExtra} /></div>
      <p className="information-footnote">Controleer de actuele tarieven en voorwaarden bij de parkeerlocatie.</p>
    </>;
  }
  const fields: { id: VisitorFieldId; title: string; hint: string }[] = [
    { id: "accessibleEntrances", title: "Toegankelijke ingangen", hint: "Ingangen, deuren en doorgangen" },
    { id: "liftInfo", title: "Lift", hint: "Verdiepingen en bereikbaarheid" },
    { id: "toiletInfo", title: "Toiletten", hint: "Locaties en gebruik" },
    { id: "accessibilityExtra", title: "Overige voorzieningen", hint: "Hulp bij een prettig bezoek" },
  ];
  if (!fields.some(({ id }) => info[id])) return <p>{fallback.accessibility}</p>;
  return <div className="accessibility-details">{fields.map(({ id, title, hint }) => <InformationDetails key={id} title={title} hint={hint} text={info[id]} />)}</div>;
}

export function CentreHistoryText() {
  const { history } = useVisitorInfo();
  if (!history) return <p>Meer over de achtergrond en geschiedenis van het winkelcentrum volgt na bevestiging van de informatie.</p>;
  return <div className="history-chapters">{informationSections(history).map((section, index) => {
    const first = section.paragraphs[0] || "";
    const end = first.match(/^.*?[.!?](?:\s|$)/)?.[0].length ?? first.length;
    const intro = first.slice(0, end).trim();
    const rest = [first.slice(end).trim(), ...section.paragraphs.slice(1)].filter(Boolean).join("\n\n");
    return <article className="history-chapter" key={index}><span className="chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{section.title || "Het verhaal van het centrum"}</h3><p>{intro}</p>{rest && <InformationDetails title="Lees verder" text={rest} />}</div></article>;
  })}</div>;
}

export function CentreManagementInfo() {
  const { managementName, managementInfo } = useVisitorInfo();
  if (!managementName && !managementInfo) return <p>Informatie over het beheer van het winkelcentrum volgt na bevestiging.</p>;
  return <>{managementName && <p className="management-name">{managementName}</p>}{managementInfo && <InformationDetails title="Over het beheer" text={managementInfo} />}</>;
}

export function CentreContactInfo({ compact = false }: { compact?: boolean }) {
  const { contactPhone, contactEmail, contactWebsite, contactInfo } = useVisitorInfo();
  if (compact && !contactPhone && !contactEmail) return null;
  if (!contactPhone && !contactEmail && !contactWebsite && !contactInfo) return <p>Officiële contactgegevens van het centrum worden hier toegevoegd zodra ze zijn bevestigd.</p>;
  return <><div className={`centre-contact-links${compact ? "" : " contact-actions"}`}>
    {contactPhone && (validInfoPhone(contactPhone) ? <a className="contact-link" href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}>{!compact && <Phone size={18} aria-hidden="true" />}{contactPhone}</a> : <p className="visitor-info-copy">{contactPhone}</p>)}
    {contactEmail && (validInfoEmail(contactEmail) ? <a className="contact-link" href={`mailto:${contactEmail}`}>{!compact && <Mail size={18} aria-hidden="true" />}{contactEmail}</a> : <p className="visitor-info-copy">{contactEmail}</p>)}
    {!compact && contactWebsite && (validInfoWebsite(contactWebsite) ? <a className="contact-link" href={contactWebsite} target="_blank" rel="noopener noreferrer"><Building2 size={18} aria-hidden="true" />Website beheerder<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opent in een nieuw tabblad)</span></a> : <p className="visitor-info-copy">{contactWebsite}</p>)}
  </div>{!compact && <InformationDetails title="Wie kan je helpen?" hint="Contact en meldingen per onderwerp" text={contactInfo} />}</>;
}

export function CentreEntrepreneursText() {
  const { entrepreneursInfo } = useVisitorInfo();
  if (!entrepreneursInfo) return <p>Informatie voor ondernemers en eventuele verhuurmogelijkheden volgt na bevestiging.</p>;
  return <><p>Interesse in een winkelruimte of ondernemen in De Vijfhoek?</p><InformationDetails title="Ondernemen & verhuur" text={entrepreneursInfo} /></>;
}
