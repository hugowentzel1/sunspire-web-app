import { test, expect } from '@playwright/test';

test.describe('Sticky CTA Debug', () => {
  test('Debug sticky CTA visibility', async ({ page }) => {
    console.log('Debugging sticky CTA...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Scroll down to hide hero CTA
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2);
    });
    await page.waitForTimeout(1000);
    
    // Look for any sticky CTA elements
    const stickyElements = await page.locator('[class*="fixed"][class*="z-50"]').all();
    console.log(`Found ${stickyElements.length} fixed z-50 elements`);
    
    for (let i = 0; i < stickyElements.length; i++) {
      const element = stickyElements[i];
      const isVisible = await element.isVisible();
      const className = await element.getAttribute('class');
      console.log(`Element ${i}: visible=${isVisible}, class="${className}"`);
    }
    
    // Check for elements with sticky CTA text
    const ctaElements = await page.locator('text="Activate on Your Domain"').all();
    console.log(`Found ${ctaElements.length} elements with CTA text`);
    
    for (let i = 0; i < ctaElements.length; i++) {
      const element = ctaElements[i];
      const isVisible = await element.isVisible();
      const className = await element.getAttribute('class');
      console.log(`CTA Element ${i}: visible=${isVisible}, class="${className}"`);
    }
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/sticky-cta-debug.png',
      fullPage: true 
    });
  });
});
