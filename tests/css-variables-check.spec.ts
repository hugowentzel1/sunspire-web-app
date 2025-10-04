import { test, expect } from '@playwright/test';

test.describe('CSS Variables Check', () => {
  test('Check if CSS variables are working on Tesla demo', async ({ page }) => {
    console.log('Checking CSS variables on Tesla demo...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check what CSS variables are set
    const brandPrimary = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
    });
    const brand600 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-600');
    });
    
    console.log('Brand Primary CSS variable:', brandPrimary);
    console.log('Brand 600 CSS variable:', brand600);
    
    // Check if the earnings text is using the right classes
    const earningsText = page.locator('p').nth(4); // The earnings text we found
    const classes = await earningsText.evaluate((el) => el.className);
    console.log('Earnings text classes:', classes);
    
    // Check the computed color
    const color = await earningsText.evaluate((el) => getComputedStyle(el).color);
    console.log('Earnings text computed color:', color);
    
    console.log('✓ CSS variables check complete');
  });
});
