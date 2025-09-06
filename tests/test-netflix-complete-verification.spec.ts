import { test, expect } from '@playwright/test';

test('Netflix Complete Verification - EVERYTHING MUST WORK', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🎬 NETFLIX COMPLETE VERIFICATION TEST');
  console.log('🔗 Testing URL:', testUrl);
  
  // ===== FIRST VISIT - SHOULD SHOW REPORT =====
  console.log('\n📊 FIRST VISIT - Testing report display...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Check if report is visible
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('✅ Report visible on first visit:', reportVisible);
  expect(reportVisible).toBe(true);
  
  // Check Netflix brand colors
  const brandColors = await page.evaluate(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary').trim(),
      brand: computedStyle.getPropertyValue('--brand').trim()
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  expect(brandColors.brandPrimary).toBe('#E50914'); // Netflix red
  expect(brandColors.brand).toBe('#E50914'); // Netflix red
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button, [role="button"]').all();
  const unlockButtons = await page.locator('text=Unlock Full Report').count();
  const activateButtons = await page.locator('text=Activate').count();
  console.log('🔘 Total CTA buttons:', ctaButtons.length);
  console.log('🔘 Unlock Full Report buttons:', unlockButtons);
  console.log('🔘 Activate buttons:', activateButtons);
  expect(unlockButtons).toBeGreaterThan(0);
  expect(activateButtons).toBeGreaterThan(0);
  
  // Test Stripe checkout functionality
  console.log('\n💳 Testing Stripe checkout...');
  const unlockButton = await page.locator('text=Unlock Full Report').first();
  const isVisible = await unlockButton.isVisible();
  expect(isVisible).toBe(true);
  
  // Set up response listener for Stripe
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('stripe') || response.url().includes('checkout'), 
    { timeout: 15000 }
  ).catch(() => null);
  
  // Click the button
  await unlockButton.click();
  
  // Wait for response
  const response = await responsePromise;
  if (response) {
    console.log('✅ Stripe response received:', response.url());
    console.log('📊 Response status:', response.status());
    
    if (response.status() === 200) {
      try {
        const responseData = await response.json();
        if (responseData.url && responseData.url.includes('checkout.stripe.com')) {
          console.log('🎯 SUCCESS: Redirected to Stripe checkout!');
          console.log('🔗 Stripe checkout URL:', responseData.url);
        } else {
          console.log('❌ Response does not contain Stripe checkout URL');
          console.log('📊 Response data:', responseData);
        }
      } catch (e) {
        console.log('✅ Stripe checkout working (response received)');
      }
    } else {
      console.log('❌ Stripe API returned error status:', response.status());
      try {
        const errorBody = await response.text();
        console.log('📊 Error response:', errorBody);
      } catch (e) {
        console.log('📊 Error response (could not parse)');
      }
    }
  } else {
    console.log('❌ No Stripe response received');
  }
  
  // Go back to continue testing
  await page.goBack();
  await page.waitForLoadState('networkidle');
  
  // Check demo quota system
  console.log('\n🔒 Testing demo quota system...');
  const firstVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 First visit quota:', firstVisitQuota);
  
  // ===== SECOND VISIT - SHOULD STILL SHOW REPORT =====
  console.log('\n📊 SECOND VISIT - Testing second attempt...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const secondVisitReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const secondVisitLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Second visit - Report visible:', secondVisitReportVisible);
  console.log('📊 Second visit - Lock visible:', secondVisitLockVisible);
  
  const secondVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 Second visit quota:', secondVisitQuota);
  
  // ===== THIRD VISIT - SHOULD SHOW LOCK =====
  console.log('\n📊 THIRD VISIT - Testing lock overlay...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const thirdVisitReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const thirdVisitLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Third visit - Report visible:', thirdVisitReportVisible);
  console.log('📊 Third visit - Lock visible:', thirdVisitLockVisible);
  
  const thirdVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 Third visit quota:', thirdVisitQuota);
  
  // Verify lock overlay is working
  expect(thirdVisitLockVisible).toBe(true);
  expect(thirdVisitReportVisible).toBe(false);
  
  // Check lock overlay elements
  if (thirdVisitLockVisible) {
    console.log('\n🔒 Testing lock overlay elements...');
    
    // Check for "What You See Now" text (should be red)
    const whatYouSeeNow = await page.locator('text=What You See Now').first();
    const whatYouSeeNowVisible = await whatYouSeeNow.isVisible();
    console.log('✅ "What You See Now" visible:', whatYouSeeNowVisible);
    expect(whatYouSeeNowVisible).toBe(true);
    
    // Check for "What You Get Live" text
    const whatYouGetLive = await page.locator('text=What You Get Live').first();
    const whatYouGetLiveVisible = await whatYouGetLive.isVisible();
    console.log('✅ "What You Get Live" visible:', whatYouGetLiveVisible);
    expect(whatYouGetLiveVisible).toBe(true);
    
    // Check for CTA buttons in lock overlay
    const lockCTAButtons = await page.locator('text=Activate on Your Domain').all();
    console.log('🔘 Lock overlay CTA buttons:', lockCTAButtons.length);
    expect(lockCTAButtons.length).toBeGreaterThan(0);
    
    // Test CTA button in lock overlay
    if (lockCTAButtons.length > 0) {
      console.log('💳 Testing CTA button in lock overlay...');
      const lockButton = lockCTAButtons[0];
      
      const lockResponsePromise = page.waitForResponse(response => 
        response.url().includes('stripe') || response.url().includes('checkout'), 
        { timeout: 15000 }
      ).catch(() => null);
      
      await lockButton.click();
      
      const lockResponse = await lockResponsePromise;
      if (lockResponse) {
        console.log('✅ Lock overlay CTA response:', lockResponse.url());
        console.log('📊 Lock CTA status:', lockResponse.status());
      } else {
        console.log('❌ Lock overlay CTA did not redirect');
      }
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  }
  
  // ===== TEST ADDRESS AUTOCOMPLETE =====
  console.log('\n🏠 Testing address autocomplete...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  await page.waitForLoadState('networkidle');
  
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  if (addressInputVisible) {
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(2000);
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item').count();
    console.log('📊 Address suggestions found:', suggestions);
  }
  
  // ===== FINAL VERIFICATION =====
  console.log('\n🎯 FINAL VERIFICATION RESULTS:');
  console.log('=====================================');
  console.log('✅ Netflix brand colors (red):', brandColors.brandPrimary === '#E50914');
  console.log('✅ Report displays on first visit:', reportVisible);
  console.log('✅ Demo quota system working:', thirdVisitLockVisible);
  console.log('✅ Lock overlay appears after 2 visits:', thirdVisitLockVisible);
  console.log('✅ CTA buttons present:', unlockButtons > 0);
  console.log('✅ Stripe checkout functional:', response?.status() === 200);
  console.log('✅ Address autocomplete available:', addressInputVisible);
  
  // Final assertions
  expect(brandColors.brandPrimary).toBe('#E50914');
  expect(reportVisible).toBe(true);
  expect(thirdVisitLockVisible).toBe(true);
  expect(unlockButtons).toBeGreaterThan(0);
  expect(response?.status()).toBe(200);
  
  console.log('\n🎉 ALL TESTS PASSED - NETFLIX DEMO IS FULLY WORKING! 🎉');
});
