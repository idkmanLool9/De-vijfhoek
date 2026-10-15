# Tijdelijke bewerkmodus voor foto’s en logo’s

Open op de gepubliceerde website **`/bewerken/`**. Voor GitHub Pages is dat na een geslaagde deployment:

**https://idkmanlool9.github.io/De-vijfhoek/bewerken/**

De bewerkmodus is bedoeld om de officiële beelden te verzamelen, hun plek te kiezen en het resultaat te beoordelen. Er is geen database of uploadserver nodig.

## Zo gebruik je hem

1. Begin bij **Centrum & homepage**. Kies het centrumlogo, de brede hero-foto en de drie kaartfoto’s.
2. Gebruik de andere filters voor de foto’s op de overige pagina’s en de foto’s en logo’s van de winkels. Dezelfde winkelfoto verschijnt zowel in de gids als op de winkelpagina.
3. Kies JPG, PNG of WebP, maximaal 15 MB per bestand. Voor transparante logo’s kun je PNG of WebP gebruiken. Zet een SVG-, HEIC- of ander bestand eerst om naar een ondersteund beeldformaat.
4. Vul een korte beschrijving van het beeld in. Deze tekst wordt later gebruikt voor bezoekers die afbeeldingen niet kunnen zien.
5. Gebruik bij foto’s de twee schuifjes om het zichtbare deel te kiezen. Het originele bestand blijft behouden. Logo’s worden volledig weergegeven.
6. Kies **Bekijk op de website** of **Terug naar de website** om het resultaat in de pagina te zien.
7. Download regelmatig het **fotopakket**. Als je klaar bent, stuur je het ZIP-bestand (of alle delen) in het gesprek terug voor definitieve verwerking.

Kies alleen aangeleverde officiële foto’s en logo’s. Een foto toevoegen verandert geen winkelgegevens, openingstijden, horecazaken of nieuwsberichten.

Grotere fotosets worden automatisch verdeeld over kleinere ZIP-pakketten. Download en bewaar alle delen. Je kunt de delen één voor één importeren; ze vullen elkaar aan. Dit houdt de bestanden makkelijk deelbaar en behoudt de originele beeldkwaliteit.

## Waar worden mijn keuzes bewaard?

Je foto’s en instellingen blijven lokaal op dit apparaat in deze browser, met IndexedDB. De voortgang blijft normaal na herladen en opnieuw openen bewaard. Browsergegevens wissen, privévensters, opslaglimieten of een ander apparaat kunnen de lokale keuzes onbeschikbaar maken. Download daarom tussendoor een back-up.

De lokale foto’s zijn **nog niet zichtbaar voor andere bezoekers**. Boven de website staat tijdens de voorvertoning een balk die dat duidelijk aangeeft. **Voorbeeld uitzetten** verbergt de lokale foto’s zonder ze te verwijderen. Op de bewerkpagina kun je het voorbeeld weer inschakelen.

De opslag is per websiteadres. Keuzes op GitHub Pages verschijnen niet vanzelf in de Cloudflare-versie. Met **Download fotopakket** en **Importeer fotopakket** kun je het werk naar een andere browser, apparaat of websiteadres overzetten. Importeren vervangt de keuzes voor de plekken in het pakket en behoudt andere bestaande keuzes.

Dit is een lokale bewerkhulp. De route heeft geen beheerderswachtwoord en kan geen gedeelde websitebestanden of GitHub wijzigen. Anderen kunnen er alleen hun eigen lokale voorbeeld mee maken. De route heeft `noindex, nofollow` en is niet opgenomen in de gewone sitenavigatie.

## Definitief publiceren

Na ontvangst van het ZIP-bestand kan de ontwikkelaar vanuit de repository-root uitvoeren:

```bash
npm run media:import -- /pad/naar/de-vijfhoek-fotos.zip
```

Bij meerdere delen voer je dit commando voor ieder ZIP-bestand uit.

Dit commando valideert het pakket en schrijft beelden naar `public/images/official/` en de beeldkeuzes naar `src/data/media.json`. Bestaande vaste keuzes voor andere plekken blijven behouden. Het pakket bevat de originele beeldbestanden, beschrijvingen en uitsnede-instellingen. Er worden geen bestanden naar een externe dienst verstuurd.

Controleer daarna de beeldkeuzes, voer lint, build en de browsertests uit, en commit en push de bestanden. Na een succesvolle GitHub Pages- of Cloudflare-deployment zijn de beelden voor alle bezoekers zichtbaar.

## De tijdelijke modus verwijderen

Nadat de beelden definitief zijn opgenomen en gecontroleerd:

1. Verwijder `src/app/bewerken/` en de tijdelijke editorinterface.
2. Verwijder de `MediaProvider`-wrapper en `MediaPreviewNotice` uit de root-layout. De gewone header, inhoud en footer blijven direct in de layout staan.
3. Vereenvoudig de beeldcomponenten naar het vaste manifest. `useMediaAsset` kan de gepubliceerde beelden al lezen zonder een actieve provider; lokale opslag en editorcode kunnen daarna worden opgeruimd.
4. Werk de tijdelijke vermeldingen in documentatie en footer bij en controleer beide deployments opnieuw.

De foto’s, logo’s, beschrijvingen en uitsneden blijven dan behouden. Het ZIP-pakket is de overdracht; het automatisch tellen van ingevulde plekken publiceert niets en verwijdert de editor niet vanzelf.
