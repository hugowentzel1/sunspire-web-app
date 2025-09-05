import { test, expect } from '@playwright/test';

test('Final 2-Demo Limitation Test - Manual Verification', async ({ page }) => {
  console.log('🎯 Final 2-Demo Limitation Test...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show full report');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait for any quota consumption
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=What You See Now').first();
  const isLockVisible1 = await lockOverlay.isVisible();
  
  // Check quota
  const quota1 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('🔒 First visit - Lock visible:', isLockVisible1);
  console.log('📦 First visit - Quota:', quota1);
  
  expect(isReportVisible1).toBe(true);
  expect(isLockVisible1).toBe(false);
  
  console.log('\n🔍 SECOND VISIT - Should still show full report');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait for any quota consumption
  
  const isReportVisible2 = await reportContent.isVisible();
  const isLockVisible2 = await lockOverlay.isVisible();
  
  const quota2 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('🔒 Second visit - Lock visible:', isLockVisible2);
  console.log('📦 Second visit - Quota:', quota2);
  
  expect(isReportVisible2).toBe(true);
  expect(isLockVisible2).toBe(false);
  
  console.log('\n🔍 THIRD VISIT - Should show lock overlay');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait for any quota consumption
  
  const isReportVisible3 = await reportContent.isVisible();
  const isLockVisible3 = await lockOverlay.isVisible();
  
  const quota3 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock visible:', isLockVisible3);
  console.log('📦 Third visit - Quota:', quota3);
  
  expect(isReportVisible3).toBe(false);
  expect(isLockVisible3).toBe(true);
  
  console.log('\n🔍 DIFFERENT COMPANY - Should reset quota');
  const appleUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
  await page.goto(appleUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const isReportVisibleApple = await reportContent.isVisible();
  const isLockVisibleApple = await lockOverlay.isVisible();
  
  const quotaApple = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📊 Apple visit - Report visible:', isReportVisibleApple);
  console.log('🔒 Apple visit - Lock visible:', isLockVisibleApple);
  console.log('📦 Apple visit - Quota:', quotaApple);
  
  expect(isReportVisibleApple).toBe(true);
  expect(isLockVisibleApple).toBe(false);
  
  console.log('\n🎯 FINAL RESULTS:');
  if (isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3 && isReportVisibleApple) {
    console.log('✅ 2-demo limitation system working perfectly!');
    console.log('  ✓ First two visits show full report');
    console.log('  ✓ Third visit shows lock overlay');
    console.log('  ✓ Different company resets quota');
  } else {
    console.log('❌ 2-demo limitation system not working correctly');
    console.log('  - First visit report:', isReportVisible1);
    console.log('  - Second visit report:', isReportVisible2);
    console.log('  - Third visit locked:', !isReportVisible3 && isLockVisible3);
    console.log('  - Apple visit reset:', isReportVisibleApple);
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'final-2-demo-test.png', fullPage: true });
  console.log('📸 Final test screenshot saved');
});
