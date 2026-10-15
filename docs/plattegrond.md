# Bezoekersplattegrond

De interactieve SVG-kaart staat op `/bezoekersinformatie/#plattegrond`, binnen de bestaande websitevormgeving. Ze bevat zoeken op winkelnaam of unitnummer, een informatiepaneel met winkelpagina-links, selectie, zoom, verschuiven en toetsenbordbediening.

## Bron en geometrie

Het aangeleverde bestand **Ontwerp zonder titel (3).svg** staat ongewijzigd in `public/maps/de-vijfhoek-vastgoedplattegrond.svg`. Het bevat een ingebedde PNG van 5016 × 5016 pixels. De kaart gebruikt de volledige oorspronkelijke afbeelding als vaste SVG-beeldlaag met hetzelfde coördinatenstelsel (`viewBox="0 0 1286.25 1284.749967"`). De oorspronkelijke vormen, muren, kleuren en verhoudingen blijven behouden; er worden geen routes, ingangen of voorzieningen toegevoegd.

De controlehash van het aangeleverde en gepubliceerde bestand is identiek: `SHA-256 f5a877c19067b62fc82effdea87b6ac2f19c6967550484e58c3656e18c07287f`.

De opdrachtgever heeft vervolgens de originele genummerde vastgoedtekening als afbeelding in het gesprek aangeleverd. De nummers uit die tekening identificeren 24 units in de schone bron. `src/data/floor-plan-geometry.json` bevat de afzonderlijke interactieve paden. Die volgen de lichte binnenvlakken langs de bestaande donkere muren: rastercontouren zijn teruggebracht tot SVG-lijnsegmenten met een maximale vereenvoudiging van circa 0,31 SVG-eenheid (1,2 bronpixels). Kolommen en omsloten nevenruimtes blijven uitsparingen via `fillRule="evenodd"`. De oorspronkelijke beeldlaag blijft de geometrische referentie en is niet hertekend of vervangen.

De transformatie van de ingebedde rasterbron is `x = pixelX × 0.255981`, `y = pixelY × 0.255981 + 0.249401`. Labels staan binnen de bijbehorende ruimtes. Losse, ongenummerde nevenruimtes en verdiepingsdetails krijgen geen verzonnen nummer of winkeltoewijzing. Oppervlaktes uit de referentietekening worden niet als winkelgegevens gepubliceerd.

De volledige vastgoedtekening blijft één overzicht (`floor: null`). Een vermelding van een verdieping bij een gedeelte van de tekening wijst niet de hele kaart aan die verdieping toe. Begane grond en eerste verdieping tonen **Plattegrond nog niet beschikbaar** zolang geen afzonderlijke bevestigde kaart beschikbaar is.

## Bevestigde winkelkoppelingen

`src/data/shop-units.ts` is de centrale lijst, op uitdrukkelijke aanwijzing van de opdrachtgever:

| Units | Winkel |
| --- | --- |
| 1 | Albert Heijn |
| 5 | Gall & Gall |
| 9 | Bakkerij Nollen |
| 13 | G&W Gezondheids Winkel Rozemarijn |
| 15 | Kruidvat |
| 17 en 19 | Scapino |
| 33 en 35 | Wibra |
| 75 | Bibliotheek Oldenzaal |
| 141 | Action |

De kaart en winkelgids gebruiken dezelfde koppelingen. Bakkerij Nollen, Gall & Gall en G&W Gezondheids Winkel Rozemarijn hebben eigen statische winkelpagina’s. Rozemarijn is door de opdrachtgever expliciet als gebruiker van unit 13 bevestigd. Het compacte kaartlabel luidt **G&W Rozemarijn**; het informatiepaneel, de zoeklijst en winkelpagina tonen de volledige naam. Unitnummers worden niet gebruikt als vervanging voor een bevestigd volledig vestigingsadres. Ontbrekende contactgegevens, openingstijden en voorzieningen blijven leeg.

De overige zichtbare genummerde ruimtes tonen alleen **Unit [nummer]**, met `shopSlug: null`. Er zijn geen winkelnamen voor onbekende units bedacht. Nieuwe toewijzingen mogen na bevestiging worden toegevoegd aan de centrale lijst; nieuwe geometrie alleen met een herkenbare genummerde bron.

## Componenten en bediening

- `VisitorMap`: zoeken, kaart-/verdiepingskeuze, lijst, selectie en lege toestanden.
- `MapCanvas`: oorspronkelijke beeldlaag met interactieve SVG-paden, zoom 100–500%, slepen en pijlknoppen. Gewoon scrollen blijft de pagina bedienen. Op een ingezoomde kaart werkt verslepen ook met aanraking. Ctrl-scroll zoomt alleen wanneer de kaart focus heeft.
- `UnitDetails`: winkelnaam, categorie en bestaande winkelpagina bij een bevestigde koppeling; onbekende units krijgen geen verzonnen link of winkelnaam.
- `src/lib/floor-plan.ts`: zoeknormalisatie, camerabegrenzing, centreren en ruimtelijke toetsenbordnavigatie.

Tab geeft toegang tot de kaart en één winkelruimte. Pijltjestoetsen bij een ruimte verplaatsen de focus naar een ruimte in die richting; Enter en spatie selecteren. Op de kaart zelf verschuiven pijltjestoetsen het beeld. + en − zoomen, Home herstelt het overzicht en Escape wist de selectie. Tab verlaat de kaart. De lijst biedt dezelfde selectie zonder precisieklikken of slepen. Selectie en zoekresultaten worden via live-regio’s gemeld; kleur is niet de enige selectie-indicator.

Er zijn geen API’s, sleutels, database of externe kaartdiensten nodig. Lokale bronafbeeldingen krijgen op GitHub Pages automatisch het juiste basepad via `assetPath`. De tijdelijke fotobewerker en alle eerder aangeleverde foto’s blijven behouden.

## Verificatie

```bash
npm run lint
npm run build:cloudflare-pages
npm run typecheck
E2E_PAGES=1 E2E_PORT=3400 npm run test:e2e
```

`tests/floor-map.spec.ts` controleert de echte bezoekerspagina: onveranderde bronbytes en verhoudingen, zoom, verschuiven, de elf bevestigde unittoewijzingen met onafhankelijke referentiepunten, winkelpagina-links, onbekende units zonder winkelnaam, ontbrekende verdiepingen en responsive toegankelijkheid.

`tests/map-canvas.spec.ts` controleert de kaartcomponent apart met herkenbaar synthetische geometrie. De harness staat buiten de App Router en is geen publieke route of plattegrond van De Vijfhoek. Deze tests controleren selectie, zoeken, meerdere units per winkel, zoomlimieten, slepen, aanraking, focus, toetsenbord, geometriebehoud en toegankelijkheid.
