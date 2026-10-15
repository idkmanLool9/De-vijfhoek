# De website live zetten op Cloudflare Pages

Het bestaande project **de-vijfhoek** op **de-vijfhoek.pages.dev** is een Cloudflare Pages-project. Gebruik daarvoor de statische Pages-build. Die bevat de homepage, winkelroutes, foto-editor, scripts, stylesheets en een echte 404-pagina. Er zijn geen database, uploadserver, applicatiesecrets of betaalde afbeeldingsdiensten nodig.

## Het bestaande Pages-project instellen

1. Open het [Cloudflare Dashboard](https://dash.cloudflare.com/), ga naar **Workers & Pages** en open **de-vijfhoek**.
2. Open **Settings → Builds & deployments → Build configurations → Edit** (in sommige dashboardversies **Settings → Build**).
3. Controleer de onderstaande instellingen en sla ze op.
4. Ga naar **Deployments** en start een nieuwe deployment van de nieuwste commit op `main`. Gebruik **Retry deployment** bij die commit als die al klaarstaat. Een retry van een oudere commit bevat deze oplossing nog niet.
5. Open na een geslaagde productie-deployment **https://de-vijfhoek.pages.dev/**. De foto-editor staat dan op **https://de-vijfhoek.pages.dev/bewerken/**.

| Instelling | Waarde |
| --- | --- |
| Repository | `idkmanLool9/De-vijfhoek` |
| Productiebranch | `main` |
| Framework preset | `None` |
| Build command | `npm run build:cloudflare-pages` |
| Build output directory | `out` |
| Root directory | standaard / repository-root |
| Node.js | `24`, via `.nvmrc` |

`wrangler.jsonc` legt de publicatiemap ook vast met `pages_build_output_dir: "./out"`. Pages gebruikt deze configuratie bij een nieuwe deployment. Het eerdere buildcommando `npm run build:cloudflare` blijft op Pages werken: Cloudflare zet `CF_PAGES=1`, waarna dat commando automatisch dezelfde statische build maakt. Gebruik bij nieuwe instellingen het expliciete Pages-commando uit de tabel.

De export gebruikt op Cloudflare het rootpad `/`, ook als er nog een `PAGES_BASE_PATH`-variabele voor GitHub Pages is ingesteld. GitHub Pages heeft zijn eigen build onder `/De-vijfhoek/`.

## Waarom een geslaagde deployment toch 404 kan geven

Een geslaagde upload betekent dat Cloudflare bestanden heeft gepubliceerd. Als de gekozen map geen `index.html` bevat, kan de homepage toch 404 geven. De OpenNext Worker-build levert een Worker en assets op; voor dit Pages-project is `out/` met de statische HTML nodig. Publiceer hier `out`, geen repository-root, `.next` of `.open-next/assets`.

Een Git-push zet code op GitHub. De publieke website verandert pas wanneer Pages de nieuwste commit heeft gebouwd en gepubliceerd. Kijk bij een fout naar de buildlogs. Controleer ook of de deployment de productiebranch `main` gebruikt; alleen een previewdeployment verandert het productieadres niet.

## Dezelfde Pages-versie lokaal controleren

Gebruik Node.js 24 vanuit de repository-root:

```bash
npm ci
npm run build:cloudflare-pages
npm run preview:cloudflare-pages
```

De preview gebruikt de lokale Cloudflare Pages-runtime en leest de map `out` uit `wrangler.jsonc`. Start de bestaande browsertests met:

```bash
E2E_PAGES=1 E2E_PORT=3350 E2E_SERVER_COMMAND='npm run preview:cloudflare-pages -- --port 3350' npm run test:e2e
```

Een lichtere statische preview kan met `npm run preview:pages -- --base-path ''`. Deze commando’s publiceren niets.

De tijdelijke foto-editor werkt ook op Pages. Foto’s blijven lokaal in de browser tot het geëxporteerde fotopakket in de repository is verwerkt. Zie [Foto’s bewerken](fotos-bewerken.md).

## Optioneel: Cloudflare Workers

De eerdere OpenNext Workers-optie blijft beschikbaar voor een afzonderlijk Worker-project. De Worker-configuratie staat in **`wrangler.worker.jsonc`**. Voor het bestaande `pages.dev`-project gebruik je de Pages-instellingen hierboven.

| Instelling voor een Worker-project | Waarde |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npx opennextjs-cloudflare deploy --config wrangler.worker.jsonc` |
| Worker name | `de-vijfhoek` |
| Node.js | `24` |

Zonder `CF_PAGES=1` maakt `build:cloudflare` de OpenNext Worker-bundle. Lokaal testen:

```bash
npm run build:cloudflare
npm run preview:cloudflare
```

Vanaf je eigen computer publiceren naar een Worker:

```bash
npx wrangler login
npm run deploy:cloudflare
```

De Worker-configuratie bindt `.open-next/assets` als `ASSETS`, activeert `nodejs_compat` en verwijst via `WORKER_SELF_REFERENCE` naar dezelfde Worker. Bij een andere Workernaam moeten `name` en `services[0].service` samen worden aangepast. Er is geen externe cache nodig. Het Worker-adres eindigt op `workers.dev` en wordt door Cloudflare bepaald.

Technische bronnen: [Statische Next.js-sites op Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [Pages-buildconfiguratie](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Pages Wrangler-configuratie](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) en [OpenNext voor Workers](https://opennext.js.org/cloudflare).
