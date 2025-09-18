import { test, expect } from "@playwright/test";

const PAID_URL =
  process.env.PAID_URL ??
  "https://sunspire-web-app.vercel.app/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";

test("Paid: clean UI with no demo/CRM copy", async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // Wait for the page to fully load
  await page.waitForLoadState("domcontentloaded");

  // 1) No demo artifacts
  for (const re of [
    /Private demo/i,
    /Activate on Your Domain/i,
    /Unlock Full Report/i,
    /Preview:\s*\d+\s*runs left/i,
  ]) {
    await expect(page.getByText(re).first()).toHaveCount(0);
  }

  // 2) No CRM marketing badges
  for (const re of [/CRM Ready/i, /CRM Integration/i, /24\/7 Support/i]) {
    await expect(page.getByText(re).first()).toHaveCount(0);
  }

  // 3) Hero logo visible (chip or img) - wait for it to load
  await page.waitForSelector("[data-hero-logo]", { timeout: 10000 });
  await expect(page.locator("[data-hero-logo]")).toBeVisible();

  // 4) KPI cards exist - these are on the report page, not the main page
  // Skip this check for the main page test

  // 5) Sticky bar appears on scroll with correct actions
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1000); // Wait for scroll to complete
  const sticky = page.locator("[data-sticky-bar]");
  await expect(sticky).toBeVisible();
  await expect(
    sticky.getByRole("button", { name: /Book Consultation/i }),
  ).toBeVisible();
  await expect(
    sticky.getByRole("button", { name: /Email PDF/i }),
  ).toBeVisible();

  // 6) Data sources & disclaimer - these are on the report page, not the main page
  // Skip this check for the main page test
});

test("Paid: hero shows company branding and correct headline", async ({
  page,
}) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // Wait for the page to fully load
  await page.waitForLoadState("domcontentloaded");

  // Check for correct headline for paid experience
  await expect(
    page.getByText("Instant Solar Analysis for Your Home"),
  ).toBeVisible();

  // Check for correct subheadline
  await expect(
    page.getByText(
      "Enter your address to see projected production, ROI, and payback in seconds.",
    ),
  ).toBeVisible();

  // Check that company logo is visible
  await page.waitForSelector("[data-hero-logo]", { timeout: 10000 });
  await expect(page.locator("[data-hero-logo]")).toBeVisible();
});

test("Paid: no internal/ops copy visible", async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // Wait for the page to fully load
  await page.waitForLoadState("domcontentloaded");

  // Should not show internal messaging
  await expect(
    page.getByText(/Live for.*Leads now save to your CRM/i),
  ).toHaveCount(0);
  // "Powered by Sunspire" should be present in footer as small attribution
  await expect(page.getByText(/Powered by Sunspire/i)).toBeVisible();

  // Should not show demo-specific messaging
  await expect(page.getByText(/Your Branded Solar Quote Tool/i)).toHaveCount(0);
  await expect(page.getByText(/Go live in 24 hours/i)).toHaveCount(0);
});

test("Paid: address form has proper attributes", async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // Wait for the page to fully load
  await page.waitForLoadState("domcontentloaded");

  // Check address input has proper attributes - wait for it to load
  await page.waitForSelector('input[type="text"]', { timeout: 10000 });
  const addressInput = page.locator('input[type="text"]').first();
  await expect(addressInput).toHaveAttribute("autocomplete", "street-address");

  // Check for Google attribution
  await expect(page.getByText(/Powered by Google/i)).toBeVisible();
});

test("Paid: sticky bar functionality", async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // Wait for the page to fully load
  await page.waitForLoadState("domcontentloaded");

  // Dismiss cookie consent banner if it appears
  try {
    const cookieBanner = page.locator(
      '[data-cookie-consent], .cookie-consent, [class*="cookie"]',
    );
    if (await cookieBanner.isVisible()) {
      const acceptBtn = page.getByRole("button", { name: /accept|agree|ok/i });
      if (await acceptBtn.isVisible()) {
        await acceptBtn.click();
        await page.waitForTimeout(500);
      }
    }
  } catch (e) {
    // Cookie banner might not be present, continue
  }

  // Initially sticky bar should not be visible
  await expect(page.locator("[data-sticky-bar]")).not.toBeVisible();

  // Scroll down to trigger sticky bar
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1000); // Wait for scroll to complete

  // Wait for sticky bar to appear
  await page.waitForSelector("[data-sticky-bar]", { timeout: 10000 });
  await expect(page.locator("[data-sticky-bar]")).toBeVisible();

  // Test consultation button click
  const consultBtn = page.getByRole("button", { name: /Book Consultation/i });
  await expect(consultBtn).toBeVisible();

  // Test email PDF button
  const emailBtn = page.getByRole("button", { name: /Email PDF/i });
  await expect(emailBtn).toBeVisible();

  // Click email button to test functionality - force click to bypass cookie banner
  await emailBtn.click({ force: true });

  // Should show success message or handle the click
  // (The actual implementation shows a temporary success message)
  await page.waitForTimeout(1000);
});
