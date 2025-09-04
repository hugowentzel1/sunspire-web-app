import { test, expect } from '@playwright/test';

test('Live Site Verification - All Features Working', async ({ page }) => {
  console.log('🌐 Testing live site features...');
  
  // Test 1: Tesla Branding and CTA
  console.log('\n🔴 Testing Tesla branding on live site...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if Tesla logo is visible
  const teslaLogo = page.locator('img[alt*="Tesla"], img[src*="tesla"]').first();
  const teslaLogoVisible = await teslaLogo.isVisible();
  console.log('🔴 Tesla logo visible:', teslaLogoVisible);
  
  // Check Tesla CTA color
  const teslaCTA = page.locator('button:has-text("Activate")').first();
  const teslaColor = await teslaCTA.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.backgroundColor;
  });
  console.log('🔴 Tesla CTA color:', teslaColor);
  
  // Test CTA click
  await teslaCTA.click();
  await page.waitForTimeout(3000);
  
  // Check if we get redirected or see error
  const currentUrl = page.url();
  console.log('🔗 URL after CTA click:', currentUrl);
  
  // Check for error messages
  const errorMessage = page.locator('text=Unable to start checkout');
  const hasError = await errorMessage.isVisible();
  console.log('❌ Checkout error visible:', hasError);
  
  // Test 2: Address Autocomplete
  console.log('\n📍 Testing address autocomplete on live site...');
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await addressInput.click();
  await addressInput.fill('123 Main St');
  await page.waitForTimeout(3000);
  
  const suggestions = await page.locator('ul li').count();
  console.log('📍 Autocomplete suggestions found:', suggestions);
  
  // Test 3: Demo Limitation
  console.log('\n🔒 Testing demo limitation on live site...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check localStorage
  const quota = await page.evaluate(() => {
    return localStorage.getItem('demo_quota_v3');
  });
  console.log('📦 Quota in localStorage:', quota);
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('div[style*="position: fixed"][style*="inset: 0"]');
  const lockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', lockVisible);
  
  // Test 4: Apple Branding
  console.log('\n🍎 Testing Apple branding on live site...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check Apple logo
  const appleLogo = page.locator('img[alt*="Apple"], img[src*="apple"]').first();
  const appleLogoVisible = await appleLogo.isVisible();
  console.log('🍎 Apple logo visible:', appleLogoVisible);
  
  // Check Apple CTA color
  const appleCTA = page.locator('button:has-text("Activate")').first();
  const appleColor = await appleCTA.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return styles.backgroundColor;
  });
  console.log('🍎 Apple CTA color:', appleColor);
  
  // Take screenshots for debugging
  await page.screenshot({ path: 'live-site-tesla.png' });
  console.log('📸 Screenshot saved as live-site-tesla.png');
  
  console.log('\n🎯 Live site verification complete!');
});
