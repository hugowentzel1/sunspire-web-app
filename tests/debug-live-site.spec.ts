import { test, expect } from '@playwright/test';

test.describe('Debug Live Site', () => {
  test('Check what CSS variables are actually set', async ({ page }) => {
    console.log('Debugging live site CSS variables...');
    
    // Test Pricing Page
    await page.goto('https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check what CSS variables are actually set
    const brandPrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
    });
    
    const brand600 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-600');
    });
    
    console.log('Brand Primary:', brandPrimary);
    console.log('Brand 600:', brand600);
    
    // Check if the Secure Stripe checkout text is actually grey
    const secureText = page.locator('text=Secure Stripe checkout').first();
    const secureTextColor = await secureText.evaluate((el) => {
      return getComputedStyle(el).color;
    });
    
    console.log('Secure Stripe checkout color:', secureTextColor);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/debug-pricing.png',
      fullPage: true
    });
    
    // Test Partners Page
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check EarningsMini numbers color
    const earningsText = page.locator('text=Earnings (example)').locator('..').locator('p').first();
    const earningsTextColor = await earningsText.evaluate((el) => {
      return getComputedStyle(el).color;
    });
    
    console.log('Earnings text color:', earningsTextColor);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/debug-partners.png',
      fullPage: true
    });
    
    console.log('✓ Debug completed');
  });
});
