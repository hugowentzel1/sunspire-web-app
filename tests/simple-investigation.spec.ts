import { test, expect } from '@playwright/test';

test('Simple investigation of double banner issue', async ({ page }) => {
  console.log('🔍 Simple investigation of double banner issue...');
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/simple-investigation-starbucks.png', fullPage: true });
  
  // Simple element counting
  const starbucksElements = await page.locator('text=Starbucks').all();
  console.log(`Found ${starbucksElements.length} elements containing "Starbucks"`);
  
  for (let i = 0; i < starbucksElements.length; i++) {
    try {
      const element = starbucksElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`Starbucks Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for navigation elements
  const navElements = await page.locator('nav, [class*="navigation"], [class*="header"]').all();
  console.log(`\nFound ${navElements.length} navigation-like elements`);
  
  for (let i = 0; i < navElements.length; i++) {
    try {
      const element = navElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const text = await element.textContent();
      
      console.log(`Nav Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text preview: "${text?.substring(0, 100)}..."`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting nav element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with "SOLAR INTELLIGENCE"
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').all();
  console.log(`\nFound ${solarElements.length} elements containing "SOLAR INTELLIGENCE"`);
  
  for (let i = 0; i < solarElements.length; i++) {
    try {
      const element = solarElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      
      console.log(`SOLAR Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting SOLAR element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with navigation links
  const pricingLinks = await page.locator('text=Pricing').all();
  const partnersLinks = await page.locator('text=Partners').all();
  const supportLinks = await page.locator('text=Support').all();
  
  console.log(`\nNavigation links found:`);
  console.log(`  Pricing: ${pricingLinks.length}`);
  console.log(`  Partners: ${partnersLinks.length}`);
  console.log(`  Support: ${supportLinks.length}`);
  
  // Check for any elements with "Launch on" text
  const launchElements = await page.locator('text=Launch on').all();
  console.log(`\n"Launch on" elements found: ${launchElements.length}`);
  
  for (let i = 0; i < launchElements.length; i++) {
    try {
      const element = launchElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      
      console.log(`Launch Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting launch element ${i + 1} details: ${error}`);
    }
  }
});
