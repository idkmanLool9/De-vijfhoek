import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { shops } from "../src/data/shops";
import { sitePath } from "./paths";

test("winkelgids zoekt, combineert filters en herstelt een lege zoekopdracht", async ({ page }) => {
  await page.goto(sitePath("/winkels"));
  const results = page.locator("#winkelresultaten");
  await expect(results.getByRole("link")).toHaveCount(shops.length);
  await page.getByRole("searchbox").fill("  ALBERT  ");
  await expect(results.getByRole("link")).toHaveCount(1);
  await expect(results.getByRole("heading")).toHaveText("Albert Heijn");
  await page.getByRole("button", { name: "Drogisterij", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Geen winkels gevonden" })).toBeVisible();
  await page.getByRole("button", { name: "Toon alle winkels" }).click();
  await expect(results.getByRole("link")).toHaveCount(shops.length);
  await page.getByRole("button", { name: "Huishoudelijk", exact: true }).click();
  await expect(results.getByRole("link")).toHaveCount(2);
  await page.getByRole("button", { name: "Schoenen", exact: true }).click();
  await expect(results.getByRole("heading")).toHaveText("Scapino");
  await page.getByRole("button", { name: "Mode", exact: true }).click();
  await expect(results.getByRole("heading")).toHaveText(["Scapino", "Hebbez | Ik wil Mode"]);
  await page.getByRole("button", { name: "Wis filters" }).click();
  await page.getByRole("searchbox").fill("boeken");
  await expect(results.getByRole("heading")).toHaveText("Bibliotheek Oldenzaal");
});

test("alle bevestigde winkeldetails werken zonder verzonnen contactgegevens", async ({ page }) => {
  for (const shop of shops) {
    const response = await page.goto(sitePath(`/winkels/${shop.slug}`));
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(shop.name);
    await expect(page.getByRole("heading", { name: "Openingstijden", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Openingstijden op Google", exact: false })).toBeVisible();
    await expect(page.locator('main a[href^="tel:"], main a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Kruimelpad" }).getByRole("link", { name: "Winkels", exact: true })).toHaveAttribute("href", sitePath("/winkels"));
  }
});

test("nieuwsfilters tonen eerlijke lege toestanden en onbekende slugs geven 404", async ({ page }) => {
  await page.goto(sitePath("/nieuws"));
  await page.getByRole("button", { name: "Evenementen", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nog geen evenementen gepubliceerd" })).toBeVisible();
  await page.getByRole("button", { name: "Nieuws", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nog geen nieuws gepubliceerd" })).toBeVisible();
  for (const url of ["/winkels/bestaat-niet", "/nieuws/bestaat-niet", "/nieuws/__no-published-news__", "/bestaat-niet"]) {
    const response = await page.goto(sitePath(url));
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Even de weg kwijt?" })).toBeVisible();
  }
});

test("clientnavigatie, actieve navigatie en statische bestanden werken na deployment", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/_next/") && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(sitePath("/"));
  await expect(page.locator(".home-hero")).toHaveCSS("background-color", "rgb(46, 48, 48)");
  await page.getByRole("link", { name: "Ontdek de winkels", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${sitePath("/winkels")}$`));
  await expect(page.getByRole("navigation", { name: "Hoofdnavigatie", exact: true }).getByRole("link", { name: "Winkels", exact: true })).toHaveAttribute("aria-current", "page");
  await page.locator("#winkelresultaten").getByRole("link").filter({ has: page.getByRole("heading", { name: "Albert Heijn", exact: true }) }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Albert Heijn");
  const response = await page.reload();
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Albert Heijn");
  await page.getByRole("navigation", { name: "Kruimelpad" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Alles dichtbij.Midden in Oldenzaal.");
  expect(errors).toEqual([]);
});

test("mobiele navigatie werkt met toetsenbord en sluit na navigeren", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(sitePath("/"));
  const toggle = page.getByRole("button", { name: "Menu openen" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Menu sluiten" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  const firstLink = page.getByRole("navigation", { name: "Mobiele hoofdnavigatie" }).getByRole("link", { name: "Winkels", exact: true });
  await expect(firstLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/winkels\/?$/);
  await expect(page.getByRole("button", { name: "Menu openen" })).toHaveAttribute("aria-expanded", "false");
});

test("bezoekersinformatie heeft werkende ankers en toegankelijke vragen", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const topics = page.getByRole("navigation", { name: "Onderwerpen bezoekersinformatie" });
  await topics.getByRole("link", { name: "Plattegrond", exact: false }).click();
  await expect(page).toHaveURL(/#plattegrond$/);
  await expect(page.locator("#plattegrond").getByRole("heading", { name: "Plattegrond", exact: true })).toBeInViewport();
  await page.getByText("Is er een plattegrond beschikbaar?", { exact: true }).click();
  await expect(page.getByText("Onder Plattegrond kun je winkels en unitnummers opzoeken.", { exact: false })).toBeVisible();
});

test("alle interne links verwijzen naar bestaande routes en ankers", async ({ page, request }) => {
  const routes = ["/", "/winkels", "/winkels/albert-heijn", "/eten-en-drinken", "/nieuws", "/bezoekersinformatie", "/over-de-vijfhoek"];
  const urls = new Set<string>();
  for (const route of routes) {
    await page.goto(sitePath(route));
    const hrefs = await page.locator('a[href^="/"], a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    for (const href of hrefs) {
      const url = new URL(href, page.url());
      urls.add(url.pathname + url.hash);
    }
  }
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.status(), url).toBe(200);
    const hash = new URL(url, "http://localhost").hash;
    if (hash) expect(await response.text(), url).toContain(`id="${hash.slice(1)}"`);
  }
});

for (const width of [320, 768, 1440]) {
  test(`overige pagina’s hebben geen overflow op ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/winkels", "/winkels/bibliotheek-oldenzaal", "/winkels/gw-rozemarijn", "/winkels/hebbez-ik-wil-mode", "/winkels/candy-corner", "/winkels/t-glashoes", "/eten-en-drinken", "/nieuws", "/bezoekersinformatie", "/over-de-vijfhoek"]) {
      await page.goto(sitePath(route));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
    }
  });
}

test("de belangrijkste pagina’s voldoen aan automatische WCAG-controles", async ({ page }) => {
  for (const route of ["/", "/winkels", "/winkels/albert-heijn", "/eten-en-drinken", "/nieuws", "/bezoekersinformatie", "/over-de-vijfhoek"]) {
    await page.goto(sitePath(route));
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole("button", { name: "Menu openen" }).click();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});
