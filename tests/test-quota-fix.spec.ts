import { test, expect } from '@playwright/test';

test('Test Quota Fix - 2 runs then lock at 0', async ({ page }) => {
  console.log('🔒 Testing quota fix - should allow 2 runs before locking at 0');
  
  // Clear any existing demo quota to start fresh
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
    console.log('🗑️ Cleared demo quota and countdown data');
  });
  
  // Navigate to Tesla demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  
  // Test 1: First Generate Report click - should work
  console.log('👀 First Generate Report click - should work...');
  await addressInput.fill('123 Main St, New York, NY');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  console.log('📊 First click - Report content visible:', isReportVisible1);
  expect(isReportVisible1).toBeTruthy();
  
  // Check quota after first click
  const quotaAfterFirst = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after first click:', quotaAfterFirst);
  
  // Test 2: Second Generate Report click - should still work
  console.log('👀 Second Generate Report click - should still work...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const isReportVisible2 = await reportContent.isVisible();
  console.log('📊 Second click - Report content visible:', isReportVisible2);
  expect(isReportVisible2).toBeTruthy();
  
  // Check quota after second click
  const quotaAfterSecond = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after second click:', quotaAfterSecond);
  
  // Test 3: Third Generate Report click - should show lockout
  console.log('🔒 Third Generate Report click - should show lockout...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('789 Pine St, Chicago, IL');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Should be on report page showing lockout overlay
  const currentUrl = page.url();
  const isOnReportPage = currentUrl.includes('/report');
  console.log('🏠 On report page after third click:', isOnReportPage);
  expect(isOnReportPage).toBeTruthy();
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible = await lockOverlay.count() > 0;
  console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
  expect(isLockOverlayVisible).toBeTruthy();
  
  // Check for red "What You See Now" elements
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
  expect(whatYouSeeNowColor).toContain('220, 38, 38'); // RGB for #DC2626 (red)
  
  // Check final quota
  const quotaAfterThird = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after third click:', quotaAfterThird);
  
  // Take screenshot
  await page.screenshot({ path: 'quota-fix-test.png', fullPage: true });
  
  console.log('🎉 Quota fix working correctly - 2 runs then lock at 0!');
});
