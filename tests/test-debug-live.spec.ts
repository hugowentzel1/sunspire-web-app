import { test, expect } from '@playwright/test';

test('Debug Live Site Behavior', async ({ page }) => {
  console.log('🔍 Debugging live site behavior...');
  
  // Clear any existing demo quota to start fresh
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
    console.log('🗑️ Cleared demo quota and countdown data');
  });
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  
  // Check initial quota
  let quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Initial quota:', quota);
  
  // Test 1: First Generate Report click
  console.log('👀 First Generate Report click...');
  await addressInput.fill('123 Main St, New York, NY');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Quota after first click:', quota);
  
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  console.log('📊 First click - Report content visible:', isReportVisible1);
  
  const lockOverlay1 = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible1 = await lockOverlay1.count() > 0;
  console.log('🔒 First click - Lock overlay visible:', isLockOverlayVisible1);
  
  // Test 2: Second Generate Report click
  console.log('👀 Second Generate Report click...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Quota before second click:', quota);
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Quota after second click:', quota);
  
  const isReportVisible2 = await reportContent.isVisible();
  console.log('📊 Second click - Report content visible:', isReportVisible2);
  
  const lockOverlay2 = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible2 = await lockOverlay2.count() > 0;
  console.log('🔒 Second click - Lock overlay visible:', isLockOverlayVisible2);
  
  // Check what's actually being displayed
  const currentUrl = page.url();
  console.log('🔗 Current URL after second click:', currentUrl);
  
  // Check if we're on report page or lockout page
  const pageTitle = await page.title();
  console.log('📄 Page title:', pageTitle);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-live-test.png', fullPage: true });
  
  console.log('🔍 Live site debug complete');
  console.log('Expected: Second click should show report (quota 1→0)');
  console.log('Actual: Second click shows', isReportVisible2 ? 'report' : 'lockout');
});
