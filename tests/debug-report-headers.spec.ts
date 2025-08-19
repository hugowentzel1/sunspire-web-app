import { test, expect } from '@playwright/test';

test('Debug report page headers in detail', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'test-results/report-page-headers-debug.png', fullPage: true });
  
  // Find ALL header elements
  const headers = await page.locator('header').all();
  console.log(`Found ${headers.length} header elements`);
  
  // Log details about each header element
  for (let i = 0; i < headers.length; i++) {
    try {
      const header = headers[i];
      const className = await header.getAttribute('class');
      const innerHTML = await header.innerHTML();
      const isVisible = await header.isVisible();
      
      console.log(`Header ${i + 1}:`);
      console.log(`  Classes: ${className}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  HTML (first 200 chars): ${innerHTML.substring(0, 200)}...`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Header ${i + 1}: Error getting details - ${error}`);
    }
  }
  
  // Also check for any elements with header-like content
  const h1Elements = await page.locator('h1').all();
  console.log(`Found ${h1Elements.length} h1 elements`);
  
  for (let i = 0; i < h1Elements.length; i++) {
    try {
      const h1 = h1Elements[i];
      const textContent = await h1.textContent();
      const className = await h1.getAttribute('class');
      const isVisible = await h1.isVisible();
      
      console.log(`H1 ${i + 1}:`);
      console.log(`  Text: "${textContent?.trim()}"`);
      console.log(`  Classes: ${className}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`H1 ${i + 1}: Error getting details - ${error}`);
    }
  }
});
