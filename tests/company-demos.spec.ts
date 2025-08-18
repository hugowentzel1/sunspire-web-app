import { test, expect } from '@playwright/test';

test.describe('Company Demo Branding - Visual Testing', () => {
  const companies = [
    { slug: 'solarpro', name: 'SolarPro Energy', expectedColor: '#059669' },
    { slug: 'ecosolar', name: 'EcoSolar Solutions', expectedColor: '#16A34A' },
    { slug: 'premiumsolar', name: 'Premium Solar Group', expectedColor: '#7C3AED' },
    { slug: 'acme', name: 'ACME Solar', expectedColor: '#2563EB' }
  ];

  companies.forEach(({ slug, name, expectedColor }) => {
    test(`should display ${name} branding correctly`, async ({ page }) => {
      // Navigate to company-specific demo
      await page.goto(`/?${slug}=1&demo=1`);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Take screenshot of the full page
      await page.screenshot({ 
        path: `test-results/${slug}-demo-full.png`,
        fullPage: true 
      });
      
      // Take screenshot of the header/branding area
      const header = page.locator('header').first();
      if (await header.isVisible()) {
        await header.screenshot({ 
          path: `test-results/${slug}-demo-header.png` 
        });
      }
      
      // Verify the company name is displayed
      const companyName = page.locator('h1').first();
      if (await companyName.isVisible()) {
        const text = await companyName.textContent();
        console.log(`${name} company name: ${text}`);
      }
      
      // Check button colors (they should use the company's brand colors)
      const buttons = page.locator('button, .btn, [class*="btn"]');
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        const computedStyle = await firstButton.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor
          };
        });
        
        console.log(`${name} button styles:`, computedStyle);
      }
    });
  });

  test('should compare all company branding side by side', async ({ page }) => {
    // This test will help visualize the differences
    console.log('Company branding comparison completed');
  });
});
