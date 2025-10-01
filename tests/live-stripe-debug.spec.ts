import { test, expect } from '@playwright/test';

test.describe('Live Stripe Debug @live-stripe', () => {
  const LIVE_URL = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';

  test('Debug LIVE Stripe checkout with console monitoring', async ({ page }) => {
    console.log('🌐 Debugging LIVE Stripe checkout...');
    
    // Monitor console messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);
      console.log(`Browser [${msg.type()}]:`, text);
    });
    
    // Monitor network requests
    page.on('request', request => {
      if (request.url().includes('stripe') || request.url().includes('checkout')) {
        console.log('→ Request:', request.method(), request.url());
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('stripe') || response.url().includes('checkout')) {
        console.log('← Response:', response.status(), response.url());
      }
    });
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Find and click CTA
    const cta = page.locator('button[data-cta="primary"]').first();
    await expect(cta).toBeVisible();
    
    console.log('Clicking CTA...');
    await cta.click();
    
    // Wait and see what happens
    await page.waitForTimeout(5000);
    
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    console.log('All console messages:', consoleMessages.filter(m => m.includes('checkout') || m.includes('Stripe') || m.includes('error')));
    
    // Take screenshot
    await page.screenshot({ path: 'live-stripe-debug.png', fullPage: true });
    
    if (finalUrl.includes('stripe.com')) {
      console.log('✅ Redirected to Stripe!');
    } else {
      console.log('❌ Did NOT redirect to Stripe');
      console.log('Check for alert dialogs or error messages');
    }
  });
});

