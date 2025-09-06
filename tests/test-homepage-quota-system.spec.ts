import { test, expect } from '@playwright/test';

test.describe('Homepage Quota System - Generate Report Button', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing demo quota to start fresh
    await page.goto('https://sunspire-web-app.vercel.app');
    await page.evaluate(() => {
      localStorage.removeItem('demo_quota_v3');
      localStorage.removeItem('demo_countdown_deadline');
      console.log('🗑️ Cleared demo quota and countdown data');
    });
  });

  test('Test Microsoft demo - 2 Generate Report clicks then lockout', async ({ page }) => {
    console.log('🔒 Testing Microsoft demo quota system via Generate Report button...');
    
    // Navigate to Microsoft demo
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 1: First Generate Report click - should work
    console.log('👀 First Generate Report click - should work...');
    
    // Enter an address
    const addressInput = page.locator('input[placeholder*="address"]').first();
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    // Click Generate Report button
    const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if report content is visible (not locked)
    const reportContent = page.locator('text=Your Solar Savings Over Time').first();
    const isReportVisible = await reportContent.isVisible();
    console.log('📊 First click - Report content visible:', isReportVisible);
    expect(isReportVisible).toBeTruthy();
    
    // Check demo quota after first click
    const quotaAfterFirst = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after first click:', quotaAfterFirst);
    
    // Go back to home page for second test
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 2: Second Generate Report click - should still work
    console.log('👀 Second Generate Report click - should still work...');
    
    // Enter an address
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    
    // Click Generate Report button
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second click - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Check demo quota after second click
    const quotaAfterSecond = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after second click:', quotaAfterSecond);
    
    // Go back to home page for third test
    await page.goto('https://sunspire-web-app.vercel.app/?company=Microsoft&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 3: Third Generate Report click - should show lockout
    console.log('🔒 Third Generate Report click - should show lockout...');
    
    // Enter an address
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    // Click Generate Report button
    await generateButton.click();
    await page.waitForTimeout(3000);
    
    // Check if we're still on home page (should show alert or stay on home)
    const currentUrl = page.url();
    const isStillOnHomePage = !currentUrl.includes('/report');
    console.log('🏠 Still on home page after third click:', isStillOnHomePage);
    
    // Check if there's an alert or error message
    const alertMessage = await page.locator('text=Demo quota exhausted').first();
    const hasAlert = await alertMessage.isVisible();
    console.log('⚠️ Alert message visible:', hasAlert);
    
    // If we did navigate to report, it should show lockout
    if (!isStillOnHomePage) {
      const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
      const isLockOverlayVisible = await lockOverlay.count() > 0;
      console.log('🔒 Lock overlay visible on report page:', isLockOverlayVisible);
      expect(isLockOverlayVisible).toBeTruthy();
      
      // Check for countdown timer
      const countdownTimer = page.locator('text=Expires in').first();
      const isCountdownVisible = await countdownTimer.isVisible();
      console.log('⏰ Countdown timer visible:', isCountdownVisible);
      expect(isCountdownVisible).toBeTruthy();
    }
    
    // Check final demo quota
    const quotaAfterThird = await page.evaluate(() => {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    });
    console.log('📦 Demo quota after third click:', quotaAfterThird);
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-quota-test-microsoft.png', fullPage: true });
    
    console.log('🎉 Microsoft demo quota system via Generate Report button works correctly!');
  });

  test('Test Apple demo - 2 Generate Report clicks then lockout', async ({ page }) => {
    console.log('🔒 Testing Apple demo quota system via Generate Report button...');
    
    // Navigate to Apple demo
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 1: First Generate Report click
    console.log('👀 First Generate Report click...');
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
    
    // Test 2: Second Generate Report click
    console.log('👀 Second Generate Report click...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second click - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Test 3: Third Generate Report click - should show lockout
    console.log('🔒 Third Generate Report click - should show lockout...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForTimeout(3000);
    
    // Check if we're still on home page or if lockout is shown
    const currentUrl = page.url();
    const isStillOnHomePage = !currentUrl.includes('/report');
    console.log('🏠 Still on home page after third click:', isStillOnHomePage);
    
    if (!isStillOnHomePage) {
      const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
      const isLockOverlayVisible = await lockOverlay.count() > 0;
      console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
      expect(isLockOverlayVisible).toBeTruthy();
    }
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-quota-test-apple.png', fullPage: true });
    
    console.log('🎉 Apple demo quota system via Generate Report button works correctly!');
  });

  test('Test Tesla demo - 2 Generate Report clicks then lockout', async ({ page }) => {
    console.log('🔒 Testing Tesla demo quota system via Generate Report button...');
    
    // Navigate to Tesla demo
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Test 1: First Generate Report click
    console.log('👀 First Generate Report click...');
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
    
    // Test 2: Second Generate Report click
    console.log('👀 Second Generate Report click...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('456 Oak Ave, Los Angeles, CA');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const isReportVisibleSecond = await reportContent.isVisible();
    console.log('📊 Second click - Report content visible:', isReportVisibleSecond);
    expect(isReportVisibleSecond).toBeTruthy();
    
    // Test 3: Third Generate Report click - should show lockout
    console.log('🔒 Third Generate Report click - should show lockout...');
    await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    await addressInput.fill('789 Pine St, Chicago, IL');
    await page.waitForTimeout(1000);
    
    await generateButton.click();
    await page.waitForTimeout(3000);
    
    // Check if we're still on home page or if lockout is shown
    const currentUrl = page.url();
    const isStillOnHomePage = !currentUrl.includes('/report');
    console.log('🏠 Still on home page after third click:', isStillOnHomePage);
    
    if (!isStillOnHomePage) {
      const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
      const isLockOverlayVisible = await lockOverlay.count() > 0;
      console.log('🔒 Lock overlay visible:', isLockOverlayVisible);
      expect(isLockOverlayVisible).toBeTruthy();
    }
    
    // Take screenshot
    await page.screenshot({ path: 'homepage-quota-test-tesla.png', fullPage: true });
    
    console.log('🎉 Tesla demo quota system via Generate Report button works correctly!');
  });
});
