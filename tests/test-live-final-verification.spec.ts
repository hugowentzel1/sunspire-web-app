import { test, expect } from '@playwright/test';

test('Live Site Final Verification', async ({ page, context }) => {
  console.log('🎯 Live Site Final Verification...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
  });
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(8000);
  
  // Test 1: Address Autocomplete
  console.log('📍 Testing Address Autocomplete...');
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type address to trigger autocomplete
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(3000);
  
  // Check for dropdown
  const autocompleteDropdown = page.locator('.absolute.z-10');
  const dropdownVisible = await autocompleteDropdown.isVisible();
  console.log('📍 Autocomplete dropdown visible:', dropdownVisible);
  
  if (dropdownVisible) {
    const suggestions = autocompleteDropdown.locator('div[class*="px-3 py-2 cursor-pointer"]');
    const suggestionCount = await suggestions.count();
    console.log('📍 Number of suggestions:', suggestionCount);
    
    if (suggestionCount > 0) {
      // Click on first suggestion
      const firstSuggestion = suggestions.first();
      const suggestionText = await firstSuggestion.textContent();
      console.log('📍 Clicking suggestion:', suggestionText);
      
      await firstSuggestion.click();
      await page.waitForTimeout(2000);
      
      // Verify we're still on home page and input is filled
      const isOnHomePage = await page.locator('button:has-text("Generate"), button:has-text("Launch")').isVisible();
      const inputValue = await addressInput.inputValue();
      
      console.log('📍 Still on home page:', isOnHomePage);
      console.log('📍 Input filled with:', inputValue);
      
      if (isOnHomePage && inputValue.includes('New York')) {
        console.log('✅ Address autocomplete working correctly');
      } else {
        console.log('❌ Address autocomplete issue');
      }
    }
  }
  
  // Test 2: Generate Report (First Run)
  console.log('📍 Testing First Generate Report...');
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
  await generateButton.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check if we're on report page
  const isReportPage = await page.locator('text=System Size').isVisible();
  const isLockoutPage = await page.locator('text=Demo limit reached').isVisible();
  
  console.log('📍 First run - Report page:', isReportPage);
  console.log('📍 First run - Lockout page:', isLockoutPage);
  
  if (isReportPage) {
    console.log('✅ First report generated successfully');
    
    // Go back for second run
    console.log('📍 Going back for second run...');
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test 3: Second Generate Report
    console.log('📍 Testing Second Generate Report...');
    const addressInput2 = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
    await addressInput2.fill('456 Oak Ave, Los Angeles');
    await page.waitForTimeout(1000);
    
    const generateButton2 = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
    await generateButton2.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if we're on report page or lockout
    const isReportPage2 = await page.locator('text=System Size').isVisible();
    const isLockoutPage2 = await page.locator('text=Demo limit reached').isVisible();
    
    console.log('📍 Second run - Report page:', isReportPage2);
    console.log('📍 Second run - Lockout page:', isLockoutPage2);
    
    if (isReportPage2) {
      console.log('✅ Second report generated successfully');
      
      // Go back for third run (should lockout)
      console.log('📍 Going back for third run (should lockout)...');
      await page.goBack();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Test 4: Third Generate Report (Should Lockout)
      console.log('📍 Testing Third Generate Report (should lockout)...');
      const addressInput3 = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
      await addressInput3.fill('789 Pine St, Chicago');
      await page.waitForTimeout(1000);
      
      const generateButton3 = page.locator('button:has-text("Generate"), button:has-text("Launch")').first();
      await generateButton3.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Check lockout message
      const lockoutMessage = await page.locator('text=Demo limit reached').isVisible();
      const upgradeMessage = await page.locator('text=Upgrade to continue').isVisible();
      
      console.log('📍 Lockout message "Demo limit reached":', lockoutMessage);
      console.log('📍 "Upgrade to continue" message:', upgradeMessage);
      
      if (lockoutMessage && upgradeMessage) {
        console.log('✅ Lockout working with improved messaging');
      } else {
        console.log('❌ Lockout message issue');
      }
    } else if (isLockoutPage2) {
      console.log('❌ Only 1 run available - should be 2 runs');
    }
  } else if (isLockoutPage) {
    console.log('❌ Locked out immediately - should allow 2 runs');
  }
  
  // Test 5: Check for any errors
  const errorMessages = consoleMessages.filter(msg => msg.includes('error') || msg.includes('Error'));
  if (errorMessages.length > 0) {
    console.log('🚨 Error messages found:', errorMessages.length);
  } else {
    console.log('✅ No error messages');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'live-final-verification.png', fullPage: true });
  
  console.log('🎯 Live site verification complete');
});
