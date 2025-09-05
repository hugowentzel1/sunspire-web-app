import { test, expect } from '@playwright/test';

test('Final Test - Original PVWatts Disclaimer', async ({ page }) => {
  console.log('🔍 Final test - verifying original PVWatts disclaimer...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show report with original PVWatts disclaimer');
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
  
  // Check for original PVWatts disclaimer (should be true)
  const originalPvwattsText = page.locator('text=Estimates are informational only, based on modeled data (NREL PVWatts® v8 and current utility rates)').first();
  const isOriginalPvwattsVisible1 = await originalPvwattsText.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible1);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible1);
  console.log('✅ Original PVWatts disclaimer visible (should be true):', isOriginalPvwattsVisible1);
  
  // Take screenshot
  await page.screenshot({ path: 'original-pvwatts-first.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT - Should show report again');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const isPricingTextVisible2 = await pricingText.isVisible();
  const isCopyDemoButtonVisible2 = await copyDemoButton.isVisible();
  const isOriginalPvwattsVisible2 = await originalPvwattsText.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('❌ Pricing text visible (should be false):', isPricingTextVisible2);
  console.log('❌ Copy demo button visible (should be false):', isCopyDemoButtonVisible2);
  console.log('✅ Original PVWatts disclaimer visible (should be true):', isOriginalPvwattsVisible2);
  
  // Take screenshot
  await page.screenshot({ path: 'original-pvwatts-second.png', fullPage: true });
  
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
  
  // Check that PVWatts disclaimer is NOT on lock page
  const lockPvwatts = page.locator('text=Estimates are informational only, based on modeled data').first();
  const isLockPvwattsVisible = await lockPvwatts.isVisible();
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock overlay visible:', isLockVisible3);
  console.log('🎨 Third visit - "What You See Now" color:', whatYouSeeNowColor);
  console.log('🎨 Third visit - "Blurred Data" color:', blurredDataColor);
  console.log('❌ Lock page PVWatts visible (should be false):', isLockPvwattsVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'original-pvwatts-third.png', fullPage: true });
  
  console.log('\n🎯 FINAL ORIGINAL PVWATTS TEST RESULTS:');
  
  // Verify correct elements are removed from report page
  const pricingRemoved = !isPricingTextVisible1 && !isPricingTextVisible2;
  const buttonRemoved = !isCopyDemoButtonVisible1 && !isCopyDemoButtonVisible2;
  
  // Verify original PVWatts disclaimer is kept on report page
  const originalPvwattsKept = isOriginalPvwattsVisible1 && isOriginalPvwattsVisible2;
  
  // Verify lockout system works (should allow 2 visits, lock on 3rd)
  const lockoutWorks = isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3;
  
  // Verify red elements in lock overlay
  const redElements = whatYouSeeNowColor.includes('220, 38, 38') && blurredDataColor.includes('220, 38, 38');
  
  // Verify PVWatts disclaimer is NOT on lock page
  const lockPvwattsRemoved = !isLockPvwattsVisible;
  
  console.log('✅ Pricing text removed from report page:', pricingRemoved);
  console.log('✅ Copy demo button removed from report page:', buttonRemoved);
  console.log('✅ Original PVWatts disclaimer kept on report page:', originalPvwattsKept);
  console.log('✅ Lockout system works (2 visits then lock):', lockoutWorks);
  console.log('✅ Lock overlay red elements:', redElements);
  console.log('✅ PVWatts disclaimer removed from lock page:', lockPvwattsRemoved);
  
  if (pricingRemoved && buttonRemoved && originalPvwattsKept && lockoutWorks && redElements && lockPvwattsRemoved) {
    console.log('\n🎉 ALL REQUIREMENTS MET!');
    console.log('✅ Pricing text and 🚀 button removed from report page');
    console.log('✅ Original PVWatts disclaimer kept on report page');
    console.log('✅ 2-demo limitation working correctly');
    console.log('✅ Lock overlay red elements working');
    console.log('✅ PVWatts disclaimer removed from lock page');
  } else {
    console.log('\n❌ SOME REQUIREMENTS NOT MET');
    console.log('  - Pricing removed:', pricingRemoved);
    console.log('  - Button removed:', buttonRemoved);
    console.log('  - Original PVWatts kept:', originalPvwattsKept);
    console.log('  - Lockout works:', lockoutWorks);
    console.log('  - Red elements:', redElements);
    console.log('  - Lock PVWatts removed:', lockPvwattsRemoved);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'original-pvwatts-final.png', fullPage: true });
  console.log('📸 All test screenshots saved');
});
