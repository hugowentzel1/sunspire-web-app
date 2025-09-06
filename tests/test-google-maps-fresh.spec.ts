import { test, expect } from '@playwright/test';

test('Test Google Maps API with Fresh Browser', async ({ page, context }) => {
  console.log('🗺️ Testing Google Maps API with fresh browser...');
  
  // Clear all storage and cookies
  await context.clearCookies();
  await context.clearPermissions();
  
  // Navigate to Apple demo with cache disabled
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', {
    waitUntil: 'networkidle'
  });
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
    if (msg.type() === 'error' && msg.text().includes('maps.googleapis.com')) {
      console.log('🚨 Google Maps Error:', message);
    }
  });
  
  // Wait for Google Maps API to load
  console.log('⏳ Waiting for Google Maps API...');
  await page.waitForTimeout(10000);
  
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
  
  // Check for Google Maps script in DOM
  const googleScripts = await page.$$eval('script[src*="google"]', scripts => 
    scripts.map(script => script.getAttribute('src'))
  );
  console.log('📜 Google Maps Scripts found:', googleScripts);
  
  // Test address input
  const addressInput = page.locator('input[placeholder*="address"]').first();
  if (await addressInput.count() > 0) {
    console.log('📍 Testing address input...');
    await addressInput.fill('123 Main St, New York');
    await page.waitForTimeout(5000);
    
    // Check for any suggestions or dropdowns
    const suggestionElements = await page.$$eval('*', elements => 
      elements
        .filter(el => el.textContent && el.textContent.toLowerCase().includes('new york'))
        .map(el => ({
          tag: el.tagName,
          text: el.textContent?.substring(0, 100),
          className: el.className
        }))
    );
    console.log('📍 Suggestion elements found:', suggestionElements.length);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'google-maps-fresh-test.png', fullPage: true });
  
  if (googleMapsStatus.hasPlaces) {
    console.log('✅ Google Maps Places API is working!');
  } else {
    console.log('❌ Google Maps API not loaded');
    console.log('📊 Total console messages:', consoleMessages.length);
    console.log('🚨 Error messages:', consoleMessages.filter(msg => msg.includes('error')).length);
  }
});
