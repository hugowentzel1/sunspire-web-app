import { test, expect } from '@playwright/test';

test.describe('Report Page Width Verification', () => {
  test('Check report page main content matches footer width', async ({ page }) => {
    console.log('Testing report page width alignment...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Get the main content Container width
    const mainContainer = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const mainBoundingBox = await mainContainer.boundingBox();
    
    // Get the footer Container width
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    const footerBoundingBox = await footerContainer.boundingBox();
    
    console.log(`Main Container width: ${mainBoundingBox?.width}px`);
    console.log(`Footer Container width: ${footerBoundingBox?.width}px`);
    
    // Check CSS variables
    const rootElement = await page.locator(':root').first();
    const contentMax = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--content-max');
    });
    const gutterSm = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--gutter-x-sm');
    });
    const gutterMd = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--gutter-x-md');
    });
    
    console.log(`CSS Variables:`);
    console.log(`  --content-max: "${contentMax}"`);
    console.log(`  --gutter-x-sm: "${gutterSm}"`);
    console.log(`  --gutter-x-md: "${gutterMd}"`);
    
    // Check computed styles of containers
    const mainComputedStyle = await mainContainer.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        width: styles.width
      };
    });
    
    const footerComputedStyle = await footerContainer.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        width: styles.width
      };
    });
    
    console.log(`Main Container computed styles:`, mainComputedStyle);
    console.log(`Footer Container computed styles:`, footerComputedStyle);
    
    // Calculate width difference
    const widthDifference = Math.abs((mainBoundingBox?.width || 0) - (footerBoundingBox?.width || 0));
    console.log(`Width difference: ${widthDifference}px`);
    
    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'test-results/report-width-debug.png',
      fullPage: true
    });
    
    // Verify widths are close (allowing for small differences)
    expect(widthDifference).toBeLessThan(10);
    
    console.log('✓ Container width verification passed');
  });
});
