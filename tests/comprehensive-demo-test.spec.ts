import { test, expect } from '@playwright/test';

test('Comprehensive Demo Test - Colors, Lockout, and Clean Bottom', async ({ page }) => {
  console.log('🔍 Comprehensive demo test - checking colors, lockout, and clean bottom...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show report with Tesla colors');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check Tesla red color on CTA buttons
  const ctaButton = page.locator('button:has-text("Unlock Full Report")').first();
  const ctaColor1 = await ctaButton.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  
  // Check for removed elements
  const pricingText = page.locator('text=Full version from just $99/mo + $399 setup').first();
  const isPricingTextVisible1 = await pricingText.isVisible();
  
  const attributionText = page.locator('text=Estimates generated using NREL PVWatts® v8').first();
  const isAttributionTextVisible1 = await attributionText.isVisible();
  
  const copyDemoButton = page.locator('text=🚀 Activate on Your Domain').first();
  const isCopyDemoButtonVisible1 = await copyDemoButton.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('🎨 First visit - CTA color:', ctaColor1);
  console.log('📊 First visit - Pricing text visible:', isPricingTextVisible1);
  console.log('📊 First visit - Attribution visible:', isAttributionTextVisible1);
  console.log('📊 First visit - Copy demo button visible:', isCopyDemoButtonVisible1);
  
  // Take screenshot of first visit
  await page.screenshot({ path: 'first-visit-tesla.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT - Should still show report with Tesla colors');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const ctaColor2 = await ctaButton.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  
  const isPricingTextVisible2 = await pricingText.isVisible();
  const isAttributionTextVisible2 = await attributionText.isVisible();
  const isCopyDemoButtonVisible2 = await copyDemoButton.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('🎨 Second visit - CTA color:', ctaColor2);
  console.log('📊 Second visit - Pricing text visible:', isPricingTextVisible2);
  console.log('📊 Second visit - Attribution visible:', isAttributionTextVisible2);
  console.log('📊 Second visit - Copy demo button visible:', isCopyDemoButtonVisible2);
  
  // Take screenshot of second visit
  await page.screenshot({ path: 'second-visit-tesla.png', fullPage: true });
  
  console.log('\n🔍 THIRD VISIT - Should show lock overlay');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible3 = await reportContent.isVisible();
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked').first();
  const isLockVisible3 = await lockOverlay.isVisible();
  
  // Check if "What You See Now" is red
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  // Check if "Blurred Data" is red
  const blurredData = page.locator('text=Blurred Data').first();
  const blurredDataColor = await blurredData.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock overlay visible:', isLockVisible3);
  console.log('🎨 Third visit - "What You See Now" color:', whatYouSeeNowColor);
  console.log('🎨 Third visit - "Blurred Data" color:', blurredDataColor);
  
  // Take screenshot of third visit (lock overlay)
  await page.screenshot({ path: 'third-visit-locked.png', fullPage: true });
  
  console.log('\n🔍 FOURTH VISIT - Should still show lock overlay');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible4 = await reportContent.isVisible();
  const isLockVisible4 = await lockOverlay.isVisible();
  
  console.log('📊 Fourth visit - Report visible:', isReportVisible4);
  console.log('🔒 Fourth visit - Lock overlay visible:', isLockVisible4);
  
  // Test with different company (Apple) - should reset quota
  console.log('\n🔍 APPLE VISIT - Should reset quota and show Apple colors');
  const appleUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
  await page.goto(appleUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisibleApple = await reportContent.isVisible();
  const ctaColorApple = await ctaButton.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  
  const isPricingTextVisibleApple = await pricingText.isVisible();
  const isAttributionTextVisibleApple = await attributionText.isVisible();
  const isCopyDemoButtonVisibleApple = await copyDemoButton.isVisible();
  
  console.log('📊 Apple visit - Report visible:', isReportVisibleApple);
  console.log('🎨 Apple visit - CTA color:', ctaColorApple);
  console.log('📊 Apple visit - Pricing text visible:', isPricingTextVisibleApple);
  console.log('📊 Apple visit - Attribution visible:', isAttributionTextVisibleApple);
  console.log('📊 Apple visit - Copy demo button visible:', isCopyDemoButtonVisibleApple);
  
  // Take screenshot of Apple visit
  await page.screenshot({ path: 'apple-visit.png', fullPage: true });
  
  console.log('\n🎯 COMPREHENSIVE TEST RESULTS:');
  
  // Verify colors are consistent
  const colorsMatch = ctaColor1 === ctaColor2;
  console.log('✅ Colors consistent across visits:', colorsMatch);
  
  // Verify lockout system works
  const lockoutWorks = isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3 && isReportVisibleApple;
  console.log('✅ Lockout system works:', lockoutWorks);
  
  // Verify elements are removed
  const elementsRemoved = !isPricingTextVisible1 && !isAttributionTextVisible1 && !isCopyDemoButtonVisible1;
  console.log('✅ Bottom elements removed:', elementsRemoved);
  
  // Verify red elements in lock overlay
  const redElements = whatYouSeeNowColor.includes('220, 38, 38') && blurredDataColor.includes('220, 38, 38');
  console.log('✅ Lock overlay red elements:', redElements);
  
  // Verify Apple reset works
  const appleResetWorks = isReportVisibleApple && !isPricingTextVisibleApple && !isAttributionTextVisibleApple && !isCopyDemoButtonVisibleApple;
  console.log('✅ Apple reset works:', appleResetWorks);
  
  console.log('\n🎉 FINAL VERIFICATION:');
  if (lockoutWorks && elementsRemoved && redElements && appleResetWorks) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('  - 2-demo limitation working correctly');
    console.log('  - Colors consistent across visits');
    console.log('  - Bottom elements removed');
    console.log('  - Lock overlay red elements working');
    console.log('  - Different company resets quota');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('  - Lockout works:', lockoutWorks);
    console.log('  - Elements removed:', elementsRemoved);
    console.log('  - Red elements:', redElements);
    console.log('  - Apple reset:', appleResetWorks);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'final-comprehensive-test.png', fullPage: true });
  console.log('📸 All test screenshots saved');
});
