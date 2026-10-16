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

De tests controleren de homepage, winkelzoekfunctie, gecombineerde categoriefilters, lege toestanden, alle bevestigde winkeldetails, 404’s, interne links en ankers, toetsenbordnavigatie, het mobiele menu, schermbreedtes van 320–1440 pixels en automatische WCAG A/AA-regels met axe. Automatische toegankelijkheidschecks vervangen geen volledige handmatige audit.

## Routes

| Route | Inhoud |
| --- | --- |
| `/` | Homepage |
| `/winkels` | Doorzoekbare winkelgids met categorieën |
| `/winkels/[slug]` | Winkeldetails, metadata en breadcrumbs |
| `/eten-en-drinken` | Bevestigde winkels voor eten en drinken |
| `/nieuws` | Nieuws en evenementen met filters |
| `/nieuws/[slug]` | Detailtemplate voor bevestigde publicaties |
| `/bezoekersinformatie` | Praktische onderwerpen, plattegrond met zoom en FAQ |
| `/over-de-vijfhoek` | Centruminformatie en contactsecties |
| `/bewerken` | Tijdelijke lokale bewerkmodus voor foto’s en logo’s |
| `/bewerken/informatie` | Tijdelijke lokale bewerkmodus voor bezoekersinformatie |

## Gegevens en officiële media

De bezoekerspagina toont de aangeleverde vastgoedplattegrond met zoom, verschuiven en toetsenbordbediening. Het SVG-bestand staat ongewijzigd onder `public/maps/`. De genummerde referentietekening bepaalt de 24 klikbare unitcontouren. Elf van de twaalf bevestigde winkels zijn aan dertien units gekoppeld, met zichtbare winkelnamen en links naar de winkelpagina’s. Voor Hebbez | Ik wil Mode is nog geen unit bevestigd. Onbekende winkels tonen alleen het unitnummer; afzonderlijke verdiepingen wachten op een eigen bevestigde kaart. De centrale winkelkoppelingen staan in `src/data/shop-units.ts`. Zie [Bezoekersplattegrond](docs/plattegrond.md) voor bronstatus, gegevens en controles.

Er is een tijdelijke bewerkmodus op **`/bewerken/`** voor het kiezen van officiële foto’s en logo’s, beschrijvingen en uitsneden. Keuzes worden lokaal in de browser bewaard en kunnen als ZIP-pakket worden geëxporteerd en teruggezet. Ze worden pas voor iedereen zichtbaar nadat het pakket in de repository is verwerkt en gedeployed. Zie [Foto’s bewerken](docs/fotos-bewerken.md) voor gebruik, overdracht en het later verwijderen van de editor.

Op **`/bewerken/informatie/`** kan de opdrachtgever zelf bereikbaarheid, parkeren, toegankelijkheid, beheer/contact en centrumteksten invullen. De gegevens worden lokaal bewaard en zijn als JSON te downloaden, terug te zetten en met `npm run info:import -- /pad/naar/bestand.json` te verwerken. De gepubliceerde gegevens staan in `src/data/visitor-info.json`. Zie [Bezoekersinformatie invullen](docs/informatie-bewerken.md) voor de werkwijze. Deze opslag staat los van de fotokeuzes.

Beelden krijgen automatisch kleinere responsive WebP-varianten vóór de build; originelen en uitsneden blijven bewaard. Over De Vijfhoek bevat een Google Maps-embed. Winkelpagina’s linken gratis naar Google voor routeplanning, openingstijden, reviews en contactmogelijkheden, zonder API-sleutel of verzonnen gegevens. Zie [Google-koppelingen en prestaties](docs/google-en-prestaties.md) voor de werking, controles en resterende brongegevens.

- `src/data/shops.ts`: de door de opdrachtgever bevestigde winkels. Voeg een object met unieke `slug` toe voor een nieuwe bevestigde winkel. Categorieën staan in hetzelfde bestand; zoekresultaataantallen worden uit de data berekend.
- Onbekende vestigingsgegevens zijn `null`. Telefoon-, e-mail-, website-, openingstijden- en voorzieningensecties tonen uitsluitend ingevulde, bevestigde informatie. Voorlopig zijn er geen bevestigde contactgegevens of openingstijden opgenomen.
- `src/data/news.ts`: uitsluitend redactioneel bevestigde publicaties toevoegen, met ISO-publicatiedatum, unieke slug, `verified: true` en `status: "published"`. Alleen die berichten zijn publiek zichtbaar. Zonder bevestigde berichten geeft een nieuwsdetailroute 404; er worden geen voorbeeldartikelen gepubliceerd. De detailtemplate is gebouwd en compileert, maar kan pas met echte inhoud functioneel worden gecontroleerd.
- Aangeleverde officiële foto’s en logo’s staan onder `public/images/official/`. De publicatiekoppelingen en uitsneden staan centraal in `src/data/media.json`; de tijdelijke fotobewerker kan aanvullende media voorbereiden. Alle aangeleverde bestanden blijven bewaard, ook wanneer een bestand nog niet aan een openbare positie is gekoppeld.
- Beeldposities zonder aangeleverde officiële media tonen een herkenbare placeholder. De homepagefoto behoudt de donkere overlay voor de witte tekst. Gebruik geen gegenereerde of willekeurige stockfoto’s als beeld van het centrum.
- Bezoekersinformatie en achtergrondteksten bevatten geen onbevestigde parkeerlocaties, tarieven, toegangsfaciliteiten, adressen, eigenaar of historische data. Deze kunnen na bevestiging gericht worden aangevuld.
- [Informatiebronnen](docs/informatiebronnen.md) beschrijft de bevestigde gegevens, de nog te controleren onderwerpen en de benodigde webtoegang voor verder onderzoek.

## Vormgeving

De aangeleverde goedgekeurde ontwerpen zijn leidend: spierwit, zwarte/antraciete tekst, ruime marges, dunne borders, rustige kaarten en afgeronde hero-knoppen. Globale stijlen en responsive instellingen staan in `src/app/globals.css`; gedeelde componenten in `src/components/`. De homepage is eerst gebouwd en visueel en technisch gecontroleerd, daarna zijn de overige routes toegevoegd.

## Productie

```bash
npm run build
npm start
```

De website heeft paginatitels, beschrijvingen, Nederlandse taalinstelling, leesbare routes en echte 404-responses.

## Live bekijken via Cloudflare Pages

Het bestaande project **de-vijfhoek.pages.dev** gebruikt Cloudflare Pages. Open in Cloudflare **Workers & Pages → de-vijfhoek → Settings → Builds & deployments** en gebruik:

| Instelling | Waarde |
| --- | --- |
| Repository | `idkmanLool9/De-vijfhoek` |
| Productiebranch | `main` |
| Framework preset | `None` |
| Build command | `npm run build:cloudflare-pages` |
| Build output directory | `out` |
| Root directory | repository-root / standaard |
| Node.js | `24`, via `.nvmrc` |

Sla de instellingen op en deploy de nieuwste commit op `main`. Na een geslaagde productie-deployment staan de website op **https://de-vijfhoek.pages.dev/** en de tijdelijke foto-editor op **https://de-vijfhoek.pages.dev/bewerken/**. De map `out` is ook vastgelegd in `wrangler.jsonc`.

```bash
npm run build:cloudflare-pages
npm run preview:cloudflare-pages
```

De volledige uitleg en hulp bij een 404 staan in [docs/cloudflare.md](docs/cloudflare.md). Het eerdere `build:cloudflare`-commando herkent Cloudflare Pages automatisch via `CF_PAGES=1`. De optionele OpenNext Workers-configuratie blijft beschikbaar in `wrangler.worker.jsonc`; de bestaande preview- en deployscripts verwijzen daar expliciet naar.

## Live bekijken via GitHub Pages

GitHub Pages heeft een eigen statische build en automatische workflow. Open [Settings → Pages](https://github.com/idkmanLool9/De-vijfhoek/settings/pages) en kies **Source: GitHub Actions**. De workflow `.github/workflows/pages.yml` bouwt, test en publiceert iedere push naar `main`. Start hem zo nodig handmatig via **Actions → Deploy website to GitHub Pages → Run workflow**.

Na een geslaagde deployment is het verwachte adres **https://idkmanlool9.github.io/De-vijfhoek/**. De workflow toont de daadwerkelijke deployment-URL. Zie [docs/github-pages.md](docs/github-pages.md) voor de volledige instructies.

```bash
npm run build:pages
npm run preview:pages
```

De Pages-build exporteert naar `out/`, inclusief alle winkelroutes en een 404-pagina. Het pad `/De-vijfhoek/` wordt toegepast op navigatie, scripts, stylesheets en lokale media. De normale Next.js- en Cloudflare-build blijven beschikbaar.
