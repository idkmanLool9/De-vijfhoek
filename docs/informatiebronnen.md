# Informatie aanvullen en controleren

## Bevestigd door de opdrachtgever

- De twaalf bevestigde winkels staan centraal in `src/data/shops.ts`. Elf winkels hebben samen dertien unitkoppelingen in `src/data/shop-units.ts`; de unit van Hebbez | Ik wil Mode is nog niet bevestigd.
- De genummerde vastgoedplattegrond bepaalt de unitcontouren. Een unitnummer is geen zelfstandig bewijs voor een volledig postadres of een verdieping.
- Bakkerij Nollen (unit 9) en Gall & Gall (unit 5) zijn daarom ook opgenomen op **Eten & drinken**, vanuit de centrale categorieën Eten & drinken en Dranken. Er zijn geen menu’s, zitplaatsen, openingstijden of horecavoorzieningen uit afgeleid.
- Alle 25 aangeleverde beeldkeuzes zijn verwerkt. De fotobewerker en eerdere bestanden blijven behouden.

## Aanvulling door de opdrachtgever op 16 oktober 2026

| Winkel | Aangeleverd straatadres | Nieuwe unitkoppeling |
| --- | --- | --- |
| Albert Heijn | In den Vijfhoek 1 | Bestaande unit 1 behouden |
| Bakkerij Nollen | In den Vijfhoek 9 | Bestaande unit 9 behouden |
| G&W Gezondheidswinkel Rozemarijn | In den Vijfhoek 13 | Bestaande unit 13 behouden |
| Scapino | In den Vijfhoek 17-19 | Bestaande units 17 en 19 behouden |
| Wibra | In den Vijfhoek 33-35 | Bestaande units 33 en 35 behouden |
| Candy Corner | Niet aangeleverd | Unit 25 |
| 't Glashoes | Alleen nummer 49 aangeleverd; geen volledig straatadres afgeleid | Unit 49 |
| Hebbez \| Ik wil Mode | Niet aangeleverd | Nog niet bevestigd |

Deze gegevens zijn overgenomen uit de expliciete gebruikersaanvulling. De daarbij verstrekte [Stagemarkt-link voor Wibra](https://stagemarkt.nl/leerbedrijven/wibra_07f2e78e-d225-428c-878b-e2f833926bea) is als aangeleverde bron vastgelegd, niet als zelfstandig geraadpleegde actuele bron. De algemene Google Maps-links verwijzen niet naar een concrete vestiging en zijn niet als winkelwebsites gepubliceerd.

De nieuwe namen zijn toegevoegd zonder openingstijden, telefoonnummers, postcodes, websites of voorzieningen af te leiden. Hebbez | Ik wil Mode valt op basis van de aangeleverde naam onder Mode. Voor Candy Corner en 't Glashoes blijft de branche onbevestigd: zij tonen voorlopig het algemene label Winkel en staan in Alle winkels. De zes nieuwe foto-/logoplekken zijn beschikbaar in de bestaande fotobewerker; de 25 aangeleverde beeldkeuzes en alle oorspronkelijke bestanden zijn behouden.

## Nog te onderzoeken

De gebruiker heeft verduidelijkt dat met ontbrekende informatie niet een privacylek werd bedoeld. De aanvulling van 16 oktober bevat nu gratis Google-links voor beschikbare openingstijden, contactmogelijkheden, reviews, foto’s en routes. De gebruiker heeft expliciet gekozen om de Places API nog niet in te richten. Deze links en de centrumembed zijn geen zelfstandig geverifieerde vestigingsgegevens en vullen de lege feitelijke velden niet automatisch. Zie `docs/google-en-prestaties.md`.

| Onderwerp | Te controleren bij | Publiceren na controle |
| --- | --- | --- |
| Parkeren | Gemeente Oldenzaal en exploitant | Parkeerlocaties, actuele tarieven, betaalperioden en eventuele hoogtebeperkingen |
| Bereikbaarheid | Gemeente, NS en 9292 | Bezoekadres, actuele stations-/haltegegevens en betrouwbare route-informatie |
| Winkels | Officiële vestigingspagina per winkel | Volledig adres, telefoon, website en reguliere openingstijden |
| Toegankelijkheid | Beheerder en officiële vestigingsinformatie | Daadwerkelijke toegangen en voorzieningen; niet afleiden uit een foto of een categorie |
| Centruminformatie | Beheerder, gemeente en eigenaar | Beheer, contact en geschiedenis met bronverwijzing |
| Overige winkels en units | Officiële winkelinformatie plus genummerde plattegrond | Alleen aangetoonde namen en unittoewijzingen |
| Nieuws en evenementen | Officiële publicatie of organisator | Actuele publicaties en vastgestelde data; geen voorbeelden uit het ontwerp overnemen |

Voor nieuwe vestigingsgegevens moeten de geraadpleegde URL, controledatum en het ondersteunde gegeven worden vastgelegd. Een zoekresultaatsamenvatting of oud vestigingsadres alleen is onvoldoende voor gewijzigde openingstijden of een kaarttoewijzing. Bij bronconflicten blijft het betreffende veld leeg totdat het verschil is opgehelderd.

## Webtoegang in deze omgeving

Op 15 oktober 2026 zijn rechtstreekse verzoeken aan onder meer de gemeente, Albert Heijn, Action, de bibliotheek en Google door de netwerkproxy geweigerd (`CONNECT ... 403 Forbidden`). Er is daardoor geen actuele openbare broninhoud opgehaald en geen nieuw tarief, openingstijd, telefoonnummer, parkeervoorziening of evenement gepubliceerd.

De gebruiker heeft de netwerkuitbreiding voor de gemeente, winkelwebsites, vervoersinformatie en zoekmachines inmiddels gepubliceerd. Dit is gecontroleerd met de configuratietool: er is een nieuwe gepubliceerde configuratieversie, geen open concept, en de benodigde domeinen staan in de domeinlijst. De bestaande toegang tot pakketdiensten is behouden.

De al lopende sessie ontvangt desondanks nog steeds proxyfouten voor deze bronwebsites. Een controlevraag aan `registry.npmjs.org` geeft wel HTTP 200. De gepubliceerde instellingen en de daadwerkelijk werkende toegang zijn dus afzonderlijk gecontroleerd; de oorzaak van de resterende blokkade is niet vastgesteld. De beschikbare tools kunnen deze draaiende omgeving niet opnieuw starten of koppelen.

Op 16 oktober 2026 is dit opnieuw gecontroleerd voor Albert Heijn, Action, de gemeente Oldenzaal en Google. Alle vier verzoeken zijn al bij de proxyverbinding geweigerd met HTTP 403; er is geen vestigings- of gemeente-inhoud opgehaald. De nieuwe gratis Google-links veranderen die ontwikkelblokkade niet. Ontbrekende beheer-, contact- en voorzieningsgegevens zijn daarom niet met onbevestigde gegevens ingevuld.

Volgende stap: start een nieuwe taak met de gepubliceerde omgeving en controleer daar eerst de toegang tot de officiële bronnen. Vraag niet opnieuw om hetzelfde domeinvoorstel te publiceren: die stap is al voltooid. Als de bronnen ook in een nieuwe taak worden geblokkeerd, onderzoek de actieve netwerkconfiguratie verder voordat actuele gegevens worden ingevuld. Hervat het bovenstaande bronnenonderzoek zodra toegang daadwerkelijk werkt.
