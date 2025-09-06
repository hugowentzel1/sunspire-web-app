import { test, expect } from '@playwright/test';

test('Comprehensive AddressAutocomplete Test', async ({ page, context }) => {
  console.log('🔍 Comprehensive AddressAutocomplete Test...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
    console.log('Console:', message);
  });
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(8000);
  
  // Check if Google Maps API is loaded
  const apiLoaded = await page.evaluate(() => {
    return typeof window.google !== 'undefined' && 
           typeof window.google.maps !== 'undefined' && 
           typeof window.google.maps.places !== 'undefined';
  });
  
  console.log('✅ Google Maps API loaded:', apiLoaded);
  
  if (!apiLoaded) {
    console.log('❌ Google Maps API not loaded, skipping test');
    return;
  }
  
  // Find address input
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  // Type in the input
  console.log('📍 Typing "123 Main St, New York"...');
  await addressInput.fill('123 Main St, New York');
  
  // Wait for autocomplete
  await page.waitForTimeout(3000);
  
  // Check for any dropdown elements
  const dropdowns = await page.$$('.absolute.z-10, [class*="dropdown"], [class*="suggestion"]');
  console.log('📍 Dropdown elements found:', dropdowns.length);
  
  // Check for Google Places Autocomplete elements
  const pacElements = await page.$$('[class*="pac-"]');
  console.log('📍 PAC elements found:', pacElements.length);
  
  // Check console messages for autocomplete
  const autocompleteMessages = consoleMessages.filter(msg => 
    msg.toLowerCase().includes('autocomplete') || 
    msg.toLowerCase().includes('places') ||
    msg.toLowerCase().includes('prediction') ||
    msg.toLowerCase().includes('searching for')
  );
  console.log('📍 Autocomplete console messages:', autocompleteMessages.length);
  if (autocompleteMessages.length > 0) {
    console.log('Autocomplete messages:', autocompleteMessages);
  }
  
  // Check if the component is actually executing
  const componentMessages = consoleMessages.filter(msg => 
    msg.includes('Google Places API is ready') ||
    msg.includes('searching for') ||
    msg.includes('Autocomplete response')
  );
  console.log('📍 Component execution messages:', componentMessages.length);
  if (componentMessages.length > 0) {
    console.log('Component messages:', componentMessages);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-comprehensive-test.png', fullPage: true });
  
  console.log('🔍 Comprehensive test complete');
});
