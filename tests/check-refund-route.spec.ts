import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Check Refund Route', () => {
  test('Detailed refund page analysis', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/refund`);
    
    console.log('Response status:', response?.status());
    console.log('Response headers:', await response?.allHeaders());
    
    // Get the full page content
    const content = await page.textContent('body');
    console.log('Full page content length:', content?.length);
    
    // Check if it's showing a 404 page or the actual refund content
    const hasRefundContent = content?.includes('Refund') || content?.includes('refund');
    const has404Content = content?.includes('404') || content?.includes('Not Found');
    
    console.log('Has refund content:', hasRefundContent);
    console.log('Has 404 content:', has404Content);
    
    // Take a screenshot to see what's actually being displayed
    await page.screenshot({ path: 'refund-page-debug.png', fullPage: true });
    console.log('Screenshot saved as refund-page-debug.png');
    
    // Check the page title
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
  });

  test('Check if refund page redirects', async ({ page }) => {
    // Follow redirects
    const response = await page.goto(`${LIVE_URL}/refund`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    const finalUrl = page.url();
    console.log('Final URL after redirects:', finalUrl);
    console.log('Response status after redirects:', response?.status());
  });
});
