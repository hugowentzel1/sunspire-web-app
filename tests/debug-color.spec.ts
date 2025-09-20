import { test, expect } from '@playwright/test';

const PAID_URL = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

test('Debug color issue', async ({ page }) => {
  await page.goto(PAID_URL, { waitUntil: 'networkidle' });
  
  // Wait a bit for everything to load
  await page.waitForTimeout(3000);
  
  // Check what the CSS variable actually is
  const brandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
  });
  
  console.log('CSS variable value:', brandColor);
  
  // Check what the URL parameters are
  const urlParams = await page.evaluate(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      company: params.get('company'),
      brandColor: params.get('brandColor'),
      logo: params.get('logo')
    };
  });
  
  console.log('URL parameters:', urlParams);
  
  // Check if BrandProvider is running
  const brandProviderLogs = await page.evaluate(() => {
    // Look for console logs from BrandProvider
    return 'BrandProvider logs would be in browser console';
  });
  
  console.log('BrandProvider status:', brandProviderLogs);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-color.png' });
});
