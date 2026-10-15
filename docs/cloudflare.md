# De website live zetten op Cloudflare

Dit project gebruikt Next.js met de OpenNext-adapter voor **Cloudflare Workers**. `wrangler.jsonc` bevat de Workernaam, de assetsbinding en de runtime-instellingen. De app heeft geen database, externe cache, betaalde afbeeldingendienst of runtimegeheimen nodig. Foto’s worden rechtstreeks als lokale bestanden geserveerd.

## Via GitHub in het dashboard

1. Open het [Cloudflare Dashboard](https://dash.cloudflare.com/) en log in op je eigen account.
2. Ga naar **Workers & Pages** en maak een nieuwe Worker-applicatie aan via de GitHub-/repository-import. Geef Cloudflare toegang tot `idkmanLool9/De-vijfhoek`.
3. Selecteer de repository en productiebranch `main`.
4. Vul de instellingen hieronder in. Laat de dependency-installatie automatisch uitvoeren; het vastgelegde `package-lock.json` hoort bij deze configuratie.
5. Start de deployment. De build en deployment moeten beide slagen.
6. Open de publieke `workers.dev`-URL die Cloudflare bij de Worker toont. Je kunt die URL ook op je telefoon of met anderen openen. Daar zie je de website echt live, inclusief de herkenbare placeholders voor nog aan te leveren foto’s.

| Veld | Waarde |
| --- | --- |
| Worker-/projectnaam | `de-vijfhoek` |
| Productiebranch | `main` |
| Rootdirectory | repository-root (`/`) |
| Buildcommando | `npm run build:cloudflare` |
| Deploycommando | `npx opennextjs-cloudflare deploy` |
| Node-versie | `24`, vastgelegd in `.nvmrc` |

Cloudflare bepaalt de uiteindelijke URL op basis van je account en Workernaam. `workers_dev: true` schakelt de publieke standaard-URL in. Een naamconflict in je eigen account kun je oplossen door `name` én `services[0].service` in `wrangler.jsonc` dezelfde nieuwe naam te geven en de dashboardnaam daarmee gelijk te houden.

De GitHub-koppeling kan iedere nieuwe commit op `main` automatisch deployen. Bekijk de buildlogs in het dashboard als een wijziging nog niet zichtbaar is. Een succesvolle Git-push betekent dat de code op GitHub staat; de website verandert pas na een geslaagde Cloudflare-deployment.

## Vanaf je eigen computer

Gebruik Node.js 24 en voer de commando’s uit vanuit de repository-root:

```bash
npm ci
npx wrangler login
npm run deploy:cloudflare
```

`wrangler login` opent de beveiligde Cloudflare-aanmelding in je browser. `deploy:cloudflare` bouwt de Next.js-app, maakt de Worker-bundle en publiceert die in het account waarmee je bent aangemeld. Het commando toont na succes het publieke adres. Zet geen toegangstokens in Git of in chatberichten.

## Lokaal testen in de Cloudflare-runtime

```bash
npm run build:cloudflare
npm run preview:cloudflare
```

De preview draait standaard op poort 8787 met de lokale Workers-runtime. Voor de bestaande browsertests:

```bash
E2E_PORT=3100 E2E_SERVER_COMMAND='npm run preview:cloudflare -- --port 3100' npm run test:e2e
```

Dat controleert dezelfde Cloudflare-bundle die wordt gedeployed. Alleen de build maken of de lokale preview starten publiceert de website nog niet. Een deployment voorbereiden zonder te publiceren kan met:

```bash
npx opennextjs-cloudflare deploy --dry-run
```

## Een eigen domein

Open na de eerste geslaagde deployment de Worker in Cloudflare en voeg onder **Settings → Domains & Routes** een **Custom Domain** toe. Cloudflare begeleidt de DNS- en HTTPS-instellingen voor dat domein. Je kunt intussen de standaard `workers.dev`-URL gebruiken. Er is in deze repository geen domeinnaam of account-ID verzonnen of vastgelegd.

## Opbouw van de deployment

- `npm run build:cloudflare` maakt `.open-next/worker.js` en `.open-next/assets`.
- `wrangler.jsonc` bindt de statische bestanden als `ASSETS` en verwijst naar de Worker-bundle.
- `nodejs_compat` maakt de Node.js-API’s beschikbaar die Next.js nodig heeft.
- `WORKER_SELF_REFERENCE` verwijst naar dezelfde Worker, zoals ondersteund door OpenNext.
- `open-next.config.ts` gebruikt de standaardadapter zonder externe incremental cache. De huidige inhoud komt uit lokale data; nieuwe inhoud wordt met een nieuwe deployment gepubliceerd.
- `images.unoptimized` serveert aangeleverde foto's direct, zonder aparte afbeeldingsdienst.
- `.open-next/`, `.wrangler/` en lokale `.dev.vars`-bestanden worden niet in Git opgenomen.

Technische bronnen: [OpenNext voor Cloudflare](https://opennext.js.org/cloudflare), [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) en [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).
