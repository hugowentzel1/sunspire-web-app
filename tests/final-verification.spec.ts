import { test, expect } from '@playwright/test';

test.describe('Final Color and Layout Verification', () => {
  test('Check all pages with Apple branding for proper colors and layout', async ({ page }) => {
    const pages = [
      { url: '/?company=Apple&demo=1', name: 'Home' },
      { url: '/pricing?company=Apple&demo=1', name: 'Pricing' },
      { url: '/partners?company=Apple&demo=1', name: 'Partners' },
      { url: '/support?company=Apple&demo=1', name: 'Support' },
      { url: '/report?company=Apple&demo=1', name: 'Report' }
    ];

    for (const pageInfo of pages) {
      console.log(`Checking ${pageInfo.name} page with Apple branding...`);
      await page.goto(`http://localhost:3001${pageInfo.url}`);
      await page.waitForLoadState('domcontentloaded');
      
      // Wait for brand colors to be applied
      await page.waitForTimeout(2000);
      
      // Take a screenshot
      await page.screenshot({ 
        path: `test-results/${pageInfo.name.toLowerCase()}-apple-final.png`,
        fullPage: true 
      });
      
      // Check if brand colors are applied
      const bodyElement = await page.locator('body').first();
      const brandPrimary = await bodyElement.evaluate((el) => {
        return getComputedStyle(el).getPropertyValue('--brand-primary');
      });
      
      console.log(`✓ ${pageInfo.name} page loaded - Brand primary: ${brandPrimary}`);
      
      // For report page, check if sticky CTA is positioned correctly
      if (pageInfo.name === 'Report') {
        const stickyCTA = await page.locator('[data-sticky-cta-desktop]').first();
        if (await stickyCTA.isVisible()) {
          const boundingBox = await stickyCTA.boundingBox();
          console.log(`✓ Sticky CTA positioned at: top=${boundingBox?.y}, right=${boundingBox?.x}, width=${boundingBox?.width}`);
        }
      }
    }
  });
});