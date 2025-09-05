import { test, expect } from '@playwright/test';

test('Test Lock Overlay - Red Elements and PVWatts Attribution', async ({ page }) => {
  console.log('🔍 Testing lock overlay with red elements and PVWatts attribution...');
  
  // Clear localStorage to ensure we get the lock overlay
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Visit the demo URL multiple times to trigger lock overlay
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // First visit - should show report
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Second visit - should show report
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Third visit - should show lock overlay
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked').first();
  const isLockVisible = await lockOverlay.isVisible();
  
  if (!isLockVisible) {
    console.log('❌ Lock overlay not visible - quota system may not be working');
    await page.screenshot({ path: 'lock-overlay-not-visible.png', fullPage: true });
    return;
  }
  
  console.log('✅ Lock overlay is visible');
  
  // Check "What You See Now" text color (should be red #DC2626)
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
  
  // Check "Blurred Data" text color (should be red #DC2626)
  const blurredData = page.locator('text=Blurred Data').first();
  const blurredDataColor = await blurredData.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  console.log('🎨 "Blurred Data" color:', blurredDataColor);
  
  // Check box border color (should be red #FCA5A5)
  const whatYouSeeNowBox = page.locator('text=What You See Now').first().locator('..').locator('..').locator('div').nth(1);
  const boxBorderColor = await whatYouSeeNowBox.evaluate((el) => {
    return window.getComputedStyle(el).borderColor;
  });
  
  console.log('🎨 Box border color:', boxBorderColor);
  
  // Check if PVWatts attribution is present
  const pvwattsText = page.locator('text=NREL PVWatts® v8').first();
  const isPvwattsVisible = await pvwattsText.isVisible();
  
  console.log('📊 PVWatts attribution visible:', isPvwattsVisible);
  
  // Check if the full attribution text is present
  const attributionText = page.locator('text=Estimates are informational only, based on modeled data').first();
  const isAttributionVisible = await attributionText.isVisible();
  
  console.log('📊 Full attribution visible:', isAttributionVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'lock-overlay-red-elements-test.png', fullPage: true });
  console.log('📸 Test screenshot saved');
  
  // Verify results
  expect(isLockVisible).toBe(true);
  expect(isPvwattsVisible).toBe(true);
  expect(isAttributionVisible).toBe(true);
  
  console.log('\n🎯 TEST RESULTS:');
  console.log('✅ Lock overlay visible:', isLockVisible);
  console.log('✅ "What You See Now" color:', whatYouSeeNowColor);
  console.log('✅ "Blurred Data" color:', blurredDataColor);
  console.log('✅ Box border color:', boxBorderColor);
  console.log('✅ PVWatts attribution visible:', isPvwattsVisible);
  console.log('✅ Full attribution visible:', isAttributionVisible);
  
  if (whatYouSeeNowColor.includes('220, 38, 38') || whatYouSeeNowColor.includes('#dc2626')) {
    console.log('✅ "What You See Now" is red');
  } else {
    console.log('❌ "What You See Now" is not red');
  }
  
  if (blurredDataColor.includes('220, 38, 38') || blurredDataColor.includes('#dc2626')) {
    console.log('✅ "Blurred Data" is red');
  } else {
    console.log('❌ "Blurred Data" is not red');
  }
});
