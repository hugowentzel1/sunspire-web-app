import { test, expect } from '@playwright/test';

test('Live Site - Full Demo Flow (2 Attempts + Lock)', async ({ page }) => {
  console.log('\n🎬 LIVE SITE - FULL DEMO FLOW TEST');
  
  const baseUrl = 'https://sunspire-web-app.vercel.app';
  const testUrl = `${baseUrl}/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&company=Netflix&demo=1`;
  
  // Clear localStorage to start fresh
  await page.goto(baseUrl);
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared localStorage');
  });
  
  console.log('\n📊 ATTEMPT 1: First Demo Visit');
  console.log('🔗 URL:', testUrl);
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check first visit
  const attempt1 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 1 Results:');
  console.log('  ✅ Report content visible:', attempt1.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt1.hasLockOverlay);
  console.log('  📦 Quota data:', attempt1.quota);
  console.log('  📄 Page content preview:', attempt1.bodyText);
  
  // Verify first attempt shows report, not lock
  expect(attempt1.hasReportContent).toBe(true);
  expect(attempt1.hasLockOverlay).toBe(false);
  
  console.log('\n📊 ATTEMPT 2: Second Demo Visit');
  
  // Navigate to a different address to trigger second demo
  const testUrl2 = `${baseUrl}/report?address=456%20Oak%20St&lat=40.7589&lng=-73.9851&company=Netflix&demo=1`;
  console.log('🔗 URL:', testUrl2);
  
  await page.goto(testUrl2);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check second visit
  const attempt2 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 2 Results:');
  console.log('  ✅ Report content visible:', attempt2.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt2.hasLockOverlay);
  console.log('  📦 Quota data:', attempt2.quota);
  console.log('  📄 Page content preview:', attempt2.bodyText);
  
  // Verify second attempt shows report, not lock
  expect(attempt2.hasReportContent).toBe(true);
  expect(attempt2.hasLockOverlay).toBe(false);
  
  console.log('\n📊 ATTEMPT 3: Third Visit (Should Show Lock)');
  
  // Navigate to a third address to trigger lock
  const testUrl3 = `${baseUrl}/report?address=789%20Pine%20St&lat=40.7505&lng=-73.9934&company=Netflix&demo=1`;
  console.log('🔗 URL:', testUrl3);
  
  await page.goto(testUrl3);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check third visit
  const attempt3 = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasReportContent = bodyText.includes('Comprehensive analysis') || bodyText.includes('System Size') || bodyText.includes('Annual Production');
    const hasLockOverlay = bodyText.includes('What You See Now') || bodyText.includes('What You Get Live');
    const quota = localStorage.getItem('demo_quota_v3');
    const parsedQuota = quota ? JSON.parse(quota) : null;
    
    return {
      hasReportContent,
      hasLockOverlay,
      quota: parsedQuota,
      bodyText: bodyText.substring(0, 500)
    };
  });
  
  console.log('📊 Attempt 3 Results:');
  console.log('  ✅ Report content visible:', attempt3.hasReportContent);
  console.log('  ❌ Lock overlay visible:', attempt3.hasLockOverlay);
  console.log('  📦 Quota data:', attempt3.quota);
  console.log('  📄 Page content preview:', attempt3.bodyText);
  
  // Verify third attempt shows lock overlay
  expect(attempt3.hasLockOverlay).toBe(true);
  expect(attempt3.hasReportContent).toBe(false);
  
  console.log('\n🎯 FINAL VERIFICATION:');
  console.log('=====================================');
  console.log('✅ Attempt 1: Report content shown');
  console.log('✅ Attempt 2: Report content shown');
  console.log('✅ Attempt 3: Lock overlay shown');
  console.log('✅ Demo quota system working correctly');
  
  console.log('\n🎉 ALL DEMO ATTEMPTS WORKING PERFECTLY! 🎉');
});
