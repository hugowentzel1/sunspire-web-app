import { test, expect } from '@playwright/test';

test.describe('Final Lockout Page Test - Complete System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing demo quota to start fresh
    await page.goto('https://sunspire-web-app.vercel.app');
    await page.evaluate(() => {
      localStorage.removeItem('demo_quota_v3');
      localStorage.removeItem('demo_countdown_deadline');
      console.log('🗑️ Cleared demo quota and countdown data');
    });
  });

  test('Test complete Microsoft demo flow - 2 runs then lockout page with timer', async ({ page }) => {
    console.log('🔒 Testing complete Microsoft demo flow...');
    
    // Step 1: First Generate Report click
    console.log('👀 Step 1: First Generate Report click...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('input[placeholder*="address"]').first();
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const reportContent = page.locator('text=Your Solar Savings Over Time').first();
    const isReportVisible = await reportContent.isVisible();
    console.log('📊 First click - Report content visible:', isReportVisible);
    expect(isReportVisible).toBeTruthy();
    
    // Step 2: Second Generate Report click
    console.log('👀 Step 2: Second Generate Report click...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second click - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Step 3: Third Generate Report click - should show alert
    console.log('🔒 Step 3: Third Generate Report click - should show alert...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    // Set up alert handler
    page.on('dialog', async dialog => {
      console.log('⚠️ Alert received:', dialog.message());
      expect(dialog.message()).toContain('Demo quota exhausted');
      await dialog.accept();
    });
    
    await generateButton.click();
    await page.waitForTimeout(2000);
    
    // Should still be on home page after alert
    const currentUrl = page.url();
    const isStillOnHomePage = !currentUrl.includes('/report');
    console.log('🏠 Still on home page after third click:', isStillOnHomePage);
    expect(isStillOnHomePage).toBeTruthy();
    
    // Step 4: Direct navigation to report page - should show lockout
    console.log('🔒 Step 4: Direct navigation to report page - should show lockout...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if lock overlay is visible
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check for lock content
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouGetLive = page.locator('text=What You Get Live').first();
    const isWhatYouSeeVisible = await whatYouSeeNow.isVisible();
    const isWhatYouGetVisible = await whatYouGetLive.isVisible();
    console.log('👁️ "What You See Now" visible:', isWhatYouSeeVisible);
    console.log('🚀 "What You Get Live" visible:', isWhatYouGetVisible);
    expect(isWhatYouSeeVisible).toBeTruthy();
    expect(isWhatYouGetVisible).toBeTruthy();
    
    // Check for countdown timer
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Check countdown timer content
    const countdownText = await countdownTimer.textContent();
    console.log('⏰ Countdown text:', countdownText);
    expect(countdownText).toMatch(/Expires in \d+d \d+h \d+m/);
    
    // Check if report content is hidden
    const isReportVisibleThird = await reportContent.isVisible();
    console.log('📊 Third visit - Report content visible:', isReportVisibleThird);
    expect(isReportVisibleThird).toBeFalsy();
    
    // Check CTA button on lockout page
    const ctaButton = page.locator('button:has-text("Activate on Your Domain")').first();
    const isCtaVisible = await ctaButton.isVisible();
    console.log('🛒 CTA button visible on lockout page:', isCtaVisible);
    expect(isCtaVisible).toBeTruthy();
    
    // Test CTA button click
    await ctaButton.click();
    await page.waitForTimeout(3000);
    
    // Check if redirected to Stripe
    const finalUrl = page.url();
    const isStripeUrl = finalUrl.includes('stripe.com') || finalUrl.includes('checkout');
    console.log('🛒 Redirected to Stripe:', isStripeUrl);
    expect(isStripeUrl).toBeTruthy();
    
    // Take final screenshot
    await page.screenshot({ path: 'final-lockout-test-microsoft.png', fullPage: true });
    
    console.log('🎉 Complete Microsoft demo flow works perfectly!');
  });

  test('Test Apple demo flow - 2 runs then lockout page', async ({ page }) => {
    console.log('🔒 Testing Apple demo flow...');
    
    // Exhaust quota with 2 clicks
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('input[placeholder*="address"]').first();
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
    
    // First click
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Second click
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Third click - should show alert
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    page.on('dialog', async dialog => {
      console.log('⚠️ Alert received:', dialog.message());
      await dialog.accept();
    });
    
    await generateButton.click();
    await page.waitForTimeout(2000);
    
    // Direct navigation to report page - should show lockout
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check lockout page
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Apple lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Apple countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ path: 'final-lockout-test-apple.png', fullPage: true });
    
    console.log('🎉 Apple demo flow works perfectly!');
  });

  test('Test Tesla demo flow - 2 runs then lockout page', async ({ page }) => {
    console.log('🔒 Testing Tesla demo flow...');
    
    // Exhaust quota with 2 clicks
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    const addressInput = page.locator('input[placeholder*="address"]').first();
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
    
    // First click
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Second click
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Third click - should show alert
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    page.on('dialog', async dialog => {
      console.log('⚠️ Alert received:', dialog.message());
      await dialog.accept();
    });
    
    await generateButton.click();
    await page.waitForTimeout(2000);
    
    // Direct navigation to report page - should show lockout
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check lockout page
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Tesla lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Tesla countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ path: 'final-lockout-test-tesla.png', fullPage: true });
    
    console.log('🎉 Tesla demo flow works perfectly!');
  });
});
