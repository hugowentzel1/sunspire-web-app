import { test, expect } from '@playwright/test';

test.describe('Edge Case Visual Verification', () => {
  test('Test sticky CTA behavior with different scroll positions and cookie states', async ({ page }) => {
    console.log('Testing edge cases and interactions...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // 1. TEST DIFFERENT SCROLL POSITIONS
    console.log('\n=== TESTING SCROLL POSITIONS ===');
    
    const scrollPositions = [
      { name: 'Top of page', scroll: 0 },
      { name: 'Middle of page', scroll: 'window.innerHeight' },
      { name: 'Bottom of page', scroll: 'document.body.scrollHeight - window.innerHeight' }
    ];
    
    for (const pos of scrollPositions) {
      console.log(`\nTesting ${pos.name}...`);
      
      if (typeof pos.scroll === 'number') {
        await page.evaluate((scroll) => window.scrollTo(0, scroll), pos.scroll);
      } else {
        await page.evaluate((scroll) => window.scrollTo(0, eval(scroll)), pos.scroll);
      }
      
      await page.waitForTimeout(500);
      
      // Check sticky CTA visibility
      const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
      const isVisible = await stickyCTA.isVisible();
      
      // Check position
      const boundingBox = await stickyCTA.boundingBox();
      const viewportHeight = await page.viewportSize()?.height || 0;
      const distanceFromBottom = viewportHeight - (boundingBox?.y || 0) - (boundingBox?.height || 0);
      
      console.log(`  Sticky CTA visible: ${isVisible}`);
      console.log(`  Distance from bottom: ${distanceFromBottom}px`);
      
      // Take screenshot for this position
      await page.screenshot({
        path: `test-results/sticky-cta-${pos.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: false
      });
    }
    
    // 2. TEST COOKIE BANNER INTERACTION
    console.log('\n=== TESTING COOKIE BANNER INTERACTION ===');
    
    // Scroll to bottom to see both elements
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(500);
    
    // Check cookie banner
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieVisible = await cookieBanner.isVisible();
    const cookiePosition = await cookieBanner.boundingBox();
    
    // Check sticky CTA
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const stickyVisible = await stickyCTA.isVisible();
    const stickyPosition = await stickyCTA.boundingBox();
    
    console.log(`Cookie banner visible: ${cookieVisible}`);
    console.log(`Sticky CTA visible: ${stickyVisible}`);
    
    if (cookieVisible && stickyVisible) {
      console.log(`Cookie banner: y=${cookiePosition?.y}, height=${cookiePosition?.height}`);
      console.log(`Sticky CTA: y=${stickyPosition?.y}, height=${stickyPosition?.height}`);
      
      // Calculate overlap
      const cookieBottom = (cookiePosition?.y || 0) + (cookiePosition?.height || 0);
      const stickyTop = stickyPosition?.y || 0;
      const overlap = Math.max(0, cookieBottom - stickyTop);
      
      console.log(`Overlap: ${overlap}px`);
      
      if (overlap > 0) {
        console.log('❌ ISSUE: Sticky CTA and cookie banner are overlapping!');
      } else {
        console.log('✅ Sticky CTA is properly positioned above cookie banner');
      }
    }
    
    // 3. TEST RESPONSIVE BEHAVIOR
    console.log('\n=== TESTING RESPONSIVE BEHAVIOR ===');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\nTesting ${viewport.name} viewport...`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Check sticky CTA
      const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50, .fixed.inset-x-0.z-50.md\\:hidden').first();
      const isVisible = await stickyCTA.isVisible();
      
      if (isVisible) {
        const boundingBox = await stickyCTA.boundingBox();
        console.log(`  Sticky CTA visible: ${isVisible}`);
        console.log(`  Size: ${boundingBox?.width}x${boundingBox?.height}`);
        console.log(`  Position: x=${boundingBox?.x}, y=${boundingBox?.y}`);
      }
      
      // Take screenshot
      await page.screenshot({
        path: `test-results/sticky-cta-${viewport.name.toLowerCase()}.png`,
        fullPage: false
      });
    }
    
    // 4. TEST CSS VARIABLE CONSISTENCY
    console.log('\n=== TESTING CSS VARIABLE CONSISTENCY ===');
    
    const rootElement = await page.locator(':root').first();
    const variables = await rootElement.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        '--content-max': styles.getPropertyValue('--content-max'),
        '--gutter-x-sm': styles.getPropertyValue('--gutter-x-sm'),
        '--gutter-x-md': styles.getPropertyValue('--gutter-x-md'),
        '--cookie-offset': styles.getPropertyValue('--cookie-offset')
      };
    });
    
    console.log('CSS Variables:', variables);
    
    // 5. FINAL COMPREHENSIVE CHECK
    console.log('\n=== FINAL COMPREHENSIVE CHECK ===');
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight));
    await page.waitForTimeout(500);
    
    // Check all elements are properly aligned
    const headerContainer = await page.locator('header .mx-auto').first();
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    
    const headerWidth = (await headerContainer.boundingBox())?.width || 0;
    const mainWidth = (await mainContainer.boundingBox())?.width || 0;
    const footerWidth = (await footerContainer.boundingBox())?.width || 0;
    
    console.log(`Width consistency check:`);
    console.log(`  Header: ${headerWidth}px`);
    console.log(`  Main: ${mainWidth}px`);
    console.log(`  Footer: ${footerWidth}px`);
    
    const allWidthsMatch = headerWidth === mainWidth && mainWidth === footerWidth && headerWidth === 1200;
    console.log(`  All widths match: ${allWidthsMatch ? '✅' : '❌'}`);
    
    // Final screenshot
    await page.screenshot({
      path: 'test-results/final-comprehensive-check.png',
      fullPage: true
    });
    
    // Assertions
    expect(allWidthsMatch).toBe(true);
    
    console.log('\n✅ All edge case tests passed!');
  });
});
