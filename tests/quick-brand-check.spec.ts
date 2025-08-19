import { test, expect } from '@playwright/test';

test.describe('Quick Brand Check', () => {
  test('quick check: demo banner gone, colors working, logos showing', async ({ page }) => {
    // Test just 3 key companies quickly
    const testCases = [
      { company: 'Google', brandColor: '#4285F4' },
      { company: 'Netflix', brandColor: '#E50914' },
      { company: 'Apple', brandColor: '#000000' }
    ];

    for (const testCase of testCases) {
      console.log(`\n🔍 Quick testing ${testCase.company}...`);
      
      // Navigate to demo page
      await page.goto(`https://sunspire-web-app.vercel.app/?company=${testCase.company}&brandColor=${testCase.brandColor}&demo=1`);
      await page.waitForLoadState('networkidle');
      
      // 1. Check demo banner is GONE
      const demoBanner = await page.locator('text=Exclusive preview built for').first();
      const isBannerGone = !(await demoBanner.isVisible());
      console.log(`   Demo banner gone: ${isBannerGone ? '✅' : '❌'}`);
      
      // 2. Check brand color is applied
      const brandColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
      });
      const isColorWorking = brandColor !== '#FFA63D' && brandColor !== '';
      console.log(`   Brand color working: ${isColorWorking ? '✅' : '❌'} (got: ${brandColor})`);
      
      // 3. Check logo is showing (not colored box)
      const logoImage = await page.locator('img[alt*="logo"]').first();
      const coloredBox = await page.locator('div[style*="background"]').filter({ hasText: testCase.company.substring(0, 2) });
      
      const hasLogo = await logoImage.isVisible();
      const noColoredBox = !(await coloredBox.isVisible());
      const isLogoWorking = hasLogo && noColoredBox;
      console.log(`   Logo working: ${isLogoWorking ? '✅' : '❌'}`);
      
      // Quick summary for this company
      const allWorking = isBannerGone && isColorWorking && isLogoWorking;
      console.log(`   ${testCase.company}: ${allWorking ? '✅ ALL GOOD' : '❌ ISSUES FOUND'}`);
      
      if (!allWorking) {
        console.log(`   ❌ Issues: Banner=${isBannerGone}, Color=${isColorWorking}, Logo=${isLogoWorking}`);
      }
      
      await page.waitForTimeout(1000);
    }
  });
});
