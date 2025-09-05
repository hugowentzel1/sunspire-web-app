import { test, expect } from '@playwright/test';

test('Debug Current State - Check Quota and Lock Overlay', async ({ page }) => {
  console.log('🔍 Debugging current state...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Wait for any quota consumption
  
  // Check quota
  const quota1 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked').first();
  const isLockVisible1 = await lockOverlay.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('🔒 First visit - Lock visible:', isLockVisible1);
  console.log('📦 First visit - Quota:', quota1);
  
  console.log('\n🔍 SECOND VISIT');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const quota2 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  const isReportVisible2 = await reportContent.isVisible();
  const isLockVisible2 = await lockOverlay.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('🔒 Second visit - Lock visible:', isLockVisible2);
  console.log('📦 Second visit - Quota:', quota2);
  
  console.log('\n🔍 THIRD VISIT');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const quota3 = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  const isReportVisible3 = await reportContent.isVisible();
  const isLockVisible3 = await lockOverlay.isVisible();
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock visible:', isLockVisible3);
  console.log('📦 Third visit - Quota:', quota3);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-current-state.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
  
  console.log('\n🎯 SUMMARY:');
  console.log('First visit - Report:', isReportVisible1, 'Lock:', isLockVisible1, 'Quota:', quota1);
  console.log('Second visit - Report:', isReportVisible2, 'Lock:', isLockVisible2, 'Quota:', quota2);
  console.log('Third visit - Report:', isReportVisible3, 'Lock:', isLockVisible3, 'Quota:', quota3);
});
