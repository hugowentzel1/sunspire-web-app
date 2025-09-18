import { test, expect } from "@playwright/test";

test("Visual verification of updated footer and cookie banner", async ({
  page,
}) => {
  // Navigate to the paid page
  await page.goto(
    "http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com",
  );

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Wait a bit more to ensure everything is rendered
  await page.waitForTimeout(2000);

  // Check that the page loaded correctly
  await expect(page.locator("h1")).toBeVisible();

  // Check cookie banner is visible and full width
  const cookieBanner = page.locator('[data-e2e="cookie-banner"]');
  await expect(cookieBanner).toBeVisible();

  // Scroll to footer to see the changes
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait for footer to be visible
  await expect(page.locator("footer")).toBeVisible();

  // Check footer layout - company name should be above logo
  const footer = page.locator("footer");
  await expect(footer.locator("h3").first()).toContainText("SolarPro Energy");

  // Pause for visual inspection
  await page.pause();
});
