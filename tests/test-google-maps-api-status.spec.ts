import { test, expect } from '@playwright/test';

test('Test Google Maps API Status', async ({ page }) => {
  console.log('🗺️ Testing Google Maps API status...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
  // Check for Google Maps API errors
  const apiErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().toLowerCase().includes('google')) {
      apiErrors.push(msg.text());
    }
  });
  
  // Check for API key warnings
  const apiWarnings: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'warn' && msg.text().toLowerCase().includes('api key')) {
      apiWarnings.push(msg.text());
    }
  });
  
  // Wait for any API calls to complete
  await page.waitForTimeout(5000);
  
  // Check if Google Maps API is loaded
  const googleMapsStatus = await page.evaluate(() => {
    const hasGoogle = typeof window.google !== 'undefined';
    const hasMaps = hasGoogle && typeof window.google.maps !== 'undefined';
    const hasPlaces = hasMaps && typeof window.google.maps.places !== 'undefined';
    
    return {
      hasGoogle,
      hasMaps,
      hasPlaces,
      googleObject: hasGoogle ? Object.keys(window.google) : []
    };
  });
  
  console.log('🗺️ Google Maps API Status:', googleMapsStatus);
  console.log('❌ API Errors:', apiErrors);
  console.log('⚠️ API Warnings:', apiWarnings);
  
  // Test address input
  const addressInput = page.locator('input[placeholder*="address"]').first();
  await addressInput.fill('123 Main St, New York');
  await page.waitForTimeout(3000);
  
  // Check for autocomplete suggestions
  const suggestions = page.locator('[data-testid="suggestion"], .suggestion, [role="option"]');
  const suggestionCount = await suggestions.count();
  console.log('📍 Autocomplete suggestions found:', suggestionCount);
  
  // Take screenshot
  await page.screenshot({ path: 'google-maps-api-status.png', fullPage: true });
  
  if (apiErrors.length > 0) {
    console.log('❌ Google Maps API has errors:', apiErrors.join(', '));
  } else if (googleMapsStatus.hasPlaces) {
    console.log('✅ Google Maps Places API is working');
  } else {
    console.log('⚠️ Google Maps API is not fully loaded');
  }
  
  console.log('🗺️ Google Maps API test complete');
});
