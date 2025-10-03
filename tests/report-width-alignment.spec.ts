import { test, expect } from '@playwright/test';

test.describe('Report Page Width Verification', () => {
  test('Check report page header, main, and footer all have same width', async ({ page }) => {
    console.log('Testing report page width alignment...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Get the header Container width
    const headerContainer = await page.locator('header .mx-auto').first();
    const headerBoundingBox = await headerContainer.boundingBox();
    
    // Get the main content Container width
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const mainBoundingBox = await mainContainer.boundingBox();
    
    // Get the footer Container width
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    const footerBoundingBox = await footerContainer.boundingBox();
    
    console.log(`Header Container width: ${headerBoundingBox?.width}px`);
    console.log(`Main Container width: ${mainBoundingBox?.width}px`);
    console.log(`Footer Container width: ${footerBoundingBox?.width}px`);
    
    // Calculate differences
    const headerMainDiff = Math.abs((headerBoundingBox?.width || 0) - (mainBoundingBox?.width || 0));
    const mainFooterDiff = Math.abs((mainBoundingBox?.width || 0) - (footerBoundingBox?.width || 0));
    const headerFooterDiff = Math.abs((headerBoundingBox?.width || 0) - (footerBoundingBox?.width || 0));
    
    console.log(`Header-Main difference: ${headerMainDiff}px`);
    console.log(`Main-Footer difference: ${mainFooterDiff}px`);
    console.log(`Header-Footer difference: ${headerFooterDiff}px`);
    
    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/report-width-alignment.png',
      fullPage: true
    });
    
    // Verify all widths are close (allowing for small differences)
    expect(headerMainDiff).toBeLessThan(10);
    expect(mainFooterDiff).toBeLessThan(10);
    expect(headerFooterDiff).toBeLessThan(10);
    
    console.log('✓ All containers have matching widths');
  });
});
