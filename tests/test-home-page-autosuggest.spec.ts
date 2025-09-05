import { test, expect } from '@playwright/test';

test('Test Home Page Address Autosuggest', async ({ page }) => {
  console.log('🔍 Testing home page address autosuggest...');
  
  // Test the live home page
  const homeUrl = 'https://sunspire-web-app.vercel.app/';
  
  console.log('🌐 Navigating to home page...');
  await page.goto(homeUrl);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  console.log('🏠 Looking for address input on home page...');
  
  // Look for address input with various selectors
  const addressInputs = [
    'input[placeholder*="address"]',
    'input[placeholder*="Address"]',
    'input[placeholder*="Enter your address"]',
    'input[placeholder*="address"]',
    'input[type="text"]',
    'input[name*="address"]',
    'input[id*="address"]'
  ];
  
  let inputFound = false;
  let inputElement = null;
  
  for (const selector of addressInputs) {
    const elements = page.locator(selector);
    const count = await elements.count();
    console.log(`📊 Found ${count} elements with selector: ${selector}`);
    
    if (count > 0) {
      inputFound = true;
      inputElement = elements.first();
      console.log(`✅ Found address input with selector: ${selector}`);
      break;
    }
  }
  
  if (inputFound && inputElement) {
    console.log('✅ Address input found on home page');
    
    // Test typing in the input
    await inputElement.click();
    await inputElement.fill('123 Main St, New York');
    
    // Wait for autosuggest to potentially appear
    await page.waitForTimeout(3000);
    
    // Check for autosuggest dropdown
    const autosuggestSelectors = [
      '.pac-container',
      '[role="listbox"]',
      '.autocomplete-suggestions',
      '.pac-item',
      '.suggestions',
      '.dropdown-menu'
    ];
    
    let autosuggestFound = false;
    for (const selector of autosuggestSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      console.log(`📊 Found ${count} autosuggest elements with selector: ${selector}`);
      
      if (count > 0) {
        autosuggestFound = true;
        console.log(`✅ Autosuggest found with selector: ${selector}`);
        break;
      }
    }
    
    if (autosuggestFound) {
      console.log('✅ Address autosuggest is working on home page');
    } else {
      console.log('❌ Address autosuggest not working on home page');
    }
  } else {
    console.log('❌ No address input found on home page');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'home-page-autosuggest-test.png' });
  console.log('📸 Screenshot saved as home-page-autosuggest-test.png');
  
  console.log('🎯 HOME PAGE AUTOSUGGEST TEST COMPLETE');
});
