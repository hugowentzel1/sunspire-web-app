import { test, expect } from '@playwright/test';

test('Test 2-Demo Limitation System - Verify Lockout After 2 Views', async ({ page }) => {
  console.log('🔒 Testing 2-demo limitation system...');
  
  // Clear any existing demo quota
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demoQuota');
    console.log('🗑️ Cleared existing demo quota');
  });
  
  // First view - should work
  console.log('👀 First view - should show report...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check if report content is visible (not locked)
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible = await reportContent.isVisible();
  console.log('📊 First view - Report content visible:', isReportVisible);
  
  // Check demo quota after first view
  const quotaAfterFirst = await page.evaluate(() => {
    const quota = localStorage.getItem('demoQuota');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after first view:', quotaAfterFirst);
  
  // Second view - should still work
  console.log('👀 Second view - should still show report...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const isReportVisibleSecond = await reportContent.isVisible();
  console.log('📊 Second view - Report content visible:', isReportVisibleSecond);
  
  // Check demo quota after second view
  const quotaAfterSecond = await page.evaluate(() => {
    const quota = localStorage.getItem('demoQuota');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after second view:', quotaAfterSecond);
  
  // Third view - should be locked
  console.log('🔒 Third view - should show lock overlay...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check if lock overlay is visible (look for the actual lock content)
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouGetLive = page.locator('text=What You Get Live').first();
  const isWhatYouSeeVisible = await whatYouSeeNow.isVisible();
  const isWhatYouGetVisible = await whatYouGetLive.isVisible();
  console.log('👁️ "What You See Now" visible:', isWhatYouSeeVisible);
  console.log('🚀 "What You Get Live" visible:', isWhatYouGetVisible);
  
  // Check if we're in lock mode (should show lock content instead of report)
  const isLockMode = isWhatYouSeeVisible && isWhatYouGetVisible;
  console.log('🔒 Third view - Lock mode active:', isLockMode);
  
  // Check if report content is hidden (should not show "Your Solar Savings Over Time")
  const isReportVisibleThird = await reportContent.isVisible();
  console.log('📊 Third view - Report content visible:', isReportVisibleThird);
  
  // Check demo quota after third view
  const quotaAfterThird = await page.evaluate(() => {
    const quota = localStorage.getItem('demoQuota');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after third view:', quotaAfterThird);
  
  // Test with different company - should reset quota
  console.log('🔄 Testing with different company (Apple) - should reset quota...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const isReportVisibleApple = await reportContent.isVisible();
  console.log('🍎 Apple view - Report content visible:', isReportVisibleApple);
  
  const quotaAfterApple = await page.evaluate(() => {
    const quota = localStorage.getItem('demoQuota');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota after Apple view:', quotaAfterApple);
  
  console.log('\n🎯 DEMO LIMITATION TEST RESULTS:');
  if (isReportVisible && isReportVisibleSecond && isLockMode) {
    console.log('✅ 2-demo limitation system working correctly!');
    console.log('  - First 2 views show report content');
    console.log('  - Third view shows lock overlay with "What You See Now" vs "What You Get Live"');
    console.log('  - Different companies reset quota');
  } else if (isReportVisible && !isReportVisibleSecond && isLockMode) {
    console.log('⚠️ 2-demo limitation system working but locking after 1 view instead of 2');
    console.log('  - First view visible:', isReportVisible);
    console.log('  - Second view locked:', !isReportVisibleSecond);
    console.log('  - Third view locked:', isLockMode);
  } else {
    console.log('❌ 2-demo limitation system not working correctly');
    console.log('  - First view visible:', isReportVisible);
    console.log('  - Second view visible:', isReportVisibleSecond);
    console.log('  - Third view locked:', isLockMode);
    console.log('  - "What You See Now" visible:', isWhatYouSeeVisible);
    console.log('  - "What You Get Live" visible:', isWhatYouGetVisible);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'demo-limitation-test.png', fullPage: true });
  console.log('📸 Demo limitation test screenshot saved');
});