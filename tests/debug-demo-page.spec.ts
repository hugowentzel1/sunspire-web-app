import { test, expect } from '@playwright/test';

test('Debug demo page content', async ({ page }) => {
  const DEMO_REPORT_URL = 'http://localhost:3000/report?company=Netflix&demo=1&address=123%20Main%20St&lat=34.0537&lng=-118.2428&placeId=test';
  
  await page.goto(DEMO_REPORT_URL, { waitUntil: 'networkidle' });
  
  // Get all text content on the page
  const bodyText = await page.locator('body').textContent();
  console.log('Page content:', bodyText);
  
  // Look for any text containing "Netflix"
  const netflixElements = page.locator('text=/Netflix/i');
  const netflixCount = await netflixElements.count();
  console.log('Netflix elements found:', netflixCount);
  
  // Look for any text containing "Exclusive"
  const exclusiveElements = page.locator('text=/Exclusive/i');
  const exclusiveCount = await exclusiveElements.count();
  console.log('Exclusive elements found:', exclusiveCount);
  
  // Look for any text containing "preview"
  const previewElements = page.locator('text=/preview/i');
  const previewCount = await previewElements.count();
  console.log('Preview elements found:', previewCount);
  
  // Look for demo-specific elements
  const demoElements = page.locator('[data-demo]');
  const demoCount = await demoElements.count();
  console.log('Demo data attributes found:', demoCount);
  
  // Take a screenshot for visual inspection
  await page.screenshot({ path: 'debug-demo-page.png', fullPage: true });
  console.log('Screenshot saved as debug-demo-page.png');
});
