import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Debug Refund Route Final', () => {
  test('Check what refund page is actually serving', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/refund`);
    
    console.log('Response status:', response?.status());
    console.log('Response headers:', await response?.allHeaders());
    
    // Get the full page content
    const content = await page.textContent('body');
    console.log('Full page content length:', content?.length);
    console.log('Page content preview:', content?.substring(0, 500));
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if there are any h1 elements
    const h1Elements = page.locator('h1');
    const h1Count = await h1Elements.count();
    console.log('H1 elements count:', h1Count);
    
    if (h1Count > 0) {
      const h1Text = await h1Elements.first().textContent();
      console.log('First H1 text:', h1Text);
    }
    
    // Check for 404 content
    const has404Content = content?.includes('404') || content?.includes('Not Found');
    console.log('Has 404 content:', has404Content);
    
    // Take a screenshot
    await page.screenshot({ path: 'refund-debug-final.png', fullPage: true });
    console.log('Screenshot saved as refund-debug-final.png');
  });
});
