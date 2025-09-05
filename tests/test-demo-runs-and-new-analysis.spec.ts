import { test, expect } from '@playwright/test';

test('Test Demo Runs and New Analysis Button', async ({ page }) => {
  console.log('🔍 Testing demo runs and new analysis button...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // Clear any existing quota
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
  });
  
  console.log('🔍 FIRST VISIT - Should show report and consume 1 quota');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Wait for quota consumption
  await page.waitForTimeout(3000);
  
  const firstQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 First visit quota:', firstQuota);
  
  const firstReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 First visit - Report visible:', firstReportVisible);
  
  // Test "New Analysis" button
  console.log('🔍 Testing "New Analysis" button...');
  const newAnalysisButton = page.locator('text=New Analysis').first();
  const newAnalysisVisible = await newAnalysisButton.isVisible();
  console.log('📊 New Analysis button visible:', newAnalysisVisible);
  
  if (newAnalysisVisible) {
    console.log('🖱️ Clicking New Analysis button...');
    const currentUrl = page.url();
    console.log('📊 Current URL before click:', currentUrl);
    
    await newAnalysisButton.click();
    await page.waitForTimeout(2000);
    
    const newUrl = page.url();
    console.log('📊 URL after New Analysis click:', newUrl);
    
    if (currentUrl !== newUrl) {
      console.log('❌ URL changed after New Analysis click - this should not happen');
    } else {
      console.log('✅ URL stayed the same after New Analysis click - correct behavior');
    }
  }
  
  console.log('🔍 SECOND VISIT - Should show report again and consume 1 more quota');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Wait for quota consumption
  await page.waitForTimeout(3000);
  
  const secondQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 Second visit quota:', secondQuota);
  
  const secondReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Second visit - Report visible:', secondReportVisible);
  
  console.log('🔍 THIRD VISIT - Should show lock overlay');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const thirdQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 Third visit quota:', thirdQuota);
  
  const thirdReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const thirdLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Third visit - Report visible:', thirdReportVisible);
  console.log('📊 Third visit - Lock visible:', thirdLockVisible);
  
  // Take screenshots
  await page.screenshot({ path: 'demo-runs-and-new-analysis-test.png' });
  
  console.log('🎯 DEMO RUNS AND NEW ANALYSIS TEST COMPLETE');
  console.log('📊 Results:');
  console.log('  - First visit report visible:', firstReportVisible);
  console.log('  - Second visit report visible:', secondReportVisible);
  console.log('  - Third visit lock visible:', thirdLockVisible);
  console.log('  - Quota progression:', firstQuota, '->', secondQuota, '->', thirdQuota);
});
