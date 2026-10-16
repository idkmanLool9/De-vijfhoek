# Beelden, navigatie en Google

## Sneller laden zonder originelen te verwijderen

`npm run media:optimize` maakt WebP-weergavebestanden in `public/images/optimized/` en legt de varianten vast in `src/data/media-optimized.json`. Het script draait automatisch vóór ontwikkelen en bouwen, ook voor GitHub Pages en Cloudflare Pages. `sharp` is een directe ontwikkelafhankelijkheid.

- Foto’s krijgen varianten tot 480, 960 en 1600 pixels breed; de hoofdfoto ook tot 2400 pixels. Kleine bronnen worden niet vergroot.
- Logo’s krijgen verliesloos gecodeerde varianten tot 160 en 320 pixels breed, met transparantie.
- Namen bevatten een bron-/encoderhash. Ongewijzigde varianten worden hergebruikt. `_headers` maakt langdurige caching van deze bestanden op Cloudflare mogelijk; GitHub Pages bepaalt zelf zijn cacheheaders.
- `next/image` gebruikt een eigen loader met echte statische bestanden en passende `sizes`. Er is geen runtime-afbeeldingenserver of Cloudflare Images-abonnement nodig.
- Originele bestanden, `media.json`, uitsneden en lokale editorpakketten blijven behouden. De editor toont kleinere publicatievoorbeelden, maar verandert lokale uploads en ZIP-exports niet.

De 25 huidige publicatiebeelden bevatten samen 32,23 MB aan bronbestanden. De grootste weergavevariant per beeld bevat samen 3,32 MB, ongeveer 90% minder. Dit is een bestandsvergelijking, geen gemeten snelheid op een bezoekersverbinding. De winkelgids gebruikt op mobiel kleinere varianten; browsertests begrenzen de daadwerkelijk gedownloade kaartbeelden tot minder dan 2 MB samen en controleren dat geen originele megabytebestanden worden geladen.

Na het importeren van een nieuw fotopakket worden passende varianten bij de volgende build automatisch gegenereerd. De oorspronkelijke bestanden worden niet verwijderd. Bij een verandering aan het encoderrecept moet ook de receptversie in `optimize-media.mjs` worden gewijzigd.

## Scrollen bij navigatie

De website gebruikt CSS `scroll-behavior: smooth`. `<html data-scroll-behavior="smooth">` vertelt Next.js om dit tijdens paginawissels tijdelijk uit te schakelen. Zonder die instelling werd klikken op het headerlogo gereproduceerd als een landing circa 553 pixels onder de bovenkant van de homepage.

`NavigationScroll` handelt daarnaast alleen expliciete klikken op gewone interne links af. Na de routercommit stopt deze een eventueel nog lopende ankerscroll en zet de nieuwe pagina direct bovenaan. Links met een hash, openen in een nieuw tabblad, downloads, de eerste paginalading en terug/vooruit worden niet overschreven. De browsertests controleren header- en footerlogo’s, navigatie vanaf de footer, navigatie tijdens een ankerscroll en de terugkeer naar een plattegrondanker op desktop en mobiel.

## Gratis Google-koppelingen

De opdrachtgever koos op 16 oktober 2026 voor gratis Google-links, zonder Places API of API-sleutel.

- **Over De Vijfhoek:** de eerdere centrumfoto is vervangen door een lazy geladen Google Maps-iframe met de zoekopdracht `Winkelcentrum In den Vijfhoek Oldenzaal`. Openen in Google Maps en routeplanning blijven ook buiten het iframe beschikbaar. De oorspronkelijke foto en fotobewerkerplek zijn bewaard.
- **Winkelpagina’s:** links naar openingstijden en contactmogelijkheden op Google Maps, routeplanning en een Google-zoekopdracht voor reviews. De zoekopdracht bevat de bevestigde winkelnaam, het aangeleverde straatadres indien beschikbaar en Oldenzaal. Alleen een unitnummer wordt niet omgezet in een straatadres.
- **Bezoekersinformatie:** routeplanning voor auto, fiets en OV, zoeken naar parkeerlocaties en een link naar de gemeente Oldenzaal. Er zijn geen parkeertarieven, ingangen of laadpunten uit zoekopdrachten afgeleid.

Deze links zoeken bij Google; er zijn geen officieel geverifieerde Place IDs toegewezen. Ze publiceren geen Google-reviewteksten, beoordelingen, aantallen, telefoonnummers of openingstijden als eigen websitegegevens. Google beheert de getoonde resultaten en tijden. De algemene Google Maps-koppeling is geen bevestigde eigen winkelwebsite.

Automatische winkelgegevens **op de website zelf** zijn bewust niet geactiveerd. Dat vraagt een afzonderlijk ingerichte Places API-koppeling, gecontroleerde Place IDs en serveropslag voor de sleutel. Een Places-sleutel hoort niet in clientcode, `NEXT_PUBLIC_*` of de GitHub-repository. De uiteindelijke inrichting, kosten en voorwaarden moeten dan opnieuw worden beoordeeld.

Externe Google-pagina’s konden in de ontwikkelomgeving niet live worden gecontroleerd: rechtstreekse verzoeken aan de Google-documentatie en Places-host werden op 16 oktober door de netwerkproxy met HTTP 403 geweigerd. Browsertests controleren de echte URL-opbouw, bestemming, iframe-titel, fallbacks en responsive layout; zij bevestigen geen externe Google-bedrijfsgegevens.

## Resterende feitelijke informatie

Beheer/contact van het centrum, geschiedenis, concrete toegankelijkheidsvoorzieningen en lokale winkelcontacten blijven afhankelijk van bevestigde bronnen. Ze zijn niet uit een ontwerp, winkelcategorie, unitnummer of Google-zoeklink overgenomen. De centrale bronstatus staat in `docs/informatiebronnen.md`.
