import { test, expect } from '@playwright/test';

test('Debug useBrandTakeover hook basic functionality', async ({ page }) => {
  // Capture console logs
  const consoleLogs: string[] = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
  });
  
  // Test with Google branding
  await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%230428F4');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for any async operations
  await page.waitForTimeout(2000);
  
  // Check if the page shows Google branding
  const headerTitle = await page.locator('header h1').first().textContent();
  console.log('Header title:', headerTitle);
  
  // Check if the page title is set correctly
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
  
  // Check if CSS variables are set
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('CSS --brand-primary:', brandPrimary);
  
  // Check if localStorage is being set
  const localStorageContent = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('localStorage content:', localStorageContent);
  
  // Print all console logs
  console.log('Browser console logs:');
  consoleLogs.forEach(log => console.log('  ', log));
  
  // The header should show Google
  expect(headerTitle).toContain('Google');
  
  // The page title should be set by BrandProvider
  expect(pageTitle).toContain('Google');
  
  // The CSS variable should be set
  expect(brandPrimary.trim()).toBe('#0428F4');
  
  // localStorage should be set (this is what we're debugging)
  if (localStorageContent) {
    const parsed = JSON.parse(localStorageContent);
    expect(parsed.brand).toBe('Google');
  } else {
    console.log('localStorage is not being set - this is the problem!');
  }
});
