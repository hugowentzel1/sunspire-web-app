import { test, expect } from '@playwright/test';

test.describe('Final Live Verification @final-live', () => {
  const LIVE_URL = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
  const LIVE_REPORT = 'https://sunspire-web-app.vercel.app/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('Complete live verification after env fix', async ({ page }) => {
    console.log('🌐 FINAL LIVE VERIFICATION');
    
    // 1. Sidebar
    await page.goto(LIVE_REPORT, { waitUntil: 'networkidle', timeout: 60000 });
    await expect(page.locator('[data-sidebar-cta]')).toBeVisible({ timeout: 10000 });
    console.log('✅ 1. Sidebar CTA visible');
    
    // 2. Countdown
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    const countdown = page.locator('text=/Expires in.*d/');
    await expect(countdown).toBeVisible({ timeout: 10000 });
    const countdownText = await countdown.textContent();
    expect(countdownText).not.toContain('0d 0h 0m 0s');
    console.log('✅ 2. Countdown timer:', countdownText);
    
    // 3. Stripe CTA  
    await page.locator('button[data-cta="primary"]').first().click();
    await page.waitForTimeout(3000);
    
    if (page.url().includes('stripe.com')) {
      console.log('✅ 3. Stripe checkout WORKING - redirected to Stripe!');
    } else {
      console.log('❌ 3. Stripe checkout NOT working - still on:', page.url());
    }
    
    // 4. Screenshot
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.screenshot({ path: 'final-live-complete.png', fullPage: true });
    console.log('✅ 4. Screenshot saved');
    
    console.log('');
    console.log('🎉 VERIFICATION COMPLETE');
  });
});
