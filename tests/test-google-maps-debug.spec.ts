import { test, expect } from '@playwright/test';

test('Debug Google Maps API Loading', async ({ page }) => {
  console.log('🔍 Debugging Google Maps API loading...');
  
  // Listen to all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(message);
    console.log('Console:', message);
  });
  
  // Listen to network requests
  const networkRequests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('google') || request.url().includes('maps')) {
      networkRequests.push(`REQUEST: ${request.method()} ${request.url()}`);
      console.log('Network:', `REQUEST: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('google') || response.url().includes('maps')) {
      networkRequests.push(`RESPONSE: ${response.status()} ${response.url()}`);
      console.log('Network:', `RESPONSE: ${response.status()} ${response.url()}`);
    }
  });
  
  // Navigate to Apple demo
  console.log('🌐 Navigating to Apple demo...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  
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
      googleObject: hasGoogle ? Object.keys(window.google) : [],
      windowKeys: Object.keys(window).filter(key => key.toLowerCase().includes('google'))
    };
  });
  
  console.log('🗺️ Google Maps API Status:', googleMapsStatus);
  
  // Check for Google Maps script in DOM
  const googleScripts = await page.$$eval('script[src*="google"]', scripts => 
    scripts.map(script => script.getAttribute('src'))
  );
  console.log('📜 Google Maps Scripts found:', googleScripts);
  
  // Check for any error messages in the page
  const errorElements = await page.$$eval('[class*="error"], [class*="Error"]', elements => 
    elements.map(el => el.textContent).filter(text => text && text.trim())
  );
  console.log('❌ Error elements found:', errorElements);
  
  // Test address input
  const addressInput = page.locator('input[placeholder*="address"]').first();
  if (await addressInput.count() > 0) {
    console.log('📍 Testing address input...');
    await addressInput.fill('123 Main St, New York');
    await page.waitForTimeout(3000);
    
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
    console.log('📍 Suggestion elements found:', suggestionElements);
  } else {
    console.log('❌ No address input found');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'google-maps-debug.png', fullPage: true });
  
  console.log('🔍 Debug complete');
  console.log('📊 Console messages count:', consoleMessages.length);
  console.log('🌐 Network requests count:', networkRequests.length);
});
