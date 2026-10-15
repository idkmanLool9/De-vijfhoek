import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, mkdir } from "node:fs/promises";
import { readMediaPackage } from "../src/lib/media-package";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { zipSync, strToU8 } from "fflate";
import { publishedMedia } from "../src/data/media";
import { basePath, sitePath } from "./paths";

async function expectPublishedHero(page: Page) {
  const hero = publishedMedia["centrum-hero"];
  if (hero) {
    const image = page.locator('[data-media-id="centrum-hero"] img');
    await expect(image).toHaveAttribute("src", `${basePath}${hero.src}`);
    await expect(image).toHaveCSS("object-position", `${hero.position.x}% ${hero.position.y}%`);
  } else {
    await expect(page.locator('[data-media-id="centrum-hero"]')).toHaveCount(0);
    await expect(page.getByText("Fotoplaceholder · Officiële centrumfoto volgt")).toBeVisible();
  }
}

// A small neutral test image; it is never committed or published as centre imagery.
async function testImage(page: Page) {
  const data = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32; canvas.height = 16;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#777"; context.fillRect(0, 0, 32, 16);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  return { name: "testafbeelding.png", mimeType: "image/png", buffer: Buffer.from(data, "base64") };
}

test("foto’s blijven lokaal bewaard en verschijnen alleen in de eigen voorvertoning", async ({ page, browser }) => {
  await page.goto(sitePath("/bewerken"));
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  const input = page.getByLabel("Grote centrumfoto kiezen", { exact: true });
  await expect(input).toBeEnabled();
  await input.setInputFiles(await testImage(page));
  const card = page.locator('[data-editor-slot="centrum-hero"]');
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  await card.getByLabel("Beschrijving van het beeld").fill("Officiële centrumfoto — testkeuze");
  await card.getByLabel("Uitsnede horizontaal", { exact: false }).focus();
  await page.keyboard.press("End");
  await card.getByLabel("Uitsnede verticaal", { exact: false }).focus();
  await page.keyboard.press("Home");
  await expect(page.getByRole("status").filter({ hasText: "Lokale wijzigingen bewaard" })).toBeVisible();
  await page.reload();
  await expect(card.getByLabel("Beschrijving van het beeld")).toHaveValue("Officiële centrumfoto — testkeuze");
  await expect(card.getByLabel("Uitsnede horizontaal", { exact: false })).toHaveValue("100");
  await page.getByRole("link", { name: "Terug naar de website", exact: true }).click();
  const image = page.locator('[data-media-id="centrum-hero"] img');
  await expect(image).toBeVisible();
  await expect(image).toHaveCSS("object-position", "100% 0%");
  await expect(page.getByRole("complementary", { name: "Lokale fotovoorvertoning" })).toBeVisible();
  await expect(page.getByText("Fotoplaceholder · Officiële centrumfoto volgt")).toHaveCount(0);
  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  await otherPage.goto(page.url());
  await expectPublishedHero(otherPage);
  await expect(otherPage.getByRole("complementary", { name: "Lokale fotovoorvertoning" })).toHaveCount(0);
  await otherContext.close();
  await page.getByRole("button", { name: "Voorbeeld uitzetten" }).click();
  await expectPublishedHero(page);
  await page.goto(sitePath("/bewerken"));
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Voorbeeld aanzetten", exact: true }).click();
  await card.getByRole("button", { name: "Verwijder keuze" }).click();
  await expect(card.getByText(publishedMedia["centrum-hero"] ? "Vast op website" : "Nog leeg", { exact: true })).toBeVisible();
  await page.reload();
  await expect(card.getByText(publishedMedia["centrum-hero"] ? "Vast op website" : "Nog leeg", { exact: true })).toBeVisible();
});

test("een compleet fotopakket kan worden geëxporteerd, teruggezet en definitief geïmporteerd", async ({ page }, testInfo) => {
  await page.goto(sitePath("/bewerken"));
  const input = page.getByLabel("Logo De Vijfhoek kiezen", { exact: true });
  await expect(input).toBeEnabled();
  await input.setInputFiles(await testImage(page));
  const card = page.locator('[data-editor-slot="centrum-logo"]');
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  await card.getByLabel("Beschrijving van het beeld").fill("Logo De Vijfhoek — testkeuze");
  const downloadButton = page.getByRole("button", { name: "Download fotopakket", exact: true });
  await expect(downloadButton).toBeEnabled();
  const downloaded = page.waitForEvent("download");
  await downloadButton.click();
  const download = await downloaded;
  const file = testInfo.outputPath("de-vijfhoek-fotos.zip");
  await download.saveAs(file);
  const bytes = await readFile(file);
  const entries = readMediaPackage(bytes);
  expect(entries).toHaveLength(1);
  expect(entries[0].id).toBe("centrum-logo");
  expect(entries[0].alt).toBe("Logo De Vijfhoek — testkeuze");
  const root = testInfo.outputPath("imported-site");
  await mkdir(root, { recursive: true });
  const imported = execFileSync(process.execPath, ["--input-type=module", "-e", "const { importMediaPackage } = await import(process.argv[1]); const { readFileSync } = await import('node:fs'); process.stdout.write(String(importMediaPackage(readFileSync(process.argv[2]), process.argv[3])));", pathToFileURL(resolve("scripts/import-media.mjs")).href, file, root], { encoding: "utf8" });
  expect(imported.trim()).toBe("1");
  const manifest = JSON.parse(await readFile(`${root}/src/data/media.json`, "utf8"));
  expect(manifest["centrum-logo"].src).toBe("/images/official/centrum-logo.png");
  expect(manifest["centrum-logo"].alt).toBe(entries[0].alt);
  expect(await readFile(`${root}/public/images/official/centrum-logo.png`)).toEqual(Buffer.from(entries[0].bytes));
  await card.getByRole("button", { name: "Verwijder keuze" }).click();
  await expect(card.getByText(publishedMedia["centrum-logo"] ? "Vast op website" : "Nog leeg", { exact: true })).toBeVisible();
  await page.getByLabel("Importeer fotopakket", { exact: false }).setInputFiles(file);
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  await expect(card.getByLabel("Beschrijving van het beeld")).toHaveValue(entries[0].alt);
  await page.getByRole("link", { name: "Terug naar de website", exact: true }).click();
  await expect(page.locator('header [data-media-id="centrum-logo"] img')).toBeVisible();
  await expect(page.locator('footer [data-media-id="centrum-logo"] img')).toBeVisible();
});

test("winkelfoto’s worden gedeeld door winkelgids en detailpagina", async ({ page }) => {
  await page.goto(sitePath("/bewerken"));
  await page.getByRole("button", { name: "Winkels", exact: true }).click();
  const input = page.getByLabel("Albert Heijn · winkelfoto kiezen", { exact: true });
  await expect(input).toBeEnabled();
  await input.setInputFiles(await testImage(page));
  await expect(page.locator('[data-editor-slot="winkel-albert-heijn-foto"]').getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  await page.goto(sitePath("/winkels"));
  await expect(page.locator('[data-media-id="winkel-albert-heijn-foto"] img')).toBeVisible();
  await page.locator("#winkelresultaten").getByRole("link").filter({ has: page.getByRole("heading", { name: "Albert Heijn", exact: true }) }).click();
  await expect(page.locator('[data-media-id="winkel-albert-heijn-foto"] img')).toBeVisible();
  await expect(page.getByText("Officiële winkelfoto’s worden hier toegevoegd", { exact: false })).toHaveCount(0);
});

test("grote fotosets worden als kleinere pakketten zonder kwaliteitsverlies geëxporteerd", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await page.goto(sitePath("/bewerken"));
  const image = await testImage(page);
  // Valid PNGs with padding exercise real attachment sizes without large bitmaps.
  const padded = Buffer.concat([image.buffer, Buffer.alloc(9 * 1024 * 1024 - image.buffer.length)]);
  for (const id of ["home-winkels", "home-eten", "home-bezoek"]) {
    const card = page.locator(`[data-editor-slot="${id}"]`);
    const input = card.locator('input[type="file"]');
    await expect(input).toBeEnabled();
    await input.setInputFiles({ name: `${id}.png`, mimeType: "image/png", buffer: padded });
    await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Download fotopakket", exact: true }).click();
  await expect(page.getByRole("link", { name: "Download deel 1 van 2", exact: false })).toBeVisible();
  const exportedIds: string[] = [];
  for (const part of [1, 2]) {
    const downloading = page.waitForEvent("download");
    await page.getByRole("link", { name: `Download deel ${part} van 2`, exact: false }).click();
    const file = testInfo.outputPath(`deel-${part}.zip`);
    await (await downloading).saveAs(file);
    const bytes = await readFile(file);
    expect(bytes.length).toBeLessThan(25 * 1024 * 1024);
    for (const entry of readMediaPackage(bytes)) {
      exportedIds.push(entry.id);
      expect(Buffer.from(entry.bytes)).toEqual(padded);
    }
  }
  expect(exportedIds.sort()).toEqual(["home-bezoek", "home-eten", "home-winkels"]);
});

test("ongeldige afbeeldingen en onveilige pakketten worden geweigerd zonder opgeslagen keuzes te wissen", async ({ page }) => {
  await page.goto(sitePath("/bewerken"));
  const input = page.getByLabel("Grote centrumfoto kiezen", { exact: true });
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name: "geen-foto.png", mimeType: "image/png", buffer: Buffer.from("dit is geen afbeelding") });
  const card = page.locator('[data-editor-slot="centrum-hero"]');
  await expect(card.getByRole("alert")).toContainText("Kies een echte JPG-");
  await input.setInputFiles(await testImage(page));
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  const unsafe = zipSync({ "../ongewenst.png": new Uint8Array([1, 2, 3]), "media.json": strToU8('{}') });
  await page.getByLabel("Importeer fotopakket", { exact: false }).setInputFiles({ name: "onveilig.zip", mimeType: "application/zip", buffer: Buffer.from(unsafe) });
  await expect(page.getByRole("alert").filter({ hasText: "onverwacht bestand" })).toBeVisible();
  await expect(card.getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  expect(() => readMediaPackage(unsafe)).toThrow("onverwacht bestand");
});

test("de editor is toegankelijk en past op mobiel en desktop", async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(sitePath("/bewerken"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
