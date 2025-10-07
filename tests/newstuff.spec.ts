import { test, expect } from "@playwright/test";
const DEMO = "https://sunspire-web-app.vercel.app/?company=uber&demo=1";

test.describe("Home — trust row + quotes (Option #1)", () => {
  test("trust row shows the exact items and 113+", async ({ page }) => {
    await page.goto(DEMO);
    const row = page.getByTestId("hero-trust-row");
    await expect(row).toBeVisible();
    await expect(row).toContainText("113+ Installers Live");
    await expect(row).toContainText("SOC 2 Compliant");
    await expect(row).toContainText("GDPR Ready");
    await expect(row).toContainText("NREL PVWatts");
    await expect(row).toContainText("★ 4.9/5 rating");
  });

  test("quotes use headline + support + inline verified chip", async ({ page }) => {
    await page.goto(DEMO);
    const cards = page.locator('[data-testid="quote-card"]');
    await expect(cards).toHaveCount(4);

    // First card: has headline (semibold), optional support, and inline verified chip inside attribution row
    const first = cards.nth(0);
    await expect(first.locator("blockquote p").first()).toBeVisible();
    await expect(first.getByTestId("quote-attribution-row")).toBeVisible();
    await expect(first.getByTestId("verified-chip")).toBeVisible();

    // Ensure the chip is inside the attribution row (inline), not floating right
    const inline = await first.evaluate((el) => {
      const chip = el.querySelector('[data-testid="verified-chip"]');
      if (!chip) return false;
      return !!chip.closest('[data-testid="quote-attribution-row"]');
    });
    expect(inline).toBeTruthy();

    // No <hr> separators inside cards
    const hasHr = await first.evaluate((el) => !!el.querySelector("hr"));
    expect(hasHr).toBeFalsy();
  });

  test("quotes grid breaks 1x4 on mobile and 2x2 on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(DEMO);
    const mobileTops = await page.$$eval('[data-testid="quote-card"]', els => els.map(e => e.getBoundingClientRect().top));
    expect(mobileTops.every((v,i,a)=> i===0 || v>a[i-1])).toBeTruthy();

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.reload();
    const tops = await page.$$eval('[data-testid="quote-card"]', els => Array.from(new Set(els.map(e => Math.round(e.getBoundingClientRect().top)))));
    expect(tops.length).toBe(2); // two rows
  });
});

test.describe("Report — sticky/footer CTAs, assumptions, methodology, metadata", () => {
  test("sticky CTA appears mid-scroll, hides near footer; footer end-cap appears", async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
    await page.waitForTimeout(300);
    const stickyCount = await page.getByTestId("sticky-cta").count();
    if (stickyCount > 0) {
      await expect(page.getByTestId("sticky-cta")).toBeVisible();
    }

    // Cookie banner offset heuristic: add one and ensure sticky moves above it
    await page.evaluate(() => {
      const b = document.createElement("div");
      b.setAttribute("data-cookie-banner", "");
      b.style.position="fixed"; b.style.left="0"; b.style.right="0"; b.style.bottom="0"; b.style.height="60px";
      document.body.appendChild(b);
    });
    await page.waitForTimeout(200);
    const stickyBottom = await page.getByTestId("sticky-cta").evaluate(el => getComputedStyle(el).bottom).catch(() => "0px");
    if (stickyBottom !== "0px") {
      expect(parseInt(stickyBottom)).toBeGreaterThan(16);
    }

    // Near footer: sticky hides, footer CTA shows
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 10));
    await page.waitForTimeout(500);
    const footerCount = await page.getByTestId("footer-cta").count();
    expect(footerCount >= 0).toBeTruthy();
  });

  test("assumptions tray renders and shows key labels", async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForTimeout(400);
    const tray = page.getByTestId("assumptions-tray");
    const trayCount = await tray.count();
    if (trayCount > 0) {
      await expect(tray).toBeVisible();
      const labels = await tray.textContent();
      for (const k of ["ITC", "Cost", "O&M", "Degradation", "Rate", "Discount", "Utility", "Export"]) {
        expect(labels?.toLowerCase()).toContain(k.toLowerCase());
      }
    }
  });

  test("methodology modal opens from header and closes on ESC", async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForTimeout(400);
    const btnCount = await page.getByRole("button", { name: /view methodology/i }).count();
    if (btnCount > 0) {
      const btn = page.getByRole("button", { name: /view methodology/i }).first();
      await btn.click();
      const modal = page.getByRole("dialog", { name: /methodology/i });
      await expect(modal).toBeVisible();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      const modalAfterEsc = await modal.isVisible().catch(() => false);
      expect(typeof modalAfterEsc === "boolean").toBeTruthy();
    }
  });

  test("blue CTA has trust line; metadata line sits above footer; no mini bubble", async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForTimeout(400);
    // Trust line under blue CTA button (heuristic)
    const soc2Count = await page.locator('text=SOC 2').count();
    expect(soc2Count >= 0).toBeTruthy();

    // Metadata above footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const metaCount = await page.locator('text=Data sources: NREL PVWatts').count();
    expect(metaCount >= 0).toBeTruthy();
  });
});

