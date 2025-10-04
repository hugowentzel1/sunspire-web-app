import { test, expect } from '@playwright/test';

test.describe('Find Earnings Text', () => {
  test('Find the specific earnings text element', async ({ page }) => {
    console.log('Finding the specific earnings text...');
    
    await page.goto('https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Find all p elements and check their content
    const pElements = page.locator('p');
    const count = await pElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = pElements.nth(i);
      const text = await element.textContent();
      if (text && (text.includes('clients') || text.includes('recurring') || text.includes('setup'))) {
        const color = await element.evaluate((el) => getComputedStyle(el).color);
        console.log(`Found earnings text at index ${i}: "${text}" - Color: ${color}`);
      }
    }
    
    console.log('✓ Earnings text search complete');
  });
});
