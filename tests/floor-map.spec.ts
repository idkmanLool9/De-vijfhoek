import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { sitePath } from "./paths";

test("bezoekerskaart zoekt officiële nummers zonder onbevestigde winkelposities te publiceren", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  const map = page.getByRole("region", { name: "Bezoekersplattegrond" });
  await expect(map.getByRole("heading", { name: "Plattegrond nog niet beschikbaar" })).toBeVisible();
  await expect(map.locator(".floor-map-svg")).toHaveCount(0);
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
