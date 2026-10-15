import { test, expect } from "@playwright/test";
import { sitePath } from "./paths";

test("homepage toont de afgesproken inhoud en eerlijke placeholders", async ({ page }) => {
  await page.goto(sitePath("/"));
  await expect(page).toHaveTitle("De Vijfhoek Oldenzaal | Alles dichtbij");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Alles dichtbij.Midden in Oldenzaal.");
  await expect(page.getByText("Fotoplaceholder · Officiële centrumfoto volgt")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ontdek de winkels", exact: true })).toHaveAttribute("href", sitePath("/winkels"));
  await expect(page.getByText("Er zijn op dit moment nog geen bevestigde nieuwsberichten of evenementen gepubliceerd.")).toBeVisible();
});

for (const width of [320, 375, 768, 1440]) {
  test(`homepage past binnen het scherm op ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(sitePath("/"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (width < 1024) {
      await page.getByRole("button", { name: "Menu openen" }).click();
      await expect(page.getByRole("navigation", { name: "Mobiele hoofdnavigatie" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Menu openen" })).toBeFocused();
      await expect(page.getByRole("navigation", { name: "Mobiele hoofdnavigatie" })).toBeHidden();
    }
  });
}

test("toetsenbord kan de navigatie overslaan", async ({ page }) => {
  await page.goto(sitePath("/"));
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Ga naar inhoud" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
