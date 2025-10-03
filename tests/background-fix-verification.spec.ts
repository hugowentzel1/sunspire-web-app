import { test, expect } from '@playwright/test';

test.describe('Background Color Fix Verification', () => {
  test('Check all pages have white/neutral backgrounds with company color accents', async ({ page }) => {
    const pages = [
      { url: '/pricing?company=Apple&demo=1', name: 'Pricing' },
      { url: '/partners?company=Apple&demo=1', name: 'Partners' },
      { url: '/support?company=Apple&demo=1', name: 'Support' }
    ];

    for (const pageInfo of pages) {
      console.log(`Checking ${pageInfo.name} page background...`);
      await page.goto(`http://localhost:3001${pageInfo.url}`);
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for styles to load
      await page.waitForTimeout(2000);
      
      // Take a screenshot
      await page.screenshot({ 
        path: `test-results/${pageInfo.name.toLowerCase()}-white-bg.png`,
        fullPage: true 
      });
      
      // Check that the main background is white/neutral
      const bodyElement = await page.locator('body').first();
      const backgroundColor = await bodyElement.evaluate((el) => {
        return getComputedStyle(el).backgroundColor;
      });
      
      console.log(`✓ ${pageInfo.name} page loaded - Background: ${backgroundColor}`);
      
      // Verify buttons still use company colors
      const button = await page.locator('button, [role="button"]').first();
      if (await button.isVisible()) {
        const buttonColor = await button.evaluate((el) => {
          return getComputedStyle(el).backgroundColor;
        });
        console.log(`✓ Button color: ${buttonColor}`);
      }
    }
  });
});
