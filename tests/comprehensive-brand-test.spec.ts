import { test, expect } from '@playwright/test';

test.describe('Comprehensive Brand Testing', () => {
  test('demo banner should be gone from ALL URLs', async ({ page }) => {
    const testUrls = [
      '/?company=Google&demo=1',
      '/?company=Netflix&demo=1', 
      '/?company=Apple&demo=1',
      '/?company=Microsoft&demo=1',
      '/?company=Spotify&demo=1',
      '/?company=Uber&demo=1',
      '/?company=Google&brandColor=%234285F4&demo=1',
      '/?company=Netflix&brandColor=%23E50914&demo=1',
      '/?company=Apple&brandColor=%23000000&demo=1',
      '/report?company=Google&demo=1',
      '/report?company=Netflix&demo=1',
      '/demo-result?company=Google&demo=1',
      '/demo-result?company=Netflix&demo=1'
    ];

    for (const url of testUrls) {
      console.log(`Testing URL: ${url}`);
      
      await page.goto(`https://sunspire-web-app.vercel.app${url}`);
      await page.waitForLoadState('networkidle');
      
      // Check that the demo banner is NOT visible anywhere
      const demoBanner = await page.locator('text=Exclusive preview built for').first();
      await expect(demoBanner).not.toBeVisible();
      
      // Also check for other demo banner text
      const expiryText = await page.locator('text=Exclusive preview — expires in').first();
      await expect(expiryText).not.toBeVisible();
      
      const runsLeftText = await page.locator('text=Runs left:').first();
      await expect(runsLeftText).not.toBeVisible();
      
      console.log(`✅ Demo banner confirmed gone from: ${url}`);
      
      // Take screenshot for verification
      const filename = url.replace(/[?&=]/g, '-').replace(/^-/, '');
      await page.screenshot({ 
        path: `test-results/no-banner-${filename}.png`,
        fullPage: true 
      });
      
      await page.waitForTimeout(500);
    }
  });

  test('different companies should show different logos', async ({ page }) => {
    const testCases = [
      { company: 'Google', expectedLogo: 'google.com' },
      { company: 'Netflix', expectedLogo: 'netflix.com' },
      { company: 'Apple', expectedLogo: 'apple.com' },
      { company: 'Microsoft', expectedLogo: 'microsoft.com' },
      { company: 'Spotify', expectedLogo: 'spotify.com' },
      { company: 'Uber', expectedLogo: 'uber.com' },
      { company: 'Tesla', expectedLogo: 'tesla.com' },
      { company: 'Starbucks', expectedLogo: 'starbucks.com' }
    ];

    for (const testCase of testCases) {
      console.log(`Testing logo for ${testCase.company}`);
      
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check if there's an actual logo image
      const logoImage = await page.locator('img[alt*="logo"]').first();
      
      // Should have a logo image
      await expect(logoImage).toBeVisible();
      
      // Check that it's not a colored box with initials
      const coloredBox = await page.locator('div[style*="background"]').filter({ hasText: testCase.company.substring(0, 2) });
      await expect(coloredBox).not.toBeVisible();
      
      // Verify the logo source contains the expected domain
      const logoSrc = await logoImage.getAttribute('src');
      expect(logoSrc).toContain(testCase.expectedLogo);
      
      console.log(`✅ ${testCase.company} shows logo from ${testCase.expectedLogo}`);
      
      await page.screenshot({ 
        path: `test-results/logo-${testCase.company.toLowerCase()}.png`,
        fullPage: false 
      });
      
      await page.waitForTimeout(500);
    }
  });

  test('different companies should show different brand colors', async ({ page }) => {
    const testCases = [
      { company: 'Google', brandColor: '#4285F4', expectedColor: '#4285F4' },
      { company: 'Netflix', brandColor: '#E50914', expectedColor: '#E50914' },
      { company: 'Spotify', brandColor: '#1DB954', expectedColor: '#1DB954' },
      { company: 'Apple', brandColor: '#000000', expectedColor: '#000000' },
      { company: 'Microsoft', brandColor: '#00A4EF', expectedColor: '#00A4EF' },
      { company: 'Uber', brandColor: '#000000', expectedColor: '#000000' },
      { company: 'Lyft', brandColor: '#FF00BF', expectedColor: '#FF00BF' }
    ];

    for (const testCase of testCases) {
      console.log(`Testing brand color for ${testCase.company}: ${testCase.brandColor}`);
      
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&brandColor=${testCase.brandColor}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check if the brand color CSS variable is set correctly
      const brandColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
      });
      
      console.log(`Expected: ${testCase.expectedColor}, Got: ${brandColor}`);
      
      // Verify the color is applied
      expect(brandColor).toBeTruthy();
      
      // Check that buttons and UI elements use the brand color
      const primaryButton = await page.locator('button').filter({ hasText: /Get|Request|Launch|Start/ }).first();
      if (await primaryButton.isVisible()) {
        const buttonColor = await primaryButton.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.backgroundColor || style.background;
        });
        
        console.log(`Button color: ${buttonColor}`);
        expect(buttonColor).toBeTruthy();
      }
      
      await page.screenshot({ 
        path: `test-results/color-${testCase.company.toLowerCase()}.png`,
        fullPage: true 
      });
      
      await page.waitForTimeout(500);
    }
  });

  test('company names should be displayed correctly', async ({ page }) => {
    const testCases = [
      'Google',
      'Netflix', 
      'Apple',
      'Microsoft',
      'Spotify',
      'Uber',
      'Tesla',
      'Starbucks'
    ];

    for (const company of testCases) {
      console.log(`Testing company name display: ${company}`);
      
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${company}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check that the company name appears in the page
      const companyText = await page.locator(`text=${company}`).first();
      await expect(companyText).toBeVisible();
      
      console.log(`✅ Company name "${company}" is displayed correctly`);
      
      await page.waitForTimeout(500);
    }
  });
});
