import { test, expect } from '@playwright/test';

test('Verify disclaimer appears in white bar on report page', async ({ page }) => {
  console.log('🔍 Verifying disclaimer appears in white bar on report page...');
  
  // Test with Tesla
  console.log('\n🚗 Testing Tesla...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that the disclaimer text appears in a white bar
  const teslaDisclaimer = page.locator('div.border-t.border-gray-100.bg-white p:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(teslaDisclaimer).toBeVisible();
  console.log('✅ Tesla disclaimer appears in white bar');
  
  // Test with Apple
  console.log('\n🍎 Testing Apple...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const appleDisclaimer = page.locator('div.border-t.border-gray-100.bg-white p:has-text("Private demo for Apple. Not affiliated.")');
  await expect(appleDisclaimer).toBeVisible();
  console.log('✅ Apple disclaimer appears in white bar');
  
  // Test with Amazon
  console.log('\n📦 Testing Amazon...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const amazonDisclaimer = page.locator('div.border-t.border-gray-100.bg-white p:has-text("Private demo for Amazon. Not affiliated.")');
  await expect(amazonDisclaimer).toBeVisible();
  console.log('✅ Amazon disclaimer appears in white bar');
  
  // Test with Google
  console.log('\n🔍 Testing Google...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const googleDisclaimer = page.locator('div.border-t.border-gray-100.bg-white p:has-text("Private demo for Google. Not affiliated.")');
  await expect(googleDisclaimer).toBeVisible();
  console.log('✅ Google disclaimer appears in white bar');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'white-bar-disclaimer-verification.png', fullPage: true });
  
  console.log('\n🎉 All white bar disclaimer tests passed!');
  console.log('✅ Disclaimer text appears in white bar on report page');
  console.log('✅ Just like on the home page!');
});
