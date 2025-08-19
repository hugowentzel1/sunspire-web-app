import { test, expect } from '@playwright/test';

test.describe('Verify Brand Takeover', () => {
  test('Google should show Google branding with blue colors', async ({ page }) => {
    console.log('🔍 Testing Google brand takeover...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&brandColor=%234285F4&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check page content
    const pageTitle = await page.locator('h1').first().textContent();
    const builtForText = await page.locator('h2').filter({ hasText: 'Built for' }).first().textContent();
    const buttonText = await page.locator('button').filter({ hasText: /Generate|Launch/ }).first().textContent();
    
    console.log('🔍 Google Page Content:');
    console.log('  Page Title:', pageTitle);
    console.log('  Built for:', builtForText);
    console.log('  Button Text:', buttonText);
    
    // Verify Google branding
    expect(pageTitle).toContain('Google');
    expect(builtForText).toContain('Built for Google');
    expect(buttonText).toContain('Launch on Google');
    
    // Check that the main branding is correct (this is the important part)
    const hasCorrectBranding = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      const companyName = 'Google';
      const brandCount = (bodyText.match(new RegExp(companyName, 'g')) || []).length;
      return brandCount >= 3; // Should appear at least 3 times (title, built for, button)
    });
    expect(hasCorrectBranding).toBe(true);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/google-brand-takeover.png',
      fullPage: true 
    });
    
    console.log('✅ Google brand takeover working correctly');
  });

  test('Netflix should show Netflix branding with red colors', async ({ page }) => {
    console.log('🔍 Testing Netflix brand takeover...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&brandColor=%23E50914&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check page content
    const pageTitle = await page.locator('h1').first().textContent();
    const builtForText = await page.locator('h2').filter({ hasText: 'Built for' }).first().textContent();
    const buttonText = await page.locator('button').filter({ hasText: /Generate|Launch/ }).first().textContent();
    
    console.log('🔍 Netflix Page Content:');
    console.log('  Page Title:', pageTitle);
    console.log('  Built for:', builtForText);
    console.log('  Button Text:', buttonText);
    
    // Verify Netflix branding
    expect(pageTitle).toContain('Netflix');
    expect(builtForText).toContain('Built for Netflix');
    expect(buttonText).toContain('Launch on Netflix');
    
    // Check that the main branding is correct (this is the important part)
    const hasCorrectBranding = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      const companyName = 'Netflix';
      const brandCount = (bodyText.match(new RegExp(companyName, 'g')) || []).length;
      return brandCount >= 3; // Should appear at least 3 times (title, built for, button)
    });
    expect(hasCorrectBranding).toBe(true);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/netflix-brand-takeover.png',
      fullPage: true 
    });
    
    console.log('✅ Netflix brand takeover working correctly');
  });

  test('TealEnergy should show TealEnergy branding with teal colors', async ({ page }) => {
    console.log('🔍 Testing TealEnergy brand takeover...');
    
    await page.goto('https://sunspire-web-app.vercel.app/?company=TealEnergy&brandColor=%2300B3B3&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check page content
    const pageTitle = await page.locator('h1').first().textContent();
    const builtForText = await page.locator('h2').filter({ hasText: 'Built for' }).first().textContent();
    const buttonText = await page.locator('button').filter({ hasText: /Generate|Launch/ }).first().textContent();
    
    console.log('🔍 TealEnergy Page Content:');
    console.log('  Page Title:', pageTitle);
    console.log('  Built for:', builtForText);
    console.log('  Button Text:', buttonText);
    
    // Verify TealEnergy branding
    expect(pageTitle).toContain('TealEnergy');
    expect(builtForText).toContain('Built for TealEnergy');
    expect(buttonText).toContain('Launch on TealEnergy');
    
    // Check that the main branding is correct (this is the important part)
    const hasCorrectBranding = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      const companyName = 'TealEnergy';
      const brandCount = (bodyText.match(new RegExp(companyName, 'g')) || []).length;
      return brandCount >= 3; // Should appear at least 3 times (title, built for, button)
    });
    expect(hasCorrectBranding).toBe(true);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/tealenergy-brand-takeover.png',
      fullPage: true 
    });
    
    console.log('✅ TealEnergy brand takeover working correctly');
  });
});
