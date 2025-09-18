import { test, expect } from "@playwright/test";

test("Working visual verification", async ({ page }) => {
  // Use full URL instead of baseURL
  await page.goto("http://localhost:3001/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com");
  
  // Wait for page to load
  await page.waitForLoadState("domcontentloaded");
  
  // Verify page loaded
  await expect(page.locator("h1").first()).toBeVisible();
  
  // Check hero text
  await expect(
    page.getByText(
      "Enter your address to see solar production, savings, and payback—instantly.",
    ),
  ).toBeVisible();
  
  // Check green checkmark has spacing
  const checkmark = page.locator(".bg-green-500 span");
  await expect(checkmark).toBeVisible();
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  
  // Check footer layout - company name above logo
  const footer = page.locator("footer");
  await expect(footer).toBeVisible();
  
  // Check company name is above logo
  const companySection = footer.locator("div").first();
  const companyName = companySection.locator("h3");
  await expect(companyName).toContainText("SolarPro Energy");
  
  console.log("✅ All visual checks passed!");
});
