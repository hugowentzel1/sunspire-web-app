import { test, expect } from "@playwright/test";

const HOME = "https://sunspire-web-app.vercel.app/?company=Netflix&demo=1";
const PRICING = "https://sunspire-web-app.vercel.app/pricing";
const TERMS = "https://sunspire-web-app.vercel.app/terms";

test.describe("CTA Validation Suite", () => {
  test("Home page CTAs unified", async ({ page }) => {
    await page.goto(HOME);
    
    // Check that new unified CTA appears multiple times
    await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCountGreaterThan(2);
    
    // Check that new subcopy appears
    await expect(page.locator("text=Live in 24 hours — or your setup fee is refunded")).toHaveCountGreaterThan(1);
    
    // Verify old CTAs are gone
    await expect(page.locator("text=Start Activation")).toHaveCount(0);
    await expect(page.locator("text=Activate for Your Customers")).toHaveCount(0);
    await expect(page.locator("text=Demo Expires Soon")).toHaveCount(0);
  });

  test("Pricing page guarantee present", async ({ page }) => {
    await page.goto(PRICING);
    
    // Check unified CTA
    await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCount(1);
    
    // Check guarantee subcopy
    await expect(page.locator("text=Live in 24 hours — or your setup fee is refunded")).toHaveCount(1);
  });

  test("Legal text updated", async ({ page }) => {
    await page.goto(TERMS);
    
    // Check for updated legal guarantee
    await expect(page.locator("text=one-time setup fee will be fully refunded")).toHaveCount(1);
  });

  test("Lightning icon visible on CTAs", async ({ page }) => {
    await page.goto(HOME);
    
    // Check that lightning icon appears on primary CTAs
    const button = page.locator("button:has-text('Launch Your Branded Version Now')");
    await expect(button).toContainText("⚡");
    
    // Check banner CTA has lightning
    const bannerCTA = page.locator("text=Launch Your Branded Version Now").first();
    await expect(bannerCTA).toContainText("⚡");
  });

  test("CTA consistency across pages", async ({ page }) => {
    // Test multiple company demos
    const companies = ["Netflix", "Apple", "Tesla"];
    
    for (const company of companies) {
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${company}&demo=1`);
      
      // Verify unified CTA appears
      await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCountGreaterThan(1);
      
      // Verify no old CTAs
      await expect(page.locator("text=Start Activation")).toHaveCount(0);
    }
  });

  test("Mobile sticky CTA consistency", async ({ page }) => {
    await page.goto(HOME);
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile sticky CTA
    await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCountGreaterThan(1);
    
    // Verify it doesn't change when scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCountGreaterThan(1);
  });

  test("Report page CTA consistency", async ({ page }) => {
    await page.goto(HOME);
    
    // Enter an address to generate report
    await page.fill('input[placeholder*="address"]', "123 Main St, San Francisco, CA");
    await page.click('button:has-text("Launch Your Branded Version Now")');
    
    // Wait for report to load
    await page.waitForURL(/\/report/);
    
    // Check report page CTA
    await expect(page.locator("text=Launch Your Branded Version Now")).toHaveCountGreaterThan(1);
  });
});
