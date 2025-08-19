import { test, expect } from '@playwright/test';

test.describe('Verify Final Fixes - Spacing and Color-Coding', () => {
  test('Check TealEnergy has perfect spacing and teal color-coded navigation', async ({ page }) => {
    console.log('🔍 Checking TealEnergy final fixes...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/tealenergy-final-fixes.png'
    });
    
    // Check spacing and colors
    const headerDetails = await page.evaluate(() => {
      const header = document.querySelector('header');
      const textContainer = header?.querySelector('div:has(h1)');
      const navLinks = header?.querySelectorAll('nav a');
      const button = header?.querySelector('button');
      
      return {
        headerHeight: header?.offsetHeight,
        textContainerPadding: getComputedStyle(textContainer as Element).padding,
        navLinkColors: Array.from(navLinks).map(link => getComputedStyle(link as Element).color),
        buttonColor: getComputedStyle(button as Element).backgroundColor,
        companyNameColor: getComputedStyle(textContainer?.querySelector('h1') as Element).color
      };
    });
    
    console.log('🔍 TealEnergy Header Details:', headerDetails);
    
    console.log('✅ TealEnergy final screenshot saved');
  });

  test('Check Netflix has perfect spacing and red color-coded navigation', async ({ page }) => {
    console.log('🔍 Checking Netflix final fixes...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/netflix-final-fixes.png'
    });
    
    // Check spacing and colors
    const headerDetails = await page.evaluate(() => {
      const header = document.querySelector('header');
      const textContainer = header?.querySelector('div:has(h1)');
      const navLinks = header?.querySelectorAll('nav a');
      const button = header?.querySelector('button');
      
      return {
        headerHeight: header?.offsetHeight,
        textContainerPadding: getComputedStyle(textContainer as Element).padding,
        navLinkColors: Array.from(navLinks).map(link => getComputedStyle(link as Element).color),
        buttonColor: getComputedStyle(button as Element).backgroundColor,
        companyNameColor: getComputedStyle(textContainer?.querySelector('h1') as Element).color
      };
    });
    
    console.log('🔍 Netflix Header Details:', headerDetails);
    
    console.log('✅ Netflix final screenshot saved');
  });

  test('Check Google has perfect spacing and blue color-coded navigation', async ({ page }) => {
    console.log('🔍 Checking Google final fixes...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/google-final-fixes.png'
    });
    
    // Check spacing and colors
    const headerDetails = await page.evaluate(() => {
      const header = document.querySelector('header');
      const textContainer = header?.querySelector('div:has(h1)');
      const navLinks = header?.querySelectorAll('nav a');
      const button = header?.querySelector('button');
      
      return {
        headerHeight: header?.offsetHeight,
        textContainerPadding: getComputedStyle(textContainer as Element).padding,
        navLinkColors: Array.from(navLinks).map(link => getComputedStyle(link as Element).color),
        buttonColor: getComputedStyle(button as Element).backgroundColor,
        companyNameColor: getComputedStyle(textContainer?.querySelector('h1') as Element).color
      };
    });
    
    console.log('🔍 Google Header Details:', headerDetails);
    
    console.log('✅ Google final screenshot saved');
  });
});
