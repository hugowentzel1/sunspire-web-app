import { test, expect } from '@playwright/test';

test('Test Google Maps API Loading', async ({ page }) => {
  console.log('🔍 Testing Google Maps API loading...');
  
  // Test the live home page
  const homeUrl = 'https://sunspire-web-app.vercel.app/';
  
  console.log('🌐 Navigating to home page...');
  await page.goto(homeUrl);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    console.log('📝 Console:', text);
  });
  
  // Wait a bit for any API loading
  await page.waitForTimeout(5000);
  
  // Check if Google Maps API is loaded
  const googleMapsLoaded = await page.evaluate(() => {
    return !!(window as any).google?.maps?.places;
  });
  console.log('📊 Google Maps API loaded:', googleMapsLoaded);
  
  // Check for API key in environment
  const hasApiKey = await page.evaluate(() => {
    return !!(window as any).process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  });
  console.log('📊 API key available in browser:', hasApiKey);
  
  // Check for any Google Maps script tags
  const scriptTags = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src*="googleapis.com"]'));
    return scripts.map(script => script.getAttribute('src'));
  });
  console.log('📊 Google Maps script tags:', scriptTags);
  
  // Check for any error messages
  const errorMessages = consoleMessages.filter(msg => 
    msg.includes('error') || msg.includes('Error') || msg.includes('failed') || msg.includes('Failed')
  );
  console.log('📊 Error messages:', errorMessages);
  
  // Check for Google Maps specific messages
  const googleMessages = consoleMessages.filter(msg => 
    msg.includes('Google') || msg.includes('Maps') || msg.includes('Places')
  );
  console.log('📊 Google Maps messages:', googleMessages);
  
  // Take screenshot
  await page.screenshot({ path: 'google-maps-api-test.png' });
  console.log('📸 Screenshot saved as google-maps-api-test.png');
  
  console.log('🎯 GOOGLE MAPS API TEST COMPLETE');
});
