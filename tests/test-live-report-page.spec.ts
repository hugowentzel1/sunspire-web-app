import { test, expect } from '@playwright/test';

test('Test live deployed report page for double banner fix', async ({ page }) => {
  console.log('🔍 Testing LIVE deployed report page for double banner fix...');
  
  // Test the actual live deployed site
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of live site
  await page.screenshot({ path: 'test-results/live-report-page-after-fix.png', fullPage: true });
  
  // Count elements on live site
  const headers = await page.locator('header').count();
  const navs = await page.locator('nav').count();
  const h1s = await page.locator('h1').count();
  const h2s = await page.locator('h2').count();
  
  console.log(`LIVE SITE - Report page after fix:`);
  console.log(`  - Header elements: ${headers} (should be 1)`);
  console.log(`  - Nav elements: ${navs} (should be 1)`);
  console.log(`  - H1 elements: ${h1s} (should be ≤2)`);
  console.log(`  - H2 elements: ${h2s} (should be ≤4)`);
  
  // Check for any elements with brand-related text
  const brandElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const newAnalysisElements = await page.locator('text=New Analysis').count();
  const launchElements = await page.locator('text=Launch on').count();
  
  console.log(`\nText element counts:`);
  console.log(`  - "Meta" text elements: ${brandElements} (should be 0)`);
  console.log(`  - "SOLAR INTELLIGENCE" text elements: ${solarElements} (should be 1)`);
  console.log(`  - "New Analysis" text elements: ${newAnalysisElements} (should be 1)`);
  console.log(`  - "Launch on" text elements: ${launchElements} (should be 1)`);
  
  // Check if the fix is working
  if (headers === 1 && solarElements === 1 && newAnalysisElements === 1 && launchElements === 1) {
    console.log('✅ FIX IS WORKING! The report page now has only one header.');
  } else {
    console.log('❌ FIX NOT WORKING YET. There are still duplicate elements.');
  }
  
  // Take a detailed look at the page structure
  await page.evaluate(() => {
    console.log('🔍 LIVE REPORT PAGE - Page structure after fix:');
    
    const allElements = document.querySelectorAll('*');
    const brandElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('Meta') || el.textContent?.includes('SOLAR INTELLIGENCE')
    );
    
    console.log(`Found ${brandElements.length} elements with brand content:`);
    
    brandElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      console.log(`Brand Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Check for any elements with header-like styling
    const headerLikeElements = Array.from(allElements).filter(el => {
      const style = window.getComputedStyle(el);
      return (
        style.position === 'sticky' ||
        style.position === 'fixed' ||
        style.top === '0px' ||
        style.zIndex !== 'auto' ||
        style.backgroundColor.includes('rgba(255, 255, 255') ||
        style.backdropFilter !== 'none'
      );
    });
    
    console.log(`\nFound ${headerLikeElements.length} elements with header-like styling:`);
    
    headerLikeElements.forEach((el, index) => {
      const style = window.getComputedStyle(el);
      console.log(`Header-like Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Position: ${style.position}`);
      console.log(`  Top: ${style.top}`);
      console.log(`  Z-index: ${style.zIndex}`);
      console.log(`  Background: ${style.backgroundColor}`);
      console.log(`  ---`);
    });
  });
});
