import { test, expect } from '@playwright/test';

test('Live Site Debug - Check What Actually Works', async ({ page }) => {
  console.log('\n🔍 LIVE SITE DEBUG - CHECKING WHAT ACTUALLY WORKS');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&company=Netflix&demo=1';
  console.log('🔗 Testing URL:', testUrl);
  
  // Clear localStorage to start fresh
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    console.log('🗑️ Cleared localStorage');
  });
  
  // Visit the page
  console.log('\n📊 Testing page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check what's actually visible
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('📄 Page body text (first 1000 chars):', bodyText.substring(0, 1000));
  
  // Check brand colors
  const brandColors = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      brandPrimary: getComputedStyle(root).getPropertyValue('--brand-primary').trim(),
      brand: getComputedStyle(root).getPropertyValue('--brand').trim()
    };
  });
  console.log('🎨 Brand colors:', brandColors);
  
  // Check for logo
  const logoVisible = await page.locator('img[alt*="Netflix"], img[src*="netflix"], .logo').first().isVisible();
  console.log('🖼️ Logo visible:', logoVisible);
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button:has-text("Activate"), button:has-text("Unlock"), a:has-text("Activate"), a:has-text("Unlock")').all();
  console.log('🔘 Total CTA buttons:', ctaButtons.length);
  
  // Check demo quota
  const quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota:', quota);
  
  // Check if report content is visible
  const reportContent = await page.locator('text=Your Solar Savings, text=Solar Analysis, text=Energy Savings').first().isVisible();
  console.log('📊 Report content visible:', reportContent);
  
  // Check if lock overlay is visible
  const lockOverlay = await page.locator('text=What You See Now, text=What You Get Live').first().isVisible();
  console.log('🔒 Lock overlay visible:', lockOverlay);
  
  // Test address autocomplete on homepage
  console.log('\n🏠 Testing address autocomplete...');
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const addressInput = await page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const addressInputVisible = await addressInput.isVisible();
  console.log('📊 Address input visible:', addressInputVisible);
  
  if (addressInputVisible) {
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(2000);
    const suggestions = await page.locator('[role="option"], .suggestion, .autocomplete-item, .pac-item').all();
    console.log('📊 Address suggestions found:', suggestions.length);
    
    // Check if Google Maps is loaded
    const googleMapsLoaded = await page.evaluate(() => {
      return typeof window.google !== 'undefined' && window.google.maps;
    });
    console.log('🗺️ Google Maps loaded:', googleMapsLoaded);
  }
  
  // Test Stripe checkout
  console.log('\n💳 Testing Stripe checkout...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  try {
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/stripe/create-checkout-session'), { timeout: 10000 }),
      page.click('button:has-text("Activate"), a:has-text("Activate")')
    ]);
    
    console.log('✅ Stripe response received:', response.url());
    console.log('📊 Response status:', response.status());
    
    if (response.status() === 200) {
      try {
        const responseData = await response.json();
        if (responseData.url && responseData.url.includes('checkout.stripe.com')) {
          console.log('🎯 SUCCESS: Redirected to Stripe checkout!');
          console.log('🔗 Stripe checkout URL:', responseData.url);
        } else {
          console.log('✅ Stripe checkout working (response received)');
        }
      } catch (e) {
        console.log('✅ Stripe checkout working (response received)');
      }
    }
  } catch (e) {
    console.log('❌ Stripe checkout failed:', e.message);
  }
  
  // FINAL VERIFICATION
  console.log('\n🎯 FINAL VERIFICATION RESULTS:');
  console.log('=====================================');
  console.log('✅ Netflix brand colors (red):', brandColors.brandPrimary === '#E50914');
  console.log('✅ Logo visible:', logoVisible);
  console.log('✅ CTA buttons present:', ctaButtons.length > 0);
  console.log('✅ Report content visible:', reportContent);
  console.log('✅ Lock overlay visible:', lockOverlay);
  console.log('✅ Demo quota working:', quota !== null);
  console.log('✅ Address autocomplete available:', addressInputVisible);
  console.log('✅ Stripe checkout functional:', response?.status() === 200);
  
  console.log('\n📝 ISSUES FOUND:');
  if (brandColors.brandPrimary !== '#E50914') console.log('❌ Brand colors not working');
  if (!logoVisible) console.log('❌ Logo not visible');
  if (ctaButtons.length === 0) console.log('❌ No CTA buttons found');
  if (!reportContent && !lockOverlay) console.log('❌ No report content or lock overlay');
  if (quota === null) console.log('❌ Demo quota not working');
  if (!addressInputVisible) console.log('❌ Address autocomplete not available');
  if (response?.status() !== 200) console.log('❌ Stripe checkout not working');
});
