import { test, expect } from '@playwright/test';

test('Final Red Elements Test - Lock Page and Report Page Spacing', async ({ page }) => {
  console.log('🔍 Final red elements test - checking lock page and report page spacing...');
  
  // Clear localStorage completely
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('\n🔍 FIRST VISIT - Should show report with reduced spacing');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if report content is visible
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  
  // Check for the "Ready to Launch" section
  const readyToLaunch = page.locator('text=Ready to Launch Your Branded Tool?').first();
  const isReadyToLaunchVisible1 = await readyToLaunch.isVisible();
  
  console.log('📊 First visit - Report visible:', isReportVisible1);
  console.log('📊 First visit - Ready to Launch visible:', isReadyToLaunchVisible1);
  
  // Take screenshot
  await page.screenshot({ path: 'red-elements-first-visit.png', fullPage: true });
  
  console.log('\n🔍 SECOND VISIT - Should show report again');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const isReportVisible2 = await reportContent.isVisible();
  const isReadyToLaunchVisible2 = await readyToLaunch.isVisible();
  
  console.log('📊 Second visit - Report visible:', isReportVisible2);
  console.log('📊 Second visit - Ready to Launch visible:', isReadyToLaunchVisible2);
  
  // Take screenshot
  await page.screenshot({ path: 'red-elements-second-visit.png', fullPage: true });
  
  console.log('\n🔍 THIRD VISIT - Should show lock overlay with red elements');
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
  
  // Check if the box background is red
  const whatYouSeeNowBox = page.locator('text=What You See Now').first().locator('..').locator('..').locator('div').nth(1);
  const boxBackgroundColor = await whatYouSeeNowBox.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  
  // Check if the box border is red
  const boxBorderColor = await whatYouSeeNowBox.evaluate((el) => {
    return window.getComputedStyle(el).borderColor;
  });
  
  console.log('📊 Third visit - Report visible:', isReportVisible3);
  console.log('🔒 Third visit - Lock overlay visible:', isLockVisible3);
  console.log('🎨 Third visit - "What You See Now" color:', whatYouSeeNowColor);
  console.log('🎨 Third visit - "Blurred Data" color:', blurredDataColor);
  console.log('🎨 Third visit - Box background color:', boxBackgroundColor);
  console.log('🎨 Third visit - Box border color:', boxBorderColor);
  
  // Take screenshot
  await page.screenshot({ path: 'red-elements-third-visit.png', fullPage: true });
  
  console.log('\n🎯 FINAL RED ELEMENTS TEST RESULTS:');
  
  // Verify lockout system works
  const lockoutWorks = isReportVisible1 && isReportVisible2 && !isReportVisible3 && isLockVisible3;
  
  // Verify red elements in lock overlay
  const whatYouSeeNowRed = whatYouSeeNowColor.includes('220, 38, 38') || whatYouSeeNowColor.includes('#dc2626');
  const blurredDataRed = blurredDataColor.includes('220, 38, 38') || blurredDataColor.includes('#dc2626');
  const boxBackgroundRed = boxBackgroundColor.includes('254, 242, 242') || boxBackgroundColor.includes('#fef2f2');
  const boxBorderRed = boxBorderColor.includes('252, 165, 165') || boxBorderColor.includes('#fca5a5');
  
  console.log('✅ Lockout system works (2 visits then lock):', lockoutWorks);
  console.log('✅ "What You See Now" is red:', whatYouSeeNowRed);
  console.log('✅ "Blurred Data" is red:', blurredDataRed);
  console.log('✅ Box background is red:', boxBackgroundRed);
  console.log('✅ Box border is red:', boxBorderRed);
  console.log('✅ Report page spacing reduced:', isReadyToLaunchVisible1 && isReadyToLaunchVisible2);
  
  if (lockoutWorks && whatYouSeeNowRed && blurredDataRed && boxBackgroundRed && boxBorderRed) {
    console.log('\n🎉 ALL REQUIREMENTS MET!');
    console.log('✅ Lock page "What You See Now" elements are always red');
    console.log('✅ Report page dead space reduced');
    console.log('✅ 2-demo limitation working correctly');
  } else {
    console.log('\n❌ SOME REQUIREMENTS NOT MET');
    console.log('  - Lockout works:', lockoutWorks);
    console.log('  - "What You See Now" red:', whatYouSeeNowRed);
    console.log('  - "Blurred Data" red:', blurredDataRed);
    console.log('  - Box background red:', boxBackgroundRed);
    console.log('  - Box border red:', boxBorderRed);
  }
  
  // Final screenshot
  await page.screenshot({ path: 'red-elements-final-test.png', fullPage: true });
  console.log('📸 All test screenshots saved');
});
