import { test, expect } from '@playwright/test';

test.describe('Live Lockout System - Complete Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing demo quota to start fresh
    await page.goto('https://sunspire-web-app.vercel.app');
    await page.evaluate(() => {
      localStorage.removeItem('demo_quota_v3');
      localStorage.removeItem('demo_countdown_deadline');
      console.log('🗑️ Cleared demo quota and countdown data');
    });
  });

  test('Test Microsoft demo - 2 runs then lockout with timer', async ({ page }) => {
    console.log('🔒 Testing Microsoft demo lockout system...');
    
    // Test 1: First run - should work
    console.log('👀 First run - should show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if report content is visible (not locked)
    const reportContent = page.locator('text=Your Solar Savings Over Time').first();
    const isReportVisible = await reportContent.isVisible();
    console.log('📊 First run - Report content visible:', isReportVisible);
    expect(isReportVisible).toBeTruthy();
    
    // Check demo quota after first run
    const quotaAfterFirst = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after first run:', quotaAfterFirst);
    
    // Test 2: Second run - should still work
    console.log('👀 Second run - should still show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second run - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Check demo quota after second run
    const quotaAfterSecond = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after second run:', quotaAfterSecond);
    
    // Test 3: Third run - should be locked with timer
    console.log('🔒 Third run - should show lock overlay with timer...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if lock overlay is visible
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Third run - Lock overlay visible:', isLockOverlayVisible);
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
    
    // Check if report content is hidden (should not show "Your Solar Savings Over Time")
    const isReportVisibleThird = await reportContent.isVisible();
    console.log('📊 Third run - Report content visible:', isReportVisibleThird);
    expect(isReportVisibleThird).toBeFalsy();
    
    // Check demo quota after third run
    const quotaAfterThird = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after third run:', quotaAfterThird);
    
    // Take screenshot of lockout
    await page.screenshot({ path: 'live-microsoft-lockout-test.png', fullPage: true });
    
    console.log('🎉 Microsoft demo lockout system is working correctly!');
  });

  test('Test Apple demo - 2 runs then lockout with timer', async ({ page }) => {
    console.log('🔒 Testing Apple demo lockout system...');
    
    // Test 1: First run - should work
    console.log('👀 First run - should show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if report content is visible (not locked)
    const reportContent = page.locator('text=Your Solar Savings Over Time').first();
    const isReportVisible = await reportContent.isVisible();
    console.log('📊 First run - Report content visible:', isReportVisible);
    expect(isReportVisible).toBeTruthy();
    
    // Test 2: Second run - should still work
    console.log('👀 Second run - should still show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second run - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Test 3: Third run - should be locked with timer
    console.log('🔒 Third run - should show lock overlay with timer...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if lock overlay is visible
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Third run - Lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check for countdown timer
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot of Apple lockout
    await page.screenshot({ path: 'live-apple-lockout-test.png', fullPage: true });
    
    console.log('🎉 Apple demo lockout system is working correctly!');
  });

  test('Test Tesla demo - 2 runs then lockout with timer', async ({ page }) => {
    console.log('🔒 Testing Tesla demo lockout system...');
    
    // Test 1: First run - should work
    console.log('👀 First run - should show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if report content is visible (not locked)
    const reportContent = page.locator('text=Your Solar Savings Over Time').first();
    const isReportVisible = await reportContent.isVisible();
    console.log('📊 First run - Report content visible:', isReportVisible);
    expect(isReportVisible).toBeTruthy();
    
    // Test 2: Second run - should still work
    console.log('👀 Second run - should still show report...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second run - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Test 3: Third run - should be locked with timer
    console.log('🔒 Third run - should show lock overlay with timer...');
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if lock overlay is visible
    const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
    const isLockOverlayVisible = await lockOverlay.count() > 0;
    console.log('🔒 Third run - Lock overlay visible:', isLockOverlayVisible);
    expect(isLockOverlayVisible).toBeTruthy();
    
    // Check for countdown timer
    const countdownTimer = page.locator('text=Expires in').first();
    const isCountdownVisible = await countdownTimer.isVisible();
    console.log('⏰ Countdown timer visible:', isCountdownVisible);
    expect(isCountdownVisible).toBeTruthy();
    
    // Take screenshot of Tesla lockout
    await page.screenshot({ path: 'live-tesla-lockout-test.png', fullPage: true });
    
    console.log('🎉 Tesla demo lockout system is working correctly!');
  });

  test('Test CTA buttons redirect to Stripe on lockout page', async ({ page }) => {
    console.log('🛒 Testing CTA buttons on lockout page...');
    
    // First exhaust the demo runs
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Third run should show lockout
    await page.goto('https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Find CTA button on lockout page
    const ctaButton = page.locator('button:has-text("Activate on Your Domain")').first();
    const isCtaVisible = await ctaButton.isVisible();
    console.log('🛒 CTA button visible on lockout page:', isCtaVisible);
    expect(isCtaVisible).toBeTruthy();
    
    // Click the CTA button
    await ctaButton.click();
    await page.waitForTimeout(3000);
    
    // Check if redirected to Stripe or if Stripe modal opened
    const currentUrl = page.url();
    const isStripeUrl = currentUrl.includes('stripe.com') || currentUrl.includes('checkout');
    
    if (!isStripeUrl) {
      // Check if Stripe modal/iframe is present
      const stripeModal = page.locator('[data-testid*="stripe"], iframe[src*="stripe"], .stripe-modal');
      const hasStripeModal = await stripeModal.count() > 0;
      console.log('🛒 Stripe modal opened:', hasStripeModal);
      expect(hasStripeModal).toBeTruthy();
    } else {
      console.log('🛒 Redirected to Stripe URL:', currentUrl);
      expect(isStripeUrl).toBeTruthy();
    }
    
    console.log('🎉 CTA buttons on lockout page work correctly!');
  });
});
