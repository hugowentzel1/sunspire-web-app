import { test, expect } from "@playwright/test";

test("Simple visual check", async ({ page }) => {
  // Navigate directly to the full URL
  await page.goto("http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com");
  
  // Wait for the page to load
  await page.waitForLoadState("networkidle");
  
  // Check that we're not on about:blank
  const url = page.url();
  expect(url).not.toBe("about:blank");
  
  // Check the page loaded correctly
  await expect(page.locator("h1").first()).toBeVisible();
  
  console.log("✅ Page loaded successfully!");
});
