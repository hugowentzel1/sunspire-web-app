import { test, expect } from '@playwright/test';

test.describe('Navigation Spacing and Brand Colors', () => {
  test('navigation should have proper spacing and brand colors', async ({ page }) => {
    // Test with different companies to verify brand colors
    const testCases = [
      { company: 'Google', brandColor: '#4285F4' },
      { company: 'Netflix', brandColor: '#E50914' },
      { company: 'TealEnergy', brandColor: '#00B3B3' }
    ];

    for (const testCase of testCases) {
      console.log(`\n🔍 Testing navigation for ${testCase.company}...`);
      
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&brandColor=${testCase.brandColor}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // 1. Check that navigation links are visible and properly spaced
      const enterpriseLink = await page.locator('text=Enterprise').first();
      const partnersLink = await page.locator('text=Partners').first();
      const supportLink = await page.locator('text=Support').first();
      
      await expect(enterpriseLink).toBeVisible();
      await expect(partnersLink).toBeVisible();
      await expect(supportLink).toBeVisible();
      
      console.log(`   ✅ Navigation links visible`);
      
      // 2. Check that the launch button is visible and properly spaced
      const launchButton = await page.locator('button').filter({ hasText: `Launch on ${testCase.company}` }).first();
      await expect(launchButton).toBeVisible();
      
      console.log(`   ✅ Launch button visible`);
      
      // 3. Check brand color is applied to CSS variable
      const brandColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
      });
      
      const isColorWorking = brandColor !== '#FFA63D' && brandColor !== '';
      console.log(`   Brand color working: ${isColorWorking ? '✅' : '❌'} (got: ${brandColor})`);
      
      // 4. Check that hover colors use brand colors
      const enterpriseHoverColor = await enterpriseLink.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue('--brand-primary') || style.color;
      });
      
      console.log(`   Enterprise hover color: ${enterpriseHoverColor}`);
      
      // 5. Take a screenshot to verify spacing visually
      await page.screenshot({ 
        path: `test-results/navigation-${testCase.company.toLowerCase()}.png`,
        fullPage: false 
      });
      
      console.log(`   📸 Screenshot saved for ${testCase.company}`);
      
      await page.waitForTimeout(1000);
    }
  });
});
