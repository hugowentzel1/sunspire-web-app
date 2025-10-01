import { test, expect } from '@playwright/test';

test.describe('Live Site Verification @live', () => {
  const LIVE_DEMO_URL = 'https://demo.sunspiredemo.com/?company=Netflix&demo=1';

  test('Live: Stripe checkout routes correctly', async ({ page }) => {
    console.log('🌐 Testing live Stripe checkout...');
    
    await page.goto(LIVE_DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Click CTA and wait for Stripe redirect
    await page.locator('button[data-cta="primary"]').first().click();
    
    // Wait for navigation to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    console.log('✅ Live CTA routes to Stripe checkout');
    console.log('✅ Current URL:', page.url());
  });

  test('Live: Demo quota system works', async ({ page }) => {
    console.log('🌐 Testing live demo quota...');
    
    await page.goto(LIVE_DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Clear quota
    await page.evaluate(() => localStorage.clear());
    
    // Navigate to report pages to consume quota
    await page.goto(`${LIVE_DEMO_URL.replace('?', '/report?')}&address=Test1&lat=34.0537&lng=-118.2428&placeId=test1`, { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.goto(`${LIVE_DEMO_URL.replace('?', '/report?')}&address=Test2&lat=34.0537&lng=-118.2428&placeId=test2`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Third should show lock screen
    await page.goto(`${LIVE_DEMO_URL.replace('?', '/report?')}&address=Test3&lat=34.0537&lng=-118.2428&placeId=test3`, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Verify lock screen
    await expect(page.locator('text=Demo limit reached')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=What You See Now')).toBeVisible();
    await expect(page.locator('text=What You Get Live')).toBeVisible();
    
    console.log('✅ Live demo quota working');
    console.log('✅ Live lock screen with green/red comparison visible');
  });

  test('Live: Demo timer visible', async ({ page }) => {
    console.log('🌐 Testing live demo timer...');
    
    await page.goto(LIVE_DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible({ timeout: 10000 });
    
    const countdownText = await countdown.textContent();
    console.log('✅ Live demo timer visible:', countdownText);
  });

  test('Live: Visual screenshot', async ({ page }) => {
    console.log('🌐 Taking live site screenshot...');
    
    await page.goto(LIVE_DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'live-site-verification.png', fullPage: true });
    
    console.log('✅ Live screenshot saved to live-site-verification.png');
  });
});

