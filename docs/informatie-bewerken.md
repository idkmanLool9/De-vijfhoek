# Bezoekersinformatie invullen

Open **Bezoekersinformatie** naast **Foto’s & logo’s** in de tijdelijke bewerkmodus:

- GitHub Pages: https://idkmanlool9.github.io/De-vijfhoek/bewerken/informatie/
- Cloudflare Pages: https://de-vijfhoek.pages.dev/bewerken/informatie/

Deze pagina komt beschikbaar na de deployment van de wijziging. De bestaande foto-editor en fotokeuzes blijven behouden.

## Invullen en bekijken

Vul de bevestigde gegevens in voor bereikbaarheid, parkeren, toegankelijkheid, beheer/contact en het verhaal van het centrum. Laat onbekende velden leeg. Een leeg veld betekent niet dat een voorziening ontbreekt. Gebruik alleen gegevens die openbaar mogen worden.

Wijzigingen worden automatisch in deze browser bewaard. **Bekijk bezoekersinformatie** toont de praktische gegevens op de bezoekerspagina. **Bekijk beheer & contact** toont de gegevens op Over De Vijfhoek. Openbaar e-mailadres en telefoonnummer verschijnen ook in de footer. Regeleinden blijven behouden; invoer is gewone tekst, geen HTML.

Het voorbeeld is alleen lokaal zichtbaar. De balk boven de website geeft dit aan. Met **Informatievoorbeeld uitzetten** verberg je het voorbeeld zonder je invoer te wissen. **Herstel gepubliceerd** herstelt één veld naar de gepubliceerde waarde.

## Back-up en overdracht

1. Kies regelmatig **Download informatiebestand**. Je krijgt `de-vijfhoek-bezoekersinformatie.json` met de gewijzigde velden.
2. Bewaar dit bestand als back-up. Stuur het hier in het gesprek wanneer de gegevens gepubliceerd mogen worden.
3. Met **Importeer informatiebestand** kun je de invoer in een andere browser of op het andere websiteadres terugzetten. Alleen de velden uit het bestand worden vervangen; andere informatie en foto’s blijven behouden.

De opslag is lokaal met `localStorage`, los van de foto-opslag in IndexedDB. GitHub Pages en Cloudflare hebben elk hun eigen browseropslag. Browsergegevens wissen, privévensters of een ander apparaat kunnen de invoer onbeschikbaar maken. Bij een opslagfout blijft de huidige invoer beschikbaar voor downloaden zolang het tabblad open blijft.

De editor kan geen gedeelde websitebestanden of GitHub wijzigen. Zonder het bestand in de repository te verwerken en te deployen blijft de invoer uitsluitend in jouw voorbeeld. Deze pagina heeft `noindex, nofollow` en staat niet in de gewone navigatie. De tijdelijke editor blijft staan totdat we afspreken deze te verwijderen.

## Verwerken in de repository

Vanuit de repository-root met Node.js 24:

```bash
npm run info:import -- /pad/naar/de-vijfhoek-bezoekersinformatie.json
```

Het commando valideert het pakket en contactlinks en voegt de velden samen met `src/data/visitor-info.json`. Een expliciet lege waarde wist dat veld; ontbrekende velden behouden de huidige waarde. Foto’s, uitsneden, winkelgegevens en plattegrond worden niet gewijzigd. Het bestand mag maximaal 100 kB zijn.

Controleer de inhoud, voer lint, beide statische builds en de relevante browsertests uit, en commit en push de wijziging. Na een geslaagde deployment verschijnen de gegevens voor alle bezoekers.

De structuur en veldlimieten staan in `src/lib/visitor-info.ts`. Deze editor behandelt centruminformatie. Openingstijden, contactgegevens en voorzieningen per winkel blijven in `src/data/shops.ts`; Google-links blijven de gratis manier om actuele vestigingsgegevens te bekijken.
