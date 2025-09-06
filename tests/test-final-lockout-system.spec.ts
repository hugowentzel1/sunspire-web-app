import { test, expect } from '@playwright/test';

test.describe('Final Lockout System - Original Design from e66b42b', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing demo quota to start fresh
    await page.goto('https://sunspire-web-app.vercel.app');
    await page.evaluate(() => {
      localStorage.removeItem('demo_quota_v3');
      localStorage.removeItem('demo_countdown_deadline');
      console.log('🗑️ Cleared demo quota and countdown data');
    });
  });

  test('Test Microsoft demo - 2 Generate Report clicks then lockout page (original design)', async ({ page }) => {
    console.log('🔒 Testing Microsoft demo with original lockout design...');
    
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
    
    // Step 3: Third Generate Report click - should navigate to lockout page
    console.log('🔒 Step 3: Third Generate Report click - should navigate to lockout page...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should be on report page showing lockout overlay
    const currentUrl = page.url();
    const isOnReportPage = currentUrl.includes('/report');
    console.log('🏠 On report page after third click:', isOnReportPage);
    expect(isOnReportPage).toBeTruthy();
    
    // Check if lock overlay is visible
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check for lock content with original design
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouGetLive = page.locator('text=What You Get Live').first();
    const isWhatYouSeeVisible = await whatYouSeeNow.isVisible();
    const isWhatYouGetVisible = await whatYouGetLive.isVisible();
    console.log('👁️ "What You See Now" visible:', isWhatYouSeeVisible);
    console.log('🚀 "What You Get Live" visible:', isWhatYouGetVisible);
    expect(isWhatYouSeeVisible).toBeTruthy();
    expect(isWhatYouGetVisible).toBeTruthy();
    
    // Check that "What You See Now" elements are RED (original design)
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
    
    // Check if report content is hidden
    const isReportVisibleThird = await reportContent.isVisible();
    console.log('📊 Third click - Report content visible:', isReportVisibleThird);
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
    await page.screenshot({ path: 'final-microsoft-lockout-original-design.png', fullPage: true });
    
    console.log('🎉 Microsoft demo with original lockout design works perfectly!');
  });

  test('Test Apple demo - 2 Generate Report clicks then lockout page', async ({ page }) => {
    console.log('🔒 Testing Apple demo with original lockout design...');
    
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
    
    // Third click - should navigate to lockout page
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check lockout page
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Apple lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check red "What You See Now" elements
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 Apple "What You See Now" color:', whatYouSeeNowColor);
    expect(whatYouSeeNowColor).toContain('220, 38, 38'); // RGB for #DC2626 (red)
    
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Apple countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ path: 'final-apple-lockout-original-design.png', fullPage: true });
    
    console.log('🎉 Apple demo with original lockout design works perfectly!');
  });

  test('Test Tesla demo - 2 Generate Report clicks then lockout page', async ({ page }) => {
    console.log('🔒 Testing Tesla demo with original lockout design...');
    
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
    
    // Third click - should navigate to lockout page
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check lockout page
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Tesla lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check red "What You See Now" elements
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 Tesla "What You See Now" color:', whatYouSeeNowColor);
    expect(whatYouSeeNowColor).toContain('220, 38, 38'); // RGB for #DC2626 (red)
    
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Tesla countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot
    await page.screenshot({ path: 'final-tesla-lockout-original-design.png', fullPage: true });
    
    console.log('🎉 Tesla demo with original lockout design works perfectly!');
  });
});
