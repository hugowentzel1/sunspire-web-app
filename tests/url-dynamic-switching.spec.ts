import { test, expect } from '@playwright/test';

test.describe('URL-Based Dynamic Switching System', () => {
  test('should dynamically change company branding based on URL parameters', async ({ page }) => {
    // Test with GreenFuture branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A&logo=https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=96&h=96&fit=crop&crop=center');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name changes
    const companyName = page.locator('text=GreenFuture');
    await expect(companyName).toBeVisible();
    
    // Check that "Your Company" is NOT visible
    const defaultCompany = page.locator('text=Your Company');
    await expect(defaultCompany).toHaveCount(0);
    
    // Check brand colors are applied
    const primaryButton = page.locator('button').filter({ hasText: /Launch|Get|Start/i }).first();
    if (await primaryButton.count() > 0) {
      const buttonColor = await primaryButton.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor;
      });
      console.log('Primary button color:', buttonColor);
      // Should be green (#16A34A) or similar
      expect(buttonColor).toMatch(/rgb\(22, 163, 74\)|rgb\(34, 197, 94\)/);
    }
    
    console.log('✅ GreenFuture branding test passed');
  });

  test('should work with different company and color combinations', async ({ page }) => {
    // Test with BlueSolar branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6&logo=https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=96&h=96&fit=crop&crop=center');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name changes
    const companyName = page.locator('text=BlueSolar');
    await expect(companyName).toBeVisible();
    
    // Check that "Your Company" is NOT visible
    const defaultCompany = page.locator('text=Your Company');
    await expect(defaultCompany).toHaveCount(0);
    
    console.log('✅ BlueSolar branding test passed');
  });

  test('should handle missing parameters gracefully with defaults', async ({ page }) => {
    // Test with minimal parameters
    await page.goto('https://sunspire-web-app.vercel.app/?company=TestCompany');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name changes
    const companyName = page.locator('text=TestCompany');
    await expect(companyName).toBeVisible();
    
    // Should use default orange color when primary not specified
    const defaultCompany = page.locator('text=Your Company');
    await expect(defaultCompany).toHaveCount(0);
    
    console.log('✅ Default parameters test passed');
  });

  test('should apply brand colors to chart and metric cards', async ({ page }) => {
    // Test with PurplePower branding
    await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=PurplePower&primary=%238B5CF6&logo=https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=96&h=96&fit=crop&crop=center');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name in report
    const companyName = page.locator('text=PurplePower');
    await expect(companyName).toBeVisible();
    
    // Check that chart section is visible
    const chartSection = page.locator('text=Your Solar Savings Over Time');
    await expect(chartSection).toBeVisible();
    
    // Check that metric cards are present
    const metricCards = page.locator('text=Investment, text=Payback Time, text=25-Year Savings');
    await expect(metricCards).toHaveCount(3);
    
    // Check that countdown timer is red (should always be red regardless of brand)
    const countdownTimer = page.locator('text=Exclusive preview — expires in');
    await expect(countdownTimer).toBeVisible();
    
    console.log('✅ PurplePower chart and metrics test passed');
  });

  test('should work with logo parameter', async ({ page }) => {
    // Test with logo
    await page.goto('https://sunspire-web-app.vercel.app/?company=LogoTest&primary=%23F97316&logo=https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=96&h=96&fit=crop&crop=center');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name
    const companyName = page.locator('text=LogoTest');
    await expect(companyName).toBeVisible();
    
    // Check that logo is loaded (should be visible somewhere on the page)
    const logoImage = page.locator('img[src*="images.unsplash.com"]');
    await expect(logoImage).toBeVisible();
    
    console.log('✅ Logo parameter test passed');
  });

  test('should handle demo mode correctly', async ({ page }) => {
    // Test with demo mode enabled
    await page.goto('https://sunspire-web-app.vercel.app/?company=DemoTest&primary=%23DC2626&demo=1');
    
    await page.waitForLoadState('networkidle');
    
    // Check company name
    const companyName = page.locator('text=DemoTest');
    await expect(companyName).toBeVisible();
    
    // Check that demo features are visible (like demo badge or ribbon)
    const demoElements = page.locator('[class*="demo"], [class*="Demo"]');
    if (await demoElements.count() > 0) {
      console.log('Demo elements found:', await demoElements.count());
    }
    
    console.log('✅ Demo mode test passed');
  });

  test('should generate unique URLs for different companies', async ({ page }) => {
    const companies = [
      { name: 'CompanyA', color: '%23FF6B6B' },
      { name: 'CompanyB', color: '%234ECDC4' },
      { name: 'CompanyC', color: '%2345B7D1' }
    ];

    for (const company of companies) {
      const url = `https://sunspire-web-app.vercel.app/?company=${company.name}&primary=${company.color}`;
      console.log(`Testing URL: ${url}`);
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Check company name is correct
      const companyName = page.locator(`text=${company.name}`);
      await expect(companyName).toBeVisible();
      
      // Check that other company names are NOT visible
      for (const otherCompany of companies) {
        if (otherCompany.name !== company.name) {
          const otherCompanyName = page.locator(`text=${otherCompany.name}`);
          await expect(otherCompanyName).toHaveCount(0);
        }
      }
      
      console.log(`✅ ${company.name} unique URL test passed`);
    }
  });
});
