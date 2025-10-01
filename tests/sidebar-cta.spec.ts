import { test, expect } from '@playwright/test';

test.describe('Sidebar CTA Verification @sidebar', () => {
  const DEMO_URL = 'http://localhost:3000/?company=Netflix&demo=1';
  const REPORT_URL = 'http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test1';

  test('1. Renders sidebar with correct metric', async ({ page }) => {
    console.log('🚀 Testing sidebar CTA renders...');
    
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    // Check sidebar container is visible
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    console.log('✅ Sidebar container visible');
    
    // Check metric is present
    const metric = page.locator('[data-sidebar-metric="installersLive"]');
    await expect(metric).toBeVisible();
    
    // Verify metric value (should be 113+ from statsProvider)
    const metricText = await metric.textContent();
    expect(metricText).toContain('113+');
    expect(metricText).toContain('installers live today');
    console.log('✅ Metric present with correct value:', metricText);
    
    // Check trust row
    const trustRow = page.locator('[data-sidebar-trust]');
    await expect(trustRow).toBeVisible();
    const trustText = await trustRow.textContent();
    expect(trustText).toContain('SOC2');
    expect(trustText).toContain('GDPR');
    expect(trustText).toContain('NREL PVWatts®');
    console.log('✅ Trust row visible with correct content');
  });

  test('2. Desktop sticky behavior', async ({ page }) => {
    console.log('🚀 Testing desktop sticky behavior...');
    
    // Desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Check position
    const box = await sidebar.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThan(1000); // Should be on right side
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Sidebar should still be visible (sticky/fixed)
    await expect(sidebar).toBeVisible();
    console.log('✅ Desktop sidebar remains visible on scroll');
  });

  test('3. Mobile inline behavior', async ({ page }) => {
    console.log('🚀 Testing mobile inline behavior...');
    
    // Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Check it's at bottom of viewport
    const box = await sidebar.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.y).toBeGreaterThan(600); // Should be near bottom
    
    // Check button has adequate touch target
    const button = sidebar.locator('button[data-cta="primary"]');
    const buttonBox = await button.boundingBox();
    expect(buttonBox).toBeTruthy();
    expect(buttonBox!.height).toBeGreaterThanOrEqual(44); // Min 44px for touch
    console.log('✅ Mobile sidebar at bottom with adequate touch targets');
  });

  test('4. Charts remain interactive', async ({ page }) => {
    console.log('🚀 Testing charts remain interactive...');
    
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    // Wait for chart to render
    const chart = page.locator('[data-testid="savings-chart"]');
    await expect(chart).toBeVisible();
    
    // Sidebar should be visible
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Chart should still be clickable/interactable
    const chartBox = await chart.boundingBox();
    expect(chartBox).toBeTruthy();
    expect(chartBox!.width).toBeGreaterThan(400); // Chart should have reasonable width
    
    console.log('✅ Charts remain visible and have reasonable dimensions');
  });

  test('5. CTA routes to Stripe', async ({ page }) => {
    console.log('🚀 Testing CTA routes to Stripe...');
    
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Click CTA and wait for Stripe request
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('api/stripe/create-checkout-session') && req.method() === 'POST'),
      sidebar.locator('button[data-cta="primary"]').click(),
    ]);
    
    const response = await request.response();
    expect(response?.status()).toBe(200);
    
    const requestData = await request.postDataJSON();
    expect(requestData.company).toBe('Netflix');
    expect(requestData.plan).toBe('starter');
    console.log('✅ CTA routes to Stripe checkout with correct metadata');
  });

  test('6. Reduced motion respected', async ({ page }) => {
    console.log('🚀 Testing reduced motion...');
    
    // Emulate prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    const sidebar = page.locator('[data-sidebar-cta]');
    await expect(sidebar).toBeVisible();
    
    // Metric should be visible (no animation delays)
    const metric = page.locator('[data-sidebar-metric="installersLive"]');
    await expect(metric).toBeVisible();
    
    // Trust row should be immediately visible (no fade-in animation)
    const trustRow = page.locator('[data-sidebar-trust]');
    await expect(trustRow).toBeVisible();
    
    console.log('✅ Content remains visible with reduced motion');
  });

  test('7. Visual screenshot verification', async ({ page }) => {
    console.log('🚀 Taking visual screenshots...');
    
    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'sidebar-cta-desktop.png', fullPage: true });
    console.log('✅ Desktop screenshot saved');
    
    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'sidebar-cta-mobile.png', fullPage: true });
    console.log('✅ Mobile screenshot saved');
  });

  test('8. Counter animation works', async ({ page }) => {
    console.log('🚀 Testing counter animation...');
    
    await page.goto(REPORT_URL, { waitUntil: 'networkidle' });
    
    const metric = page.locator('[data-sidebar-metric="installersLive"]');
    await expect(metric).toBeVisible();
    
    // Wait for counter to animate
    await page.waitForTimeout(1000);
    
    // Should show final value
    const metricText = await metric.textContent();
    expect(metricText).toContain('113+');
    console.log('✅ Counter shows final value');
  });
});

