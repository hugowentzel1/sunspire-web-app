import { test, expect } from '@playwright/test';

test('Debug Footer Elements - Check What\'s Actually There', async ({ page }) => {
  console.log('🔍 Debugging footer elements...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if report content is visible (not locked)
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible = await reportContent.isVisible();
  
  if (!isReportVisible) {
    console.log('❌ Report content not visible - may be locked');
    await page.screenshot({ path: 'report-not-visible-debug.png', fullPage: true });
    return;
  }
  
  console.log('✅ Report content is visible');
  
  // Check for all possible button texts
  const allButtons = await page.locator('button').all();
  console.log('🔍 Found buttons:');
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    console.log(`  Button ${i}: "${text}"`);
  }
  
  // Check for "Activate on Your Domain" text anywhere
  const activateText = page.locator('text=Activate on Your Domain').first();
  const isActivateTextVisible = await activateText.isVisible();
  console.log('📊 "Activate on Your Domain" text visible:', isActivateTextVisible);
  
  // Check for emoji
  const emoji = page.locator('text=🚀').first();
  const isEmojiVisible = await emoji.isVisible();
  console.log('📊 🚀 emoji visible:', isEmojiVisible);
  
  // Check for disclaimer text
  const disclaimer = page.locator('text=Estimates are informational only').first();
  const isDisclaimerVisible = await disclaimer.isVisible();
  console.log('📊 Disclaimer visible:', isDisclaimerVisible);
  
  // Check for PVWatts text
  const pvwatts = page.locator('text=PVWatts').first();
  const isPvwattsVisible = await pvwatts.isVisible();
  console.log('📊 PVWatts visible:', isPvwattsVisible);
  
  // Check for Google text
  const google = page.locator('text=Google').first();
  const isGoogleVisible = await google.isVisible();
  console.log('📊 Google visible:', isGoogleVisible);
  
  // Get page content to see what's actually there
  const pageContent = await page.content();
  const hasCopyDemoButton = pageContent.includes('🚀 Activate on Your Domain');
  const hasDisclaimer = pageContent.includes('Estimates are informational only');
  const hasPvwatts = pageContent.includes('PVWatts');
  
  console.log('\n🔍 Page content analysis:');
  console.log('📊 Contains "🚀 Activate on Your Domain":', hasCopyDemoButton);
  console.log('📊 Contains disclaimer text:', hasDisclaimer);
  console.log('📊 Contains PVWatts:', hasPvwatts);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-footer-elements.png', fullPage: true });
  console.log('📸 Debug screenshot saved');
  
  console.log('\n🎯 DEBUG RESULTS:');
  console.log('✅ Report visible:', isReportVisible);
  console.log('✅ "Activate on Your Domain" visible:', isActivateTextVisible);
  console.log('✅ 🚀 emoji visible:', isEmojiVisible);
  console.log('✅ Disclaimer visible:', isDisclaimerVisible);
  console.log('✅ PVWatts visible:', isPvwattsVisible);
  console.log('✅ Google visible:', isGoogleVisible);
  console.log('✅ Page contains copy demo button:', hasCopyDemoButton);
  console.log('✅ Page contains disclaimer:', hasDisclaimer);
  console.log('✅ Page contains PVWatts:', hasPvwatts);
});
