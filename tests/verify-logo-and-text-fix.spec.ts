import { test, expect } from '@playwright/test';

test('Verify Logo Display and Text Fix', async ({ page }) => {
  console.log('🔧 Verifying logo display and text fix...');
  
  // Test with Apple
  console.log('📍 Testing with Apple...');
  await page.goto('http://localhost:3001/report?company=Apple&demo=1&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that Apple logo is showing in header
  const headerLogo = page.locator('header img[alt="Apple logo"]');
  await expect(headerLogo).toBeVisible();
  console.log('✅ Apple logo showing in header');
  
  // Check that Apple logo is showing in hero section
  const heroLogo = page.locator('main img[alt="Apple logo"]');
  await expect(heroLogo).toBeVisible();
  console.log('✅ Apple logo showing in hero section');
  
  // Check the correct text is showing
  const demoText = page.locator('span:has-text("Private demo for Apple. Not affiliated.")');
  await expect(demoText).toBeVisible();
  console.log('✅ Correct demo text showing for Apple');
  
  // Test with Tesla
  console.log('📍 Testing with Tesla...');
  await page.goto('http://localhost:3001/report?company=Tesla&demo=1&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that Tesla logo is showing in header
  const teslaHeaderLogo = page.locator('header img[alt="Tesla logo"]');
  await expect(teslaHeaderLogo).toBeVisible();
  console.log('✅ Tesla logo showing in header');
  
  // Check that Tesla logo is showing in hero section
  const teslaHeroLogo = page.locator('main img[alt="Tesla logo"]');
  await expect(teslaHeroLogo).toBeVisible();
  console.log('✅ Tesla logo showing in hero section');
  
  // Check the correct text is showing
  const teslaDemoText = page.locator('span:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(teslaDemoText).toBeVisible();
  console.log('✅ Correct demo text showing for Tesla');
  
  // Test with Google
  console.log('📍 Testing with Google...');
  await page.goto('http://localhost:3001/report?company=Google&demo=1&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that Google logo is showing in header
  const googleHeaderLogo = page.locator('header img[alt="Google logo"]');
  await expect(googleHeaderLogo).toBeVisible();
  console.log('✅ Google logo showing in header');
  
  // Check that Google logo is showing in hero section
  const googleHeroLogo = page.locator('main img[alt="Google logo"]');
  await expect(googleHeroLogo).toBeVisible();
  console.log('✅ Google logo showing in hero section');
  
  // Check the correct text is showing
  const googleDemoText = page.locator('span:has-text("Private demo for Google. Not affiliated.")');
  await expect(googleDemoText).toBeVisible();
  console.log('✅ Correct demo text showing for Google');
  
  console.log('🎉 All logo and text fixes verified successfully!');
});
