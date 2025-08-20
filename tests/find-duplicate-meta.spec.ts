import { test, expect } from '@playwright/test';

test('Find exact source of duplicate Meta text on report page', async ({ page }) => {
  console.log('🔍 Finding exact source of duplicate Meta text...');
  
  // Go to Meta-branded report page
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740&company=Meta&brandColor=%230428F4');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/find-duplicate-meta.png', fullPage: true });
  
  // Find all elements containing "Meta" and get their details
  const metaElements = await page.locator('text=Meta').all();
  console.log(`Found ${metaElements.length} elements containing "Meta"`);
  
  for (let i = 0; i < metaElements.length; i++) {
    const element = metaElements[i];
    const text = await element.textContent();
    const tagName = await element.evaluate(el => el.tagName);
    const className = await element.getAttribute('class');
    const isVisible = await element.isVisible();
    
    // Get the full text of the parent element to understand context
    const parentText = await element.locator('..').textContent();
    const parentTag = await element.locator('..').evaluate(el => el.tagName);
    const parentClass = await element.locator('..').getAttribute('class');
    
    console.log(`\n=== Meta Element ${i + 1} ===`);
    console.log(`Element Details:`);
    console.log(`  Tag: ${tagName}`);
    console.log(`  Classes: ${className}`);
    console.log(`  Text: "${text?.trim()}"`);
    console.log(`  Visible: ${isVisible}`);
    console.log(`Parent Details:`);
    console.log(`  Parent Tag: ${parentTag}`);
    console.log(`  Parent Classes: ${parentClass}`);
    console.log(`  Parent Text: "${parentText?.trim().substring(0, 100)}..."`);
    
    // Get position to understand layout
    const box = await element.boundingBox();
    if (box) {
      console.log(`Position: x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);
    }
  }
  
  // Also check for any "SOLAR INTELLIGENCE" text that might be duplicated
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').all();
  console.log(`\n\nFound ${solarElements.length} elements containing "SOLAR INTELLIGENCE"`);
  
  for (let i = 0; i < solarElements.length; i++) {
    const element = solarElements[i];
    const text = await element.textContent();
    const tagName = await element.evaluate(el => el.tagName);
    const className = await element.getAttribute('class');
    
    console.log(`\n=== SOLAR INTELLIGENCE Element ${i + 1} ===`);
    console.log(`  Tag: ${tagName}`);
    console.log(`  Classes: ${className}`);
    console.log(`  Text: "${text?.trim()}"`);
    
    const box = await element.boundingBox();
    if (box) {
      console.log(`  Position: x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);
    }
  }
});
