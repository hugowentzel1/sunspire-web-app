import { test, expect } from '@playwright/test';

test.describe('Cookie Offset Simple Test', () => {
  test('Check cookie offset is working', async ({ page }) => {
    console.log('Testing cookie offset...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Check console logs for CookieOffsetProvider
    const logs = [];
    page.on('console', msg => {
      if (msg.text().includes('CookieOffsetProvider')) {
        logs.push(msg.text());
      }
    });
    
    // Wait a bit more for any async operations
    await page.waitForTimeout(2000);
    
    console.log('Console logs:', logs);
    
    // Check CSS variable
    const rootElement = await page.locator(':root').first();
    const cookieOffset = await rootElement.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--cookie-offset');
    });
    
    console.log(`--cookie-offset: "${cookieOffset}"`);
    
    // Check if cookie banner exists
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieExists = await cookieBanner.count() > 0;
    console.log(`Cookie banner exists: ${cookieExists}`);
    
    if (cookieExists) {
      const cookieVisible = await cookieBanner.isVisible();
      console.log(`Cookie banner visible: ${cookieVisible}`);
      
      if (cookieVisible) {
        const cookieBoundingBox = await cookieBanner.boundingBox();
        const cookieHeight = cookieBoundingBox?.height || 0;
        console.log(`Cookie banner height: ${cookieHeight}px`);
      }
    }
  });
});
