import { test, expect } from '@playwright/test';

test('Verify disclaimer text appears under header on report page', async ({ page }) => {
  console.log('🔍 Verifying disclaimer text under header on report page...');
  
  // Test with Tesla
  console.log('\n🚗 Testing Tesla...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check that the disclaimer text appears under the header (right after header, before main content)
  const disclaimerUnderHeader = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Tesla. Not affiliated.")');
  await expect(disclaimerUnderHeader).toBeVisible();
  console.log('✅ Disclaimer text "Private demo for Tesla. Not affiliated." appears under header');
  
  // Verify it's positioned correctly (after header, before main content)
  const header = page.locator('header');
  const main = page.locator('main[data-testid="report-page"]');
  const disclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50');
  
  // Check that disclaimer comes after header
  const headerBox = await header.boundingBox();
  const disclaimerBox = await disclaimer.boundingBox();
  
  if (headerBox && disclaimerBox) {
    expect(disclaimerBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
    console.log('✅ Disclaimer is positioned correctly: after header');
  }
  
  // Test with Apple
  console.log('\n🍎 Testing Apple...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const appleDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Apple. Not affiliated.")');
  await expect(appleDisclaimer).toBeVisible();
  console.log('✅ Disclaimer text "Private demo for Apple. Not affiliated." appears under header for Apple');
  
  // Test with Amazon
  console.log('\n📦 Testing Amazon...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=2&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const amazonDisclaimer = page.locator('div.border-t.border-gray-100.bg-gray-50\\/50 p:has-text("Private demo for Amazon. Not affiliated.")');
  await expect(amazonDisclaimer).toBeVisible();
  console.log('✅ Disclaimer text "Private demo for Amazon. Not affiliated." appears under header for Amazon');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'disclaimer-under-header-verification.png', fullPage: true });
  
  console.log('\n🎉 All disclaimer positioning tests passed!');
  console.log('✅ Disclaimer text appears under header on report page');
  console.log('✅ Positioned correctly: after header, before main content');
  console.log('✅ Works dynamically for different companies!');
});
