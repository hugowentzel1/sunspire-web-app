import { test, expect } from '@playwright/test';

test.describe('Local Final Check Before Push @final', () => {
  const LOCAL_URL = 'http://localhost:3000/?company=Apple&demo=1';
  const LOCAL_REPORT = 'http://localhost:3000/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('1. Countdown timer shows valid time (not all zeros)', async ({ page }) => {
    console.log('🚀 Testing countdown timer...');
    
    // Clear localStorage to get fresh timer
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.removeItem('demo_countdown_deadline'));
    await page.reload({ waitUntil: 'networkidle' });
    
    // Find countdown text
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible({ timeout: 5000 });
    
    const countdownText = await countdown.textContent();
    console.log('Countdown text:', countdownText);
    
    // Should NOT be all zeros
    expect(countdownText).not.toContain('0d 0h 0m 0s');
    // Should show days
    expect(countdownText).toMatch(/\d+d/);
    
    console.log('✅ Countdown timer working correctly');
  });

  test('2. Stripe checkout works from homepage', async ({ page }) => {
    console.log('🚀 Testing Stripe checkout from homepage...');
    
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    
    // Click CTA
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    console.log('✅ Stripe checkout working from homepage');
  });

  test('3. Sidebar CTA visible on report page', async ({ page }) => {
    console.log('🚀 Testing sidebar CTA on report...');
    
    await page.goto(LOCAL_REPORT, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    const metric = page.locator('[data-sidebar-metric="installersLive"]');
    const metricText = await metric.textContent();
    expect(metricText).toContain('113+');
    
    console.log('✅ Sidebar CTA visible with metric:', metricText);
  });

  test('4. Sidebar CTA routes to Stripe', async ({ page }) => {
    console.log('🚀 Testing sidebar CTA Stripe routing...');
    
    await page.goto(LOCAL_REPORT, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      sidebar.locator('button[data-cta="primary"]').click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    console.log('✅ Sidebar CTA routes to Stripe checkout');
  });

  test('5. Bottom CTA has clear outline', async ({ page }) => {
    console.log('🚀 Testing bottom CTA outline...');
    
    await page.goto(LOCAL_REPORT, { waitUntil: 'networkidle' });
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Find bottom CTA
    const bottomSection = page.locator('text=Ready to Launch Your Branded Tool');
    await expect(bottomSection).toBeVisible();
    
    console.log('✅ Bottom CTA section visible');
    
    // Take screenshot
    await page.screenshot({ path: 'final-local-check.png', fullPage: true });
    console.log('✅ Screenshot saved');
  });

  test('6. Demo quota works', async ({ page }) => {
    console.log('🚀 Testing demo quota...');
    
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // Check quota counter
    const quotaText = page.locator('text=/runs left/');
    await expect(quotaText).toBeVisible();
    
    const text = await quotaText.textContent();
    expect(text).toContain('2 runs left');
    
    console.log('✅ Demo quota showing:', text);
  });
});

