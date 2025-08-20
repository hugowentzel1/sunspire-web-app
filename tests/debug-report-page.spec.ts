import { test, expect } from '@playwright/test';

test('Debug report page to find duplicate banner source', async ({ page }) => {
  console.log('🔍 Debugging report page to find duplicate banner...');
  
  await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-report-page.png', fullPage: true });
  
  // Count all elements that might be creating the duplicate appearance
  const headers = await page.locator('header').count();
  const navs = await page.locator('nav').count();
  const h1s = await page.locator('h1').count();
  const h2s = await page.locator('h2').count();
  
  console.log(`Element counts:`);
  console.log(`  - Header elements: ${headers}`);
  console.log(`  - Nav elements: ${navs}`);
  console.log(`  - H1 elements: ${h1s}`);
  console.log(`  - H2 elements: ${h2s}`);
  
  // Check for any elements with brand-related text
  const brandElements = await page.locator('text=Meta').all();
  console.log(`\nFound ${brandElements.length} elements containing "Meta":`);
  
  for (let i = 0; i < brandElements.length; i++) {
    try {
      const element = brandElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`Meta Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting Meta element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with "SOLAR INTELLIGENCE" text
  const solarElements = await page.locator('text=SOLAR INTELLIGENCE').all();
  console.log(`\nFound ${solarElements.length} elements containing "SOLAR INTELLIGENCE":`);
  
  for (let i = 0; i < solarElements.length; i++) {
    try {
      const element = solarElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`SOLAR Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting SOLAR element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with "REPORT" text
  const reportElements = await page.locator('text=REPORT').all();
  console.log(`\nFound ${reportElements.length} elements containing "REPORT":`);
  
  for (let i = 0; i < reportElements.length; i++) {
    try {
      const element = reportElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`REPORT Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting REPORT element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with "New Analysis" text
  const newAnalysisElements = await page.locator('text=New Analysis').all();
  console.log(`\nFound ${newAnalysisElements.length} elements containing "New Analysis":`);
  
  for (let i = 0; i < newAnalysisElements.length; i++) {
    try {
      const element = newAnalysisElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`New Analysis Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting New Analysis element ${i + 1} details: ${error}`);
    }
  }
  
  // Check for any elements with "Launch on" text
  const launchElements = await page.locator('text=Launch on').all();
  console.log(`\nFound ${launchElements.length} elements containing "Launch on":`);
  
  for (let i = 0; i < launchElements.length; i++) {
    try {
      const element = launchElements[i];
      const text = await element.textContent();
      const tagName = await element.evaluate(el => el.tagName);
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      
      console.log(`Launch Element ${i + 1}:`);
      console.log(`  Tag: ${tagName}`);
      console.log(`  Classes: ${className}`);
      console.log(`  Text: "${text?.trim()}"`);
      console.log(`  Visible: ${isVisible}`);
      console.log(`  ---`);
    } catch (error) {
      console.log(`Error getting Launch element ${i + 1} details: ${error}`);
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
  
  // Take a detailed look at the page structure
  await page.evaluate(() => {
    console.log('🔍 REPORT PAGE - Page structure analysis:');
    
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
    
    // Check for any elements with header-like styling
    const headerLikeElements = Array.from(allElements).filter(el => {
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
    
    console.log(`\nFound ${headerLikeElements.length} elements with header-like styling:`);
    
    headerLikeElements.forEach((el, index) => {
      const style = window.getComputedStyle(el);
      console.log(`Header-like Element ${index + 1}:`);
      console.log(`  Tag: ${el.tagName}`);
      console.log(`  Classes: ${el.className}`);
      console.log(`  Position: ${style.position}`);
      console.log(`  Top: ${style.top}`);
      console.log(`  Z-index: ${style.zIndex}`);
      console.log(`  Background: ${style.backgroundColor}`);
      console.log(`  ---`);
    });
  });
});
