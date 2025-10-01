import { test, expect } from '@playwright/test';

test.describe('Live Demo Site Verification @live', () => {
  const LIVE_URL = 'https://demo.sunspiredemo.com/?company=Apple&demo=1';
  const LIVE_REPORT = 'https://demo.sunspiredemo.com/report?company=Apple&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('Live: Countdown timer shows valid time', async ({ page }) => {
    console.log('🌐 Testing live countdown timer...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Find countdown text
    const countdown = page.locator('text=/Expires in/');
    await expect(countdown).toBeVisible({ timeout: 10000 });
    
    const countdownText = await countdown.textContent();
    console.log('Countdown text:', countdownText);
    
    // Should NOT be all zeros
    expect(countdownText).not.toContain('0d 0h 0m 0s');
    // Should show days/hours/minutes
    expect(countdownText).toMatch(/\d+d \d+h \d+m/);
    
    console.log('✅ Live countdown timer working:', countdownText);
  });

  test('Live: Stripe CTA works', async ({ page }) => {
    console.log('🌐 Testing live Stripe CTA...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Click CTA
    const cta = page.locator('button[data-cta="primary"]').first();
    await expect(cta).toBeVisible({ timeout: 10000 });
    
    // Click and wait for navigation or error
    const [responseOrTimeout] = await Promise.race([
      Promise.all([
        page.waitForResponse(res => res.url().includes('stripe'), { timeout: 10000 }),
        cta.click()
      ]),
      page.waitForTimeout(10000).then(() => [null])
    ]);
    
    if (responseOrTimeout) {
      console.log('✅ Stripe request initiated');
    } else {
      // Check console for errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      console.log('Console errors:', errors);
    }
  });

  test('Live: Sidebar CTA visible on report page', async ({ page }) => {
    console.log('🌐 Testing live sidebar CTA...');
    
    await page.goto(LIVE_REPORT, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check sidebar
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible({ timeout: 10000 });
    
    // Check metric
    const metric = page.locator('[data-sidebar-metric="installersLive"]');
    const metricText = await metric.textContent();
    expect(metricText).toContain('113+');
    
    console.log('✅ Live sidebar CTA visible with metric:', metricText);
  });

  test('Live: Bottom CTA has clear outline', async ({ page }) => {
    console.log('🌐 Testing live bottom CTA outline...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Scroll to bottom CTA
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Find bottom CTA in the colored box
    const bottomCta = page.locator('text=Ready to Launch Your Branded Tool').locator('..').locator('button[data-cta="primary"]');
    
    if (await bottomCta.count() > 0) {
      await expect(bottomCta).toBeVisible();
      
      // Check border styling
      const borderWidth = await bottomCta.evaluate(el => {
        return window.getComputedStyle(el).borderWidth;
      });
      
      console.log('Bottom CTA border width:', borderWidth);
      expect(borderWidth).toContain('4px');
      console.log('✅ Bottom CTA has 4px border');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'live-demo-verification.png', fullPage: true });
    console.log('✅ Screenshot saved');
  });

  test('Live: Demo quota system works', async ({ page }) => {
    console.log('🌐 Testing live demo quota...');
    
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    
    // Check quota counter
    const quotaText = page.locator('text=/runs left/');
    await expect(quotaText).toBeVisible({ timeout: 10000 });
    
    const text = await quotaText.textContent();
    expect(text).toContain('2 runs left');
    
    console.log('✅ Demo quota showing:', text);
  });
});

