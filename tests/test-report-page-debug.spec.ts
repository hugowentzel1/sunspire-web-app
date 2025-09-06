import { test, expect } from '@playwright/test';

test.describe('Report Page Debug', () => {
  test('Debug report page content', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Debugging report page...');
    
    // Navigate directly to report page
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-report-page.png' });
    
    // Check page content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText?.length);
    console.log('Body text preview:', bodyText?.substring(0, 500));
    
    // Check for specific elements
    const elements = [
      'h1', 'h2', 'h3', 'p', 'div', 'button', 'a',
      '[data-testid="report-content"]',
      '.report-content',
      '.solar-estimate',
      '[data-testid="lock-overlay"]',
      '.lock-overlay',
      '.preview-limit',
      'text=Preview:',
      'text=runs left',
      'text=Unlock',
      'text=Activate'
    ];
    
    for (const selector of elements) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const texts = await page.locator(selector).allTextContents();
        console.log(`${selector}: ${count} elements - ${texts.slice(0, 3).join(', ')}`);
      }
    }
    
    // Check console logs
    page.on('console', msg => {
      console.log(`Console ${msg.type()}:`, msg.text());
    });
    
    // Check for any loading states
    const loadingElements = await page.locator('[class*="loading"], [class*="Loading"], [class*="spinner"]').count();
    console.log('Loading elements found:', loadingElements);
    
    // Check if page is still loading
    const isLoading = await page.evaluate(() => document.readyState);
    console.log('Document ready state:', isLoading);
    
    console.log('✅ Report page debug completed');
  });
});
