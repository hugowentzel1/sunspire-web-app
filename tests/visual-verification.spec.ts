import { test, expect } from '@playwright/test';

test('Visual verification of double banner fixes', async ({ page }) => {
  // Test 1: Starbucks main page - should show single header
  console.log('🔍 Testing Starbucks main page...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ path: 'test-results/starbucks-main-page-current.png', fullPage: true });
  
  // Count elements
  const starbucksElements = await page.locator('text=Starbucks').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const headers = await page.locator('header').count();
  
  console.log(`Starbucks main page results:`);
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Starbucks text elements: ${starbucksElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${solarElements}`);
  
  // Test 2: Report page - should show single header
  console.log('🔍 Testing report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ path: 'test-results/report-page-current.png', fullPage: true });
  
  // Count elements
  const reportHeaders = await page.locator('header').count();
  const newAnalysisElements = await page.locator('text=New Analysis').count();
  
  console.log(`Report page results:`);
  console.log(`  - Header elements: ${reportHeaders}`);
  console.log(`  - New Analysis text elements: ${newAnalysisElements}`);
  
  // Test 3: Google main page for comparison
  console.log('🔍 Testing Google main page for comparison...');
  await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take full page screenshot
  await page.screenshot({ path: 'test-results/google-main-page-current.png', fullPage: true });
  
  // Count elements
  const googleElements = await page.locator('text=Google').count();
  const googleSolarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  
  console.log(`Google main page results:`);
  console.log(`  - Google text elements: ${googleElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${googleSolarElements}`);
  
  // Log all findings
  console.log('\n📊 SUMMARY OF FINDINGS:');
  console.log('========================');
  console.log(`Starbucks Main Page:`);
  console.log(`  - Headers: ${headers} (should be 1)`);
  console.log(`  - Starbucks texts: ${starbucksElements} (should be ≤2)`);
  console.log(`  - SOLAR INTELLIGENCE texts: ${solarElements} (should be ≤2)`);
  console.log(`\nReport Page:`);
  console.log(`  - Headers: ${reportHeaders} (should be 1)`);
  console.log(`  - New Analysis texts: ${newAnalysisElements} (should be 1)`);
  console.log(`\nGoogle Main Page:`);
  console.log(`  - Google texts: ${googleElements} (should be ≤2)`);
  console.log(`  - SOLAR INTELLIGENCE texts: ${googleSolarElements} (should be ≤2)`);
  
  // Take a screenshot of the page structure to see what's actually rendered
  await page.evaluate(() => {
    console.log('🔍 Page structure analysis:');
    const headers = document.querySelectorAll('header');
    console.log(`Found ${headers.length} header elements:`);
    
    headers.forEach((header, index) => {
      console.log(`Header ${index + 1}:`);
      console.log(`  Classes: ${header.className}`);
      console.log(`  Children: ${header.children.length}`);
      console.log(`  HTML preview: ${header.innerHTML.substring(0, 200)}...`);
    });
    
    const starbucksTexts = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('Starbucks')
    );
    console.log(`\nFound ${starbucksTexts.length} elements containing "Starbucks":`);
    
    starbucksTexts.forEach((el, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
    });
  });
});
