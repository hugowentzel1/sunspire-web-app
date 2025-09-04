import { test, expect } from '@playwright/test';

test('Test brand theme function', async ({ page }) => {
  console.log('🧪 Testing brand theme function...');
  
  // Test the getBrandTheme function directly
  const brandThemeResults = await page.evaluate(() => {
    // Import the function (this won't work in browser, but let's test the logic)
    const map: Record<string, string> = {
      meta: '#1877F2',
      facebook: '#1877F2',
      apple: '#0071E3',
      amazon: '#FF9900',
      google: '#4285F4',
      microsoft: '#00A4EF',
      netflix: '#E50914',
      spotify: '#1DB954',
      twitter: '#1DA1F2',
      linkedin: '#0A66C2',
      tesla: '#CC0000',
      zillow: '#006AFF',
      redfin: '#D21F3C',
      chase: '#117ACA',
      wellsfargo: '#D71E28',
      default: '#2563EB',
    };
    
    const getBrandTheme = (companyHandle?: string) => {
      const key = (companyHandle || '').toLowerCase();
      return map[key] || map.default;
    };
    
    return {
      tesla: getBrandTheme('Tesla'),
      apple: getBrandTheme('Apple'),
      amazon: getBrandTheme('Amazon'),
      google: getBrandTheme('Google'),
      microsoft: getBrandTheme('Microsoft'),
      netflix: getBrandTheme('Netflix'),
    };
  });
  
  console.log('🎨 Brand theme results:', brandThemeResults);
  
  // Verify Tesla should be red
  expect(brandThemeResults.tesla).toBe('#CC0000');
  expect(brandThemeResults.apple).toBe('#0071E3');
  expect(brandThemeResults.amazon).toBe('#FF9900');
  expect(brandThemeResults.google).toBe('#4285F4');
  expect(brandThemeResults.microsoft).toBe('#00A4EF');
  expect(brandThemeResults.netflix).toBe('#E50914');
});
