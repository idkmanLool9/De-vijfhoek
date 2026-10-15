# De website op GitHub Pages publiceren

GitHub Pages heeft een eigen statische deployment. De Cloudflare Pages- en Workers-opties blijven beschikbaar. Alle builds gebruiken dezelfde pagina’s en centrale lokale data.

## Eenmalig inschakelen

1. Open [Settings → Pages](https://github.com/idkmanLool9/De-vijfhoek/settings/pages) in de GitHub-repository.
2. Kies bij **Build and deployment → Source** de optie **GitHub Actions**.
3. Open [de Pages-workflow](https://github.com/idkmanLool9/De-vijfhoek/actions/workflows/pages.yml). Start zo nodig via **Run workflow** een run op `main` als de eerste run al plaatsvond voordat Pages werd ingeschakeld.
4. Wacht totdat de jobs **build** en **deploy** slagen. De deployment toont de gepubliceerde URL.

Het verwachte adres voor deze repository is na een succesvolle deployment:

**https://idkmanlool9.github.io/De-vijfhoek/**

Daarna bouwt en publiceert iedere push naar `main` automatisch de nieuwe website. De workflow kan ook handmatig worden gestart. Er zijn geen persoonlijke toegangstokens of aanvullende repositorysecrets nodig; de workflow gebruikt de standaard GitHub Actions-token en de Pages-deploymentrechten.

## Hoe de build werkt

- `.github/workflows/pages.yml` configureert Pages, installeert de vastgelegde dependencies, voert lint uit en bouwt de statische website.
- `npm run build:pages` gebruikt `output: "export"`, `trailingSlash: true` en het Pages-basepad. De uitvoer staat in `out/`.
- Het basepad komt in de workflow van `actions/configure-pages`. Lokaal is de standaard `/De-vijfhoek`; een override kan met `PAGES_BASE_PATH`. Bij een gekoppeld eigen domein kan het basepad leeg zijn.
- Interne Next.js-links krijgen het basepad automatisch. Aangeleverde lokale foto’s en logo’s krijgen hetzelfde pad via `src/lib/paths.ts`.
- Alle bevestigde winkelroutes en gepubliceerde nieuwsartikelen worden tijdens de build gegenereerd. Onbekende routes gebruiken de echte `404.html`-pagina van de statische host.
- Zolang er geen gepubliceerde nieuwsartikelen zijn, heeft Next.js één interne validatieparameter nodig. De pagina roept hiervoor `notFound()` aan; het buildscript verwijdert de bijbehorende gegenereerde directory uit `out/`. Er komt geen fictief nieuwsbericht online.
- `.nojekyll` houdt de Next.js-assets onder `_next` beschikbaar voor statische hosting.
- De workflow controleert de geëxporteerde website met dezelfde browsertests, waaronder zoeken, filters, clientnavigatie, herladen van detailroutes, assets, toetsenbordbediening, responsive layout en automatische toegankelijkheidschecks. Alleen een geslaagde build wordt gedeployed.

Omdat Pages statische bestanden serveert, worden gewijzigde lokale data en nieuwe artikelen zichtbaar na de volgende geslaagde deployment.

## Lokaal testen

Vanuit de repository-root, met Node.js 24:

```bash
npm ci
npm run build:pages
npm run preview:pages
```

De lokale preview serveert uitsluitend de statische `out/`-map, standaard op poort 3200 onder `/De-vijfhoek/`. Hij gebruikt geen Next.js-server of Cloudflare-runtime. Voor de browsertests:

```bash
E2E_PAGES=1 E2E_BASE_PATH=/De-vijfhoek E2E_PORT=3200 npm run test:e2e
```

De testconfiguratie start de statische preview indien nodig en hergebruikt hem als hij al draait. Buiten de cloudomgeving installeer je zo nodig eerst de testbrowser met `npx playwright install chromium`.

Voor het bestaande Cloudflare Pages-project gebruik je `npm run build:cloudflare-pages` en outputmap `out`, zonder het GitHub-basepad. De optionele Workers-scripts blijven beschikbaar. Zie de [Cloudflare-instructies](cloudflare.md).
