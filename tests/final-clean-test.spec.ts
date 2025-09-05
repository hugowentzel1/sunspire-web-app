import { test, expect } from '@playwright/test';

test('Final Clean Test - All Requirements Met', async ({ page }) => {
  console.log('🔍 Final clean test - verifying all requirements...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show report with clean footer');
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
  
  const pvwattsAttribution = page.locator('text=Estimates generated using NREL PVWatts® v8').first();
  const isPvwattsAttributionVisible1 = await pvwattsAttribution.isVisible();
  
  const googleAttribution = page.locator('text=Mapping & location data © Google').first();
  const isGoogleAttributionVisible1 = await googleAttribution.isVisible();
  
  // Check for KEPT elements (should be true)
  const pvwattsDisclaimer = page.locator('text=Estimates are informational only, based on modeled data (NREL PVWatts® v8 and current utility rates)').first();
  const isPvwattsDisclaimerVisible1 = await pvwattsDisclaimer.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible1);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible1);
  console.log('❌ PVWatts attribution visible (should be false):', isPvwattsAttributionVisible1);
  console.log('❌ Google attribution visible (should be false):', isGoogleAttributionVisible1);
  console.log('✅ PVWatts disclaimer visible (should be true):', isPvwattsDisclaimerVisible1);
  
  // Take screenshot
  await page.screenshot({ path: 'clean-first-visit.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT - Should show report again');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const isPricingTextVisible2 = await pricingText.isVisible();
  const isCopyDemoButtonVisible2 = await copyDemoButton.isVisible();
  const isPvwattsAttributionVisible2 = await pvwattsAttribution.isVisible();
  const isGoogleAttributionVisible2 = await googleAttribution.isVisible();
  const isPvwattsDisclaimerVisible2 = await pvwattsDisclaimer.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible2);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible2);
  console.log('❌ PVWatts attribution visible (should be false):', isPvwattsAttributionVisible2);
  console.log('❌ Google attribution visible (should be false):', isGoogleAttributionVisible2);
  console.log('✅ PVWatts disclaimer visible (should be true):', isPvwattsDisclaimerVisible2);
  
  // Take screenshot
  await page.screenshot({ path: 'clean-second-visit.png', fullPage: true });
  
  console.log('\n🔍 THIRD VISIT - Should show lock overlay with original styling');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible3 = await reportContent.isVisible();
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked').first();
  const isLockVisible3 = await lockOverlay.isVisible();
  
  // Check if "What You See Now" uses brand colors (not red)
  const whatYouSeeNow = page.locator('text=What You See Now').first();
  const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  // Check if "Blurred Data" uses brand colors (not red)
  const blurredData = page.locator('text=Blurred Data').first();
  const blurredDataColor = await blurredData.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock overlay visible:', isLockVisible3);
  console.log('🎨 Third visit - "What You See Now" color:', whatYouSeeNowColor);
  console.log('🎨 Third visit - "Blurred Data" color:', blurredDataColor);
  
  // Take screenshot
  await page.screenshot({ path: 'clean-third-visit.png', fullPage: true });
  
  console.log('\n🎯 FINAL CLEAN TEST RESULTS:');
  
  // Verify correct elements are removed from report page
  const pricingRemoved = !isPricingTextVisible1 && !isPricingTextVisible2;
  const buttonRemoved = !isCopyDemoButtonVisible1 && !isCopyDemoButtonVisible2;
  const attributionRemoved = !isPvwattsAttributionVisible1 && !isPvwattsAttributionVisible2 && !isGoogleAttributionVisible1 && !isGoogleAttributionVisible2;
  
  // Verify PVWatts disclaimer is kept on report page
  const pvwattsDisclaimerKept = isPvwattsDisclaimerVisible1 && isPvwattsDisclaimerVisible2;
  
  // Verify lockout system works (should allow 2 visits, lock on 3rd)
  const lockoutWorks = isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3;
  
  // Verify lock overlay uses brand colors (not hardcoded red)
  const usesBrandColors = !whatYouSeeNowColor.includes('220, 38, 38') && !blurredDataColor.includes('220, 38, 38');
  
  console.log('✅ Pricing text removed from report page:', pricingRemoved);
  console.log('✅ Copy demo button removed from report page:', buttonRemoved);
  console.log('✅ Attribution elements removed from report page:', attributionRemoved);
  console.log('✅ PVWatts disclaimer kept on report page:', pvwattsDisclaimerKept);
  console.log('✅ Lockout system works (2 visits then lock):', lockoutWorks);
  console.log('✅ Lock overlay uses brand colors (not red):', usesBrandColors);
  
  if (pricingRemoved && buttonRemoved && attributionRemoved && pvwattsDisclaimerKept && lockoutWorks && usesBrandColors) {
    console.log('\n🎉 ALL REQUIREMENTS MET!');
    console.log('✅ Pricing text and 🚀 button removed from report page');
    console.log('✅ Attribution elements removed from report page');
    console.log('✅ PVWatts disclaimer kept on report page');
    console.log('✅ 2-demo limitation working correctly');
    console.log('✅ Lock overlay reverted to original styling with brand colors');
  } else {
    console.log('\n❌ SOME REQUIREMENTS NOT MET');
    console.log('  - Pricing removed:', pricingRemoved);
    console.log('  - Button removed:', buttonRemoved);
    console.log('  - Attribution removed:', attributionRemoved);
    console.log('  - PVWatts disclaimer kept:', pvwattsDisclaimerKept);
    console.log('  - Lockout works:', lockoutWorks);
    console.log('  - Brand colors used:', usesBrandColors);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'clean-final-test.png', fullPage: true });
  console.log('📸 All test screenshots saved');
});
