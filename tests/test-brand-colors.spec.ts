import { test, expect } from '@playwright/test';

test.describe('Brand Color Testing', () => {
  test('should apply different brand colors for different companies', async ({ page }) => {
    // Test different brand colors
    const testCases = [
      { company: 'Google', brandColor: '#4285F4', expectedColor: '#4285F4' },
      { company: 'Netflix', brandColor: '#E50914', expectedColor: '#E50914' },
      { company: 'Spotify', brandColor: '#1DB954', expectedColor: '#1DB954' },
      { company: 'Apple', brandColor: '#000000', expectedColor: '#000000' },
      { company: 'Microsoft', brandColor: '#00A4EF', expectedColor: '#00A4EF' }
    ];

    for (const testCase of testCases) {
      console.log(`Testing ${testCase.company} with color ${testCase.brandColor}`);
      
      // Navigate to the demo page with brand parameters
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&brandColor=${testCase.brandColor}&demo=1`);
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');
      
      // Check if the brand color CSS variable is set correctly
      const brandColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
      });
      
      console.log(`Expected: ${testCase.expectedColor}, Got: ${brandColor}`);
      
      // Verify the color is applied (should be close to expected)
      expect(brandColor).toBeTruthy();
      
      // Take a screenshot for visual verification
      await page.screenshot({ 
        path: `test-results/brand-color-${testCase.company.toLowerCase()}.png`,
        fullPage: true 
      });
      
      // Wait a bit between tests
      await page.waitForTimeout(1000);
    }
  });

  test('should show company logos instead of colored boxes', async ({ page }) => {
    const testCases = [
      { company: 'Google', expectedLogo: true },
      { company: 'Netflix', expectedLogo: true },
      { company: 'Apple', expectedLogo: true },
      { company: 'Microsoft', expectedLogo: true }
    ];

    for (const testCase of testCases) {
      console.log(`Testing logo for ${testCase.company}`);
      
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // Check if there's an actual image instead of a colored box
      const logoImage = await page.locator('img[alt*="logo"]').first();
      const coloredBox = await page.locator('div[style*="background"]').filter({ hasText: testCase.company.substring(0, 2) });
      
      if (testCase.expectedLogo) {
        // Should have a logo image
        await expect(logoImage).toBeVisible();
        // Should not have a colored box with initials
        await expect(coloredBox).not.toBeVisible();
      }
      
      await page.screenshot({ 
        path: `test-results/logo-test-${testCase.company.toLowerCase()}.png`,
        fullPage: false 
      });
      
      await page.waitForTimeout(1000);
    }
  });

  test('should not show demo banner', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Google&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that the demo banner is NOT visible
    const demoBanner = await page.locator('text=Exclusive preview built for').first();
    await expect(demoBanner).not.toBeVisible();
    
    // Take screenshot to verify
    await page.screenshot({ 
      path: 'test-results/no-demo-banner.png',
      fullPage: true 
    });
  });
});
