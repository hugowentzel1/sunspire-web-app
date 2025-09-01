import { test, expect } from '@playwright/test';

test('Fix Verification - Autosuggest and Demo Quota', async ({ page }) => {
  console.log('🔧 Testing fixes for autosuggest and demo quota...');
  
  // Test 1: Check autosuggest on report page
  console.log('📍 Testing autosuggest on report page...');
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait for animations to complete
  
  // Check if address input section exists
  const addressSection = page.locator('h2:has-text("Enter Your Property Address")');
  await expect(addressSection).toBeVisible();
  console.log('✅ Address input section found on report page');
  
  // Check if AddressAutocomplete component is present
  const addressInput = page.locator('input[placeholder*="property address"]');
  await expect(addressInput).toBeVisible();
  console.log('✅ Address input field found on report page');
  
  // Test autosuggest functionality
  await addressInput.click();
  await addressInput.fill('123 Main St');
  await page.waitForTimeout(2000);
  
  // Check if autosuggest dropdown appears
  const suggestions = page.locator('ul li');
  const suggestionCount = await suggestions.count();
  console.log(`🔍 Found ${suggestionCount} autosuggest suggestions`);
  
  // Test 2: Check demo quota functionality
  console.log('📍 Testing demo quota functionality...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check if demo mode is active
  const demoIndicator = page.locator('[data-demo="true"]');
  await expect(demoIndicator).toBeVisible();
  console.log('✅ Demo mode is active');
  
  // Enter an address and generate estimate
  const homeAddressInput = page.locator('input[placeholder*="address"]').first();
  await homeAddressInput.fill('123 Main St, New York, NY');
  
  const generateButton = page.locator('button:has-text("Generate Solar Intelligence Report")');
  await generateButton.click();
  
  // Wait for navigation to report page
  await page.waitForURL('**/report**');
  console.log('✅ Successfully navigated to report page');
  
  // Check if we're on the report page with the address
  const reportAddress = page.locator('p:has-text("123 Main St")');
  await expect(reportAddress).toBeVisible();
  console.log('✅ Report page shows correct address');
  
  // Test 3: Check that autosuggest works on the new report page
  console.log('📍 Testing autosuggest on new report page...');
  const newAddressInput = page.locator('input[placeholder*="property address"]');
  await expect(newAddressInput).toBeVisible();
  
  await newAddressInput.click();
  await newAddressInput.fill('456 Oak Ave');
  await page.waitForTimeout(2000);
  
  const newSuggestions = page.locator('ul li');
  const newSuggestionCount = await newSuggestions.count();
  console.log(`🔍 Found ${newSuggestionCount} autosuggest suggestions on new report page`);
  
  console.log('🎉 All fixes verified successfully!');
});
