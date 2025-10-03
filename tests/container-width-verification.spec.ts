import { test, expect } from '@playwright/test';

test.describe('Container Width Verification', () => {
  test('Check report page main content matches footer width', async ({ page }) => {
    console.log('Testing report page with Apple branding...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Get the main content Container width (the actual content area)
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const mainBoundingBox = await mainContainer.boundingBox();
    
    // Get the footer Container width (the actual content area)
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    const footerBoundingBox = await footerContainer.boundingBox();
    
    console.log(`Main Container width: ${mainBoundingBox?.width}px`);
    console.log(`Footer Container width: ${footerBoundingBox?.width}px`);
    
    // Check if widths are approximately equal (within 5px tolerance)
    const widthDifference = Math.abs((mainBoundingBox?.width || 0) - (footerBoundingBox?.width || 0));
    console.log(`Width difference: ${widthDifference}px`);
    
    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/container-width-verification.png',
      fullPage: true 
    });
    
    // Verify widths are close (allowing for small differences)
    expect(widthDifference).toBeLessThan(10); // Allow small tolerance for rounding
    
    console.log('✓ Container width verification passed');
  });
});
