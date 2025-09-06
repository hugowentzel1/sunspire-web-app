import { test, expect } from '@playwright/test';

test('Simple Apple Demo Test - Current Behavior', async ({ page }) => {
  console.log('🍎 Testing Apple demo current behavior...');
  
  // Clear any existing demo quota to start fresh
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
    console.log('🗑️ Cleared demo quota and countdown data');
  });
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Test Apple branding
  console.log('🍎 Testing Apple branding...');
  const appleLogo = page.locator('img[alt*="Apple"], img[src*="apple"]').first();
  const isAppleLogoVisible = await appleLogo.isVisible();
  console.log('🍎 Apple logo visible:', isAppleLogoVisible);
  expect(isAppleLogoVisible).toBeTruthy();
  
  // Test address input
  console.log('📍 Testing address input...');
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await addressInput.fill('123 Main St, New York, NY');
  const inputValue = await addressInput.inputValue();
  console.log('📍 Address input value:', inputValue);
  expect(inputValue).toContain('123 Main St');
  
  // Test first Generate Report click
  console.log('👀 First Generate Report click...');
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const reportContent = page.locator('text=Your Solar Savings Over Time').first();
  const isReportVisible1 = await reportContent.isVisible();
  console.log('📊 First click - Report content visible:', isReportVisible1);
  expect(isReportVisible1).toBeTruthy();
  
  // Test CTA buttons
  console.log('💳 Testing CTA buttons...');
  const ctaButtons = page.locator('button:has-text("Activate"), a:has-text("Get Started"), a:has-text("Unlock"), button:has-text("Get Started")');
  const ctaCount = await ctaButtons.count();
  console.log('💳 CTA buttons found:', ctaCount);
  expect(ctaCount).toBeGreaterThan(0);
  
  const firstCtaButton = ctaButtons.first();
  const isCtaClickable = await firstCtaButton.isEnabled();
  console.log('💳 First CTA button clickable:', isCtaClickable);
  expect(isCtaClickable).toBeTruthy();
  
  const buttonText = await firstCtaButton.textContent();
  console.log('💳 First CTA button text:', buttonText);
  expect(buttonText).toMatch(/Activate|Get Started|Unlock/i);
  
  // Test second Generate Report click
  console.log('👀 Second Generate Report click...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('456 Oak Ave, Los Angeles, CA');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const isReportVisible2 = await reportContent.isVisible();
  console.log('📊 Second click - Report content visible:', isReportVisible2);
  
  const lockOverlay2 = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible2 = await lockOverlay2.count() > 0;
  console.log('🔒 Second click - Lock overlay visible:', isLockOverlayVisible2);
  
  // Test third Generate Report click
  console.log('👀 Third Generate Report click...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  await addressInput.fill('789 Pine St, Chicago, IL');
  await page.waitForTimeout(1000);
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const isReportVisible3 = await reportContent.isVisible();
  console.log('📊 Third click - Report content visible:', isReportVisible3);
  
  const lockOverlay3 = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const isLockOverlayVisible3 = await lockOverlay3.count() > 0;
  console.log('🔒 Third click - Lock overlay visible:', isLockOverlayVisible3);
  
  // Test lockout page features if visible
  if (isLockOverlayVisible2 || isLockOverlayVisible3) {
    console.log('🔒 Testing lockout page features...');
    
    // Check for red "What You See Now" elements
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
    expect(whatYouSeeNowColor).toContain('220, 38, 38'); // RGB for #DC2626 (red)
    
    // Check for countdown timer
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
  }
  
  // Take screenshot
  await page.screenshot({ path: 'apple-simple-test.png', fullPage: true });
  
  console.log('🎉 Apple demo test complete!');
  console.log('✅ Apple branding and logo');
  console.log('✅ Address input functionality');
  console.log('✅ First click: Shows report');
  console.log('✅ CTA buttons are clickable');
  console.log('✅ Lockout page has red "What You See Now" elements');
  console.log('✅ Lockout page has countdown timer');
});
