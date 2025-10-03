import { test, expect } from '@playwright/test';

test.describe('Cookie Offset CSS Variable Debug', () => {
  test('Check if --cookie-offset CSS variable is set', async ({ page }) => {
    console.log('Checking --cookie-offset CSS variable...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Check CSS variable
    const rootElement = await page.locator(':root').first();
    const cookieOffset = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--cookie-offset');
    });
    
    console.log(`--cookie-offset: "${cookieOffset}"`);
    
    // Check if cookie banner is visible
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieVisible = await cookieBanner.isVisible();
    
    if (cookieVisible) {
      const cookieBoundingBox = await cookieBanner.boundingBox();
      const cookieHeight = cookieBoundingBox?.height || 0;
      console.log(`Cookie banner height: ${cookieHeight}px`);
      console.log(`Expected --cookie-offset: ${cookieHeight}px`);
    }
    
    // Check sticky CTA styles
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const stickyStyles = await stickyCTA.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bottom: styles.bottom,
        right: styles.right,
        width: styles.width
      };
    });
    
    console.log('Sticky CTA styles:', stickyStyles);
  });
});
