import { test, expect } from '@playwright/test';

test('Verify dynamic company logos and text work for different companies', async ({ page }) => {
  console.log('🔍 Testing dynamic company branding...');
  
  // Test 1: Apple
  console.log('\n🍎 Testing Apple...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check Apple logo and text
  const appleHeaderLogo = page.locator('header img[alt="Apple logo"]').first();
  const appleHeroLogo = page.locator('main img[alt="Apple logo"]').first();
  await expect(appleHeaderLogo).toBeVisible();
  await expect(appleHeroLogo).toBeVisible();
  
  const appleCompanyName = page.locator('header h1');
  await expect(appleCompanyName).toHaveText('Apple');
  
  const appleDemoText = page.locator('span:has-text("Private demo for Apple. Not affiliated.")');
  await expect(appleDemoText).toBeVisible();
  
  console.log('✅ Apple branding working correctly');
  
  // Test 2: Amazon
  console.log('\n📦 Testing Amazon...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check Amazon logo and text
  const amazonHeaderLogo = page.locator('header img[alt="Amazon logo"]').first();
  const amazonHeroLogo = page.locator('main img[alt="Amazon logo"]').first();
  await expect(amazonHeaderLogo).toBeVisible();
  await expect(amazonHeroLogo).toBeVisible();
  
  const amazonCompanyName = page.locator('header h1');
  await expect(amazonCompanyName).toHaveText('Amazon');
  
  const amazonDemoText = page.locator('span:has-text("Private demo for Amazon. Not affiliated.")');
  await expect(amazonDemoText).toBeVisible();
  
  console.log('✅ Amazon branding working correctly');
  
  // Test 3: Google
  console.log('\n🔍 Testing Google...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check Google logo and text
  const googleHeaderLogo = page.locator('header img[alt="Google logo"]').first();
  const googleHeroLogo = page.locator('main img[alt="Google logo"]').first();
  await expect(googleHeaderLogo).toBeVisible();
  await expect(googleHeroLogo).toBeVisible();
  
  const googleCompanyName = page.locator('header h1');
  await expect(googleCompanyName).toHaveText('Google');
  
  const googleDemoText = page.locator('span:has-text("Private demo for Google. Not affiliated.")');
  await expect(googleDemoText).toBeVisible();
  
  console.log('✅ Google branding working correctly');
  
  // Test 4: Tesla (again to confirm)
  console.log('\n🚗 Testing Tesla...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check Tesla logo and text
  const teslaHeaderLogo = page.locator('header img[alt="Tesla logo"]').first();
  const teslaHeroLogo = page.locator('main img[alt="Tesla logo"]').first();
  await expect(teslaHeaderLogo).toBeVisible();
  await expect(teslaHeroLogo).toBeVisible();
  
  const teslaCompanyName = page.locator('header h1');
  await expect(teslaCompanyName).toHaveText('Tesla');
  
  const teslaDemoText = page.locator('span:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(teslaDemoText).toBeVisible();
  
  console.log('✅ Tesla branding working correctly');
  
  // Test 5: Custom company (should fallback to sun icon)
  console.log('\n☀️ Testing custom company (should show sun icon)...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=CustomCompany&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check custom company name (should be capitalized)
  const customCompanyName = page.locator('header h1');
  await expect(customCompanyName).toHaveText('Customcompany');
  
  const customDemoText = page.locator('span:has-text("Private demo for Customcompany. Not affiliated.")');
  await expect(customDemoText).toBeVisible();
  
  console.log('✅ Custom company branding working correctly');
  
  // Take screenshots for visual verification
  await page.screenshot({ path: 'dynamic-company-test.png', fullPage: true });
  
  console.log('\n🎉 All dynamic company branding tests passed!');
  console.log('✅ Logos, company names, and demo text all change based on URL parameters');
  console.log('✅ No hardcoded values - everything is dynamic!');
});
