import { test, expect } from '@playwright/test';

test('Debug duplicate elements to find source of duplicates', async ({ page }) => {
  console.log('🔍 Debugging duplicate elements...');
  
  // Go to the localhost Meta-branded main page
  await page.goto('http://localhost:3000/?company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  console.log('📱 Page loaded! Investigating duplicate elements...');
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'test-results/debug-duplicate-elements.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved: test-results/debug-duplicate-elements.png');
  
  // Debug function to find all elements with specific text
  await page.evaluate(() => {
    console.log('🔍 DEBUGGING DUPLICATE ELEMENTS...');
    
    // Find all elements containing "Meta"
    const metaElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('Meta')
    );
    
    console.log(`\nFound ${metaElements.length} elements containing "Meta":`);
    metaElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      console.log(`Meta Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Size: ${rect.width}x${rect.height}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Find all elements containing "SOLAR INTELLIGENCE"
    const solarElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('SOLAR INTELLIGENCE')
    );
    
    console.log(`\nFound ${solarElements.length} elements containing "SOLAR INTELLIGENCE":`);
    solarElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      console.log(`SOLAR Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Size: ${rect.width}x${rect.height}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Find all elements containing "Support"
    const supportElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('Support')
    );
    
    console.log(`\nFound ${supportElements.length} elements containing "Support":`);
    supportElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      console.log(`Support Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Size: ${rect.width}x${rect.height}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Check for any hidden or duplicate navigation components
    const allElements = document.querySelectorAll('*');
    const potentialDuplicates = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return (
        text.includes('Meta') ||
        text.includes('SOLAR INTELLIGENCE') ||
        text.includes('Pricing') ||
        text.includes('Partners') ||
        text.includes('Support')
      );
    });
    
    console.log(`\nFound ${potentialDuplicates.length} total elements with navigation content:`);
    potentialDuplicates.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      console.log(`Navigation Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Size: ${rect.width}x${rect.height}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
  });
  
  // Also check the page structure
  const headers = await page.locator('header').count();
  const navs = await page.locator('nav').count();
  const sections = await page.locator('section').count();
  
  console.log(`\n📊 PAGE STRUCTURE:`);
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Nav elements: ${navs}`);
  console.log(`  - Section elements: ${sections}`);
  
  // Check if there are any elements with navigation-like classes
  const navigationElements = await page.locator('[class*="navigation"], [class*="header"], [class*="banner"]').count();
  console.log(`  - Navigation-like elements: ${navigationElements}`);
  
  console.log('\n🎉 Debug complete! Check console for detailed element analysis.');
});
