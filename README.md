# De Vijfhoek Oldenzaal

Responsive website voor Winkelcentrum In den Vijfhoek. Gebouwd met Next.js App Router, TypeScript, Tailwind CSS en Lucide React. Lokale data, zonder database of externe API’s. Er zijn geen sleutels of omgevingsvariabelen nodig.

## Ontwikkelen

Gebruik Node.js 24 LTS en npm 11. De cloudomgeving is al geïsoleerd: werk in de bestaande checkout, maak geen extra Git-worktree tenzij daarom wordt gevraagd.

```bash
cd /workspace/De-vijfhoek
npm ci --cache /tmp/devijfhoek-npm-cache
npm run dev
```

De ontwikkelserver luistert op poort 3000. `allowedDevOrigins` staat alleen de extra lokale testhost `127.0.0.1` toe. Voeg bij gebruik van een andere ontwikkelhost uitsluitend die concrete vertrouwde host toe. Er is geen wildcard ingesteld.

## Controleren

```bash
npm run lint
npm run build
npm run typecheck
npm run test:e2e
```

De browsertests gebruiken het aanwezige `/usr/bin/chromium`, of `CHROMIUM_PATH` als dat is ingesteld. Op een andere machine kun je de Playwright-browser installeren met `npx playwright install chromium`.

Een bestaande ontwikkelserver op poort 3000 wordt hergebruikt. Testen tegen de productiebuild kan na `npm run build`:

```bash
E2E_PORT=3100 E2E_SERVER_COMMAND='npm run start -- --port 3100' npm run test:e2e
```

De tests controleren de homepage, winkelzoekfunctie, gecombineerde categoriefilters, lege toestanden, zes winkeldetails, 404’s, interne links en ankers, toetsenbordnavigatie, het mobiele menu, schermbreedtes van 320–1440 pixels en automatische WCAG A/AA-regels met axe. Automatische toegankelijkheidschecks vervangen geen volledige handmatige audit.

## Routes

| Route | Inhoud |
| --- | --- |
| `/` | Homepage |
| `/winkels` | Doorzoekbare winkelgids met categorieën |
| `/winkels/[slug]` | Winkeldetails, metadata en breadcrumbs |
| `/eten-en-drinken` | Horeca-informatie; wacht op bevestigde zaken |
| `/nieuws` | Nieuws en evenementen met filters |
| `/nieuws/[slug]` | Detailtemplate voor bevestigde publicaties |
| `/bezoekersinformatie` | Onderwerpen, plattegrondplaceholder en FAQ |
| `/over-de-vijfhoek` | Centruminformatie en contactsecties |

## Gegevens en officiële media

- `src/data/shops.ts`: de zes door de opdrachtgever bevestigde winkels. Voeg een object met unieke `slug` toe voor een nieuwe bevestigde winkel. Categorieën staan in hetzelfde bestand; zoekresultaataantallen worden uit de data berekend.
- Onbekende vestigingsgegevens zijn `null`. Telefoon-, e-mail-, website-, openingstijden- en voorzieningensecties tonen uitsluitend ingevulde, bevestigde informatie. Voorlopig zijn er geen bevestigde contactgegevens of openingstijden opgenomen.
- `src/data/news.ts`: uitsluitend redactioneel bevestigde publicaties toevoegen, met ISO-publicatiedatum, unieke slug, `verified: true` en `status: "published"`. Alleen die berichten zijn publiek zichtbaar. Zonder bevestigde berichten geeft een nieuwsdetailroute 404; er worden geen voorbeeldartikelen gepubliceerd. De detailtemplate is gebouwd en compileert, maar kan pas met echte inhoud functioneel worden gecontroleerd.
- Officiële winkelbeelden en logo’s kunnen onder `public/images/` komen, met lokale paden in `photo` en `logo`. Er zijn nu geen echte centrumfoto’s, winkelfoto’s of logo’s aangeleverd. Het winkelsymbool bij de tijdelijke tekstweergave in de header is een Lucide-icoon, geen officieel logo.
- `src/components/ui.tsx` en de homepage bevatten herkenbare foto-/hero-placeholders. Vervang die door aangeleverde officiële media. Behoud bij de homepagefoto de donkere overlay voor de witte tekst. Gebruik geen gegenereerde of willekeurige stockfoto’s als beeld van het centrum.
- Bezoekersinformatie en achtergrondteksten bevatten geen onbevestigde parkeerlocaties, tarieven, toegangsfaciliteiten, adressen, eigenaar of historische data. Deze kunnen na bevestiging gericht worden aangevuld.

## Vormgeving

De aangeleverde goedgekeurde ontwerpen zijn leidend: spierwit, zwarte/antraciete tekst, ruime marges, dunne borders, rustige kaarten en afgeronde hero-knoppen. Globale stijlen en responsive instellingen staan in `src/app/globals.css`; gedeelde componenten in `src/components/`. De homepage is eerst gebouwd en visueel en technisch gecontroleerd, daarna zijn de overige routes toegevoegd.

## Productie

```bash
npm run build
npm start
```

De website heeft paginatitels, beschrijvingen, Nederlandse taalinstelling, leesbare routes en echte 404-responses. Er is nog geen productiedomein opgegeven. Hosting, domeinkoppeling en publicatie vallen buiten deze implementatie.
