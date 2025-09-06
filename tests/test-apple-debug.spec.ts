import { test, expect } from '@playwright/test';

test('Debug Apple Demo Quota System', async ({ page }) => {
  console.log('🔍 Debugging Apple demo quota system...');
  
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
  
  // Test 3: Third Generate Report click
  console.log('👀 Third Generate Report click...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Quota before third click:', quota);
  
  await addressInput.fill('789 Pine St, Chicago, IL');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Quota after third click:', quota);
  
  const isReportVisible3 = await reportContent.isVisible();
  console.log('📊 Third click - Report content visible:', isReportVisible3);
  
  const lockOverlay3 = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible3 = await lockOverlay3.count() > 0;
  console.log('🔒 Third click - Lock overlay visible:', isLockOverlayVisible3);
  
  // Take screenshot
  await page.screenshot({ path: 'apple-debug-test.png', fullPage: true });
  
  console.log('🔍 Apple debug complete');
  console.log('Expected behavior:');
  console.log('  First click:  Quota 2→1, Show report');
  console.log('  Second click: Quota 1→0, Show report');
  console.log('  Third click:  Quota 0→-1, Show lockout');
});
