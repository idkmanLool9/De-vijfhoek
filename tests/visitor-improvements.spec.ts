import { test, expect } from "@playwright/test";
import { shops } from "../src/data/shops";
import { basePath, sitePath } from "./paths";

for (const width of [375, 1440]) {
  test(`navigatie start bovenaan en bewaart ankers en browsergeschiedenis op ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(sitePath("/over-de-vijfhoek"));
    await page.locator("header .brand").click();
    await expect(page).toHaveURL(new RegExp(`${sitePath("/")}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.locator("footer .brand").click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.locator("footer").getByRole("link", { name: "Winkels", exact: false }).click();
    await expect(page).toHaveURL(new RegExp(`${sitePath("/winkels")}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.locator("footer .brand").click();
    await expect(page).toHaveURL(new RegExp(`${sitePath("/")}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.locator("footer").getByRole("link", { name: "Bezoekersinfo", exact: false }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.getByRole("navigation", { name: "Onderwerpen bezoekersinformatie" }).getByRole("link", { name: "Plattegrond", exact: false }).click();
    await expect(page.locator("#plattegrond").getByRole("heading", { name: "Plattegrond", exact: true })).toBeInViewport();
    const scroll = await page.evaluate(() => window.scrollY);
    expect(scroll).toBeGreaterThan(300);
    await page.locator("footer").getByRole("link", { name: "Winkels", exact: false }).evaluate((link) => (link as HTMLAnchorElement).click());
    await expect(page).toHaveURL(new RegExp(`${sitePath("/winkels")}$`));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await page.goBack();
    await expect(page).toHaveURL(/#plattegrond$/);
    await expect(page.locator("#plattegrond").getByRole("heading", { name: "Plattegrond", exact: true })).toBeInViewport();
  });
}

test("winkelgids laadt kleinere responsive beelden en bewaart de uitsneden", async ({ page, request }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const originals: string[] = [];
  page.on("request", (request) => { if (request.resourceType() === "image" && request.url().includes("/images/official/")) originals.push(request.url()); });
  await page.goto(sitePath("/winkels"));
  const images = page.locator(".shop-card img");
  const urls = new Set<string>();
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const src = await image.evaluate((el) => (el as HTMLImageElement).currentSrc);
    expect(new URL(src).pathname).toMatch(new RegExp(`^${basePath}/images/optimized/`));
    urls.add(src);
  }
  let total = 0;
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.ok()).toBe(true);
    const size = (await response.body()).length;
    expect(size, url).toBeLessThan(250_000);
    total += size;
  }
  expect(total).toBeLessThan(2_000_000);
  expect(originals).toEqual([]);
});

test("gratis Google-koppelingen verwijzen naar de juiste winkel zonder verzonnen reviews of tijden", async ({ page }) => {
  for (const slug of ["albert-heijn", "t-glashoes", "hebbez-ik-wil-mode"]) {
    await page.goto(sitePath(`/winkels/${slug}`));
    const shop = shops.find((shop) => shop.slug === slug)!;
    const opening = page.getByRole("link", { name: "Openingstijden op Google", exact: false });
    const search = new URL((await opening.getAttribute("href"))!);
    expect(search.origin).toBe("https://www.google.com");
    expect(search.searchParams.get("api")).toBe("1");
    expect(search.searchParams.get("query")).toContain(shop.name.replace(/\s*\|\s*/g, " "));
    expect(search.searchParams.get("query")).toContain("Oldenzaal");
    if (shop.address) expect(search.searchParams.get("query")).toContain(shop.address);
    const route = new URL((await page.getByRole("link", { name: "Route met Google Maps", exact: false }).getAttribute("href"))!);
    expect(route.pathname).toBe("/maps/dir/");
    expect(route.searchParams.get("destination")).toBe(search.searchParams.get("query"));
    const reviews = new URL((await page.getByRole("link", { name: "Reviews op Google", exact: false }).getAttribute("href"))!);
    expect(reviews.searchParams.get("q")).toBe(`${search.searchParams.get("query")} reviews`);
    await expect(page.locator(".hours-list")).toHaveCount(0);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  }
  // Third-party rendering is not controlled by this repository. Validate the
  // real embed URL, accessible title and usable fallback links independently.
  await page.route("https://www.google.com/maps?*", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Map test</title>" }));
  await page.goto(sitePath("/over-de-vijfhoek"));
  const frame = page.getByTitle("Google Maps — Winkelcentrum In den Vijfhoek, Oldenzaal", { exact: true });
  const url = new URL((await frame.getAttribute("src"))!);
  expect(url.searchParams.get("q")).toBe("Winkelcentrum In den Vijfhoek Oldenzaal");
  expect(url.searchParams.get("output")).toBe("embed");
  await expect(frame).toBeVisible();
  await expect(page.locator('[data-media-id="over-centrum"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Open in Google Maps", exact: false })).toBeVisible();
});
