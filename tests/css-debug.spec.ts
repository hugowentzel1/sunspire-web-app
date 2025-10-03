import { test, expect } from '@playwright/test';

test.describe('CSS and Visibility Debug', () => {
  test('Debug CSS and visibility issues', async ({ page }) => {
    console.log('Debugging CSS and visibility...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for everything to load
    await page.waitForTimeout(5000);
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(1000);
    
    // Check sticky CTA computed styles
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const computedStyles = await stickyCTA.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex,
        bottom: styles.bottom,
        right: styles.right,
        width: styles.width,
        height: styles.height,
        transform: styles.transform,
        pointerEvents: styles.pointerEvents
      };
    });
    
    console.log('Sticky CTA computed styles:', computedStyles);
    
    // Check if it has any classes that might hide it
    const className = await stickyCTA.getAttribute('class');
    console.log('Sticky CTA classes:', className);
    
    // Check aria-hidden attribute
    const ariaHidden = await stickyCTA.getAttribute('aria-hidden');
    console.log('Sticky CTA aria-hidden:', ariaHidden);
    
    // Check if hero CTA is visible (which would hide sticky CTA)
    const heroCTA = await page.locator('#main-cta').first();
    const heroExists = await heroCTA.count() > 0;
    const heroVisible = heroExists ? await heroCTA.isVisible() : false;
    
    console.log(`Hero CTA exists: ${heroExists}`);
    console.log(`Hero CTA visible: ${heroVisible}`);
    
    if (heroVisible) {
      const heroBoundingBox = await heroCTA.boundingBox();
      console.log(`Hero CTA position: x=${heroBoundingBox?.x}, y=${heroBoundingBox?.y}`);
      console.log(`Hero CTA size: width=${heroBoundingBox?.width}, height=${heroBoundingBox?.height}`);
    }
    
    // Check viewport intersection
    const stickyIntersection = await stickyCTA.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      return {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        viewportHeight: viewportHeight,
        isInViewport: rect.top >= 0 && rect.bottom <= viewportHeight
      };
    });
    
    console.log('Sticky CTA intersection:', stickyIntersection);
    
    // Check CSS variables
    const rootElement = await page.locator(':root').first();
    const cssVars = await rootElement.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        '--cookie-offset': styles.getPropertyValue('--cookie-offset'),
        '--content-max': styles.getPropertyValue('--content-max'),
        '--brand-600': styles.getPropertyValue('--brand-600'),
        '--brand-700': styles.getPropertyValue('--brand-700')
      };
    });
    
    console.log('CSS Variables:', cssVars);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/css-debug.png',
      fullPage: false
    });
    
    // Try to find all fixed positioned elements
    const allFixedElements = await page.locator('[style*="position: fixed"], .fixed').all();
    console.log(`Found ${allFixedElements.length} fixed positioned elements`);
    
    for (let i = 0; i < allFixedElements.length; i++) {
      const element = allFixedElements[i];
      const isVisible = await element.isVisible();
      const className = await element.getAttribute('class');
      const boundingBox = await element.boundingBox();
      
      console.log(`Fixed element ${i}: visible=${isVisible}, class="${className}", position=(${boundingBox?.x}, ${boundingBox?.y}), size=${boundingBox?.width}x${boundingBox?.height}`);
    }
  });
});
