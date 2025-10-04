import { test, expect } from '@playwright/test';

test.describe('Actual Color Inspection', () => {
  test('Check actual computed colors of elements', async ({ page }) => {
    console.log('Checking actual computed colors...');
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Find the earnings text with a more specific selector
    const earningsSection = page.locator('h3:has-text("Earnings (example)")');
    if (await earningsSection.count() > 0) {
      const earningsText = earningsSection.locator('..').locator('p').first();
      if (await earningsText.count() > 0) {
        const color = await earningsText.evaluate((el) => getComputedStyle(el).color);
        console.log('Partners earnings text color:', color);
      }
    }
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Find the helpful resources section
    const helpfulResources = page.locator('h3:has-text("Helpful Resources")');
    if (await helpfulResources.count() > 0) {
      const setupGuide = helpfulResources.locator('..').locator('a:has-text("Setup Guide")');
      if (await setupGuide.count() > 0) {
        const color = await setupGuide.evaluate((el) => getComputedStyle(el).color);
        console.log('Setup Guide link color:', color);
      }
    }
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Find the hero text
    const heroText = page.locator('p:has-text("Go live in under 24 hours with branded solar quotes")');
    if (await heroText.count() > 0) {
      const color = await heroText.evaluate((el) => getComputedStyle(el).color);
      console.log('Pricing hero text color:', color);
    }
    
    console.log('✓ Color inspection complete');
  });
});
