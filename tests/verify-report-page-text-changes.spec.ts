import { test, expect } from '@playwright/test';

test('Verify report page text changes - new banner and removed old text', async ({ page }) => {
  console.log('🔍 Verifying report page text changes...');
  
  // Test with Tesla
  console.log('\n🚗 Testing Tesla...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the new text "Ready to Launch Your Branded Tool?" is showing
  const newText = page.locator('p:has-text("Ready to Launch Your Branded Tool?")');
  await expect(newText).toBeVisible();
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing');
  
  // Check that the old text "A ready-to-deploy solar intelligence tool — live on your site in 24 hours." is NOT showing
  const oldText = page.locator('p:has-text("A ready-to-deploy solar intelligence tool — live on your site in 24 hours.")');
  await expect(oldText).not.toBeVisible();
  console.log('✅ Old text "A ready-to-deploy solar intelligence tool — live on your site in 24 hours." is correctly NOT showing');
  
  // Check that the old "Private demo for Tesla. Not affiliated." text is NOT showing in the main content
  const oldDemoText = page.locator('span:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(oldDemoText).not.toBeVisible();
  console.log('✅ Old demo text "Private demo for Tesla. Not affiliated." is correctly NOT showing in main content');
  
  // Check that the new banner footer "Private demo for Tesla. Not affiliated." is showing
  const newBannerText = page.locator('div.border-t.border-gray-100 p:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(newBannerText).toBeVisible();
  console.log('✅ New banner footer "Private demo for Tesla. Not affiliated." is showing');
  
  // Test with Apple
  console.log('\n🍎 Testing Apple...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the new text is showing for Apple
  const appleNewText = page.locator('p:has-text("Ready to Launch Your Branded Tool?")');
  await expect(appleNewText).toBeVisible();
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing for Apple');
  
  // Check that the new banner footer is showing for Apple
  const appleBannerText = page.locator('div.border-t.border-gray-100 p:has-text("Private demo for Apple. Not affiliated.")');
  await expect(appleBannerText).toBeVisible();
  console.log('✅ New banner footer "Private demo for Apple. Not affiliated." is showing for Apple');
  
  // Test with Amazon
  console.log('\n📦 Testing Amazon...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the new text is showing for Amazon
  const amazonNewText = page.locator('p:has-text("Ready to Launch Your Branded Tool?")');
  await expect(amazonNewText).toBeVisible();
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing for Amazon');
  
  // Check that the new banner footer is showing for Amazon
  const amazonBannerText = page.locator('div.border-t.border-gray-100 p:has-text("Private demo for Amazon. Not affiliated.")');
  await expect(amazonBannerText).toBeVisible();
  console.log('✅ New banner footer "Private demo for Amazon. Not affiliated." is showing for Amazon');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'report-page-text-changes-verification.png', fullPage: true });
  
  console.log('\n🎉 All text changes verified successfully!');
  console.log('✅ New text "Ready to Launch Your Branded Tool?" is showing');
  console.log('✅ Old text "A ready-to-deploy solar intelligence tool — live on your site in 24 hours." is removed');
  console.log('✅ Old demo text is removed from main content');
  console.log('✅ New banner footer "Private demo for [Company]. Not affiliated." is showing');
  console.log('✅ All changes work dynamically for different companies!');
});
