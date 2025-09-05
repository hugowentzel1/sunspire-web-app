import { test, expect } from '@playwright/test';

test('Final Verification - Correct Elements Removed and Kept', async ({ page }) => {
  console.log('🔍 Final verification - checking correct elements are removed/kept...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show report with correct elements');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check for REMOVED elements (should be false)
  const pricingText = page.locator('text=Full version from just $99/mo + $399 setup').first();
  const isPricingTextVisible1 = await pricingText.isVisible();
  
  const copyDemoButton = page.locator('text=🚀 Activate on Your Domain').first();
  const isCopyDemoButtonVisible1 = await copyDemoButton.isVisible();
  
  // Check for KEPT elements (should be true)
  const pvwattsText = page.locator('text=Estimates generated using NREL PVWatts® v8').first();
  const isPvwattsTextVisible1 = await pvwattsText.isVisible();
  
  const googleText = page.locator('text=Mapping & location data © Google').first();
  const isGoogleTextVisible1 = await googleText.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible1);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible1);
  console.log('✅ PVWatts text visible (should be true):', isPvwattsTextVisible1);
  console.log('✅ Google text visible (should be true):', isGoogleTextVisible1);
  
  // Take screenshot
  await page.screenshot({ path: 'first-visit-final.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT - Should show report again');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const isPricingTextVisible2 = await pricingText.isVisible();
  const isCopyDemoButtonVisible2 = await copyDemoButton.isVisible();
  const isPvwattsTextVisible2 = await pvwattsText.isVisible();
  const isGoogleTextVisible2 = await googleText.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible2);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible2);
  console.log('✅ PVWatts text visible (should be true):', isPvwattsTextVisible2);
  console.log('✅ Google text visible (should be true):', isGoogleTextVisible2);
  
  // Take screenshot
  await page.screenshot({ path: 'second-visit-final.png', fullPage: true });
  
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
  
  // Take screenshot
  await page.screenshot({ path: 'third-visit-final.png', fullPage: true });
  
  console.log('\n🎯 FINAL VERIFICATION RESULTS:');
  
  // Verify correct elements are removed
  const pricingRemoved = !isPricingTextVisible1 && !isPricingTextVisible2;
  const buttonRemoved = !isCopyDemoButtonVisible1 && !isCopyDemoButtonVisible2;
  
  // Verify correct elements are kept
  const pvwattsKept = isPvwattsTextVisible1 && isPvwattsTextVisible2;
  const googleKept = isGoogleTextVisible1 && isGoogleTextVisible2;
  
  // Verify lockout system works
  const lockoutWorks = isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3;
  
  // Verify red elements in lock overlay
  const redElements = whatYouSeeNowColor.includes('220, 38, 38') && blurredDataColor.includes('220, 38, 38');
  
  console.log('✅ Pricing text removed:', pricingRemoved);
  console.log('✅ Copy demo button removed:', buttonRemoved);
  console.log('✅ PVWatts text kept:', pvwattsKept);
  console.log('✅ Google text kept:', googleKept);
  console.log('✅ Lockout system works:', lockoutWorks);
  console.log('✅ Lock overlay red elements:', redElements);
  
  if (pricingRemoved && buttonRemoved && pvwattsKept && googleKept && lockoutWorks && redElements) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Correct elements removed (pricing text and 🚀 button)');
    console.log('✅ Correct elements kept (PVWatts and Google attribution)');
    console.log('✅ 2-demo limitation working correctly');
    console.log('✅ Lock overlay red elements working');
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('  - Pricing removed:', pricingRemoved);
    console.log('  - Button removed:', buttonRemoved);
    console.log('  - PVWatts kept:', pvwattsKept);
    console.log('  - Google kept:', googleKept);
    console.log('  - Lockout works:', lockoutWorks);
    console.log('  - Red elements:', redElements);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'final-verification-complete.png', fullPage: true });
  console.log('📸 All test screenshots saved');
});