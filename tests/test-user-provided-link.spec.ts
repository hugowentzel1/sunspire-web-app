import { test, expect } from '@playwright/test';

test('Test User Provided Link - Complete Functionality Check', async ({ page }) => {
  console.log('🔍 Testing user provided link for complete functionality...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo';
  
  // Clear any existing quota and brand state
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log('🔍 Loading user provided link...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if report is visible (should be visible on first visit)
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible on first visit:', reportVisible);
  
  // Check brand colors
  const brandColors = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand')
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  
  // Check CTA buttons
  const ctaButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [data-cta], .btn-primary, .btn-secondary, .btn'));
    return buttons.map(btn => {
      const styles = window.getComputedStyle(btn);
      return {
        text: btn.textContent?.trim().substring(0, 40) || 'No text',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        className: btn.className,
        isVisible: btn.offsetParent !== null
      };
    }).filter(btn => btn.isVisible);
  });
  console.log('🔘 CTA Buttons found:', ctaButtons.length);
  console.log('🔘 CTA Button details:', ctaButtons);
  
  // Check if CTA buttons are clickable and redirect to Stripe
  const ctaButtonTests = [];
  for (let i = 0; i < Math.min(ctaButtons.length, 3); i++) {
    try {
      const button = page.locator('button, [data-cta], .btn-primary, .btn-secondary, .btn').nth(i);
      const buttonText = await button.textContent();
      console.log(`🔍 Testing CTA button ${i + 1}: "${buttonText}"`);
      
      // Click button and check for redirect
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('stripe') || response.url().includes('checkout'), { timeout: 5000 }).catch(() => null),
        button.click()
      ]);
      
      if (response) {
        console.log(`✅ CTA button ${i + 1} redirected to Stripe:`, response.url());
        ctaButtonTests.push({ button: i + 1, text: buttonText, success: true, url: response.url() });
      } else {
        console.log(`❌ CTA button ${i + 1} did not redirect to Stripe`);
        ctaButtonTests.push({ button: i + 1, text: buttonText, success: false });
      }
      
      // Go back to test next button
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
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
  await page.waitForTimeout(3000);
  
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
  await page.waitForTimeout(3000);
  
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
      const whatYouSeeNow = document.querySelector('text=What You See Now') || document.querySelector('*:contains("What You See Now")');
      const blurredData = document.querySelector('text=Blurred Data') || document.querySelector('*:contains("Blurred Data")');
      
      return {
        whatYouSeeNowExists: !!whatYouSeeNow,
        blurredDataExists: !!blurredData,
        whatYouSeeNowColor: whatYouSeeNow ? window.getComputedStyle(whatYouSeeNow).color : null,
        blurredDataColor: blurredData ? window.getComputedStyle(blurredData).color : null
      };
    });
    console.log('🔒 Lock overlay info:', lockOverlayInfo);
  }
  
  // Check address autocomplete
  console.log('🔍 Testing address autocomplete...');
  try {
    const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
    if (await addressInput.isVisible()) {
      await addressInput.fill('123 Main St');
      await page.waitForTimeout(1000);
      
      const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item').count();
      console.log('📊 Address autocomplete suggestions found:', suggestions);
    } else {
      console.log('📊 Address input not found');
    }
  } catch (error) {
    console.log('❌ Address autocomplete error:', error.message);
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'user-provided-link-test.png' });
  
  // Summary
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
  
  // Overall assessment
  const overallSuccess = reportVisible && secondVisitReportVisible && thirdVisitLockVisible && 
                        ctaButtonTests.some(t => t.success) && 
                        brandColors.brandPrimary && brandColors.brand;
  
  console.log('🎯 OVERALL SUCCESS:', overallSuccess ? '✅' : '❌');
});
