import { test, expect } from '@playwright/test';

test.describe('Sticky CTA State Debug', () => {
  test('Debug sticky CTA state variables', async ({ page }) => {
    console.log('Debugging sticky CTA state...');
    await page.goto('http://localhost:3001/report?company=Apple&demo=1');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for everything to load
    await page.waitForTimeout(5000);
    
    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(1000);
    
    // Check if data-cookie-visible attribute is set
    const rootElement = await page.locator(':root').first();
    const cookieVisibleAttr = await rootElement.getAttribute('data-cookie-visible');
    console.log('Root data-cookie-visible attribute:', cookieVisibleAttr);
    
    // Check cookie banner visibility
    const cookieBanner = await page.locator('#cookie-banner').first();
    const cookieVisible = await cookieBanner.isVisible();
    console.log('Cookie banner visible:', cookieVisible);
    
    // Force a page refresh to see if the fix works
    console.log('Refreshing page to test fix...');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Scroll to bottom again
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
    });
    await page.waitForTimeout(1000);
    
    // Check sticky CTA again
    const stickyCTA = await page.locator('.hidden.md\\:block.fixed.z-50').first();
    const computedStyles = await stickyCTA.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        opacity: styles.opacity,
        pointerEvents: styles.pointerEvents
      };
    });
    
    console.log('Sticky CTA after refresh:', computedStyles);
    
    const className = await stickyCTA.getAttribute('class');
    console.log('Sticky CTA classes after refresh:', className);
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/sticky-cta-after-refresh.png',
      fullPage: false
    });
  });
});
