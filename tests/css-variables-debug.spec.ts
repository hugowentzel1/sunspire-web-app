import { test, expect } from '@playwright/test';

test.describe('CSS Variables Debug', () => {
  test('Check CSS variables are applied correctly', async ({ page }) => {
    console.log('Testing CSS variables...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for styles to load
    await page.waitForTimeout(2000);
    
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
    
    console.log(`--content-max: ${contentMax}`);
    console.log(`--gutter-x-sm: ${gutterSm}`);
    console.log(`--gutter-x-md: ${gutterMd}`);
    
    // Check Container element styles
    const container = await page.locator('main[data-testid="report-page"] .mx-auto').first();
    const containerStyles = await container.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        width: styles.width
      };
    });
    
    console.log('Container styles:', containerStyles);
    
    // Check footer Container styles
    const footerContainer = await page.locator('footer[data-testid="footer"] .mx-auto').first();
    const footerStyles = await footerContainer.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        maxWidth: styles.maxWidth,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        width: styles.width
      };
    });
    
    console.log('Footer Container styles:', footerStyles);
  });
});
