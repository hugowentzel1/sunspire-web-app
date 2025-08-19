import { test, expect } from '@playwright/test';

test('Debug where all Starbucks text elements are coming from', async ({ page }) => {
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot first
  await page.screenshot({ path: 'test-results/debug-starbucks-full.png', fullPage: true });
  
  // Find ALL elements containing "Starbucks" text
  const starbucksElements = await page.locator('text=Starbucks').all();
  console.log(`Found ${starbucksElements.length} elements containing "Starbucks"`);
  
  // Log details about each element
  for (let i = 0; i < starbucksElements.length; i++) {
    try {
      const element = starbucksElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.evaluate(el => el.className);
      const textContent = await element.textContent();
      const isVisible = await element.isVisible();
      
      console.log(`Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Class: ${className}`);
      console.log(`  Text: "${textContent?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Element ${i + 1}: Error getting details - ${error}`);
    }
  }
  
  // Also check for "SOLAR INTELLIGENCE" elements
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').all();
  console.log(`Found ${solarElements.length} elements containing "SOLAR INTELLIGENCE"`);
  
  for (let i = 0; i < solarElements.length; i++) {
    try {
      const element = solarElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.evaluate(el => el.className);
      const textContent = await element.textContent();
      const isVisible = await element.isVisible();
      
      console.log(`SOLAR Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Class: ${className}`);
      console.log(`  Text: "${textContent?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`SOLAR Element ${i + 1}: Error getting details - ${error}`);
    }
  }
  
  // Check if there are multiple navigation components
  const navs = await page.locator('nav').all();
  console.log(`Found ${navs.length} nav elements`);
  
  // Check if there are multiple header components
  const headers = await page.locator('header').all();
  console.log(`Found ${headers.length} header elements`);
  
  // Check for any components that might be duplicated
  const components = await page.locator('[class*="navigation"], [class*="header"], [class*="brand"]').all();
  console.log(`Found ${components.length} potential navigation/header/brand components`);
});
