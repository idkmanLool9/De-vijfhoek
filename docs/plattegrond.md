# Bezoekersplattegrond

De kaartinterface staat op `/bezoekersinformatie/#plattegrond`, binnen de bestaande websitevormgeving. Zoeken op winkelnaam of de aangeleverde unitnummers, het informatiepaneel en de keuze tussen het volledige overzicht en de twee verdiepingen zijn geïntegreerd.

## Huidige bronstatus

De aangeleverde opgeschoonde afbeelding bevat geen leesbare unitnummers. Daardoor is niet vast te stellen welke contour bij welk officieel nummer hoort. De opdrachtgever heeft aangegeven dat de originele vastgoedplattegrond mét unitnummers en oppervlaktes beschikbaar is. Dat bestand moet nog worden aangeleverd.

Daarom zijn de productievelden `sourceImage` en `geometry` leeg. De website toont **Plattegrond nog niet beschikbaar**, terwijl zoeken en winkelinformatie al werken. Er is geen benaderende hertekening, verzonnen unitvorm, winkelpositie, ingang, voorziening of looproute gepubliceerd. Ook zijn er geen oppervlaktes ingevuld.

De volledige vastgoedtekening is één overzicht (`floor: null`). Vermeldingen van een verdieping op een gedeelte van de tekening mogen niet worden gebruikt om de hele tekening aan die verdieping toe te wijzen. Begane grond en eerste verdieping tonen hun lege toestand zolang geen bevestigde kaart voor die verdieping beschikbaar is.

De tien door de opdrachtgever genoemde unitnummers zijn afzonderlijke, nog niet geplaatste records. De acht voorlopige koppelingen tussen winkels en unitnummers staan in `src/data/map-allocation-candidates.ts`. Dit bestand wordt niet door de publieke interface geïmporteerd. De actuele locatiegegevens én de grenzen in de originele plattegrond moeten worden gecontroleerd voordat een koppeling wordt overgenomen in `shopSlug`. Bakkerij Nollen en Gall & Gall zijn niet op basis van alleen deze onderzoeksgegevens aan de publieke winkelgids toegevoegd.

## Originele kaart toevoegen

1. Verkrijg de originele genummerde vastgoedplattegrond, bij voorkeur als vector-PDF of SVG. Gebruik anders een scherpe afbeelding met voldoende resolutie om alle unitnummers en muren te herkennen.
2. Bewaar de bron onder `public/maps/`. Bij SVG moeten alleen vertrouwde lokale beeld- en tekengegevens worden gebruikt, zonder scripts of externe verwijzingen.
3. Vul `sourceImage` en `viewBox` in `src/data/floor-plan.ts` in met de oorspronkelijke afmetingen. De oorspronkelijke tekening blijft als SVG-beeldlaag behouden. Maak geen nieuwe ruimtes, muren, doorgangen of verdiepingsindeling.
4. Trek de daadwerkelijke unitgrenzen over in hetzelfde coördinatenstelsel. Per unit bevat `geometry` een SVG-`path`, een punt voor het unitnummer en de begrenzende rechthoek. Neem uitsparingen mee als subpaden met `fillRule="evenodd"`. De interactieve paden liggen over de bron; ze vervangen de oorspronkelijke muren niet. Verwijder uitsluitend overbodige tekst en markeringen wanneer een opgeschoonde versie nodig is.
5. Controleer iedere winkelkoppeling aan de hand van actuele officiële vestigingsgegevens en het nummer in de originele tekening. Een gepubliceerd vestigingsadres alleen bewijst niet welke vorm in de tekening daarbij hoort. Zet pas daarna de bestaande winkel-slug in `shopSlug`; voor een nieuwe winkel moet eerst een bevestigd record in `src/data/shops.ts` worden toegevoegd.
6. Laat onbekende winkels op `shopSlug: null`: de interface toont dan alleen **Unit [nummer]** en **Winkel nog niet bevestigd**. Neem alle werkelijk zichtbare units over, zonder het totaal uit de huidige lijst af te leiden.
7. Voeg een aparte verdieping alleen na bevestiging als afzonderlijk plan toe met `floor: "ground"` of `floor: "first"`. Laat het volledige overzicht behouden wanneer de bron meerdere gebouwdelen beslaat.
8. Vergelijk de kaart en grenzen visueel met de originele bron, controleer zoekresultaten en winkelpagina’s, en voer onderstaande checks opnieuw uit.

Er zijn geen API’s, sleutels, database of externe kaartdiensten nodig. Lokale bronafbeeldingen krijgen op GitHub Pages automatisch het juiste basepad via `assetPath`.

## Componenten en bediening

- `VisitorMap`: zoeken, kaart-/verdiepingskeuze, lijst, selectie en lege toestanden.
- `MapCanvas`: interactieve SVG, oorspronkelijke beeldlaag, zoom 100–500%, slepen en pijlknoppen. Gewoon scrollen blijft de pagina bedienen. Op een ingezoomde kaart werkt verslepen ook met aanraking. Ctrl-scroll zoomt alleen wanneer de kaart focus heeft.
- `UnitDetails`: winkelnaam, categorie en bestaande winkelpagina bij een bevestigde koppeling. Bij ontbrekende gegevens worden geen links of locaties verzonnen.
- `src/lib/floor-plan.ts`: zoeknormalisatie, camerabegrenzing, centreren en ruimtelijke toetsenbordnavigatie.

Tab geeft toegang tot de kaart en één winkelruimte. Pijltjestoetsen bij een ruimte verplaatsen de focus naar een ruimte in die richting; Enter en spatie selecteren. Op de kaart zelf verschuiven pijltjestoetsen het beeld. + en − zoomen, Home herstelt het overzicht en Escape wist de selectie. Tab verlaat de kaart. De lijst biedt dezelfde selectie zonder precisieklikken of slepen. Selectie en zoekresultaten worden via live-regio’s gemeld; kleur is niet de enige selectie-indicator.

## Verificatie

```bash
npm run lint
npm run build:cloudflare-pages
npm run typecheck
E2E_PAGES=1 E2E_PORT=3360 npm run test:e2e
```

`tests/floor-map.spec.ts` controleert de echte bezoekerspagina met de ontbrekende bron, zoeken, winkelpagina-links, de onbevestigde unitkoppelingen, verdiepingen en toegankelijkheid.

`tests/map-canvas.spec.ts` controleert de kaartcomponent apart met herkenbaar synthetische geometrie. De harness staat buiten de App Router, wordt alleen door de tests gebouwd met esbuild en is geen publieke route of plattegrond van De Vijfhoek. Deze tests controleren selectie, zoeken, meerdere units per winkel, zoomlimieten, slepen, aanraking, focus, toetsenbord, geometriebehoud en responsive toegankelijkheid. Deze technische tests bevestigen geen echte winkelpositie. De bronvergelijking en controle van de daadwerkelijke winkelindeling volgen zodra het origineel beschikbaar is.
