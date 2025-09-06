import { test, expect } from '@playwright/test';

test('Check CSP Headers', async ({ page }) => {
  console.log('🔍 Checking CSP headers...');
  
  // Navigate to Apple demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  
  // Get response headers
  const response = await page.request.get('https://sunspire-web-app.vercel.app/?company=Apple&demo=1');
  const headers = response.headers();
  
  console.log('📋 Response Headers:');
  console.log('X-Frame-Options:', headers['x-frame-options']);
  console.log('Referrer-Policy:', headers['referrer-policy']);
  console.log('Content-Security-Policy:', headers['content-security-policy']);
  console.log('Permissions-Policy:', headers['permissions-policy']);
  
  // Check if CSP includes Google Maps
  const csp = headers['content-security-policy'] || '';
  const hasGoogleMaps = csp.includes('maps.googleapis.com');
  
  console.log('🗺️ CSP includes Google Maps:', hasGoogleMaps);
  
  if (hasGoogleMaps) {
    console.log('✅ CSP is correctly configured for Google Maps');
  } else {
    console.log('❌ CSP is missing Google Maps configuration');
    console.log('Current CSP:', csp);
  }
});
