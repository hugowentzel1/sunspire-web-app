import { test, expect } from '@playwright/test';

test('Simple page check to see what elements exist', async ({ page }) => {
  console.log('🔍 Simple page check...');
  
  // Go to the localhost Meta-branded main page
  await page.goto('http://localhost:3000/?company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  console.log('📱 Page loaded! Checking elements...');
  
  // Take a screenshot
  await page.screenshot({ 
    path: 'test-results/simple-page-check.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved: test-results/simple-page-check.png');
  
  // Simple element counting
  const headers = await page.locator('header').count();
  const metaElements = await page.locator('text=Meta').count();
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').count();
  const supportElements = await page.locator('text=Support').count();
  
  console.log('\n📊 ELEMENT COUNTS:');
  console.log(`  - Headers: ${headers}`);
  console.log(`  - Meta text: ${metaElements}`);
  console.log(`  - SOLAR INTELLIGENCE text: ${solarElements}`);
  console.log(`  - Support text: ${supportElements}`);
  
  // Get all text content to see what's actually there
  const allText = await page.textContent('body');
  console.log('\n📝 ALL PAGE TEXT (first 1000 chars):');
  console.log(allText?.substring(0, 1000));
  
  console.log('\n🎉 Simple check complete!');
});
