import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basePath, sitePath } from "./paths";

test("aangeleverde plattegrond wordt ongewijzigd geladen en kan zoomen en verschuiven", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(sitePath("/bezoekersinformatie"));
  const region = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const map = region.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  await expect(map).toBeVisible();
  await expect(map).toHaveAccessibleDescription(/Winkelruimtes zijn als knoppen te bedienen/);
  await expect(region.getByRole("heading", { name: "Plattegrond nog niet beschikbaar" })).toHaveCount(0);
  const source = `${basePath}/maps/de-vijfhoek-vastgoedplattegrond.svg`;
  await expect(map.locator("image")).toHaveAttribute("href", source);
  const response = await request.get(source);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  expect(digest(await response.body())).toBe(digest(await readFile("public/maps/de-vijfhoek-vastgoedplattegrond.svg")));
  expect(digest(await response.body())).toBe("f5a877c19067b62fc82effdea87b6ac2f19c6967550484e58c3656e18c07287f");
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
  expect(errors).toEqual([]);
});

test("bevestigde winkels staan in de juiste units en linken naar hun winkelpagina", async ({ page, request }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const region = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const drawing = region.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  const details = region.getByRole("region", { name: "Informatie over de selectie" });
  await expect(drawing.locator(".floor-map-unit")).toHaveCount(24);
  await expect(region.getByLabel("Legenda")).toBeVisible();
  const originalPaths = await drawing.locator(".floor-map-unit path").evaluateAll((paths) => paths.map((p) => p.getAttribute("d")));
  // Independent reference points read from the numbered drawing, in the
  // unchanged clean source coordinate system. All eleven owner allocations.
  const expected = [
    { unit: "1", name: "Albert Heijn", slug: "albert-heijn", point: [802.5, 241] },
    { unit: "5", name: "Gall & Gall", slug: "gall-en-gall", point: [513.6, 261.1] },
    { unit: "9", name: "Bakkerij Nollen", slug: "bakkerij-nollen", point: [513.6, 381.4] },
    { unit: "13", name: "G&W Gezondheids Winkel Rozemarijn", slug: "gw-rozemarijn", point: [481.5, 501.8] },
    { unit: "15", name: "Kruidvat", slug: "kruidvat", point: [621.9, 481.8] },
    { unit: "17", name: "Scapino", slug: "scapino", point: [754.4, 489.8] },
    { unit: "19", name: "Scapino", slug: "scapino", point: [890.8, 509.8] },
    { unit: "33", name: "Wibra", slug: "wibra", point: [778.4, 754.6] },
    { unit: "35", name: "Wibra", slug: "wibra", point: [794.5, 834.9] },
    { unit: "75", name: "Bibliotheek Oldenzaal", slug: "bibliotheek-oldenzaal", point: [280.9, 883] },
    { unit: "141", name: "Action", slug: "action", point: [224.7, 345.3] },
  ];
  for (const item of expected) {
    const unit = drawing.getByRole("button", { name: `${item.name}, unit ${item.unit}`, exact: true });
    expect(await unit.evaluate((path, point) => (path as SVGGeometryElement).isPointInFill(new DOMPoint(point[0], point[1])), item.point), `unit ${item.unit} reference location`).toBe(true);
    await region.getByRole("searchbox").fill(item.name);
    const result = region.getByRole("list").getByRole("button").filter({ has: page.getByText(`Unit ${item.unit}`, { exact: true }) });
    await result.click();
    await expect(unit).toHaveAttribute("aria-pressed", "true");
    await expect(details.getByRole("heading")).toHaveText(item.name);
    await expect(details.getByText(`Unit ${item.unit}`, { exact: true })).toBeVisible();
    await expect(details.getByText("Locatie op de plattegrond nog niet bevestigd.")).toHaveCount(0);
    await expect(details.getByRole("link")).toHaveAttribute("href", sitePath(`/winkels/${item.slug}`));
    expect((await request.get(sitePath(`/winkels/${item.slug}`))).status()).toBe(200);
  }
  expect(await drawing.locator(".floor-map-unit path").evaluateAll((paths) => paths.map((p) => p.getAttribute("d")))).toEqual(originalPaths);
});

test("kaartklikken en toetsenbord selecteren echte units, onbekende winkels blijven naamloos", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const region = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const drawing = region.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  const details = region.getByRole("region", { name: "Informatie over de selectie" });
  // Click a known interior point, rather than the center of an irregular path's bounds.
  await drawing.scrollIntoViewIfNeeded();
  const point = await drawing.evaluate((svg) => {
    const p = new DOMPoint(224.7, 345.3).matrixTransform((svg as SVGSVGElement).getScreenCTM()!);
    return { x: p.x, y: p.y };
  });
  await page.mouse.click(point.x, point.y);
  await expect(details.getByRole("heading")).toHaveText("Action");
  const unknown = drawing.getByRole("button", { name: "Unit 125, winkel nog niet bevestigd", exact: true });
  await unknown.focus();
  await page.keyboard.press("Enter");
  await expect(unknown).toHaveAttribute("aria-pressed", "true");
  await expect(details.getByRole("heading")).toHaveText("Unit 125");
  await expect(details.getByText("De winkel in deze unit is nog niet bevestigd.")).toBeVisible();
  await expect(details.getByRole("link")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(details.getByRole("heading")).toHaveText("Kies een winkel of unit");
  await region.getByRole("searchbox").fill("bestaat niet");
  await expect(region.getByText("Geen winkels of units gevonden.")).toBeVisible();
  await region.getByRole("button", { name: "Zoekopdracht wissen", exact: true }).click();
  await expect(region.getByRole("list").getByRole("button")).toHaveCount(24);
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
  await expect(map.getByRole("list").getByRole("button")).toHaveCount(24);
});

test("winkeldetails openen de bevestigde unit en houden meerdere units per winkel vindbaar", async ({ page }) => {
  for (const item of [
    { slug: "gw-rozemarijn", name: "G&W Gezondheids Winkel Rozemarijn", unit: "13", count: 1 },
    { slug: "scapino", name: "Scapino", unit: "17", count: 2 },
    { slug: "wibra", name: "Wibra", unit: "33", count: 2 },
  ]) {
    await page.goto(sitePath(`/winkels/${item.slug}`));
    const link = page.getByRole("link", { name: "Bekijk op de plattegrond", exact: true });
    await expect(link).toHaveAttribute("href", `${sitePath("/bezoekersinformatie")}?unit=${item.unit}#plattegrond`);
    await link.click();
    const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
    await expect(map.getByRole("searchbox")).toHaveValue(item.name);
    await expect(map.getByRole("list").getByRole("button")).toHaveCount(item.count);
    await expect(map.locator(`[data-unit-id="unit-${item.unit}"]`)).toHaveAttribute("aria-pressed", "true");
    expect(Number(await map.locator(".floor-map-viewport").getAttribute("data-zoom"))).toBeGreaterThan(1);
  }
});

test("unitlinks werken na herladen en browsergeschiedenis, met een mobiele sprong naar winkelinformatie", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  const url = `${sitePath("/bezoekersinformatie")}?unit=13#plattegrond`;
  await page.goto(url);
  const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
  const details = map.getByRole("region", { name: "Informatie over de selectie" });
  await expect(map.locator('[data-unit-id="unit-13"]')).toHaveAttribute("aria-pressed", "true");
  await page.evaluate((href) => window.history.pushState(null, "", href), `${sitePath("/bezoekersinformatie")}?unit=19#plattegrond`);
  await expect(map.locator('[data-unit-id="unit-19"]')).toHaveAttribute("aria-pressed", "true");
  await expect(details.getByRole("heading")).toHaveText("Scapino");
  await page.goBack();
  await expect(map.locator('[data-unit-id="unit-13"]')).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(map.locator('[data-unit-id="unit-13"]')).toHaveAttribute("aria-pressed", "true");
  await map.getByRole("link", { name: "Bekijk winkelinformatie", exact: true }).click();
  await expect(details).toBeInViewport();
  await expect(details).toBeFocused();
  await map.getByRole("button", { name: "Selectie wissen", exact: true }).click();
  await expect(details.getByRole("heading")).toHaveText("Kies een winkel of unit");
  await map.getByRole("searchbox").fill("125");
  await map.getByRole("list").getByRole("button").click();
  await expect(details.getByRole("heading")).toHaveText("Unit 125");
  await expect(map.locator('[data-unit-id="unit-13"]')).toHaveAttribute("aria-pressed", "false");
  await page.goto(`${sitePath("/bezoekersinformatie")}?unit=4044#plattegrond`);
  await expect(map.locator('.floor-map-unit [aria-pressed="true"]')).toHaveCount(0);
  await expect(map.getByRole("list").getByRole("button")).toHaveCount(24);
  expect(errors).toEqual([]);
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
    await expect(map.getByRole("region", { name: "Informatie over de selectie" }).getByRole("heading")).toHaveText("Bibliotheek Oldenzaal");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
    const accessibility = await new AxeBuilder({ page }).include(".floor-map").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations, `${width}px`).toEqual([]);
  }
});
