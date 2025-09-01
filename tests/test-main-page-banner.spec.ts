import { test, expect } from '@playwright/test';

test('Test Main Page Banner Shows Logo', async ({ page }) => {
  console.log('🚀 Testing main page banner shows logo properly...');
  
  // Navigate to main page with demo parameters
  await page.goto('http://localhost:3000/?demo=1&company=Apple');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded!');
  
  // Verify the banner shows logo instead of weird text
  console.log('🔍 Checking banner shows logo...');
  
  // Check that the Apple logo is visible in the banner (there are 2 logos, so use first)
  const bannerLogo = page.locator('img[alt="Apple logo"]').first();
  await expect(bannerLogo).toBeVisible();
  console.log('✅ Apple logo is visible in banner');
  
  // Check that company name is visible in the banner (not in weird text)
  const companyName = page.locator('h2').locator('text=Apple');
  await expect(companyName).toBeVisible();
  console.log('✅ Company name "Apple" is visible in banner');
  
  // Check that "Solar Intelligence" is visible in the banner
  const solarIntelligence = page.locator('p.text-xs.font-semibold.text-gray-500.tracking-widest.uppercase');
  await expect(solarIntelligence).toBeVisible();
  console.log('✅ "SOLAR INTELLIGENCE" text is visible in banner');
  
  // Verify that the weird text is NOT present
  const weirdText = page.locator('text=Demo for Apple — Powered by Sunspire');
  const weirdTextCount = await weirdText.count();
  expect(weirdTextCount).toBe(0);
  console.log('✅ Weird text "Demo for Apple — Powered by Sunspire" is NOT present');
  
  // Check that the address input field is present for autosuggest testing
  console.log('🔍 Checking address input for autosuggest...');
  
  const addressInput = page.locator('input[placeholder*="address"]');
  const inputCount = await addressInput.count();
  
  if (inputCount > 0) {
    console.log('✅ Address input field found on main page');
    
    // Try typing in the address field to test autosuggest
    await addressInput.first().click();
    await addressInput.first().fill('123 Main St');
    
    // Wait a moment for autosuggest to potentially appear
    await page.waitForTimeout(3000);
    
    // Check if autosuggest dropdown appears
    const autosuggestDropdown = page.locator('.autocomplete-dropdown, [role="listbox"], .predictions, .address-suggestions');
    const dropdownCount = await autosuggestDropdown.count();
    
    if (dropdownCount > 0) {
      console.log('✅ Autosuggest dropdown appeared');
    } else {
      console.log('⚠️ Autosuggest dropdown did not appear - may need API key');
    }
  } else {
    console.log('⚠️ No address input field found on main page');
  }
  
  console.log('🎉 Main page banner test complete!');
  console.log('📱 You should see:');
  console.log('   - Apple logo in banner (not weird text)');
  console.log('   - "Apple" company name in banner');
  console.log('   - "SOLAR INTELLIGENCE" text in banner');
  console.log('   - NO "Demo for Apple — Powered by Sunspire" text');
  console.log('   - Address input field for autosuggest testing');
  
  // Take a screenshot to show the result
  await page.screenshot({ path: 'test-results/main-page-banner-test.png', fullPage: true });
  console.log('📸 Screenshot saved: main-page-banner-test.png');
  
  console.log('🔍 Browser will stay open for 2 minutes for visual inspection...');
  console.log('👀 Verify: Logo in banner + address input for autosuggest');
  
  // Keep browser open for inspection
  await page.waitForTimeout(120000); // 2 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
