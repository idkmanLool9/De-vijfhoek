import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { readVisitorPackage, emptyVisitorInfo } from "../src/lib/visitor-info";
import { sitePath } from "./paths";
import publishedInfo from "../src/data/visitor-info.json";

// All data in these tests is synthetic and is never written to the live site.
const parking = "[Testgegevens lokale editor] Parkeerzone voor de browsertest.\nTweede regel voor de voorvertoning.";

async function openEditor(page: Page) {
  await page.goto(sitePath("/bewerken/informatie"));
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toBeEnabled();
}

test("informatie blijft lokaal bewaard en verschijnt alleen in de eigen voorvertoning", async ({ page, browser, request }) => {
  await openEditor(page);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.getByRole("navigation", { name: "Bewerkmodus" }).getByRole("link", { name: "Bezoekersinformatie", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(parking);
  await page.getByLabel("Toegankelijke ingangen", { exact: true }).fill("Testbeschrijving van de ingang.");
  await page.getByLabel("Lift", { exact: true }).fill("");
  await page.getByLabel("Naam beheerder", { exact: true }).fill("Testbeheerder voor de browsertest");
  await page.getByLabel("Openbaar e-mailadres", { exact: true }).fill("informatie@example.test");
  await page.reload();
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toHaveValue(parking);
  await page.getByRole("link", { name: "Bekijk bezoekersinformatie", exact: true }).click();
  await expect(page.locator("#parkeren")).toContainText(parking);
  await expect(page.locator("#toegankelijkheid")).toContainText("Testbeschrijving van de ingang.");
  await expect(page.locator("#toegankelijkheid summary").filter({ hasText: /^Lift/ })).toHaveCount(0);
  await expect(page.getByRole("complementary", { name: "Lokale informatievoorvertoning" })).toBeVisible();
  const other = await browser.newContext();
  const visitor = await other.newPage();
  await visitor.goto(sitePath("/bezoekersinformatie"));
  await expect(visitor.locator("#parkeren")).not.toContainText("Testgegevens lokale editor");
  expect(await (await request.get(sitePath("/bezoekersinformatie"))).text()).not.toContain("Testgegevens lokale editor");
  await other.close();
  await page.goto(sitePath("/over-de-vijfhoek"));
  await expect(page.locator("#beheer")).toContainText("Testbeheerder voor de browsertest");
  await expect(page.locator("#contact").getByRole("link", { name: "informatie@example.test", exact: true })).toHaveAttribute("href", "mailto:informatie@example.test");
  await page.getByRole("button", { name: "Informatievoorbeeld uitzetten", exact: true }).click();
  await expect(page.locator("#beheer")).not.toContainText("Testbeheerder voor de browsertest");
  await openEditor(page);
  await expect(page.getByLabel("Naam beheerder", { exact: true })).toHaveValue("Testbeheerder voor de browsertest");
  await page.getByRole("button", { name: "Herstel Naam beheerder", exact: true }).click();
  await expect(page.getByLabel("Naam beheerder", { exact: true })).toHaveValue(publishedInfo.managementName);
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toHaveValue(parking);
});

test("informatie exporteert en importeert zonder fotokeuzes of andere velden te wissen", async ({ page }, testInfo) => {
  await page.goto(sitePath("/bewerken"));
  const bytes = await page.evaluate(() => {
    const canvas = document.createElement("canvas"); canvas.width = 32; canvas.height = 16;
    canvas.getContext("2d")!.fillRect(0, 0, 32, 16);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  const logo = page.getByLabel("Logo De Vijfhoek kiezen", { exact: true });
  await expect(logo).toBeEnabled();
  await logo.setInputFiles({ name: "testlogo.png", mimeType: "image/png", buffer: Buffer.from(bytes, "base64") });
  await page.getByRole("navigation", { name: "Bewerkmodus" }).getByRole("link", { name: "Bezoekersinformatie", exact: true }).click();
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(parking);
  await page.getByLabel("Openbaar e-mailadres", { exact: true }).fill("informatie@example.test");
  const lateScripts: string[] = [];
  await page.route(/\/_next\/static\/chunks\/[^/]+\.js(?:\?|$)/, (route) => { lateScripts.push(route.request().url()); return route.abort("failed"); });
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download informatiebestand", exact: true }).click();
  const file = testInfo.outputPath("de-vijfhoek-bezoekersinformatie.json");
  await (await downloading).saveAs(file);
  const text = await readFile(file, "utf8");
  expect(readVisitorPackage(text)).toEqual({ parkingLocations: parking, contactEmail: "informatie@example.test" });
  await page.getByLabel("Parkeertarieven", { exact: true }).fill("Een later toegevoegd testtarief.");
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill("Tijdelijk veranderd testveld");
  await page.getByLabel("Importeer informatiebestand", { exact: false }).setInputFiles(file);
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toHaveValue(parking);
  await expect(page.getByLabel("Parkeertarieven", { exact: true })).toHaveValue("Een later toegevoegd testtarief.");
  expect(lateScripts).toEqual([]);
  await page.unroute(/\/_next\/static\/chunks\/[^/]+\.js(?:\?|$)/);
  await page.getByRole("navigation", { name: "Bewerkmodus" }).getByRole("link", { name: "Foto’s & logo’s", exact: true }).click();
  await expect(page.locator('[data-editor-slot="centrum-logo"]').getByText("Lokaal gekozen", { exact: true })).toBeVisible();
  const root = testInfo.outputPath("imported-site");
  await mkdir(`${root}/src/data`, { recursive: true });
  await writeFile(`${root}/src/data/visitor-info.json`, JSON.stringify({ ...emptyVisitorInfo(), managementName: "Bestaande testbeheerder" }));
  const photoManifest = '{"bewaardeFoto":"ongewijzigd"}\n';
  await writeFile(`${root}/src/data/media.json`, photoManifest);
  const result = execFileSync(process.execPath, ["--input-type=module", "-e", "const { importVisitorInfo } = await import(process.argv[1]); const { readFileSync } = await import('node:fs'); process.stdout.write(String(importVisitorInfo(readFileSync(process.argv[2], 'utf8'), process.argv[3])));", pathToFileURL(resolve("scripts/import-visitor-info.mjs")).href, file, root], { encoding: "utf8" });
  expect(result.trim()).toBe("2");
  const published = JSON.parse(await readFile(`${root}/src/data/visitor-info.json`, "utf8"));
  expect(published.parkingLocations).toBe(parking);
  expect(published.contactEmail).toBe("informatie@example.test");
  expect(published.managementName).toBe("Bestaande testbeheerder");
  expect(published.liftInfo).toBe("");
  expect(await readFile(`${root}/src/data/media.json`, "utf8")).toBe(photoManifest);
});

test("ongeldige bestanden en contactlinks worden geweigerd zonder invoer te verliezen", async ({ page }) => {
  await openEditor(page);
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(parking);
  const unsafe = JSON.stringify({ format: "de-vijfhoek-bezoekersinformatie", version: 1, values: { contactWebsite: "javascript:alert(1)" } });
  await page.getByLabel("Importeer informatiebestand", { exact: false }).setInputFiles({ name: "onveilig.json", mimeType: "application/json", buffer: Buffer.from(unsafe) });
  await expect(page.getByRole("alert").filter({ hasText: "geldige website" })).toBeVisible();
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toHaveValue(parking);
  expect(() => readVisitorPackage(unsafe)).toThrow("geldige website");
  await page.getByLabel("Openbaar e-mailadres", { exact: true }).fill("ongeldig-adres");
  await page.getByRole("button", { name: "Download informatiebestand", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "geldig openbaar e-mailadres" })).toBeVisible();
  await expect(page.getByLabel("Parkeerlocaties", { exact: true })).toHaveValue(parking);
  await page.getByLabel("Openbaar e-mailadres", { exact: true }).fill("");
  const markup = '<img src="x" onerror="alert(1)">';
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(markup);
  await page.getByRole("link", { name: "Bekijk bezoekersinformatie", exact: true }).click();
  await expect(page.locator("#parkeren")).toContainText(markup);
  await expect(page.locator("#parkeren img")).toHaveCount(0);
});

test("mislukte browseropslag behoudt invoer voor een downloadbare back-up", async ({ page }, testInfo) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("test quota", "QuotaExceededError"); }; });
  await openEditor(page);
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(parking);
  await expect(page.getByRole("alert").filter({ hasText: "Bewaren in deze browser is niet gelukt" })).toBeVisible();
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download informatiebestand", exact: true }).click();
  const file = testInfo.outputPath("back-up.json");
  await (await downloading).saveAs(file);
  expect(readVisitorPackage(await readFile(file, "utf8"))).toEqual({ parkingLocations: parking });
});

test("de informatiebewerker is responsive en toegankelijk met ingevulde velden", async ({ page }) => {
  await openEditor(page);
  await page.getByLabel("Parkeerlocaties", { exact: true }).fill(parking);
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}px`).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByRole("link", { name: "Bekijk bezoekersinformatie", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Lokale informatievoorvertoning" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
