import { test, expect } from '@playwright/test';

test.describe('Final Visual Verification', () => {
  test('Complete visual verification with multiple screenshots', async ({ page }) => {
    console.log('Starting final comprehensive visual verification...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for all content to load
    await page.waitForTimeout(3000);
    
    // 1. CHECK INITIAL STATE
    console.log('\n=== INITIAL STATE CHECK ===');
    
    // Check cookie banner
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieVisible = await cookieBanner.isVisible();
    const cookiePosition = await cookieBanner.boundingBox();
    
    console.log(`Cookie banner visible: ${cookieVisible}`);
    if (cookieVisible) {
      console.log(`Cookie banner: y=${cookiePosition?.y}, height=${cookiePosition?.height}`);
    }
    
    // Check sticky CTA
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const stickyVisible = await stickyCTA.isVisible();
    const stickyPosition = await stickyCTA.boundingBox();
    
    console.log(`Sticky CTA visible: ${stickyVisible}`);
    if (stickyVisible) {
      console.log(`Sticky CTA: y=${stickyPosition?.y}, height=${stickyPosition?.height}`);
    }
    
    // 2. SCROLL TO DIFFERENT POSITIONS AND TAKE SCREENSHOTS
    console.log('\n=== SCROLLING AND SCREENSHOTS ===');
    
    const positions = [
      { name: 'top', scroll: 0 },
      { name: 'middle', scroll: 'window.innerHeight' },
      { name: 'bottom', scroll: 'document.body.scrollHeight - window.innerHeight' }
    ];
    
    for (const pos of positions) {
      console.log(`\nPosition: ${pos.name}`);
      
      if (typeof pos.scroll === 'number') {
        await page.evaluate((scroll) => window.scrollTo(0, scroll), pos.scroll);
      } else {
        await page.evaluate((scroll) => window.scrollTo(0, eval(scroll)), pos.scroll);
      }
      
      await page.waitForTimeout(500);
      
      // Check sticky CTA visibility and position
      const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
      const isVisible = await stickyCTA.isVisible();
      const boundingBox = await stickyCTA.boundingBox();
      
      console.log(`  Sticky CTA visible: ${isVisible}`);
      if (isVisible) {
        const viewportHeight = await page.viewportSize()?.height || 0;
        const distanceFromBottom = viewportHeight - (boundingBox?.y || 0) - (boundingBox?.height || 0);
        console.log(`  Distance from bottom: ${distanceFromBottom}px`);
        console.log(`  Size: ${boundingBox?.width}x${boundingBox?.height}`);
      }
      
      // Take screenshot
      await page.screenshot({
        path: `test-results/final-${pos.name}-position.png`,
        fullPage: false
      });
    }
    
    // 3. CHECK WIDTH ALIGNMENT
    console.log('\n=== WIDTH ALIGNMENT CHECK ===');
    
    // Scroll to bottom for final check
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(500);
    
    // Check all container widths
    const headerContainer = await page.locator('header .mx-auto').first();
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    
    const headerWidth = (await headerContainer.boundingBox())?.width || 0;
    const mainWidth = (await mainContainer.boundingBox())?.width || 0;
    const footerWidth = (await footerContainer.boundingBox())?.width || 0;
    
    console.log(`Header width: ${headerWidth}px`);
    console.log(`Main width: ${mainWidth}px`);
    console.log(`Footer width: ${footerWidth}px`);
    
    const widthDifferences = {
      headerMain: Math.abs(headerWidth - mainWidth),
      mainFooter: Math.abs(mainWidth - footerWidth),
      headerFooter: Math.abs(headerWidth - footerWidth)
    };
    
    console.log(`Width differences:`, widthDifferences);
    
    // 4. FINAL POSITIONING CHECK
    console.log('\n=== FINAL POSITIONING CHECK ===');
    
    // Check cookie banner and sticky CTA relationship
    const cookieBannerFinal = await page.locator('#cookie-banner').first();
    const stickyCTAFinal = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    
    const cookieVisibleFinal = await cookieBannerFinal.isVisible();
    const stickyVisibleFinal = await stickyCTAFinal.isVisible();
    
    if (cookieVisibleFinal && stickyVisibleFinal) {
      const cookiePos = await cookieBannerFinal.boundingBox();
      const stickyPos = await stickyCTAFinal.boundingBox();
      
      const cookieTop = cookiePos?.y || 0;
      const cookieHeight = cookiePos?.height || 0;
      const stickyTop = stickyPos?.y || 0;
      const stickyHeight = stickyPos?.height || 0;
      
      const stickyBottom = stickyTop + stickyHeight;
      const cookieBottom = cookieTop + cookieHeight;
      
      console.log(`Cookie banner: top=${cookieTop}, bottom=${cookieBottom}`);
      console.log(`Sticky CTA: top=${stickyTop}, bottom=${stickyBottom}`);
      
      // Check if sticky CTA is above cookie banner
      const isStickyAboveCookie = stickyBottom <= cookieTop;
      console.log(`Sticky CTA is above cookie banner: ${isStickyAboveCookie}`);
      
      if (isStickyAboveCookie) {
        const gap = cookieTop - stickyBottom;
        console.log(`Gap between sticky CTA and cookie banner: ${gap}px`);
      } else {
        const overlap = stickyBottom - cookieTop;
        console.log(`Overlap between sticky CTA and cookie banner: ${overlap}px`);
      }
    }
    
    // 5. TAKE FINAL COMPREHENSIVE SCREENSHOT
    console.log('\n=== FINAL SCREENSHOT ===');
    
    await page.screenshot({
      path: 'test-results/final-comprehensive-verification.png',
      fullPage: true
    });
    
    // 6. FINAL ASSERTIONS
    console.log('\n=== FINAL ASSERTIONS ===');
    
    // All widths should match
    expect(headerWidth).toBe(1200);
    expect(mainWidth).toBe(1200);
    expect(footerWidth).toBe(1200);
    
    // Sticky CTA should be visible
    expect(stickyVisibleFinal).toBe(true);
    
    // Sticky CTA should have correct size
    if (stickyVisibleFinal) {
      const stickyPos = await stickyCTAFinal.boundingBox();
      expect(stickyPos?.width).toBe(320);
    }
    
    // If both cookie banner and sticky CTA are visible, sticky should be above cookie
    if (cookieVisibleFinal && stickyVisibleFinal) {
      const cookiePos = await cookieBannerFinal.boundingBox();
      const stickyPos = await stickyCTAFinal.boundingBox();
      
      const stickyBottom = (stickyPos?.y || 0) + (stickyPos?.height || 0);
      const cookieTop = cookiePos?.y || 0;
      
      expect(stickyBottom).toBeLessThanOrEqual(cookieTop);
    }
    
    console.log('\n✅ All final verifications passed!');
  });
});
