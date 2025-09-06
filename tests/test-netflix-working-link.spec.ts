import { test, expect } from '@playwright/test';

test('Test Working Netflix Link - Complete Functionality Check', async ({ page }) => {
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1';
  
  console.log('🔍 Testing working Netflix link for complete functionality...');
  console.log('🔍 Loading Netflix link...');
  
  // First visit - should show report
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Check if report is visible
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible on first visit:', reportVisible);
  
  // Check brand colors
  const brandColors = await page.evaluate(() => {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary').trim(),
      brand: computedStyle.getPropertyValue('--brand').trim()
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button, [role="button"]').all();
  console.log('🔘 CTA Buttons found:', ctaButtons.length);
  
  // Test CTA button functionality
  const ctaButtonTests = [];
  for (let i = 0; i < Math.min(ctaButtons.length, 5); i++) {
    try {
      const button = ctaButtons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      
      if (isVisible && text && text.trim()) {
        console.log(`🔍 Testing CTA button ${i + 1}: "${text}"`);
        
        // Click button and check for redirect
        const [response] = await Promise.all([
          page.waitForResponse(response => response.url().includes('stripe') || response.url().includes('checkout'), { timeout: 5000 }).catch(() => null),
          button.click()
        ]);
        
        if (response) {
          console.log(`✅ CTA button ${i + 1} redirected to: ${response.url()}`);
          ctaButtonTests.push({ button: i + 1, text: text.trim(), success: true, url: response.url() });
        } else {
          console.log(`❌ CTA button ${i + 1} did not redirect to Stripe`);
          ctaButtonTests.push({ button: i + 1, text: text.trim(), success: false });
        }
        
        // Go back to test next button
        await page.goBack();
        await page.waitForLoadState('networkidle');
      }
    } catch (error) {
      console.log(`❌ Error testing CTA button ${i + 1}:`, error.message);
      ctaButtonTests.push({ button: i + 1, text: 'Unknown', success: false, error: error.message });
    }
  }
  
  // Check demo quota system
  console.log('🔍 Testing demo quota system...');
  
  // First visit - should show report
  const firstVisitQuota = await page.evaluate(() => {
    try {
      const quota = localStorage.getItem('demo_quota_v3');
      return quota ? JSON.parse(quota) : null;
    } catch (e) {
      return null;
    }
  });
  console.log('📊 First visit quota:', firstVisitQuota);
  
  // Second visit - should still show report
  console.log('🔍 Second visit...');
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
  
  // Third visit - should show lock
  console.log('🔍 Third visit...');
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
  
  // Check lock overlay elements if visible
  let lockOverlayInfo = null;
  if (thirdVisitLockVisible) {
    lockOverlayInfo = await page.evaluate(() => {
      const lockOverlay = document.querySelector('[data-testid="lock-overlay"]') || document.querySelector('text=What You See Now')?.closest('div');
      if (lockOverlay) {
        const computedStyle = getComputedStyle(lockOverlay);
        return {
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color,
          borderColor: computedStyle.borderColor
        };
      }
      return null;
    });
    console.log('🔒 Lock overlay info:', lockOverlayInfo);
  }
  
  // Check address autocomplete
  console.log('🔍 Testing address autocomplete...');
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  if (addressInputVisible) {
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(1000);
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item').count();
    console.log('📊 Address suggestions found:', suggestions);
  }
  
  // Final verification
  console.log('🎯 COMPLETE FUNCTIONALITY TEST RESULTS:');
  console.log('📊 Demo Quota System:');
  console.log('  - First visit report visible:', reportVisible);
  console.log('  - Second visit report visible:', secondVisitReportVisible);
  console.log('  - Third visit lock visible:', thirdVisitLockVisible);
  console.log('  - Quota progression:', firstVisitQuota, '->', secondVisitQuota, '->', thirdVisitQuota);
  
  console.log('📊 CTA Buttons:');
  console.log('  - Total buttons found:', ctaButtons.length);
  console.log('  - Stripe redirects working:', ctaButtonTests.filter(t => t.success).length);
  console.log('  - Button details:', ctaButtonTests);
  
  console.log('📊 Brand Colors:');
  console.log('  - Brand primary:', brandColors.brandPrimary);
  console.log('  - Brand:', brandColors.brand);
  
  console.log('📊 Lock Overlay:');
  console.log('  - Lock visible on third visit:', thirdVisitLockVisible);
  console.log('  - Lock overlay elements:', lockOverlayInfo);
  
  // Assertions
  expect(reportVisible).toBe(true);
  expect(ctaButtonTests.some(t => t.success)).toBe(true);
  expect(brandColors.brandPrimary).not.toBe('#FFA63D'); // Should not be default orange
  expect(thirdVisitLockVisible).toBe(true); // Should show lock after 2 visits
  
  console.log('🎯 OVERALL SUCCESS: ✅');
});
