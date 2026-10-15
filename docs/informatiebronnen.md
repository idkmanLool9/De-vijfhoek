# Informatie aanvullen en controleren

## Bevestigd door de opdrachtgever

- De negen winkels en hun unitkoppelingen staan centraal in `src/data/shops.ts` en `src/data/shop-units.ts`.
- De genummerde vastgoedplattegrond bepaalt de unitcontouren. Een unitnummer is geen zelfstandig bewijs voor een volledig postadres of een verdieping.
- Bakkerij Nollen (unit 9) en Gall & Gall (unit 5) zijn daarom ook opgenomen op **Eten & drinken**, vanuit de centrale categorieën Eten & drinken en Dranken. Er zijn geen menu’s, zitplaatsen, openingstijden of horecavoorzieningen uit afgeleid.
- Alle 25 aangeleverde beeldkeuzes zijn verwerkt. De fotobewerker en eerdere bestanden blijven behouden.

## Nog te onderzoeken

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

Volgende stap: start een nieuwe taak met de gepubliceerde omgeving en controleer daar eerst de toegang tot de officiële bronnen. Vraag niet opnieuw om hetzelfde domeinvoorstel te publiceren: die stap is al voltooid. Als de bronnen ook in een nieuwe taak worden geblokkeerd, onderzoek de actieve netwerkconfiguratie verder voordat actuele gegevens worden ingevuld. Hervat het bovenstaande bronnenonderzoek zodra toegang daadwerkelijk werkt.
