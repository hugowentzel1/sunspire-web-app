import { test, expect } from '@playwright/test';

test('Debug Quota System - Detailed Analysis', async ({ page }) => {
  console.log('🔍 Detailed quota system debugging...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared all localStorage');
  });
  
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('Demo quota') || msg.text().includes('🔒')) {
      consoleMessages.push(msg.text());
      console.log('📝 Console:', msg.text());
    }
  });
  
  // First view
  console.log('👀 First view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check localStorage after first view
  const quotaAfterFirst = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📦 After first view:', quotaAfterFirst);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisibleFirst = await reportContent.isVisible();
  console.log('📊 First view - Report content visible:', isReportVisibleFirst);
  
  // Check for lock overlay
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const isLockVisibleFirst = await whatYouSeeNow.isVisible();
  console.log('🔒 First view - Lock overlay visible:', isLockVisibleFirst);
  
  // Second view
  console.log('👀 Second view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const quotaAfterSecond = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📦 After second view:', quotaAfterSecond);
  
  const isReportVisibleSecond = await reportContent.isVisible();
  console.log('📊 Second view - Report content visible:', isReportVisibleSecond);
  
  const isLockVisibleSecond = await whatYouSeeNow.isVisible();
  console.log('🔒 Second view - Lock overlay visible:', isLockVisibleSecond);
  
  // Third view
  console.log('👀 Third view...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  const quotaAfterThird = await page.evaluate(() => {
    const demoQuota = localStorage.getItem('demo_quota_v3');
    return demoQuota ? JSON.parse(demoQuota) : null;
  });
  
  console.log('📦 After third view:', quotaAfterThird);
  
  const isReportVisibleThird = await reportContent.isVisible();
  console.log('📊 Third view - Report content visible:', isReportVisibleThird);
  
  const isLockVisibleThird = await whatYouSeeNow.isVisible();
  console.log('🔒 Third view - Lock overlay visible:', isLockVisibleThird);
  
  console.log('\n🎯 ANALYSIS:');
  console.log('First view - Report visible:', isReportVisibleFirst, 'Lock visible:', isLockVisibleFirst);
  console.log('Second view - Report visible:', isReportVisibleSecond, 'Lock visible:', isLockVisibleSecond);
  console.log('Third view - Report visible:', isReportVisibleThird, 'Lock visible:', isLockVisibleThird);
  
  if (isReportVisibleFirst && isReportVisibleSecond && !isReportVisibleThird && isLockVisibleThird) {
    console.log('✅ 2-demo limitation working correctly!');
  } else if (isReportVisibleFirst && !isReportVisibleSecond && isLockVisibleSecond) {
    console.log('❌ Locking after 1 view instead of 2');
  } else {
    console.log('❌ System not working as expected');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'debug-quota-detailed.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
});
