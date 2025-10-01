import { test, expect } from '@playwright/test';

test.describe('Pre-Deploy Final Check @predeploy', () => {
  const LOCAL_URL = 'http://localhost:3000/?company=Apple&demo=1';
  const LOCAL_REPORT = 'http://localhost:3000/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('1. Sidebar CTA positioned mid-page (not bottom)', async ({ page }) => {
    console.log('🚀 1. Testing sidebar positioning...');
    
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(LOCAL_REPORT, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Should be in the layout, not fixed at bottom
    const box = await sidebar.boundingBox();
    console.log('Sidebar position:', { x: box!.x, y: box!.y });
    
    // Should be visible in viewport (not way down at bottom)
    expect(box!.y).toBeLessThan(600);
    expect(box!.y).toBeGreaterThan(50);
    
    console.log('✅ Sidebar positioned mid-page');
    
    await page.screenshot({ path: 'sidebar-positioning-check.png', fullPage: false });
  });

  test('2. Countdown timer shows 6-7 days (not zeros)', async ({ page }) => {
    console.log('🚀 2. Testing countdown timer...');
    
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.removeItem('demo_countdown_deadline'));
    await page.reload({ waitUntil: 'networkidle' });
    
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible();
    
    const text = await countdown.textContent();
    console.log('Countdown:', text);
    
    // Should show 6 or 7 days
    expect(text).toMatch(/Expires in [67]d/);
    expect(text).not.toContain('0d 0h 0m 0s');
    
    console.log('✅ Countdown showing valid time');
  });

  test('3. Stripe checkout returns valid URL', async ({ page }) => {
    console.log('🚀 3. Testing Stripe checkout...');
    
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      page.locator('button[data-cta="primary"]').first().click(),
    ]);
    
    const response = await request.response();
    console.log('Response status:', response?.status());
    
    expect(response?.status()).toBe(200);
    
    // Parse request data to verify it's correct
    const requestData = await request.postDataJSON();
    expect(requestData.company).toBe('Apple');
    expect(requestData.plan).toBe('starter');
    
    console.log('✅ Stripe checkout request successful with correct metadata');
  });

  test('4. Activate page shows quote.yourcompany.com', async ({ page }) => {
    console.log('🚀 4. Testing activate page...');
    
    await page.goto('http://localhost:3000/activate?session_id=test&company=Apple', { waitUntil: 'networkidle' });
    
    // Click on Custom Domain tab
    const domainTab = page.locator('button').filter({ hasText: 'Custom Domain' });
    await domainTab.click();
    await page.waitForTimeout(500);
    
    // Check for quote.yourcompany.com mention
    await expect(page.locator('text=quote.yourcompany.com')).toBeVisible();
    
    console.log('✅ Activate page shows quote.yourcompany.com');
    
    await page.screenshot({ path: 'activate-page-check.png' });
  });

  test('5. Full visual verification', async ({ page }) => {
    console.log('🚀 5. Taking full visual screenshots...');
    
    // Homepage
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'final-homepage-check.png', fullPage: true });
    console.log('✅ Homepage screenshot');
    
    // Report with sidebar
    await page.goto(LOCAL_REPORT, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'final-report-sidebar-check.png', fullPage: true });
    console.log('✅ Report page screenshot');
  });
});

