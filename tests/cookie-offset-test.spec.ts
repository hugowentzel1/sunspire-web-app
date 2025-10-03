import { test, expect } from '@playwright/test';

test.describe('Cookie Offset and Sticky CTA Verification', () => {
  test('Check sticky CTA respects cookie banner offset', async ({ page }) => {
    console.log('Testing cookie offset functionality...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if cookie banner is visible
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieVisible = await cookieBanner.isVisible();
    
    if (cookieVisible) {
      console.log('Cookie banner is visible');
      
      // Get cookie banner height
      const cookieBoundingBox = await cookieBanner.boundingBox();
      const cookieHeight = cookieBoundingBox?.height || 0;
      console.log(`Cookie banner height: ${cookieHeight}px`);
      
      // Scroll down to make sticky CTA visible
      await page.evaluate(() => {
        window.scrollTo(0, window.innerHeight);
      });
      await page.waitForTimeout(1000);
      
      // Check if sticky CTA is visible
      const stickyCTA = await page.locator('main[data-testid="report-page"] + * [data-sticky-cta-desktop], main[data-testid="report-page"] + * [data-sticky-cta-mobile]').first();
      const stickyVisible = await stickyCTA.isVisible();
      
      if (stickyVisible) {
        const stickyBoundingBox = await stickyCTA.boundingBox();
        const viewportHeight = await page.viewportSize()?.height || 0;
        const stickyDistanceFromBottom = viewportHeight - (stickyBoundingBox?.y || 0) - (stickyBoundingBox?.height || 0);
        
        console.log(`Sticky CTA distance from bottom: ${stickyDistanceFromBottom}px`);
        console.log(`Expected offset: ${cookieHeight + 24}px`);
        
        // Sticky CTA should be positioned above the cookie banner
        expect(stickyDistanceFromBottom).toBeGreaterThan(cookieHeight);
        
        console.log('✓ Sticky CTA properly offset from cookie banner');
      } else {
        console.log('Sticky CTA not visible after scrolling');
      }
    } else {
      console.log('Cookie banner not visible');
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/cookie-offset-test.png',
      fullPage: true 
    });
  });
});
