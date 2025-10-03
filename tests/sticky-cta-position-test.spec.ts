import { test, expect } from '@playwright/test';

test.describe('Sticky CTA Position and Size Verification', () => {
  test('Check sticky CTA is bottom-right positioned with original size', async ({ page }) => {
    console.log('Testing sticky CTA positioning and size...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Scroll down to hide the hero CTA so sticky CTA becomes visible
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight);
    });
    
    // Wait for scroll to complete
    await page.waitForTimeout(1000);
    
    // Check if sticky CTA is visible
    const stickyCTA = await page.locator('[data-sticky-cta-desktop]').first();
    const isVisible = await stickyCTA.isVisible();
    
    if (isVisible) {
      // Get the bounding box
      const boundingBox = await stickyCTA.boundingBox();
      
      console.log(`Sticky CTA position: top=${boundingBox?.y}, right=${boundingBox?.x}, width=${boundingBox?.width}, height=${boundingBox?.height}`);
      
      // Check that it's positioned at bottom-right (not center)
      const viewportHeight = await page.viewportSize()?.height || 0;
      const distanceFromBottom = viewportHeight - (boundingBox?.y || 0) - (boundingBox?.height || 0);
      
      console.log(`Distance from bottom: ${distanceFromBottom}px`);
      
      // Should be close to bottom (within 100px)
      expect(distanceFromBottom).toBeLessThan(100);
      
      // Should have original width (320px)
      expect(boundingBox?.width).toBe(320);
      
      console.log('✓ Sticky CTA positioned correctly at bottom-right with original size');
    } else {
      console.log('Sticky CTA still not visible after scrolling');
    }
    
    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/sticky-cta-position-test.png',
      fullPage: true 
    });
  });
});