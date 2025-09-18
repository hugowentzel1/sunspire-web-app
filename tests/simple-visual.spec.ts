import { test, expect } from "@playwright/test";

test("Visual check of footer and cookie banner", async ({ page }) => {
  // Navigate to the page
  await page.goto(
    "http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com",
  );

  // Wait for page to load
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // Check page loaded
  await expect(page.locator("h1")).toBeVisible();

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  // Check footer is visible
  await expect(page.locator("footer")).toBeVisible();

  // Check company name is above logo in footer
  const footer = page.locator("footer");
  const companyName = footer.locator("h3").first();
  await expect(companyName).toContainText("SolarPro Energy");

  // Check cookie banner
  const cookieBanner = page.locator('[data-e2e="cookie-banner"]');
  await expect(cookieBanner).toBeVisible();

  // Pause for visual inspection
  await page.pause();
});
