import { test, expect } from '@playwright/test';

test('Test AddressAutocomplete Component Mounting', async ({ page, context }) => {
  console.log('🔍 Testing AddressAutocomplete Component Mounting...');
  
  await context.clearCookies();
  await context.clearPermissions();
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
  });
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(8000);
  
  // Check if the input has the expected classes from AddressAutocomplete
  const addressInput = page.locator('input[placeholder*="address"], input[placeholder*="Address"]').first();
  await expect(addressInput).toBeVisible();
  
  const className = await addressInput.getAttribute('class');
  console.log('📍 Input classes:', className);
  
  // Check if the input has the expected classes from AddressAutocomplete
  const hasExpectedClasses = className?.includes('w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent');
  console.log('📍 Has expected AddressAutocomplete classes:', hasExpectedClasses);
  
  // Check if there's a parent div with relative class (from AddressAutocomplete)
  const parentDiv = addressInput.locator('..');
  const parentClass = await parentDiv.getAttribute('class');
  console.log('📍 Parent div classes:', parentClass);
  
  // Check if there's a loading spinner (from AddressAutocomplete)
  const loadingSpinner = page.locator('.animate-spin.rounded-full.h-4.w-4.border-b-2.border-blue-500');
  const spinnerExists = await loadingSpinner.count() > 0;
  console.log('📍 Loading spinner exists:', spinnerExists);
  
  // Check for any AddressAutocomplete specific elements
  const autocompleteContainer = page.locator('.relative');
  const containerCount = await autocompleteContainer.count();
  console.log('📍 Relative containers found:', containerCount);
  
  // Check console messages for component mounting
  const componentMessages = consoleMessages.filter(msg => 
    msg.includes('Google Maps API key') ||
    msg.includes('Google Places API loaded') ||
    msg.includes('Google Maps script already exists')
  );
  console.log('📍 Component mounting messages:', componentMessages.length);
  if (componentMessages.length > 0) {
    console.log('Component messages:', componentMessages);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'component-mounting-test.png', fullPage: true });
  
  console.log('🔍 Component mounting test complete');
});
