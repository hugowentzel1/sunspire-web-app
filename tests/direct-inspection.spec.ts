import { test, expect } from '@playwright/test';

test.describe('Direct Visual Inspection', () => {
  test('Check what colors are actually showing on live site', async ({ page }) => {
    console.log('Directly inspecting live site colors...');
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot first
    await page.screenshot({
      path: 'test-results/partners-inspection.png',
      fullPage: true
    });
    
    // Check the actual color of the earnings text
    const earningsText = page.locator('text=Earnings (example)').locator('..').locator('p').first();
    if (await earningsText.count() > 0) {
      const color = await earningsText.evaluate((el) => getComputedStyle(el).color);
      console.log('Partners earnings text color:', color);
    } else {
      console.log('Partners earnings text not found');
    }
    
    // Test Support Page
    await page.goto('https://sunspire-web-app.vercel.app/support?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/support-inspection.png',
      fullPage: true
    });
    
    // Check the actual color of helpful resources links
    const setupGuide = page.locator('a:has-text("Setup Guide")');
    if (await setupGuide.count() > 0) {
      const color = await setupGuide.evaluate((el) => getComputedStyle(el).color);
      console.log('Setup Guide link color:', color);
    } else {
      console.log('Setup Guide link not found');
    }
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/pricing-inspection.png',
      fullPage: true
    });
    
    // Check the actual color of the hero text
    const heroText = page.locator('text=Go live in under 24 hours with branded solar quotes');
    if (await heroText.count() > 0) {
      const color = await heroText.evaluate((el) => getComputedStyle(el).color);
      console.log('Pricing hero text color:', color);
    } else {
      console.log('Pricing hero text not found');
    }
    
    console.log('✓ Inspection complete - check console output and screenshots');
  });
});
