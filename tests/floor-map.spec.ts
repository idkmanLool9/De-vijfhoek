import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basePath, sitePath } from "./paths";

test("aangeleverde plattegrond wordt ongewijzigd geladen en kan zoomen en verschuiven", async ({ page, request }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const region = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const map = region.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  await expect(map).toBeVisible();
  await expect(map).toHaveAccessibleDescription(/Winkelposities op de tekening zijn nog niet bevestigd/);
  await expect(region.getByRole("heading", { name: "Plattegrond nog niet beschikbaar" })).toHaveCount(0);
  const source = `${basePath}/maps/de-vijfhoek-vastgoedplattegrond.svg`;
  await expect(map.locator("image")).toHaveAttribute("href", source);
  const response = await request.get(source);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  expect(digest(await response.body())).toBe(digest(await readFile("public/maps/de-vijfhoek-vastgoedplattegrond.svg")));
  await page.evaluate(async (src) => { const image = new Image(); image.src = src; await image.decode(); }, source);
  await expect(map).toHaveAttribute("viewBox", "0 0 1286.25 1284.749967");
  await region.getByRole("button", { name: "Inzoomen", exact: true }).click();
  await expect(region.getByLabel("Zoomniveau")).toHaveText("135%");
  const drawing = map.locator(".floor-map-drawing");
  const before = await drawing.getAttribute("transform");
  await region.getByRole("button", { name: "Kaart naar links verschuiven" }).click();
  expect(await drawing.getAttribute("transform")).not.toBe(before);
  await region.getByRole("button", { name: "Volledige kaart tonen" }).click();
  await expect(region.getByLabel("Zoomniveau")).toHaveText("100%");
  await expect(map).toHaveAttribute("viewBox", "0 0 1286.25 1284.749967");
});

test("bezoekerskaart zoekt officiële nummers zonder onbevestigde winkelposities te publiceren", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
  await expect(map.locator(".floor-map-svg")).toBeVisible();
  await expect(map.locator(".floor-map-unit")).toHaveCount(0);
  await expect(map.getByLabel("Legenda")).toHaveCount(0);
  await map.getByRole("searchbox").fill("141");
  const list = map.getByRole("list", { name: "Gevonden winkels en units" });
  await expect(list.getByRole("button")).toHaveCount(1);
  await list.getByRole("button").click();
  const details = map.getByRole("region", { name: "Informatie over de selectie" });
  await expect(details.getByRole("heading")).toHaveText("Unit 141");
  await expect(details.getByText("De winkel in deze unit is nog niet bevestigd.")).toBeVisible();
  await expect(details.getByRole("link")).toHaveCount(0);
  await map.getByRole("searchbox").fill(" Action ");
  await list.getByRole("button", { name: "Action", exact: false }).click();
  await expect(details.getByRole("heading")).toHaveText("Action");
  await expect(details.getByText("Huishoudelijk")).toBeVisible();
  await expect(details.getByText("Locatie op de plattegrond nog niet bevestigd.")).toBeVisible();
  await expect(details.getByRole("link", { name: "Bekijk de winkelpagina" })).toHaveAttribute("href", sitePath("/winkels/action"));
  await map.getByRole("searchbox").fill("Nollen");
  await expect(map.getByText("Geen winkels of units gevonden.")).toBeVisible();
  await map.getByRole("button", { name: "Zoekopdracht wissen", exact: true }).click();
  await expect(list.getByRole("button")).toHaveCount(10);
});

test("volledige tekening wordt niet automatisch aan een verdieping toegewezen", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const level = map.getByRole("combobox", { name: "Kaart / verdieping" });
  await expect(level).toHaveValue("overview");
  for (const floor of ["ground", "first"]) {
    await level.selectOption(floor);
    await expect(map.getByRole("heading", { name: "Plattegrond nog niet beschikbaar" })).toBeVisible();
    await expect(map.getByText("Er is nog geen bevestigde plattegrond voor deze verdieping beschikbaar.")).toBeVisible();
    await expect(map.locator(".floor-map-svg")).toHaveCount(0);
  }
  await level.selectOption("overview");
  await expect(map.locator(".floor-map-svg")).toBeVisible();
  await expect(map.getByRole("list").getByRole("button")).toHaveCount(10);
});

test("zoeklijst, informatiepaneel en lege verdiepingen zijn toegankelijk op mobiel en desktop", async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(sitePath("/bezoekersinformatie"));
    const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
    await map.getByRole("searchbox").fill("75");
    const result = map.getByRole("list").getByRole("button");
    await result.focus();
    await page.keyboard.press("Enter");
    await expect(map.getByRole("region", { name: "Informatie over de selectie" }).getByRole("heading")).toHaveText("Unit 75");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
    const accessibility = await new AxeBuilder({ page }).include(".floor-map").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations, `${width}px`).toEqual([]);
  }
});
