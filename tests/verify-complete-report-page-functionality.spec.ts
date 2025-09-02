import { test, expect } from '@playwright/test';

test('Verify complete report page functionality - dynamic branding and disclaimer placement', async ({ page }) => {
  console.log('🔍 Verifying complete report page functionality...');
  
  // Test 1: Tesla
  console.log('\n🚗 Testing Tesla...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check Tesla logo in header
  const teslaHeaderLogo = page.locator('header img[alt="Tesla logo"]').first();
  await expect(teslaHeaderLogo).toBeVisible();
  const teslaHeaderLogoSrc = await teslaHeaderLogo.getAttribute('src');
  expect(teslaHeaderLogoSrc).toContain('tesla.com');
  console.log('✅ Tesla logo in header is visible and correct');
  
  // Check Tesla logo in hero section
  const teslaHeroLogo = page.locator('main img[alt="Tesla logo"]').first();
  await expect(teslaHeroLogo).toBeVisible();
  const teslaHeroLogoSrc = await teslaHeroLogo.getAttribute('src');
  expect(teslaHeroLogoSrc).toContain('tesla.com');
  console.log('✅ Tesla logo in hero section is visible and correct');
  
  // Check Tesla company name in header
  const teslaCompanyName = page.locator('header h1');
  await expect(teslaCompanyName).toHaveText('Tesla');
  console.log('✅ Tesla company name in header is correct');
  
  // Check disclaimer under header
  const teslaDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(teslaDisclaimer).toBeVisible();
  console.log('✅ Tesla disclaimer under header is visible and correct');
  
  // Test 2: Apple
  console.log('\n🍎 Testing Apple...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check Apple logo in header
  const appleHeaderLogo = page.locator('header img[alt="Apple logo"]').first();
  await expect(appleHeaderLogo).toBeVisible();
  const appleHeaderLogoSrc = await appleHeaderLogo.getAttribute('src');
  expect(appleHeaderLogoSrc).toContain('apple.com');
  console.log('✅ Apple logo in header is visible and correct');
  
  // Check Apple logo in hero section
  const appleHeroLogo = page.locator('main img[alt="Apple logo"]').first();
  await expect(appleHeroLogo).toBeVisible();
  const appleHeroLogoSrc = await appleHeroLogo.getAttribute('src');
  expect(appleHeroLogoSrc).toContain('apple.com');
  console.log('✅ Apple logo in hero section is visible and correct');
  
  // Check Apple company name in header
  const appleCompanyName = page.locator('header h1');
  await expect(appleCompanyName).toHaveText('Apple');
  console.log('✅ Apple company name in header is correct');
  
  // Check disclaimer under header
  const appleDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Apple. Not affiliated.")');
  await expect(appleDisclaimer).toBeVisible();
  console.log('✅ Apple disclaimer under header is visible and correct');
  
  // Test 3: Amazon
  console.log('\n📦 Testing Amazon...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check Amazon logo in header
  const amazonHeaderLogo = page.locator('header img[alt="Amazon logo"]').first();
  await expect(amazonHeaderLogo).toBeVisible();
  const amazonHeaderLogoSrc = await amazonHeaderLogo.getAttribute('src');
  expect(amazonHeaderLogoSrc).toContain('amazon.com');
  console.log('✅ Amazon logo in header is visible and correct');
  
  // Check Amazon logo in hero section
  const amazonHeroLogo = page.locator('main img[alt="Amazon logo"]').first();
  await expect(amazonHeroLogo).toBeVisible();
  const amazonHeroLogoSrc = await amazonHeroLogo.getAttribute('src');
  expect(amazonHeroLogoSrc).toContain('amazon.com');
  console.log('✅ Amazon logo in hero section is visible and correct');
  
  // Check Amazon company name in header
  const amazonCompanyName = page.locator('header h1');
  await expect(amazonCompanyName).toHaveText('Amazon');
  console.log('✅ Amazon company name in header is correct');
  
  // Check disclaimer under header
  const amazonDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Amazon. Not affiliated.")');
  await expect(amazonDisclaimer).toBeVisible();
  console.log('✅ Amazon disclaimer under header is visible and correct');
  
  // Test 4: Google
  console.log('\n🔍 Testing Google...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check Google logo in header
  const googleHeaderLogo = page.locator('header img[alt="Google logo"]').first();
  await expect(googleHeaderLogo).toBeVisible();
  const googleHeaderLogoSrc = await googleHeaderLogo.getAttribute('src');
  expect(googleHeaderLogoSrc).toContain('google.com');
  console.log('✅ Google logo in header is visible and correct');
  
  // Check Google logo in hero section
  const googleHeroLogo = page.locator('main img[alt="Google logo"]').first();
  await expect(googleHeroLogo).toBeVisible();
  const googleHeroLogoSrc = await googleHeroLogo.getAttribute('src');
  expect(googleHeroLogoSrc).toContain('google.com');
  console.log('✅ Google logo in hero section is visible and correct');
  
  // Check Google company name in header
  const googleCompanyName = page.locator('header h1');
  await expect(googleCompanyName).toHaveText('Google');
  console.log('✅ Google company name in header is correct');
  
  // Check disclaimer under header
  const googleDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Google. Not affiliated.")');
  await expect(googleDisclaimer).toBeVisible();
  console.log('✅ Google disclaimer under header is visible and correct');
  
  // Test 5: Custom company (should show sun icon)
  console.log('\n☀️ Testing Custom Company...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=CustomCompany&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check custom company name in header (should be capitalized)
  const customCompanyName = page.locator('header h1');
  await expect(customCompanyName).toHaveText('Customcompany');
  console.log('✅ Custom company name in header is correct');
  
  // Check disclaimer under header
  const customDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Customcompany. Not affiliated.")');
  await expect(customDisclaimer).toBeVisible();
  console.log('✅ Custom company disclaimer under header is visible and correct');
  
  // Test 6: Verify the new text is showing
  console.log('\n📝 Testing new text content...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that the new text "Ready to Launch Your Branded Tool?" is showing
  const newText = page.locator('p:has-text("Ready to Launch Your Branded Tool?")');
  await expect(newText).toBeVisible();
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing');
  
  // Check that the old text is NOT showing
  const oldText = page.locator('p:has-text("A ready-to-deploy solar intelligence tool — live on your site in 24 hours.")');
  await expect(oldText).not.toBeVisible();
  console.log('✅ Old text is correctly NOT showing');
  
  // Take screenshots for visual verification
  await page.screenshot({ path: 'complete-report-page-verification.png', fullPage: true });
  
  console.log('\n🎉 All report page functionality verified successfully!');
  console.log('✅ Company logos and names change dynamically based on URL');
  console.log('✅ Disclaimer text appears under header for all companies');
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing');
  console.log('✅ Old text is removed');
  console.log('✅ No hardcoded values - everything is dynamic!');
});
