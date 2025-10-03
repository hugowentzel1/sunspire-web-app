import { test, expect } from '@playwright/test';

test.describe('Simple Visual Check', () => {
  test('Just take a screenshot to see what we actually have', async ({ page }) => {
    console.log('Opening report page to check visual state...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for everything to load
    await page.waitForTimeout(5000);
    
    // Scroll to bottom to see sticky CTA and cookie banner
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(1000);
    
    // Take a screenshot
    await page.screenshot({
      path: 'test-results/what-we-actually-see.png',
      fullPage: false
    });
    
    // Check if sticky CTA exists
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const stickyExists = await stickyCTA.count() > 0;
    const stickyVisible = stickyExists ? await stickyCTA.isVisible() : false;
    
    console.log(`Sticky CTA exists: ${stickyExists}`);
    console.log(`Sticky CTA visible: ${stickyVisible}`);
    
    if (stickyVisible) {
      const boundingBox = await stickyCTA.boundingBox();
      console.log(`Sticky CTA position: x=${boundingBox?.x}, y=${boundingBox?.y}`);
      console.log(`Sticky CTA size: width=${boundingBox?.width}, height=${boundingBox?.height}`);
    }
    
    // Check cookie banner
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieExists = await cookieBanner.count() > 0;
    const cookieVisible = cookieExists ? await cookieBanner.isVisible() : false;
    
    console.log(`Cookie banner exists: ${cookieExists}`);
    console.log(`Cookie banner visible: ${cookieVisible}`);
    
    if (cookieVisible) {
      const boundingBox = await cookieBanner.boundingBox();
      console.log(`Cookie banner position: x=${boundingBox?.x}, y=${boundingBox?.y}`);
      console.log(`Cookie banner size: width=${boundingBox?.width}, height=${boundingBox?.height}`);
    }
    
    // Check widths
    const headerContainer = await page.locator('header .mx-auto').first();
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    
    const headerWidth = (await headerContainer.boundingBox())?.width || 0;
    const mainWidth = (await mainContainer.boundingBox())?.width || 0;
    const footerWidth = (await footerContainer.boundingBox())?.width || 0;
    
    console.log(`Header width: ${headerWidth}px`);
    console.log(`Main width: ${mainWidth}px`);
    console.log(`Footer width: ${footerWidth}px`);
    
    // Take full page screenshot too
    await page.screenshot({
      path: 'test-results/what-we-actually-see-full.png',
      fullPage: true
    });
  });
});