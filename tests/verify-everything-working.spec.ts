import { test, expect } from '@playwright/test';

test.describe('Verify Everything is Working Correctly', () => {
  test('Check TealEnergy - logos, navigation, and functionality', async ({ page }) => {
    console.log('🔍 Testing TealEnergy - comprehensive check...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check logo is displaying
    const logo = page.locator('header img').first();
    const hasLogo = await logo.count() > 0;
    const logoSrc = await logo.getAttribute('src');
    console.log('🔍 Logo check:', { hasLogo, logoSrc });
    expect(hasLogo).toBe(true);
    expect(logoSrc).toContain('tealenergy.com');
    
    // Check brand name
    const brandName = await page.locator('header h1').first().textContent();
    console.log('🔍 Brand name:', brandName);
    expect(brandName).toBe('TealEnergy');
    
    // Check navigation links
    const navLinks = page.locator('header nav a');
    const linkCount = await navLinks.count();
    console.log('🔍 Navigation link count:', linkCount);
    expect(linkCount).toBe(3);
    
    // Check each navigation link
    const pricingLink = page.locator('header nav a').filter({ hasText: 'Pricing' });
    const partnersLink = page.locator('header nav a').filter({ hasText: 'Partners' });
    const supportLink = page.locator('header nav a').filter({ hasText: 'Support' });
    
    expect(await pricingLink.getAttribute('href')).toBe('/pricing');
    expect(await partnersLink.getAttribute('href')).toBe('/partners');
    expect(await supportLink.getAttribute('href')).toBe('/support');
    
    // Check button text
    const button = page.locator('header button').first();
    const buttonText = await button.textContent();
    console.log('🔍 Button text:', buttonText);
    expect(buttonText).toContain('Launch on TealEnergy');
    
    // Check "Built for" section
    const builtForSection = page.locator('h2').filter({ hasText: 'Built for TealEnergy' });
    expect(await builtForSection.count()).toBe(1);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/tealenergy-everything-working.png',
      fullPage: true 
    });
    
    console.log('✅ TealEnergy - everything working perfectly!');
  });

  test('Check Netflix - logos, navigation, and functionality', async ({ page }) => {
    console.log('🔍 Testing Netflix - comprehensive check...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check logo is displaying
    const logo = page.locator('header img').first();
    const hasLogo = await logo.count() > 0;
    const logoSrc = await logo.getAttribute('src');
    console.log('🔍 Logo check:', { hasLogo, logoSrc });
    expect(hasLogo).toBe(true);
    expect(logoSrc).toContain('netflix.com');
    
    // Check brand name
    const brandName = await page.locator('header h1').first().textContent();
    console.log('🔍 Brand name:', brandName);
    expect(brandName).toBe('Netflix');
    
    // Check navigation links
    const pricingLink = page.locator('header nav a').filter({ hasText: 'Pricing' });
    const partnersLink = page.locator('header nav a').filter({ hasText: 'Partners' });
    const supportLink = page.locator('header nav a').filter({ hasText: 'Support' });
    
    expect(await pricingLink.getAttribute('href')).toBe('/pricing');
    expect(await partnersLink.getAttribute('href')).toBe('/partners');
    expect(await supportLink.getAttribute('href')).toBe('/support');
    
    // Check button text
    const button = page.locator('header button').first();
    const buttonText = await button.textContent();
    console.log('🔍 Button text:', buttonText);
    expect(buttonText).toContain('Launch on Netflix');
    
    // Check "Built for" section
    const builtForSection = page.locator('h2').filter({ hasText: 'Built for Netflix' });
    expect(await builtForSection.count()).toBe(1);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/netflix-everything-working.png',
      fullPage: true 
    });
    
    console.log('✅ Netflix - everything working perfectly!');
  });

  test('Check Google - logos, navigation, and functionality', async ({ page }) => {
    console.log('🔍 Testing Google - comprehensive check...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check logo is displaying
    const logo = page.locator('header img').first();
    const hasLogo = await logo.count() > 0;
    const logoSrc = await logo.getAttribute('src');
    console.log('🔍 Logo check:', { hasLogo, logoSrc });
    expect(hasLogo).toBe(true);
    expect(logoSrc).toContain('google.com');
    
    // Check brand name
    const brandName = await page.locator('header h1').first().textContent();
    console.log('🔍 Brand name:', brandName);
    expect(brandName).toBe('Google');
    
    // Check navigation links
    const pricingLink = page.locator('header nav a').filter({ hasText: 'Pricing' });
    const partnersLink = page.locator('header nav a').filter({ hasText: 'Partners' });
    const supportLink = page.locator('header nav a').filter({ hasText: 'Support' });
    
    expect(await pricingLink.getAttribute('href')).toBe('/pricing');
    expect(await partnersLink.getAttribute('href')).toBe('/partners');
    expect(await supportLink.getAttribute('href')).toBe('/support');
    
    // Check button text
    const button = page.locator('header button').first();
    const buttonText = await button.textContent();
    console.log('🔍 Button text:', buttonText);
    expect(buttonText).toContain('Launch on Google');
    
    // Check "Built for" section
    const builtForSection = page.locator('h2').filter({ hasText: 'Built for Google' });
    expect(await builtForSection.count()).toBe(1);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/google-everything-working.png',
      fullPage: true 
    });
    
    console.log('✅ Google - everything working perfectly!');
  });

  test('Check Apple - logos, navigation, and functionality', async ({ page }) => {
    console.log('🔍 Testing Apple - comprehensive check...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&brandColor=%23000000&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check logo is displaying
    const logo = page.locator('header img').first();
    const hasLogo = await logo.count() > 0;
    const logoSrc = await logo.getAttribute('src');
    console.log('🔍 Logo check:', { hasLogo, logoSrc });
    expect(hasLogo).toBe(true);
    expect(logoSrc).toContain('apple.com');
    
    // Check brand name
    const brandName = await page.locator('header h1').first().textContent();
    console.log('🔍 Brand name:', brandName);
    expect(brandName).toBe('Apple');
    
    // Check navigation links
    const pricingLink = page.locator('header nav a').filter({ hasText: 'Pricing' });
    const partnersLink = page.locator('header nav a').filter({ hasText: 'Partners' });
    const supportLink = page.locator('header nav a').filter({ hasText: 'Support' });
    
    expect(await pricingLink.getAttribute('href')).toBe('/pricing');
    expect(await partnersLink.getAttribute('href')).toBe('/partners');
    expect(await supportLink.getAttribute('href')).toBe('/support');
    
    // Check button text
    const button = page.locator('header button').first();
    const buttonText = await button.textContent();
    console.log('🔍 Button text:', buttonText);
    expect(buttonText).toContain('Launch on Apple');
    
    // Check "Built for" section
    const builtForSection = page.locator('h2').filter({ hasText: 'Built for Apple' });
    expect(await builtForSection.count()).toBe(1);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/apple-everything-working.png',
      fullPage: true 
    });
    
    console.log('✅ Apple - everything working perfectly!');
  });
});
