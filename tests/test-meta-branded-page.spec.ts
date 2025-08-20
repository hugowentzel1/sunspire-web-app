import { test, expect } from '@playwright/test';

test('Test Meta-branded page for double banner issue', async ({ page }) => {
  console.log('🔍 Testing Meta-branded page for double banner issue...');
  
  // Test the Meta-branded page
  await page.goto('https://sunspire-web-app.vercel.app/?company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/meta-branded-page.png', fullPage: true });
  
  // Count elements
  const headers = await page.locator('header').count();
  const navs = await page.locator('nav').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const launchElements = await page.locator('text=Launch on').count();
  
  console.log(`Meta-branded page results:`);
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Nav elements: ${navs}`);
  console.log(`  - Meta text elements: ${metaElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${solarElements}`);
  console.log(`  - Launch on text elements: ${launchElements}`);
  
  // Now navigate to the report page with the same brand
  console.log('\n🔍 Navigating to report page with Meta brand...');
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740&company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of report page
  await page.screenshot({ path: 'test-results/meta-branded-report-page.png', fullPage: true });
  
  // Count elements on report page
  const reportHeaders = await page.locator('header').count();
  const reportNavs = await page.locator('nav').count();
  const reportMetaElements = await page.locator('text=Meta').count();
  const reportSolarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const reportNewAnalysisElements = await page.locator('text=New Analysis').count();
  const reportLaunchElements = await page.locator('text=Launch on').count();
  
  console.log(`\nMeta-branded report page results:`);
  console.log(`  - Header elements: ${reportHeaders}`);
  console.log(`  - Nav elements: ${reportNavs}`);
  console.log(`  - Meta text elements: ${reportMetaElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${reportSolarElements}`);
  console.log(`  - New Analysis text elements: ${reportNewAnalysisElements}`);
  console.log(`  - Launch on text elements: ${reportLaunchElements}`);
  
  // Check for any elements with "REPORT" text
  const reportTextElements = await page.locator('text=REPORT').count();
  console.log(`  - REPORT text elements: ${reportTextElements}`);
  
  // Take a detailed look at the page structure
  await page.evaluate(() => {
    console.log('🔍 META-BRANDED REPORT PAGE - Page structure analysis:');
    
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
    
    // Check for any elements with "REPORT" text
    const reportElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('REPORT')
    );
    
    console.log(`\nFound ${reportElements.length} elements with "REPORT" text:`);
    
    reportElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      console.log(`REPORT Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
  });
});
