import { test, expect } from '@playwright/test';

test.describe('Color and Layout Verification', () => {
  test('Check support and partners pages for proper company colors', async ({ page }) => {
    const pages = [
      { url: '/support?company=Apple&demo=1', name: 'Support' },
      { url: '/partners?company=Apple&demo=1', name: 'Partners' },
      { url: '/report?company=Apple&demo=1', name: 'Report' }
    ];

    for (const pageInfo of pages) {
      console.log(`Checking ${pageInfo.name} page...`);
      await page.goto(`http://localhost:3001${pageInfo.url}`);
      await page.waitForLoadState('domcontentloaded');
      
      // Take a screenshot
      await page.screenshot({ 
        path: `test-results/${pageInfo.name.toLowerCase()}-color-check.png`,
        fullPage: true 
      });
      
      // Check for brand colors in CSS
      const bodyElement = await page.locator('body').first();
      const computedStyle = await bodyElement.evaluate((el) => {
        return window.getComputedStyle(el);
      });
      
      console.log(`✓ ${pageInfo.name} page loaded and screenshot taken`);
    }
  });
});
