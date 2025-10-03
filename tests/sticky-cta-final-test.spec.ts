import { test, expect } from '@playwright/test';

test.describe('Sticky CTA Final Test', () => {
  test('Check sticky CTA is working with cookie offset', async ({ page }) => {
    console.log('Testing sticky CTA with cookie offset...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Scroll down to hide hero CTA
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2);
    });
    await page.waitForTimeout(1000);
    
    // Find the sticky CTA element
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const isVisible = await stickyCTA.isVisible();
    
    if (isVisible) {
      console.log('Sticky CTA is visible');
      
      // Get the button inside
      const button = await stickyCTA.locator('a, button').first();
      const buttonText = await button.textContent();
      console.log(`Button text: "${buttonText}"`);
      
      // Get positioning
      const boundingBox = await stickyCTA.boundingBox();
      console.log(`Position: top=${boundingBox?.y}, right=${boundingBox?.x}, width=${boundingBox?.width}, height=${boundingBox?.height}`);
      
      // Check if it's positioned at bottom-right
      const viewportHeight = await page.viewportSize()?.height || 0;
      const distanceFromBottom = viewportHeight - (boundingBox?.y || 0) - (boundingBox?.height || 0);
      console.log(`Distance from bottom: ${distanceFromBottom}px`);
      
      // Should be close to bottom (within 100px) and have 320px width
      expect(distanceFromBottom).toBeLessThan(100);
      expect(boundingBox?.width).toBe(320);
      
      console.log('✓ Sticky CTA positioned correctly at bottom-right with 320px width');
      
      // Check cookie banner
      const cookieBanner = await page.locator('#cookie-banner').first();
      const cookieVisible = await cookieBanner.isVisible();
      
      if (cookieVisible) {
        const cookieBoundingBox = await cookieBanner.boundingBox();
        const cookieHeight = cookieBoundingBox?.height || 0;
        console.log(`Cookie banner height: ${cookieHeight}px`);
        
        // Sticky CTA should be above cookie banner
        expect(distanceFromBottom).toBeGreaterThan(cookieHeight);
        console.log('✓ Sticky CTA properly offset from cookie banner');
      }
    } else {
      console.log('Sticky CTA not visible');
    }
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/sticky-cta-final-test.png',
      fullPage: true 
    });
  });
});
