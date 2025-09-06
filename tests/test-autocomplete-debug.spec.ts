import { test, expect } from '@playwright/test';

test('Debug AddressAutocomplete Component', async ({ page, context }) => {
  console.log('🔍 Debugging AddressAutocomplete Component...');
  
  // Clear all storage and cookies for fresh start
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
    console.log('Console:', message);
  });
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  // Wait for Google Maps API to load
  console.log('⏳ Waiting for Google Maps API to load...');
  await page.waitForTimeout(8000);
  
  // Check if AddressAutocomplete component is rendered
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  const inputExists = await addressInput.count() > 0;
  console.log('📍 Address input exists:', inputExists);
  
  if (inputExists) {
    const placeholder = await addressInput.getAttribute('placeholder');
    console.log('📍 Input placeholder:', placeholder);
    
    // Check if the input has the expected classes from AddressAutocomplete
    const className = await addressInput.getAttribute('class');
    console.log('📍 Input classes:', className);
    
    // Type in the input
    console.log('📍 Typing "123 Main St, New York"...');
    await addressInput.fill('123 Main St, New York');
    
    // Wait for autocomplete
    await page.waitForTimeout(3000);
    
    // Check for any dropdown elements
    const dropdowns = await page.$$('.absolute.z-10, [class*="dropdown"], [class*="suggestion"]');
    console.log('📍 Dropdown elements found:', dropdowns.length);
    
    // Check for any elements with "suggestion" in class name
    const suggestionElements = await page.$$('[class*="suggestion"]');
    console.log('📍 Suggestion elements found:', suggestionElements.length);
    
    // Check for any elements with "autocomplete" in class name
    const autocompleteElements = await page.$$('[class*="autocomplete"]');
    console.log('📍 Autocomplete elements found:', autocompleteElements.length);
    
    // Check for any elements with "pac-" (Google Places Autocomplete) class names
    const pacElements = await page.$$('[class*="pac-"]');
    console.log('📍 PAC elements found:', pacElements.length);
    
    // Check if there are any error messages in console
    const errorMessages = consoleMessages.filter(msg => msg.includes('error'));
    console.log('🚨 Error messages:', errorMessages.length);
    if (errorMessages.length > 0) {
      console.log('Error details:', errorMessages);
    }
    
    // Check for Google Places API specific messages
    const googleMessages = consoleMessages.filter(msg => 
      msg.toLowerCase().includes('google') || 
      msg.toLowerCase().includes('places') || 
      msg.toLowerCase().includes('autocomplete')
    );
    console.log('🗺️ Google/Places messages:', googleMessages.length);
    if (googleMessages.length > 0) {
      console.log('Google details:', googleMessages);
    }
  }
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-debug-test.png', fullPage: true });
  
  console.log('🔍 AddressAutocomplete debug complete');
});
