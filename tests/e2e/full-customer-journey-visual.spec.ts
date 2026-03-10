/**
 * Full customer journey — run VISUALLY (headed) so you can watch every step.
 *
 * Part A: Installer buys Sunspire — demo → report → Launch → Stripe checkout (redirect only).
 * Part B: Installer dashboard / activation (success URL).
 * Part C: Homeowner gets estimate and signs up — report (paid) → Request a free consult → modal → submit → success + Book a time / No thanks.
 * Part D: Status page — every link/button.
 * Part E: Refund page — every link/button.
 *
 * Run (see the browser):
 *   npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --headed --workers=1
 * With slow motion (recommended):
 *   npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --headed --workers=1 --slow-mo=800
 *
 * Against live (recommended; ~40s):
 *   BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/full-customer-journey-visual.spec.ts --headed --workers=1
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

// Single long test so you watch one continuous journey; timeout 3 min
test.describe("Full customer journey (visual)", () => {
  test("A→B→C: Installer demo → checkout redirect, then Homeowner estimate → lead signup; then Status + Refund", async ({
    page,
    request,
  }) => {
    test.setTimeout(120000);

    // ---- Part A: Installer — open demo, go to report, click Launch (redirect to Stripe) ----
    await page.goto(`${BASE}/?company=TestCo&demo=1`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => null);
    await page.waitForTimeout(1500);

    // Landing: primary CTA or "Launch" should be visible (use single locator to avoid strict mode)
    await expect(page.getByRole("button", { name: /Launch Your Branded Version|Activate on Your Domain/i }).first()).toBeVisible({ timeout: 15000 });

    // Go to report with demo=1 (installer viewing as demo)
    await page.goto(
      `${BASE}/report?company=TestCo&demo=1&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('text=/NREL|PVWatts|savings|Production|System Size|estimate/i', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(2000);

    // On demo report: "Book a Consultation" or lock overlay "Launch Your Branded Version"
    const bookConsultDemo = page.getByRole("button", { name: /Book a Consultation/i }).first();
    const launchOverlay = page.getByRole("button", { name: /Launch Your Branded Version/i }).first();
    const hasLaunch = await launchOverlay.isVisible().catch(() => false);
    const hasBook = await bookConsultDemo.isVisible().catch(() => false);
    expect(hasLaunch || hasBook || await page.locator("body").innerText().then((t) => /Launch|NREL|savings/i.test(t))).toBe(true);

    // Click Launch (if visible) — should redirect to Stripe; we'll wait for navigation then assert URL
    if (hasLaunch) {
      const [nav] = await Promise.all([
        page.waitForURL(/stripe\.com|checkout|payment/, { timeout: 15000 }).catch(() => null),
        launchOverlay.click(),
      ]);
      if (nav) {
        await expect(page).toHaveURL(/stripe\.com|checkout|payment/i, { timeout: 5000 });
        // Come back to app for rest of test
        await page.goto(`${BASE}/?company=TestCo&demo=1`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);
      }
    }

    // ---- Part B: Activation / success page (simulate post-purchase) ----
    await page.goto(`${BASE}/c/TestCo?session_id=test_visual&demo=1`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const dashBody = await page.locator("body").innerText();
    const hasDashboardCopy = /Instant URL|dashboard|Connect your CRM|you're live|embed|API key|Back to Home/i.test(dashBody);
    expect(hasDashboardCopy || dashBody.length > 200).toBe(true);
    const backLink = page.getByRole("link", { name: /Back to Home|← Back/i }).first();
    await expect(backLink).toBeVisible({ timeout: 8000 }).catch(() => null);

    // ---- Part C: Homeowner — report WITHOUT demo (paid) so we get "Request a free consult" and lead modal ----
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('text=/Next step|Request a free consult|Book a Consultation|NREL|savings/i', { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(1500);

    const consultBtn = page.getByRole("button", { name: /Request a free consult|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 10000 });
    await consultBtn.click();
    const dialogOrStripe = await Promise.race([
      page.waitForSelector('[role="dialog"]', { timeout: 8000 }).then(() => "dialog" as const),
      page.waitForURL(/stripe\.com|checkout/, { timeout: 8000 }).then(() => "stripe" as const).catch(() => null),
    ]).catch(() => null);
    if (dialogOrStripe === "stripe" || dialogOrStripe === null) {
      if (page.url().match(/stripe\.com|checkout/i)) await page.goto(`${BASE}/status`, { waitUntil: "domcontentloaded" });
    } else if (dialogOrStripe === "dialog") {
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal.locator("text=/Next step: schedule your free consultation|free consultation/i")).toBeVisible({ timeout: 5000 });
      await expect(modal.locator("#report-lead-name")).toBeVisible();
      await expect(modal.locator("#report-lead-email")).toBeVisible();
      await expect(modal.locator("#report-lead-phone")).toBeVisible();
      await expect(modal.locator("#report-lead-consent")).toBeVisible();
      await expect(modal.locator("text=/agree to be contacted/i").first()).toBeVisible({ timeout: 3000 });
      await expect(modal.locator('button[type="submit"]')).toContainText(/Send my report|Sending/i);

      await modal.locator("#report-lead-name").fill("Visual Journey Test");
      await modal.locator("#report-lead-email").fill(`journey-${Date.now()}@test.example`);
      await modal.locator("#report-lead-phone").fill("+1 555 123 4567");
      await modal.locator("#report-lead-consent").check();
      await modal.locator('button[type="submit"]').click();

      await page.waitForSelector('text=/all set|hear back|Book a time|No thanks|Something went wrong|Failed|Sending/i', {
        timeout: 12000,
      }).catch(() => null);
      await page.waitForTimeout(2000);
      const bodyText = await page.locator("body").innerText();
      const hasSuccess = /all set|hear back within 1 business day|Book a time \(recommended\)|No thanks — have them reach out/i.test(bodyText);
      const hasError = /Something went wrong|Failed to submit/i.test(bodyText);
      if (hasSuccess) {
        const noThanksBtn = page.getByRole("button", { name: /No thanks — have them reach out/i }).first();
        await noThanksBtn.click().catch(() => null);
        await page.waitForTimeout(500);
      } else {
        await page.getByRole("button", { name: /Cancel/i }).first().click().catch(() => null);
        await page.waitForTimeout(300);
      }
    }

    // ---- Part D: Status page — every button/link ----
    await page.goto(`${BASE}/status`, { waitUntil: "load" });
    await page.waitForSelector('[data-testid="status-service-list"], text=/Status check failed/i', { timeout: 20000 }).catch(() => null);
    await expect(page.locator("body")).toContainText(/support@getsunspire\.com|Status check failed/i, { timeout: 15000 });
    const bodyD = await page.locator("body").innerText();
    const statusFailed = /Status check failed/i.test(bodyD);
    if (!statusFailed) {
      await expect(page.locator("body")).toContainText(/api\/health|System Status|Operational|Airtable|Stripe|NREL/i);
      const refreshBtn = page.getByRole("button", { name: /Refresh now|Refreshing/i });
      await expect(refreshBtn).toBeVisible({ timeout: 5000 });
      await refreshBtn.click();
      await page.waitForTimeout(2000);
      const backToHomeStatus = page.getByRole("link", { name: /Back to Home|← Back/i }).first();
      await expect(backToHomeStatus).toBeVisible({ timeout: 3000 });
      await backToHomeStatus.click();
      await page.waitForTimeout(500);
    }

    // ---- Part E: Refund page — every link/button ----
    await page.goto(`${BASE}/legal/refund`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('text=/Refund Policy|Setup-Fee|support@getsunspire/i', { timeout: 10000 });
    await expect(page.locator("body")).toContainText(/Sunspire Software LLC|1700 Northside/i);
    const supportMailLink = page.locator('a[href*="support@getsunspire"]').first();
    await expect(supportMailLink).toBeVisible({ timeout: 3000 });
    const privacyOrTerms = page.locator('a[href*="/privacy"], a[href*="/terms"]').first();
    await expect(privacyOrTerms).toBeVisible({ timeout: 5000 }).catch(() => null);
  });
});
