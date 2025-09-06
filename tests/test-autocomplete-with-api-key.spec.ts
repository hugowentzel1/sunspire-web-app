import { test, expect } from '@playwright/test';

test('Test Address Autocomplete with API Key Check', async ({ page }) => {
  console.log('📍 Testing address autocomplete with API key check...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check if API key is available in the environment
  const apiKeyAvailable = await page.evaluate(() => {
    // Check if the API key is available in the environment
    return typeof process !== 'undefined' && 
           process.env && 
           process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  });
  
  console.log('🔑 API key available in browser:', apiKeyAvailable);
  
  // Check for any console warnings about missing API key
  const consoleWarnings: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'warn' && msg.text().includes('Google Maps API key')) {
      consoleWarnings.push(msg.text());
    }
  });
  
  const addressInput = page.locator('input[placeholder*="address"]').first();
  
  // Test input functionality
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(2000);
  
  const inputValue = await addressInput.inputValue();
  console.log('📍 Input value:', inputValue);
  
  // Check for any error messages about missing API key
  const errorMessages = await page.locator('text=Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY').count();
  console.log('❌ Error messages about missing API key:', errorMessages);
  
  // Check console warnings
  await page.waitForTimeout(2000);
  console.log('⚠️ Console warnings:', consoleWarnings);
  
  // Check if Google Maps script is loaded
  const googleMapsScriptLoaded = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    return scripts.some(script => 
      script.src && script.src.includes('maps.googleapis.com')
    );
  });
  
  console.log('📜 Google Maps script loaded:', googleMapsScriptLoaded);
  
  // Check if Google Maps API is available
  const googleMapsAPI = await page.evaluate(() => {
    return typeof window.google !== 'undefined' && 
           typeof window.google.maps !== 'undefined' &&
           typeof window.google.maps.places !== 'undefined';
  });
  
  console.log('🗺️ Google Maps API available:', googleMapsAPI);
  
  // Take screenshot
  await page.screenshot({ path: 'autocomplete-api-key-test.png', fullPage: true });
  
  console.log('📍 Autocomplete API key test complete');
  console.log('🔑 API key available:', apiKeyAvailable);
  console.log('📜 Google Maps script loaded:', googleMapsScriptLoaded);
  console.log('🗺️ Google Maps API available:', googleMapsAPI);
  console.log('⚠️ Console warnings:', consoleWarnings.length > 0 ? consoleWarnings.join(', ') : 'None');
  
  if (!apiKeyAvailable) {
    console.log('❌ Google Maps API key is not configured in Vercel environment');
    console.log('💡 To fix: Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to Vercel environment variables');
  }
});
