import { test, expect } from '@playwright/test';

test('Test live deployed site for double banner fix', async ({ page }) => {
  console.log('🔍 Testing LIVE deployed site for double banner fix...');
  
  // Test the actual live deployed site
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of live site
  await page.screenshot({ path: 'test-results/live-site-after-fix.png', fullPage: true });
  
  // Check for the specific text that was causing the issue
  const launchElements = await page.locator('text=Ready to launch on your domain').count();
  const whiteLabelElements = await page.locator('text=White-label ready').count();
  
  console.log(`LIVE SITE - After fix:`);
  console.log(`  - "Ready to launch on your domain" elements: ${launchElements} (should be 0)`);
  console.log(`  - "White-label ready" elements: ${whiteLabelElements} (should be 1)`);
  
  // Count other elements
  const starbucksElements = await page.locator('text=Starbucks').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const headers = await page.locator('header').count();
  
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Starbucks text elements: ${starbucksElements}`);
  console.log(`  - SOLAR INTELLIGENCE text elements: ${solarElements}`);
  
  // Check if the fix is working
  if (launchElements === 0 && whiteLabelElements === 1) {
    console.log('✅ FIX IS WORKING! The duplicate "Ready to launch" text has been replaced.');
  } else {
    console.log('❌ FIX NOT WORKING YET. The old text is still there.');
  }
  
  // Also check for any other potential duplicate elements
  const allText = await page.textContent('body');
  const starbucksCount = (allText?.match(/Starbucks/g) || []).length;
  const solarCount = (allText?.match(/SOLAR INTELLIGENCE/g) || []).length;
  
  console.log(`\nText analysis:`);
  console.log(`  - Total "Starbucks" occurrences: ${starbucksCount}`);
  console.log(`  - Total "SOLAR INTELLIGENCE" occurrences: ${solarCount}`);
  
  // Take a screenshot of the page structure
  await page.evaluate(() => {
    console.log('🔍 LIVE SITE - Page structure after fix:');
    
    const allElements = document.querySelectorAll('*');
    const starbucksElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('Starbucks')
    );
    
    console.log(`Found ${starbucksElements.length} elements containing "Starbucks":`);
    
    starbucksElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      console.log(`Starbucks Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  ---`);
    });
    
    // Check for any elements with "Ready to launch" text
    const launchElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('Ready to launch')
    );
    
    console.log(`\nFound ${launchElements.length} elements with "Ready to launch" text:`);
    
    launchElements.forEach((el, index) => {
      console.log(`Launch Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  ---`);
    });
  });
});
