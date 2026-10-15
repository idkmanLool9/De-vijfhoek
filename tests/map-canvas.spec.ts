import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./map-harness";

test("SVG-ruimtes blijven geometrisch gelijk bij selectie, zoeken en zoomen", async ({ page, mapHarness }) => {
  await page.goto(mapHarness);
  const map = page.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  await expect(map).toBeVisible();
  const paths = await map.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")));
  await map.getByRole("button", { name: "Action, unit 141", exact: true }).click();
  await expect(map.getByRole("button", { name: "Action, unit 141", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("region", { name: "Informatie over de selectie" }).getByRole("heading")).toHaveText("Action");
  await expect(page.getByRole("link", { name: "Bekijk de winkelpagina" })).toHaveAttribute("href", "/winkels/action");
  await page.getByRole("button", { name: "Inzoomen", exact: true }).click();
  await expect(page.getByLabel("Zoomniveau")).toHaveText("135%");
  await page.getByRole("searchbox").fill("  SCAPINO  ");
  await expect(page.getByRole("list", { name: "Gevonden winkels en units" }).getByRole("button")).toHaveCount(2);
  await expect(map.locator(".is-dimmed")).toHaveCount(3);
  expect(await map.locator("path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d")))).toEqual(paths);
  await expect(map).toHaveAttribute("viewBox", "0 0 1000 1000");
  await expect(map.locator("image")).toHaveAttribute("width", "1000");
  await page.getByRole("button", { name: "Volledige kaart tonen" }).click();
  await expect(page.getByLabel("Zoomniveau")).toHaveText("100%");
  await expect(page.getByRole("button", { name: "Uitzoomen", exact: true })).toBeDisabled();
});

test("zoomlimieten, pijlknoppen en slepen werken zonder onbedoelde selectie", async ({ page, mapHarness }) => {
  await page.goto(mapHarness);
  const drawing = page.locator(".floor-map-drawing");
  await page.getByRole("button", { name: "Inzoomen", exact: true }).click({ clickCount: 6 });
  await expect(page.getByLabel("Zoomniveau")).toHaveText("500%");
  await expect(page.getByRole("button", { name: "Inzoomen", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Volledige kaart tonen" }).click();
  await page.getByRole("button", { name: "Inzoomen", exact: true }).click();
  const before = await drawing.getAttribute("transform");
  await page.getByRole("button", { name: "Kaart naar links verschuiven" }).click();
  expect(await drawing.getAttribute("transform")).not.toBe(before);
  const viewport = page.locator(".floor-map-viewport");
  await viewport.scrollIntoViewIfNeeded();
  const box = (await viewport.boundingBox())!;
  const afterPan = await drawing.getAttribute("transform");
  await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .65, box.y + box.height * .55, { steps: 8 });
  await page.mouse.up();
  expect(await drawing.getAttribute("transform")).not.toBe(afterPan);
  await expect(page.locator(".floor-map-unit [aria-pressed=true]")).toHaveCount(0);
  await page.getByRole("button", { name: "Volledige kaart tonen" }).click();
  await expect(drawing).toHaveAttribute("transform", "translate(0 0) scale(1)");
});

test("toetsenbord kiest ruimtes, houdt focus zichtbaar en verlaat de kaart", async ({ page, mapHarness }) => {
  await page.goto(mapHarness);
  const map = page.getByRole("group", { name: "Interactieve plattegrond", exact: false });
  await map.focus();
  await page.keyboard.press("+");
  await expect(page.getByLabel("Zoomniveau")).toHaveText("135%");
  await page.keyboard.press("Home");
  await page.keyboard.press("Tab");
  const first = map.getByRole("button", { name: "Albert Heijn, unit 1", exact: true });
  await expect(first).toBeFocused();
  await page.keyboard.press("ArrowRight");
  const action = map.getByRole("button", { name: "Action, unit 141", exact: true });
  await expect(action).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(action).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("End");
  const unknown = map.getByRole("button", { name: "Unit 999, winkel nog niet bevestigd", exact: true });
  await expect(unknown).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Informatie over de selectie" }).getByRole("heading")).toHaveText("Unit 999");
  await expect(page.getByRole("link", { name: "Bekijk de winkelpagina" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(unknown).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Inzoomen", exact: true })).toBeFocused();
});

test("lijst selecteert een ruimte buiten beeld en ontbrekende verdiepingen krijgen geen fictieve kaart", async ({ page, mapHarness }) => {
  await page.goto(mapHarness);
  await page.getByRole("searchbox").fill("141");
  await page.getByRole("list", { name: "Gevonden winkels en units" }).getByRole("button").click();
  await expect(page.getByRole("group", { name: "Interactieve plattegrond", exact: false }).getByRole("button", { name: "Action, unit 141" })).toHaveAttribute("aria-pressed", "true");
  expect(Number(await page.locator(".floor-map-viewport").getAttribute("data-zoom"))).toBeGreaterThan(1);
  await page.getByRole("combobox").selectOption("first");
  await expect(page.getByRole("heading", { name: "Plattegrond nog niet beschikbaar" })).toBeVisible();
  await expect(page.locator(".floor-map-svg")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Kies een winkel of unit" })).toBeVisible();
  await page.getByRole("combobox").selectOption("overview");
  await expect(page.getByLabel("Zoomniveau")).toHaveText("100%");
});

test("kaart en geselecteerde informatie zijn responsive en automatisch toegankelijk", async ({ page, mapHarness }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(mapHarness);
    await page.getByRole("searchbox").fill("999");
    await page.getByRole("list", { name: "Gevonden winkels en units" }).getByRole("button").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations, `${width}px`).toEqual([]);
  }
});

test("touchbediening kan na inzoomen verschuiven terwijl de brongeometrie behouden blijft", async ({ browser, mapHarness }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(mapHarness);
  await page.getByRole("button", { name: "Inzoomen", exact: true }).tap();
  const map = page.locator(".floor-map-svg");
  await expect(map).toHaveCSS("touch-action", "none");
  await map.scrollIntoViewIfNeeded();
  const box = (await map.boundingBox())!;
  const drawing = page.locator(".floor-map-drawing");
  const before = await drawing.getAttribute("transform");
  const cdp = await context.newCDPSession(page);
  const point = { x: Math.round(box.x + box.width * .5), y: Math.round(box.y + box.height * .5) };
  await cdp.send("Input.synthesizeScrollGesture", { ...point, xDistance: 50, yDistance: 30, gestureSourceType: "touch", speed: 300 });
  await expect(drawing).not.toHaveAttribute("transform", before!);
  await expect(map).toHaveAttribute("viewBox", "0 0 1000 1000");
  await page.getByRole("button", { name: "Volledige kaart tonen" }).tap();
  await expect(map).toHaveCSS("touch-action", "pan-y pinch-zoom");
  await context.close();
});
