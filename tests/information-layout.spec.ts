import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { sitePath } from "./paths";
import info from "../src/data/visitor-info.json";

test("bezoekgids groepeert vervoer en parkeren en ontsluit lange details met toetsenbord", async ({ page }) => {
  await page.goto(sitePath("/bezoekersinformatie"));
  for (const name of ["Met de auto", "Met de fiets", "Met het OV"]) {
    await expect(page.locator(".travel-cards").getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(page.locator(".visit-address")).toContainText(info.visitAddress);
  await expect(page.locator(".arrival-photo img")).toHaveCount(1);
  await expect(page.locator(".parking-location")).toHaveCount(3);
  const tariffs = page.locator(".parking-practical details").filter({ has: page.locator("summary", { hasText: "Parkeertarieven" }) });
  await expect(tariffs).not.toHaveAttribute("open");
  await expect(tariffs.locator("ul").first()).toBeHidden();
  await tariffs.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(tariffs).toHaveAttribute("open", "");
  await expect(tariffs.getByRole("list").first()).toBeVisible();
  await expect(tariffs).toContainText("ca. € 1,45 per uur");
  const toilets = page.locator(".accessibility-details details").filter({ has: page.locator("summary", { hasText: "Toiletten" }) });
  await expect(toilets).not.toHaveAttribute("open");
  await toilets.locator("summary").click();
  await expect(toilets).toContainText("Bibliotheek Oldenzaal");
  await expect(toilets.locator(".information-details-body")).toBeVisible();
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("centrumverhaal is compact, volledig te openen en contact staat direct klaar", async ({ page }) => {
  await page.route("https://www.google.com/maps?*", route => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Kaart</title>" }));
  await page.goto(sitePath("/over-de-vijfhoek"));
  await expect(page.locator(".history-chapter")).toHaveCount(2);
  const chapter = page.locator(".history-chapter").first();
  await expect(chapter.locator("details")).not.toHaveAttribute("open");
  await expect(chapter.locator(".information-details-body")).toBeHidden();
  await chapter.locator("summary").focus();
  await page.keyboard.press("Space");
  await expect(chapter.locator(".information-details-body")).toBeVisible();
  await expect(chapter).toContainText("Hoog-Catharijne");
  await expect(page.locator("#beheer")).toContainText(info.managementName);
  await expect(page.locator("#contact").getByRole("link", { name: info.contactEmail, exact: true })).toHaveAttribute("href", `mailto:${info.contactEmail}`);
  await expect(page.locator("#contact").getByRole("link", { name: info.contactPhone, exact: true })).toHaveAttribute("href", "tel:0703180055");
  await page.locator("#contact summary").click();
  await expect(page.locator("#contact .information-details-body")).toBeVisible();
  await expect(page.locator("#contact")).toContainText("Meldingen over parkeren en openbare ruimte");
  await page.locator("#ondernemers summary").click();
  await expect(page.locator("#ondernemers")).toContainText("Actieve Winkeliersvereniging");
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
});
