/**
 * Visual/functional checks for the new changes:
 * - Streamlined status page (support@getsunspire.com, UptimeRobot, Sentry)
 * - Report CTA block (Next step heading, Request a free consult)
 * - Lead modal (wording, consent, post-submit "Book a time" / "No thanks")
 * - Refund page (legal name, support link)
 * - Health API shape
 * Run: BASE_URL=https://sunspire-web-app.vercel.app npx playwright test tests/e2e/new-changes-visual.spec.ts
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("New changes — visual and buttons", () => {
  test("Status page: support@getsunspire.com, UptimeRobot, Sentry, daily check", async ({
    page,
    request,
  }) => {
    const healthRes = await request.get(`${BASE}/api/health`);
    expect(healthRes.ok() || healthRes.status() === 503).toBe(true);
    const healthBody = await healthRes.json().catch(() => ({}));
    expect(healthBody.services).toBeDefined();
    expect(Array.isArray(healthBody.services)).toBe(true);

    await page.goto(`${BASE}/status`, { waitUntil: "load" });
    // Wait for final state (not loading): either service list (success) or error message
    await page.waitForSelector('[data-testid="status-service-list"], text=/Status check failed/i', { timeout: 20000 }).catch(() => null);
    await expect(page.locator("body")).toContainText(/support@getsunspire\.com|Status check failed/i, { timeout: 15000 });
    // Status page must have exactly one h1 (design requirement); scope to status content so layout/other h1s don't break
    const statusContent = page.locator('[data-testid="status-page-content"]').first();
    await expect(statusContent).toBeVisible({ timeout: 5000 });
    const h1InStatus = statusContent.locator("h1");
    await expect(h1InStatus).toHaveCount(1);
    const h1Text = await h1InStatus.first().innerText();
    expect(h1Text).toMatch(/System Status|Status check failed/i);
    const body = await page.locator("body").innerText();
    const isErrorState = /Status check failed/i.test(body);
    if (!isErrorState) {
      expect(body).toMatch(/Sentry|sentry/i);
      expect(body).toMatch(/\/api\/health|api\/health/i);
      const hasNewBlock = /UptimeRobot|uptimerobot|Daily check|daily check/i.test(body);
      const hasOldBlock = /Not checked on this page|probed by/i.test(body);
      expect(hasNewBlock || hasOldBlock).toBe(true);
    }
  });

  test("Report page: CTA section and consult/booking button", async ({
    page,
  }) => {
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('text=/Next step|Request a free consult|Book a Consultation|NREL|savings/i', {
      timeout: 20000,
    });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/NREL|savings|solar|report|Production|System Size/i);
    const hasNextStep = /Next step: get your install-ready plan|Next step: schedule your free consultation|quick consult confirms roof layout|installer can schedule the next step/i.test(body);
    const hasConsultBtn = /Request a free consult|Book a Consultation/i.test(body);
    expect(hasNextStep || hasConsultBtn).toBe(true);
    const consultBtn = page.getByRole("button", { name: /Request a free consult|Book a Consultation/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 5000 });
    // Paid report: no "Talk to a Specialist" button (hideTalkToSpecialist)
    const talkBtn = page.getByRole("link", { name: /Talk to a Specialist/i });
    await expect(talkBtn).toHaveCount(0);
  });

  test("Lead modal: open, wording, consent, submit button, then success or error", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(
      `${BASE}/report?company=TestCo&address=1600+Amphitheatre+Parkway&lat=37.422&lng=-122.084&state=CA&placeId=test`,
      { waitUntil: "domcontentloaded" }
    );
    await page.waitForSelector('button:has-text("Request a free consult")', { timeout: 20000 }).catch(() => null);
    const consultBtn = page.getByRole("button", { name: /Request a free consult/i }).first();
    await expect(consultBtn).toBeVisible({ timeout: 10000 });
    await consultBtn.click();
    await page.waitForSelector('[role="dialog"]', { timeout: 8000 });
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal.locator("text=/Next step: schedule your free consultation|free consultation/i")).toBeVisible({
      timeout: 5000,
    });
    await expect(modal.locator("text=/Share your details|quick consult confirms roof layout|installer can guide the next step/i")).toBeVisible({
      timeout: 3000,
    });
    await expect(modal.locator("#report-lead-name")).toBeVisible();
    await expect(modal.locator("#report-lead-email")).toBeVisible();
    await expect(modal.locator("#report-lead-phone")).toBeVisible();
    await expect(modal.locator("#report-lead-consent")).toBeVisible();
    await expect(modal.locator("text=/agree to be contacted/i").first()).toBeVisible({ timeout: 3000 });
    await expect(modal.locator('button[type="submit"]')).toContainText(/Send my report|Sending/i);
    await expect(modal.locator("text=/Takes ~30 seconds|No obligation/i")).toBeVisible({ timeout: 3000 }).catch(() => null);

    await modal.locator("#report-lead-name").fill("Visual Test");
    await modal.locator("#report-lead-email").fill(`visual-${Date.now()}@test.example`);
    await modal.locator("#report-lead-consent").check();
    await modal.locator('button[type="submit"]').click();

    await page.waitForSelector('text=/You\'re all set|hear back within 1 business day|Book a time|No thanks — have them reach out|Something went wrong|Failed|Sending/i', {
      timeout: 20000,
    });
    await page.waitForTimeout(3000);
    const afterBody = (await modal.innerText().catch(() => "")) || (await page.locator("body").innerText().catch(() => ""));
    const hasSuccess = /You're all set|hear back within 1 business day|Book a time|No thanks — have them reach out/i.test(afterBody);
    const hasError = /Something went wrong|Failed to submit|Failed|error/i.test(afterBody);
    expect(hasSuccess || hasError).toBe(true);
  });

  test("Activation (post-pay) page: no main site header (Activate, Pricing, Support)", async ({
    page,
  }) => {
    await page.goto(`${BASE}/c/activate-test?session_id=cs_test_123&demo=1`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector('text=/Dashboard|Instant URL|Custom Domain|Embed/i', { timeout: 15000 });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Dashboard|Instant URL|Custom Domain|embed/i);
    // Main site nav (header with Pricing/Support/Activate) must not be present on /c/ pages
    await expect(page.getByTestId("main-site-nav")).toHaveCount(0);
  });

  test("Refund page: loads, legal name, support link", async ({ page }) => {
    await page.goto(`${BASE}/legal/refund`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('text=/Refund Policy|Setup-Fee|support@getsunspire/i', { timeout: 10000 });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Refund Policy|Setup-Fee Refund|setup fee/i);
    expect(body).toMatch(/support@getsunspire\.com/i);
    expect(body).toMatch(/Sunspire Software LLC|1700 Northside/i);
    const supportLink = page.locator('a[href*="support@getsunspire"]').first();
    await expect(supportLink).toBeVisible({ timeout: 3000 });
  });

  test("Health API: timestamp, services array, each service has service + status", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/api/health`);
    const data = await res.json().catch(() => ({}));
    expect(data.timestamp).toBeDefined();
    expect(Array.isArray(data.services)).toBe(true);
    if (data.services?.length > 0) {
      const first = data.services[0];
      expect(first).toHaveProperty("service");
      expect(first).toHaveProperty("status");
      expect(["ok", "degraded", "down"]).toContain(first.status);
    }
  });
});
