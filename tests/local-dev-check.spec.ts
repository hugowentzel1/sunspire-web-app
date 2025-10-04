import { test, expect } from '@playwright/test';

test.describe('Local Development Check', () => {
  test('Check local development server for EarningsMini', async ({ page }) => {
    console.log('Checking local development server...');
    
    await page.goto('http://localhost:3003/partners?company=tesla&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Check the earnings text
    const earningsText = page.locator('p').nth(4); // The earnings text
    const classes = await earningsText.evaluate((el) => el.className);
    const color = await earningsText.evaluate((el) => getComputedStyle(el).color);
    const text = await earningsText.textContent();
    
    console.log('Local earnings text:', text);
    console.log('Local earnings classes:', classes);
    console.log('Local earnings color:', color);
    
    console.log('✓ Local development check complete');
  });
});
