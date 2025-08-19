import { test, expect } from '@playwright/test';

test('Check for double banner issues on main page', async ({ page }) => {
  // Test with Starbucks branding to see the double banner issue
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot to see the current state
  await page.screenshot({ path: 'test-results/starbucks-double-banner.png', fullPage: true });
  
  // Check if there are multiple header elements
  const headers = await page.locator('header').count();
  console.log('Number of header elements found:', headers);
  
  // Check for duplicate navigation elements
  const navElements = await page.locator('nav').count();
  console.log('Number of nav elements found:', navElements);
  
  // Check for multiple company name displays
  const companyNames = await page.locator('h1').count();
  console.log('Number of h1 elements found:', companyNames);
  
  // Look for the specific double banner issue
  const starbucksTexts = await page.locator('text=Starbucks').count();
  console.log('Number of "Starbucks" text elements found:', starbucksTexts);
  
  // Check if there are multiple "SOLAR INTELLIGENCE" texts
  const solarIntelligenceTexts = await page.locator('text=SOLAR INTELLIGENCE').count();
  console.log('Number of "SOLAR INTELLIGENCE" text elements found:', solarIntelligenceTexts);
  
  // This test will fail if we find multiple headers, indicating the double banner issue
  expect(headers).toBe(1);
  expect(starbucksTexts).toBeLessThanOrEqual(2); // Should only be in header and maybe one other place
});

test('Check report page for double banner', async ({ page }) => {
  // Test the report page specifically
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/report-page-double-banner.png', fullPage: true });
  
  // Check for multiple headers
  const headers = await page.locator('header').count();
  console.log('Report page - Number of header elements found:', headers);
  
  // Check for multiple "Solar Intelligence Report" or "New Analysis" texts
  const reportTitles = await page.locator('h1').count();
  console.log('Report page - Number of h1 elements found:', reportTitles);
  
  // Look for the specific issue
  const newAnalysisTexts = await page.locator('text=New Analysis').count();
  console.log('Report page - Number of "New Analysis" text elements found:', newAnalysisTexts);
  
  expect(headers).toBe(1);
  expect(newAnalysisTexts).toBe(1);
});
