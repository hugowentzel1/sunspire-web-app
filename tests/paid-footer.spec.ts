import { test, expect } from "@playwright/test";

const PAID =
  "http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com"; // no demo=1
const PAID_REPORT =
  "http://localhost:3001/report?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";

test.describe("Paid, customer-facing", () => {
  test("Footer exists, shows company branding, and no Sunspire contacts", async ({
    page,
  }) => {
    await page.goto(PAID, { waitUntil: "networkidle" });
    const footer = page.locator("[data-footer]");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("Powered by Sunspire")).toBeVisible();
    await expect(
      footer.getByRole("link", { name: /privacy policy/i }),
    ).toBeVisible();
    // ensure we didn't leak Sunspire emails in paid contexts
    await expect(page.getByText(/@getsunspire\.com/i)).toHaveCount(0);
  });

  test("No demo CTAs/copy on start page", async ({ page }) => {
    await page.goto(PAID, { waitUntil: "networkidle" });
    await expect(page.getByText(/Activate on Your Domain/i)).toHaveCount(0);
    await expect(page.getByText(/Unlock Full Report/i)).toHaveCount(0);
    await expect(page.getByText(/Preview: \d+ runs left/i)).toHaveCount(0);
    await expect(page.getByText(/leads now save to your crm/i)).toHaveCount(0);
  });

  test("Report page has no demo CRM banner or unlock banners", async ({
    page,
  }) => {
    await page.goto(PAID_REPORT, { waitUntil: "networkidle" });
    await expect(page.getByText(/leads now save to your crm/i)).toHaveCount(0);
    await expect(page.getByText(/unlock full report/i)).toHaveCount(0);
    await expect(page.getByText(/activate on your domain/i)).toHaveCount(0);
    // Check that the page loads without errors
    await expect(page.locator("body")).toBeVisible();
  });

  test("Customer benefits copy shows instead of CRM copy", async ({ page }) => {
    await page.goto(PAID, { waitUntil: "networkidle" });
    await expect(
      page.getByText(/Accurate Modeling \(NREL PVWatts® v8\)/i),
    ).toBeVisible();
    await expect(page.getByText(/Uses Local Utility Rates/i)).toBeVisible();
    await expect(
      page.getByText(
        /Accurate Modeling.*Uses Local Utility Rates.*End-to-End Encryption/i,
      ),
    ).toBeVisible();
    // Old CRM copy should not be present
    await expect(page.getByText(/CRM-ready/i)).toHaveCount(0);
    await expect(page.getByText(/SOC 2-aligned/i)).toHaveCount(0);
  });

  test("Footer has proper accessibility features", async ({ page }) => {
    await page.goto(PAID, { waitUntil: "networkidle" });
    const footer = page.locator("[data-footer]");

    // Check for proper ARIA landmarks
    await expect(footer).toHaveAttribute("role", "contentinfo");

    // Check for legal navigation
    const legalNav = footer.locator('nav[aria-label="Legal"]');
    await expect(legalNav).toBeVisible();

    // Check that links have proper styling (underline on hover/focus)
    const links = footer.locator("a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);

    // Check that legal links have the underline class (excluding the "Powered by" link)
    const legalLinks = footer.locator("nav a");
    const legalLinkCount = await legalLinks.count();
    for (let i = 0; i < legalLinkCount; i++) {
      const link = legalLinks.nth(i);
      const className = await link.getAttribute("class");
      expect(className).toContain("underline");
    }
  });
});
