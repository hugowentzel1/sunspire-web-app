import { test, expect } from '@playwright/test';

test.describe('Sticky CTA Position Debug', () => {
  test('Debug sticky CTA positioning calculation', async ({ page }) => {
    console.log('Debugging sticky CTA positioning...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(500);
    
    // Check CSS variables
    const rootElement = await page.locator(':root').first();
    const cookieOffset = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--cookie-offset');
    });
    
    console.log(`--cookie-offset: "${cookieOffset}"`);
    
    // Check sticky CTA computed styles
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const computedStyles = await stickyCTA.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        bottom: styles.bottom,
        right: styles.right,
        width: styles.width,
        height: styles.height,
        position: styles.position
      };
    });
    
    console.log('Sticky CTA computed styles:', computedStyles);
    
    // Get actual position
    const boundingBox = await stickyCTA.boundingBox();
    const viewportHeight = await page.viewportSize()?.height || 0;
    const actualBottom = viewportHeight - (boundingBox?.y || 0);
    
    console.log(`Viewport height: ${viewportHeight}px`);
    console.log(`Sticky CTA y position: ${boundingBox?.y}px`);
    console.log(`Actual distance from bottom: ${actualBottom}px`);
    console.log(`Expected distance from bottom: ${24 + parseInt(cookieOffset)}px`);
    
    // Check cookie banner
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieBoundingBox = await cookieBanner.boundingBox();
    const cookieTop = cookieBoundingBox?.y || 0;
    const cookieHeight = cookieBoundingBox?.height || 0;
    
    console.log(`Cookie banner top: ${cookieTop}px`);
    console.log(`Cookie banner height: ${cookieHeight}px`);
    console.log(`Cookie banner bottom: ${cookieTop + cookieHeight}px`);
    
    // Calculate if there's overlap
    const stickyBottom = (boundingBox?.y || 0) + (boundingBox?.height || 0);
    const overlap = Math.max(0, stickyBottom - cookieTop);
    
    console.log(`Sticky CTA bottom: ${stickyBottom}px`);
    console.log(`Overlap with cookie banner: ${overlap}px`);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/sticky-cta-position-debug.png',
      fullPage: false
    });
    
    // The issue might be that the sticky CTA is positioned relative to the viewport bottom,
    // but the cookie banner is positioned relative to the document bottom
    console.log(`Document height: ${await page.evaluate(() => document.body.scrollHeight)}px`);
    console.log(`Scroll position: ${await page.evaluate(() => window.scrollY)}px`);
  });
});
