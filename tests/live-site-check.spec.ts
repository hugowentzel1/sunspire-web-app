import { test, expect } from '@playwright/test';

test('Check live deployed site for double banner issues', async ({ page }) => {
  console.log('🔍 Checking LIVE deployed site...');
  
  // Test the actual live deployed site
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of live site
  await page.screenshot({ path: 'test-results/live-site-starbucks.png', fullPage: true });
  
  // Count elements on live site
  const starbucksElements = await page.locator('text=Starbucks').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const headers = await page.locator('header').count();
  
  console.log(`LIVE SITE - Starbucks page:`);
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Starbucks text elements: ${starbucksElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${solarElements}`);
  
  // Check if there are multiple navigation-like sections
  const navSections = await page.locator('nav, [class*="navigation"], [class*="header"]').count();
  console.log(`  - Navigation-like sections: ${navSections}`);
  
  // Look for any duplicate branding content
  const allText = await page.textContent('body');
  const starbucksCount = (allText?.match(/Starbucks/g) || []).length;
  const solarCount = (allText?.match(/SOLAR INTELLIGENCE/g) || []).length;
  
  console.log(`  - Total "Starbucks" occurrences in page: ${starbucksCount}`);
  console.log(`  - Total "SOLAR INTELLIGENCE" occurrences in page: ${solarCount}`);
  
  // Check for any components that might be duplicated
  const components = await page.locator('[class*="brand"], [class*="logo"], [class*="company"]').count();
  console.log(`  - Brand/logo/company components: ${components}`);
  
  // Take a detailed look at the page structure
  await page.evaluate(() => {
    console.log('🔍 LIVE SITE - Page structure analysis:');
    
    // Check for any duplicate navigation components
    const allElements = document.querySelectorAll('*');
    const navigationElements = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return text.includes('Starbucks') || text.includes('SOLAR INTELLIGENCE');
    });
    
    console.log(`Found ${navigationElements.length} elements with navigation content:`);
    
    navigationElements.forEach((el, index) => {
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
    });
    
    // Check if there are multiple instances of similar components
    const headerElements = document.querySelectorAll('header');
    console.log(`\nFound ${headerElements.length} header elements:`);
    
    headerElements.forEach((header, index) => {
      console.log(`Header ${index + 1}:`);
      console.log(`  Classes: ${header.className}`);
      console.log(`  Children: ${header.children.length}`);
      console.log(`  HTML preview: ${header.innerHTML.substring(0, 300)}...`);
    });
  });
  
  // Also check the report page on live site
  console.log('\n🔍 Checking LIVE report page...');
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ path: 'test-results/live-site-report.png', fullPage: true });
  
  const reportHeaders = await page.locator('header').count();
  const newAnalysisElements = await page.locator('text=New Analysis').count();
  
  console.log(`LIVE SITE - Report page:`);
  console.log(`  - Header elements: ${reportHeaders}`);
  console.log(`  - New Analysis text elements: ${newAnalysisElements}`);
});
