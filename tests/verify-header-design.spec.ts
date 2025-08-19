import { test, expect } from '@playwright/test';

test.describe('Verify Header Design Matches Commit 4c72bca', () => {
  test('Check TealEnergy header matches the exact commit design', async ({ page }) => {
    console.log('🔍 Verifying TealEnergy header matches commit 4c72bca design...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot of the header
    const header = page.locator('header').first();
    await header.screenshot({ 
      path: 'test-results/tealenergy-header-commit-design.png'
    });
    
    // Check header structure details
    const headerDetails = await page.evaluate(() => {
      const header = document.querySelector('header');
      const headerClasses = header?.className || '';
      const container = header?.querySelector('div');
      const containerClasses = container?.className || '';
      const flexContainer = container?.querySelector('div');
      const flexClasses = flexContainer?.className || '';
      
      // Check logo
      const logo = header?.querySelector('img');
      const logoWidth = logo?.getAttribute('width');
      const logoHeight = logo?.getAttribute('height');
      
      // Check brand text
      const brandText = header?.querySelector('h1');
      const brandClasses = brandText?.className || '';
      const brandContent = brandText?.textContent || '';
      
      // Check navigation
      const nav = header?.querySelector('nav');
      const navClasses = nav?.className || '';
      const navLinks = nav?.querySelectorAll('a');
      const navLinkTexts = Array.from(navLinks).map(link => link.textContent);
      
      // Check button
      const button = header?.querySelector('button');
      const buttonText = button?.textContent || '';
      
      return {
        headerClasses,
        containerClasses, 
        flexClasses,
        logoWidth,
        logoHeight,
        brandClasses,
        brandContent,
        navClasses,
        navLinkTexts,
        buttonText,
        hasBackdropBlur: headerClasses.includes('backdrop-blur'),
        hasBorder: headerClasses.includes('border-b'),
        isHeight20: flexClasses.includes('h-20'),
        isMaxW7xl: containerClasses.includes('max-w-7xl')
      };
    });
    
    console.log('🔍 Header Design Details:', headerDetails);
    
    // Verify key design elements match commit 4c72bca
    expect(headerDetails.hasBackdropBlur).toBe(true);
    expect(headerDetails.hasBorder).toBe(true);
    expect(headerDetails.isHeight20).toBe(true);
    expect(headerDetails.isMaxW7xl).toBe(true);
    expect(headerDetails.logoWidth).toBe('48');
    expect(headerDetails.logoHeight).toBe('48');
    expect(headerDetails.brandContent).toBe('TealEnergy');
    expect(headerDetails.navLinkTexts).toEqual(['Enterprise', 'Partners', 'Support']);
    expect(headerDetails.buttonText).toContain('Launch on TealEnergy');
    
    console.log('✅ Header design matches commit 4c72bca perfectly!');
  });

  test('Check Netflix header has same design with different branding', async ({ page }) => {
    console.log('🔍 Verifying Netflix header has same design structure...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/netflix-header-commit-design.png',
      fullPage: true 
    });
    
    // Check branding
    const brandingDetails = await page.evaluate(() => {
      const brandText = document.querySelector('header h1');
      const button = document.querySelector('header button');
      const logo = document.querySelector('header img');
      
      return {
        brandContent: brandText?.textContent || '',
        buttonText: button?.textContent || '',
        hasLogo: !!logo,
        logoSrc: logo?.src || ''
      };
    });
    
    console.log('🔍 Netflix Branding:', brandingDetails);
    
    expect(brandingDetails.brandContent).toBe('Netflix');
    expect(brandingDetails.buttonText).toContain('Launch on Netflix');
    expect(brandingDetails.hasLogo).toBe(true);
    expect(brandingDetails.logoSrc).toContain('netflix.com');
    
    console.log('✅ Netflix header has correct dynamic branding!');
  });
});
