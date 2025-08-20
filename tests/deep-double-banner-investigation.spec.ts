import { test, expect } from '@playwright/test';

test('Deep investigation of double banner issue', async ({ page }) => {
  console.log('🔍 Deep investigation of double banner issue...');
  
  await page.goto('https://sunspire-web-app.vercel.app/?company=Starbucks&brandColor=%23006471');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/deep-investigation-starbucks.png', fullPage: true });
  
  // Look for ANY elements that might appear as headers
  await page.evaluate(() => {
    console.log('🔍 DEEP INVESTIGATION - Looking for ANY header-like elements...');
    
    // Check for any elements with header-like classes or content
    const allElements = document.querySelectorAll('*');
    const potentialHeaders = Array.from(allElements).filter(el => {
      const className = el.className || '';
      const text = el.textContent || '';
      
      // Look for elements that might appear as headers
      return (
        className.includes('header') ||
        className.includes('navigation') ||
        className.includes('nav') ||
        className.includes('banner') ||
        className.includes('top') ||
        className.includes('sticky') ||
        text.includes('Starbucks') ||
        text.includes('SOLAR INTELLIGENCE') ||
        text.includes('Launch on') ||
        text.includes('Pricing') ||
        text.includes('Partners') ||
        text.includes('Support')
      );
    });
    
    console.log(`Found ${potentialHeaders.length} potential header-like elements:`);
    
    potentialHeaders.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      
      console.log(`Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Size: ${rect.width}x${rect.height}`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Check for any elements with similar styling to headers
    const styledElements = Array.from(allElements).filter(el => {
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
    
    console.log(`\nFound ${styledElements.length} elements with header-like styling:`);
    
    styledElements.forEach((el, index) => {
      const style = window.getComputedStyle(el);
      console.log(`Styled Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Position: ${style.position}`);
      console.log(`  Top: ${style.top}`);
      console.log(`  Z-index: ${style.zIndex}`);
      console.log(`  Background: ${style.backgroundColor}`);
      console.log(`  Backdrop: ${style.backdropFilter}`);
      console.log(`  ---`);
    });
    
    // Check for any duplicate content
    const starbucksElements = Array.from(allElements).filter(el => 
      el.textContent?.includes('Starbucks')
    );
    
    console.log(`\nFound ${starbucksElements.length} elements containing "Starbucks":`);
    
    starbucksElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      console.log(`Starbucks Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  Position: top=${rect.top}, left=${rect.left}`);
      console.log(`  Parent: ${el.parentElement?.tagName} (${el.parentElement?.className})`);
      console.log(`  ---`);
    });
    
    // Check for any navigation-like structures
    const navStructures = Array.from(allElements).filter(el => {
      const children = el.children;
      return Array.from(children).some(child => 
        child.textContent?.includes('Pricing') ||
        child.textContent?.includes('Partners') ||
        child.textContent?.includes('Support')
      );
    });
    
    console.log(`\nFound ${navStructures.length} elements with navigation structure:`);
    
    navStructures.forEach((el, index) => {
      console.log(`Nav Structure ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Children: ${el.children.length}`);
      console.log(`  Text: "${el.textContent?.trim()}"`);
      console.log(`  ---`);
    });
  });
  
  // Also check the visual layout
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Page height: ${pageHeight}px`);
  
  // Check if there are multiple sections that look like headers
  const sections = await page.locator('section, div[class*="header"], div[class*="navigation"]').count();
  console.log(`Header-like sections found: ${sections}`);
  
  // Check for any elements at the top of the page
  const topElements = await page.locator('*').filter({ hasText: /Starbucks|SOLAR INTELLIGENCE|Pricing|Partners|Support/ }).all();
  console.log(`Top-level elements with navigation content: ${topElements.length}`);
  
  for (let i = 0; i < topElements.length; i++) {
    try {
      const element = topElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      
      console.log(`Top Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
    } catch (error) {
      console.log(`Error getting element ${i + 1} details: ${error}`);
    }
  }
});
