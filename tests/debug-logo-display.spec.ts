import { test, expect } from '@playwright/test';

test.describe('Debug Logo Display', () => {
  test('Debug why TealEnergy logo is not showing', async ({ page }) => {
    console.log('🔍 Debugging TealEnergy logo display...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check the brand takeover data
    const brandData = await page.evaluate(() => {
      // Check if CSS variables are set
      const brandPrimary = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
      const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand');
      
      // Check if there are any img elements in the header
      const headerImgs = document.querySelectorAll('header img');
      const headerImgSrcs = Array.from(headerImgs).map(img => (img as HTMLImageElement).src);
      
      // Check if there are any divs with emoji placeholders
      const emojiPlaceholders = document.querySelectorAll('header div span');
      const emojiPlaceholdersWithEmoji = Array.from(emojiPlaceholders).filter(span => span.textContent?.includes('☀️'));
      
      return {
        brandPrimary,
        brand,
        headerImgCount: headerImgs.length,
        headerImgSrcs,
        emojiPlaceholderCount: emojiPlaceholdersWithEmoji.length,
        pageTitle: document.title,
        bodyText: document.body.textContent?.substring(0, 200)
      };
    });
    
    console.log('🔍 Brand Data:', brandData);
    
    // Check if the logo URL is being generated correctly
    const logoUrl = await page.evaluate(() => {
      // Try to access the logo URL from the component
      const logoElements = document.querySelectorAll('img[src*="logo.clearbit.com"]');
      return Array.from(logoElements).map(img => (img as HTMLImageElement).src);
    });
    
    console.log('🔍 Logo URLs found:', logoUrl);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'test-results/tealenergy-logo-debug.png',
      fullPage: true 
    });
    
    console.log('✅ Debug screenshot saved');
  });
});
