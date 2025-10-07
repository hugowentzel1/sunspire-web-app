import { test, expect } from "@playwright/test";
const DEMO = "https://sunspire-web-app.vercel.app/?company=uber&demo=1";

test.describe("Hero trust row: emojis + alignment + content", () => {
  test("trust row exists once, emojis subdued & aligned, content correct", async ({ page }) => {
    await page.goto(DEMO);
    const row = page.getByTestId("hero-trust-row");
    await expect(row).toBeVisible();
    await expect(row).toHaveCount(1);

    const rowText = await row.textContent();
    expect(rowText?.toLowerCase()).toContain("installers live");
    await expect(row).toContainText("SOC 2");
    await expect(row).toContainText("GDPR");
    await expect(row).toContainText("NREL PVWatts");
    await expect(row).toContainText("rating");

    // Check we have separators
    const dots = await row.locator("span:text('•')").count();
    expect(dots).toBeGreaterThanOrEqual(4);

    // Check an emoji has opacity ~ 0.6 (style driven)
    const emoji = row.locator("span[aria-hidden='true']").first();
    const opacity = await emoji.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeCloseTo(0.6, 1);
  });
});

test.describe("Quote cards: consistent layout + restored Verified look", () => {
  test("4 cards, same structure, inline green verified pill", async ({ page }) => {
    await page.goto(DEMO);

    const cards = page.getByTestId("quote-card");
    await expect(cards).toHaveCount(4);

    // Headline + support present in each card
    for (let i = 0; i < 4; i++) {
      const c = cards.nth(i);
      const paras = c.locator("blockquote p");
      await expect(paras.first()).toBeVisible();
      const parasCount = await paras.count();
      expect(parasCount).toBeGreaterThanOrEqual(1); // at least headline
    }

    // Attribution row contains inline Verified pill with restored green look
    const firstAttr = cards.nth(0).getByTestId("quote-attribution-row");
    await expect(firstAttr).toBeVisible();

    const chip = firstAttr.getByTestId("verified-chip");
    await expect(chip).toBeVisible();
    await expect(chip).toContainText("Verified");

    // Verify the 'restored' look via classes on the chip
    const classList = await chip.evaluate(el => el.className);
    expect(classList).toContain("bg-emerald-50");
    expect(classList).toContain("border-emerald-200");
    expect(classList).toContain("text-emerald-700");

    // Ensure chip is inline within the attribution row bounds (not floating)
    const rowBox = await firstAttr.boundingBox();
    const chipBox = await chip.boundingBox();
    if (rowBox && chipBox) {
      // Just verify they overlap vertically (inline on same line)
      const inline = chipBox.y >= rowBox.y && chipBox.y <= (rowBox.y + rowBox.height + 5);
      expect(inline).toBeTruthy();
    }

    // Check card height variance is modest (visual consistency)
    const heights = await Promise.all(
      [0,1,2,3].map(async i => (await cards.nth(i).boundingBox())?.height || 0)
    );
    const minH = Math.min(...heights), maxH = Math.max(...heights);
    expect(maxH - minH).toBeLessThan(60); // allow reasonable variance
  });
});

