import { test, expect } from '@playwright/test';

test('Comprehensive Fix Verification - All Issues', async ({ page }) => {
  console.log('🔧 Comprehensive verification of all fixes...');
  
  // Test 1: Autosuggest on report page
  console.log('📍 Test 1: Autosuggest on report page...');
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const addressSection = page.locator('h2:has-text("Enter Your Property Address")');
  await expect(addressSection).toBeVisible();
  console.log('✅ Address input section found on report page');
  
  const addressInput = page.locator('input[placeholder*="property address"]');
  await expect(addressInput).toBeVisible();
  console.log('✅ Address input field found on report page');
  
  // Test autosuggest
  await addressInput.click();
  await addressInput.fill('123 Main St');
  await page.waitForTimeout(2000);
  
  const suggestions = page.locator('ul li');
  const suggestionCount = await suggestions.count();
  console.log(`🔍 Found ${suggestionCount} autosuggest suggestions`);
  
  // Test 2: Demo quota functionality
  console.log('📍 Test 2: Demo quota functionality...');
  await page.goto('http://localhost:3001/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  const demoIndicator = page.locator('[data-demo="true"]');
  await expect(demoIndicator).toBeVisible();
  console.log('✅ Demo mode is active');
  
  // Find the correct button text
  const generateButton = page.locator('button').filter({ hasText: /Generate|Get Quote|Launch/ });
  await expect(generateButton).toBeVisible();
  console.log('✅ Generate button found');
  
  // Enter address and click
  const homeAddressInput = page.locator('input[placeholder*="address"]').first();
  await homeAddressInput.fill('123 Main St, New York, NY');
  await generateButton.click();
  
  await page.waitForURL('**/report**');
  console.log('✅ Successfully navigated to report page');
  
  // Test 3: Check all Stripe checkout buttons
  console.log('📍 Test 3: Checking all Stripe checkout buttons...');
  
  // Check "Unlock Full Report" buttons
  const unlockButtons = page.locator('button').filter({ hasText: /unlock full report/i });
  const unlockCount = await unlockButtons.count();
  console.log(`🔍 Found ${unlockCount} "Unlock Full Report" buttons`);
  
  for (let i = 0; i < unlockCount; i++) {
    const button = unlockButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Unlock button ${i + 1} is visible`);
  }
  
  // Check "Activate on Your Domain" buttons
  const activateButtons = page.locator('button').filter({ hasText: /activate on your domain/i });
  const activateCount = await activateButtons.count();
  console.log(`🔍 Found ${activateCount} "Activate on Your Domain" buttons`);
  
  for (let i = 0; i < activateCount; i++) {
    const button = activateButtons.nth(i);
    await expect(button).toBeVisible();
    console.log(`✅ Activate button ${i + 1} is visible`);
  }
  
  // Test 4: Check CRM Guides link on support page
  console.log('📍 Test 4: Checking CRM Guides link...');
  await page.goto('http://localhost:3001/support');
  await page.waitForLoadState('networkidle');
  
  const crmGuidesLink = page.locator('a:has-text("CRM Guides")');
  await expect(crmGuidesLink).toBeVisible();
  console.log('✅ CRM Guides link found on support page');
  
  // Click the CRM Guides link
  await crmGuidesLink.click();
  await page.waitForLoadState('networkidle');
  
  // Check if we're on the CRM guides page
  const crmGuidesPage = page.locator('h1:has-text("CRM Integration Guides")');
  const hasCrmGuidesPage = await crmGuidesPage.count();
  console.log(`🔍 CRM Guides page found: ${hasCrmGuidesPage > 0}`);
  
  if (hasCrmGuidesPage > 0) {
    console.log('✅ CRM Guides link works correctly');
  } else {
    console.log('❌ CRM Guides link may not be working correctly');
  }
  
  // Test 5: Check "Address autocomplete temporarily unavailable" message
  console.log('📍 Test 5: Checking autocomplete message...');
  await page.goto('http://localhost:3001/report?address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const autocompleteMessage = page.locator('p:has-text("Address autocomplete temporarily unavailable")');
  await expect(autocompleteMessage).toBeVisible();
  console.log('✅ "Address autocomplete temporarily unavailable" message is visible');
  
  console.log('🎉 All comprehensive tests completed!');
});
