import { test, expect } from '@playwright/test';

test.describe('Live Site Verification', () => {
  test('Check live site with Apple branding', async ({ page }) => {
    const pages = [
      { url: 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1', name: 'Home' },
      { url: 'https://sunspire-web-app.vercel.app/pricing?company=Apple&demo=1', name: 'Pricing' },
      { url: 'https://sunspire-web-app.vercel.app/partners?company=Apple&demo=1', name: 'Partners' },
      { url: 'https://sunspire-web-app.vercel.app/support?company=Apple&demo=1', name: 'Support' },
      { url: 'https://sunspire-web-app.vercel.app/report?company=Apple&demo=1', name: 'Report' }
    ];

    for (const pageInfo of pages) {
      console.log(`Checking live ${pageInfo.name} page...`);
      await page.goto(pageInfo.url);
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for brand colors to be applied
      await page.waitForTimeout(3000);
      
      // Take a screenshot
      await page.screenshot({ 
        path: `test-results/live-${pageInfo.name.toLowerCase()}-apple.png`,
        fullPage: true 
      });
      
      // Check brand color
      const bodyElement = await page.locator('body').first();
      const brandPrimary = await bodyElement.evaluate((el) => {
        return getComputedStyle(el).getPropertyValue('--brand-primary');
      });
      
      console.log(`✓ Live ${pageInfo.name} page loaded - Brand primary: ${brandPrimary}`);
    }
  });
});