import { test, expect } from '@playwright/test';

test('Test Quota System Directly', async ({ page }) => {
  console.log('🔍 Testing quota system directly...');
  
  // Clear any existing quota
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
  });
  
  // Test the quota system directly
  const quotaResult = await page.evaluate(() => {
    // Simulate the quota system
    const KEY = 'demo_quota_v3';
    const allowed = 2;
    
    // Read current quota
    const map = JSON.parse(localStorage.getItem(KEY) || "{}");
    const link = 'https://sunspire-web-app.vercel.app/report?company=Tesla&demo=1';
    const currentRuns = map[link] ?? allowed;
    
    console.log('Initial quota:', currentRuns);
    
    // Consume one run
    const newRuns = Math.max(0, currentRuns - 1);
    map[link] = newRuns;
    localStorage.setItem(KEY, JSON.stringify(map));
    
    console.log('After consume:', newRuns);
    
    // Read again
    const finalMap = JSON.parse(localStorage.getItem(KEY) || "{}");
    const finalRuns = finalMap[link] ?? allowed;
    
    console.log('Final quota:', finalRuns);
    
    return {
      initial: currentRuns,
      afterConsume: newRuns,
      final: finalRuns
    };
  });
  
  console.log('📊 Quota test result:', quotaResult);
  
  // Now test with the actual report page
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('🔍 Testing with actual report page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const actualQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  
  console.log('📊 Actual quota after page load:', actualQuota);
  
  // Check if report is visible
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible:', reportVisible);
  
  // Check if lock is visible
  const lockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Lock visible:', lockVisible);
});
