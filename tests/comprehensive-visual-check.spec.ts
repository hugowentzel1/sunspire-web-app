import { test, expect } from '@playwright/test';

test.describe('Comprehensive Visual Verification', () => {
  test('Deep visual check of sticky CTA, cookie banner, and width alignment', async ({ page }) => {
    console.log('Starting comprehensive visual verification...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for all content to load
    await page.waitForTimeout(3000);
    
    // 1. CHECK COOKIE BANNER
    console.log('\n=== COOKIE BANNER CHECK ===');
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieExists = await cookieBanner.count() > 0;
    const cookieVisible = cookieExists ? await cookieBanner.isVisible() : false;
    
    console.log(`Cookie banner exists: ${cookieExists}`);
    console.log(`Cookie banner visible: ${cookieVisible}`);
    
    let cookieHeight = 0;
    let cookiePosition = { x: 0, y: 0, width: 0, height: 0 };
    
    if (cookieVisible) {
      cookiePosition = await cookieBanner.boundingBox() || { x: 0, y: 0, width: 0, height: 0 };
      cookieHeight = cookiePosition.height;
      console.log(`Cookie banner position: x=${cookiePosition.x}, y=${cookiePosition.y}`);
      console.log(`Cookie banner size: width=${cookiePosition.width}, height=${cookieHeight}`);
    }
    
    // 2. CHECK CSS VARIABLES
    console.log('\n=== CSS VARIABLES CHECK ===');
    const rootElement = await page.locator(':root').first();
    const cookieOffset = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--cookie-offset');
    });
    const contentMax = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--content-max');
    });
    
    console.log(`--cookie-offset: "${cookieOffset}"`);
    console.log(`--content-max: "${contentMax}"`);
    
    // 3. SCROLL TO MAKE STICKY CTA VISIBLE
    console.log('\n=== SCROLLING TO REVEAL STICKY CTA ===');
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2);
    });
    await page.waitForTimeout(1000);
    
    // 4. CHECK STICKY CTA
    console.log('\n=== STICKY CTA CHECK ===');
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const stickyExists = await stickyCTA.count() > 0;
    const stickyVisible = stickyExists ? await stickyCTA.isVisible() : false;
    
    console.log(`Sticky CTA exists: ${stickyExists}`);
    console.log(`Sticky CTA visible: ${stickyVisible}`);
    
    let stickyPosition = { x: 0, y: 0, width: 0, height: 0 };
    let stickyDistanceFromBottom = 0;
    
    if (stickyVisible) {
      stickyPosition = await stickyCTA.boundingBox() || { x: 0, y: 0, width: 0, height: 0 };
      const viewportHeight = await page.viewportSize()?.height || 0;
      stickyDistanceFromBottom = viewportHeight - stickyPosition.y - stickyPosition.height;
      
      console.log(`Sticky CTA position: x=${stickyPosition.x}, y=${stickyPosition.y}`);
      console.log(`Sticky CTA size: width=${stickyPosition.width}, height=${stickyPosition.height}`);
      console.log(`Sticky CTA distance from bottom: ${stickyDistanceFromBottom}px`);
      
      // Check button text
      const button = await stickyCTA.locator('a, button').first();
      const buttonText = await button.textContent();
      console.log(`Sticky CTA button text: "${buttonText}"`);
      
      // Check computed styles
      const stickyStyles = await stickyCTA.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          bottom: styles.bottom,
          right: styles.right,
          width: styles.width,
          position: styles.position,
          zIndex: styles.zIndex
        };
      });
      console.log('Sticky CTA computed styles:', stickyStyles);
    }
    
    // 5. CHECK WIDTH ALIGNMENT
    console.log('\n=== WIDTH ALIGNMENT CHECK ===');
    
    // Header width
    const headerContainer = await page.locator('header .mx-auto').first();
    const headerBoundingBox = await headerContainer.boundingBox();
    const headerWidth = headerBoundingBox?.width || 0;
    
    // Main content width
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const mainBoundingBox = await mainContainer.boundingBox();
    const mainWidth = mainBoundingBox?.width || 0;
    
    // Footer width
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    const footerBoundingBox = await footerContainer.boundingBox();
    const footerWidth = footerBoundingBox?.width || 0;
    
    console.log(`Header width: ${headerWidth}px`);
    console.log(`Main content width: ${mainWidth}px`);
    console.log(`Footer width: ${footerWidth}px`);
    
    const headerMainDiff = Math.abs(headerWidth - mainWidth);
    const mainFooterDiff = Math.abs(mainWidth - footerWidth);
    const headerFooterDiff = Math.abs(headerWidth - footerWidth);
    
    console.log(`Header-Main difference: ${headerMainDiff}px`);
    console.log(`Main-Footer difference: ${mainFooterDiff}px`);
    console.log(`Header-Footer difference: ${headerFooterDiff}px`);
    
    // 6. CHECK POSITIONING RELATIONSHIP
    console.log('\n=== POSITIONING RELATIONSHIP CHECK ===');
    
    if (cookieVisible && stickyVisible) {
      const cookieBottom = cookiePosition.y + cookiePosition.height;
      const stickyTop = stickyPosition.y;
      
      console.log(`Cookie banner bottom: ${cookieBottom}px`);
      console.log(`Sticky CTA top: ${stickyTop}px`);
      console.log(`Gap between cookie and sticky: ${stickyTop - cookieBottom}px`);
      
      // Verify sticky CTA is above cookie banner
      const isStickyAboveCookie = stickyTop < cookieBottom;
      console.log(`Sticky CTA is above cookie banner: ${isStickyAboveCookie}`);
      
      if (!isStickyAboveCookie) {
        console.log('❌ ISSUE: Sticky CTA is overlapping with cookie banner!');
      }
    }
    
    // 7. TAKE COMPREHENSIVE SCREENSHOTS
    console.log('\n=== TAKING SCREENSHOTS ===');
    
    // Full page screenshot
    await page.screenshot({
      path: 'test-results/comprehensive-visual-check-full.png',
      fullPage: true
    });
    
    // Viewport screenshot
    await page.screenshot({
      path: 'test-results/comprehensive-visual-check-viewport.png',
      fullPage: false
    });
    
    // Bottom area screenshot (where sticky CTA and cookie banner are)
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(500);
    
    await page.screenshot({
      path: 'test-results/comprehensive-visual-check-bottom.png',
      fullPage: false
    });
    
    // 8. FINAL VERIFICATION
    console.log('\n=== FINAL VERIFICATION ===');
    
    // Check all requirements
    const requirements = {
      stickyCTAExists: stickyExists,
      stickyCTAVisible: stickyVisible,
      stickyCTACorrectSize: stickyVisible ? stickyPosition.width === 320 : false,
      stickyCTACorrectPosition: stickyVisible ? stickyDistanceFromBottom > 0 && stickyDistanceFromBottom < 100 : false,
      widthAlignment: headerMainDiff < 5 && mainFooterDiff < 5 && headerFooterDiff < 5,
      cookieOffsetWorking: cookieOffset !== '0px' || !cookieVisible,
      stickyAboveCookie: cookieVisible && stickyVisible ? stickyPosition.y < (cookiePosition.y + cookiePosition.height) : true
    };
    
    console.log('Requirements check:');
    Object.entries(requirements).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
    
    // Assertions
    expect(stickyExists).toBe(true);
    expect(stickyVisible).toBe(true);
    expect(stickyPosition.width).toBe(320);
    expect(stickyDistanceFromBottom).toBeGreaterThan(0);
    expect(stickyDistanceFromBottom).toBeLessThan(100);
    expect(headerMainDiff).toBeLessThan(5);
    expect(mainFooterDiff).toBeLessThan(5);
    expect(headerFooterDiff).toBeLessThan(5);
    
    if (cookieVisible && stickyVisible) {
      expect(stickyPosition.y).toBeLessThan(cookiePosition.y + cookiePosition.height);
    }
    
    console.log('\n✅ All visual checks passed!');
  });
});
