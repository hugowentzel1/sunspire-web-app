import { test, expect } from '@playwright/test';

test('Simple Verification - Check Current State', async ({ page }) => {
  console.log('🔍 Simple verification test...');
  
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
  await page.waitForTimeout(5000);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check for removed elements
  const pricingText = page.locator('text=Full version from just $99/mo + $399 setup').first();
  const isPricingTextVisible1 = await pricingText.isVisible();
  
  const attributionText = page.locator('text=Estimates generated using NREL PVWatts® v8').first();
  const isAttributionTextVisible1 = await attributionText.isVisible();
  
  const copyDemoButton = page.locator('text=🚀 Activate on Your Domain').first();
  const isCopyDemoButtonVisible1 = await copyDemoButton.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('📊 First visit - Pricing text visible:', isPricingTextVisible1);
  console.log('📊 First visit - Attribution visible:', isAttributionTextVisible1);
  console.log('📊 First visit - Copy demo button visible:', isCopyDemoButtonVisible1);
  
  // Take screenshot
  await page.screenshot({ path: 'first-visit-simple.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked').first();
  const isLockVisible2 = await lockOverlay.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('📊 Second visit - Lock overlay visible:', isLockVisible2);
  
  // Take screenshot
  await page.screenshot({ path: 'second-visit-simple.png', fullPage: true });
  
  console.log('\n🔍 THIRD VISIT');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible3 = await reportContent.isVisible();
  const isLockVisible3 = await lockOverlay.isVisible();
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('📊 Third visit - Lock overlay visible:', isLockVisible3);
  
  // Take screenshot
  await page.screenshot({ path: 'third-visit-simple.png', fullPage: true });
  
  console.log('\n🎯 SIMPLE VERIFICATION RESULTS:');
  console.log('✅ First visit - Report visible:', isReportVisible1);
  console.log('✅ First visit - Elements removed:', !isPricingTextVisible1 && !isAttributionTextVisible1 && !isCopyDemoButtonVisible1);
  console.log('✅ Second visit - Locked:', !isReportVisible2 && isLockVisible2);
  console.log('✅ Third visit - Still locked:', !isReportVisible3 && isLockVisible3);
  
  if (isReportVisible1 && !isPricingTextVisible1 && !isAttributionTextVisible1 && !isCopyDemoButtonVisible1 && !isReportVisible2 && isLockVisible2 && !isReportVisible3 && isLockVisible3) {
    console.log('\n🎉 ALL CHECKS PASSED!');
    console.log('✅ Elements successfully removed from bottom');
    console.log('✅ 2-demo limitation working correctly');
    console.log('✅ Lock overlay showing after 2 visits');
  } else {
    console.log('\n❌ SOME CHECKS FAILED');
  }
});
