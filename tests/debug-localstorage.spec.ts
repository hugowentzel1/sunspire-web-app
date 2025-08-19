import { test, expect } from '@playwright/test';

test('Debug localStorage functionality', async ({ page }) => {
  // Test with Google branding
  await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%230428F4');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check what's in localStorage
  const localStorageContent = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  
  console.log('localStorage content after Google page load:', localStorageContent);
  
  // Check if the page shows Google branding
  const headerTitle = await page.locator('header h1').first().textContent();
  console.log('Header title:', headerTitle);
  
  // Navigate to a different page (like pricing)
  await page.goto('https://sunspire-web-app.vercel.app/pricing');
  await page.waitForLoadState('networkidle');
  
  // Check localStorage again
  const localStorageAfterNav = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  
  console.log('localStorage content after navigation to pricing:', localStorageAfterNav);
  
  // Check if the pricing page header shows Google branding
  const pricingHeaderTitle = await page.locator('header h1').first().textContent();
  console.log('Pricing page header title:', pricingHeaderTitle);
  
  // The localStorage should persist, so this should still show Google
  expect(localStorageAfterNav).toBeTruthy();
  
  // Parse the localStorage content to see what's stored
  if (localStorageAfterNav) {
    const parsed = JSON.parse(localStorageAfterNav);
    console.log('Parsed localStorage:', parsed);
    expect(parsed.brand).toBe('Google');
  }
});
