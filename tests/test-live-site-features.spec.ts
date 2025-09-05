import { test, expect } from '@playwright/test';

test('Test Live Site Features - CTA Buttons, Autosuggest, Demo Runs', async ({ page }) => {
  console.log('🔍 Testing live site features...');
  
  // Test the live URL
  const liveUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  console.log('🌐 Navigating to live site...');
  await page.goto(liveUrl);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  console.log('📊 Checking if report page loads...');
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible:', reportVisible);
  
  if (reportVisible) {
    console.log('✅ Report page loaded successfully');
    
    // Test CTA buttons
    console.log('🔘 Testing CTA buttons...');
    const ctaButtons = page.locator('[data-cta="primary"]');
    const ctaCount = await ctaButtons.count();
    console.log('📊 CTA button count:', ctaCount);
    
    if (ctaCount > 0) {
      console.log('✅ CTA buttons found');
      
      // Test first CTA button click
      const firstCta = ctaButtons.first();
      const ctaText = await firstCta.textContent();
      console.log('📊 First CTA text:', ctaText);
      
      // Check if button has proper styling
      const ctaStyle = await firstCta.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
      console.log('🎨 CTA button styling:', ctaStyle);
    } else {
      console.log('❌ No CTA buttons found');
    }
    
    // Test address autosuggest
    console.log('🏠 Testing address autosuggest...');
    const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]');
    const inputCount = await addressInput.count();
    console.log('📊 Address input count:', inputCount);
    
    if (inputCount > 0) {
      console.log('✅ Address input found');
      
      // Try typing in the input
      await addressInput.first().click();
      await addressInput.first().fill('123 Main St');
      
      // Wait a bit for autosuggest to potentially appear
      await page.waitForTimeout(2000);
      
      // Check if autosuggest appears
      const suggestions = page.locator('[role="listbox"], .pac-container, .autocomplete-suggestions');
      const suggestionCount = await suggestions.count();
      console.log('📊 Autosuggest suggestions count:', suggestionCount);
      
      if (suggestionCount > 0) {
        console.log('✅ Address autosuggest working');
      } else {
        console.log('⚠️ Address autosuggest not visible (may be working but no suggestions)');
      }
    } else {
      console.log('❌ No address input found');
    }
    
    // Test demo quota system
    console.log('🔒 Testing demo quota system...');
    
    // Check localStorage for demo quota
    const quota = await page.evaluate(() => {
      return localStorage.getItem('demo_quota_v3');
    });
    console.log('📊 Current quota in localStorage:', quota);
    
    // Check if quota consumption is working
    const quotaData = quota ? JSON.parse(quota) : null;
    if (quotaData) {
      console.log('📊 Quota data:', quotaData);
      console.log('📊 Remaining runs:', quotaData.runs);
    }
    
  } else {
    console.log('❌ Report page not visible - checking for lock overlay...');
    
    // Check if lock overlay is showing
    const lockOverlay = page.locator('text=What You See Now');
    const lockVisible = await lockOverlay.isVisible();
    console.log('🔒 Lock overlay visible:', lockVisible);
    
    if (lockVisible) {
      console.log('✅ Lock overlay is showing (quota exhausted)');
      
      // Check red elements
      const whatYouSeeNow = page.locator('text=What You See Now').first();
      const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
      
      const blurredData = page.locator('text=Blurred Data');
      const blurredDataColor = await blurredData.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      console.log('🎨 "Blurred Data" color:', blurredDataColor);
    }
  }
  
  // Test brand colors
  console.log('🎨 Testing brand colors...');
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('📊 --brand-primary CSS variable:', brandPrimary);
  
  const brand = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand');
  });
  console.log('📊 --brand CSS variable:', brand);
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-features-test.png' });
  console.log('📸 Screenshot saved as live-site-features-test.png');
  
  console.log('🎯 LIVE SITE FEATURES TEST COMPLETE');
});
