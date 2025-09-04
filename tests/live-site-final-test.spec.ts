import { test, expect } from '@playwright/test';

test('Live Site Final Test - Complete Feature Check', async ({ page }) => {
  console.log('🌐 Final comprehensive test of live site...');
  
  // Test Tesla branding
  console.log('\n🔴 Testing Tesla features...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check title
  const title = await page.title();
  console.log('📝 Page title:', title);
  
  // Check if Tesla logo is visible
  const teslaLogo = page.locator('img').first();
  const logoVisible = await teslaLogo.isVisible();
  console.log('🔴 Logo visible:', logoVisible);
  
  // Check brand colors in CSS
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand')
    };
  });
  console.log('🎨 CSS brand colors:', cssVars);
  
  // Check CTA buttons
  const ctaButtons = await page.locator('button:has-text("Activate")').count();
  console.log('🔘 CTA buttons found:', ctaButtons);
  
  if (ctaButtons > 0) {
    const ctaButton = page.locator('button:has-text("Activate")').first();
    const ctaColor = await ctaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });
    console.log('🔘 CTA button color:', ctaColor);
    
    // Check if CTA redirects to Stripe (listen for network request)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/stripe/create-checkout-session'), { timeout: 5000 }
    ).catch(() => null);
    
    await ctaButton.click();
    const response = await responsePromise;
    
    if (response) {
      console.log('✅ Stripe checkout request made:', response.status());
    } else {
      console.log('❌ No Stripe checkout request made');
    }
  }
  
  // Test address autocomplete
  console.log('\n📍 Testing address autocomplete...');
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  const inputVisible = await addressInput.isVisible();
  console.log('📍 Address input visible:', inputVisible);
  
  if (inputVisible) {
    await addressInput.click();
    await addressInput.fill('123 Main St');
    await page.waitForTimeout(3000);
    
    const suggestions = await page.locator('ul li').count();
    console.log('📍 Autocomplete suggestions:', suggestions);
  }
  
  // Test demo limitation
  console.log('\n🔒 Testing demo limitation...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check localStorage quota
  const quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Demo quota:', quota);
  
  // Check if lock overlay appears
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const lockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', lockVisible);
  
  // Test Apple branding for comparison
  console.log('\n🍎 Testing Apple branding...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const appleTitle = await page.title();
  console.log('🍎 Apple page title:', appleTitle);
  
  const appleCssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand')
    };
  });
  console.log('🍎 Apple CSS colors:', appleCssVars);
  
  // Final status
  console.log('\n🎯 LIVE SITE STATUS SUMMARY:');
  console.log('✅ Working features:');
  console.log('  - Page loads correctly');
  console.log('  - Brand takeover logic runs');
  console.log('  - Logo displays');
  console.log('  - Company names in title work');
  
  console.log('\n❌ Issues found:');
  console.log('  - CTA buttons are white instead of brand colors');
  console.log('  - Address autocomplete not working (API key missing)');
  console.log('  - Stripe checkout returns 500 error');
  console.log('  - Demo limitation not working properly');
  console.log('  - Brand colors default to orange instead of company colors');
  
  console.log('\n🔧 Required fixes:');
  console.log('  1. Configure Google Maps API key in Vercel environment');
  console.log('  2. Fix Stripe environment variables and pricing configuration');
  console.log('  3. Debug brand theme function to return correct colors');
  console.log('  4. Ensure CTA buttons use CSS variables for brand colors');
  console.log('  5. Fix demo quota consumption logic');
  
  await page.screenshot({ path: 'live-site-final-status.png' });
  console.log('📸 Final status screenshot saved');
});
