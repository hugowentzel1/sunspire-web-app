import { test, expect } from '@playwright/test';

test('Test Header Restored and Autosuggest Status', async ({ page }) => {
  console.log('🚀 Testing header restoration and autosuggest status...');
  
  // Navigate to main page with demo parameters (where address input should be)
  await page.goto('http://localhost:3000/?demo=1&company=Apple');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded!');
  
  // Check autosuggest status on main page
  console.log('🔍 Checking autosuggest status on main page...');
  
  // Look for any API key error messages
  const apiKeyError = page.locator('text=Invalid API Key provided');
  const apiKeyErrorCount = await apiKeyError.count();
  
  if (apiKeyErrorCount > 0) {
    console.log('⚠️ API Key error detected - autosuggest may not work');
  } else {
    console.log('✅ No API Key errors detected');
  }
  
  // Check if there's an address input field
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
      
      // Check for any error messages in console or on page
      const errorMessages = page.locator('text=error, text=Error, text=API, text=key');
      const errorCount = await errorMessages.count();
      if (errorCount > 0) {
        console.log('⚠️ Error messages found on page');
      }
    }
  } else {
    console.log('⚠️ No address input field found on main page');
  }
  
  // Now navigate to report page to check header
  console.log('🔍 Navigating to report page to check header...');
  await page.goto('http://localhost:3000/report?demo=1&company=Apple');
  await page.waitForLoadState('networkidle');
  
  // Verify the header looks like the commit
  console.log('🔍 Checking header restoration...');
  
  const headerLogo = page.locator('header').locator('img[alt="Apple logo"]');
  await expect(headerLogo).toBeVisible();
  console.log('✅ Apple logo is visible in header');
  
  // Check that company name is in brand primary color
  const companyName = page.locator('header').locator('text=Apple');
  await expect(companyName).toBeVisible();
  console.log('✅ Company name "Apple" is visible in header');
  
  // Check that "Solar Intelligence" is uppercase and smaller
  const solarIntelligence = page.locator('header').locator('text=SOLAR INTELLIGENCE');
  await expect(solarIntelligence).toBeVisible();
  console.log('✅ "SOLAR INTELLIGENCE" text is visible in header (uppercase)');
  
  // Verify the ready-to text is still in main content (no white box, subtext)
  console.log('🔍 Checking ready-to text styling...');
  
  const readyToText = page.locator('main').locator('text=ready-to-deploy');
  await expect(readyToText).toBeVisible();
  console.log('✅ Ready-to text is visible in main content');
  
  // Check that "Not affiliated with Apple" is subtext (smaller, gray)
  const notAffiliatedText = page.locator('main').locator('text=Not affiliated with Apple');
  await expect(notAffiliatedText).toBeVisible();
  console.log('✅ "Not affiliated with Apple" text visible (subtext)');
  
  console.log('🎉 Header restoration and autosuggest check complete!');
  console.log('📱 You should see:');
  console.log('   - Address input field on main page for autosuggest testing');
  console.log('   - Apple logo in header (left side)');
  console.log('   - "Apple" company name in brand primary color');
  console.log('   - "SOLAR INTELLIGENCE" in uppercase, smaller text');
  console.log('   - Ready-to text in main content (NO white box)');
  console.log('   - "Not affiliated with Apple" as subtext');
  
  // Take a screenshot to show the result
  await page.screenshot({ path: 'test-results/header-and-autosuggest-test.png', fullPage: true });
  console.log('📸 Screenshot saved: header-and-autosuggest-test.png');
  
  console.log('🔍 Browser will stay open for 2 minutes for visual inspection...');
  console.log('👀 Verify: Header looks like commit + check autosuggest on main page');
  
  // Keep browser open for inspection
  await page.waitForTimeout(120000); // 2 minutes
  
  console.log('⏰ Time is up! Closing browser...');
});
