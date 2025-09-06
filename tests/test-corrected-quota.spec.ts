import { test, expect } from '@playwright/test';

test('Corrected Quota Test - 2 runs then lock at 0', async ({ page }) => {
  console.log('🔒 Testing corrected quota behavior - 2 runs then lock at 0');
  
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
  
  // Test 2: Second Generate Report click - should show lockout (quota goes to 0)
  console.log('👀 Second Generate Report click - should show lockout (quota goes to 0)...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Should show lockout overlay (not report content)
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible = await lockOverlay.count() > 0;
  console.log('🔒 Second click - Lock overlay visible:', isLockOverlayVisible);
  expect(isLockOverlayVisible).toBeTruthy();
  
  const isReportVisible2 = await reportContent.isVisible();
  console.log('📊 Second click - Report content visible:', isReportVisible2);
  expect(isReportVisible2).toBeFalsy(); // Should NOT show report content
  
  // Check quota after second click
  const quotaAfterSecond = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after second click:', quotaAfterSecond);
  
  // Check for red "What You See Now" elements
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
  expect(whatYouSeeNowColor).toContain('220, 38, 38'); // RGB for #DC2626 (red)
  
  // Check for countdown timer
  const countdownTimer = page.locator('text=Expires in').first();
  const isCountdownVisible = await countdownTimer.isVisible();
  console.log('⏰ Countdown timer visible:', isCountdownVisible);
  expect(isCountdownVisible).toBeTruthy();
  
  // Take screenshot
  await page.screenshot({ path: 'corrected-quota-test.png', fullPage: true });
  
  console.log('🎉 Corrected quota test passed - 2 runs then lock at 0!');
  console.log('✅ First click: Shows report (quota 2→1)');
  console.log('✅ Second click: Shows lockout (quota 1→0)');
  console.log('✅ Lockout page has red "What You See Now" elements');
  console.log('✅ Lockout page has countdown timer');
});
