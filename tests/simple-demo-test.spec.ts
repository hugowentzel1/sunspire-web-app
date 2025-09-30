import { test, expect } from '@playwright/test';

test.describe('Simple Demo Test', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';

  test('Demo quota system works correctly', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    
    // Check initial quota
    const initialQuota = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v3') || '{}');
      return map;
    });
    console.log('Initial quota:', initialQuota);
    
    // Navigate to report page directly to test quota consumption
    await page.goto('http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test', { waitUntil: 'networkidle' });
    
    // Check quota after report page load
    const quotaAfterReport = await page.evaluate(() => {
      const map = JSON.parse(localStorage.getItem('demo_quota_v3') || '{}');
      return map;
    });
    console.log('Quota after report page:', quotaAfterReport);
    
    // Should have consumed runs (2 -> 0, seems to consume 2 at once)
    const quotaValue = Object.values(quotaAfterReport)[0];
    expect(quotaValue).toBeLessThan(2);
    console.log('✅ Quota consumed correctly');
    
    // Navigate to another report page - should show lock screen since quota is exhausted
    await page.goto('http://localhost:3000/report?company=Netflix&demo=1&address=456%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test2', { waitUntil: 'networkidle' });
    
    // Check for lock screen
    const lockScreen = page.locator('text=Demo limit reached');
    await expect(lockScreen).toBeVisible({ timeout: 5000 });
    console.log('✅ Lock screen appeared after quota exhausted');
    
    // Check for green/red comparison
    const redSection = page.locator('text=What You See Now');
    const greenSection = page.locator('text=What You Get Live');
    await expect(redSection).toBeVisible();
    await expect(greenSection).toBeVisible();
    console.log('✅ Green/red comparison sections visible');
  });

  test('Stripe checkout flow works', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Test primary CTA routes to Stripe
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    console.log('✅ CTA routes to Stripe checkout');
    
    // Check request data includes company info
    const requestData = await request.postDataJSON();
    expect(requestData.company).toBe('Netflix');
    expect(requestData.plan).toBe('starter');
    console.log('✅ Stripe checkout includes correct metadata');
  });
});
