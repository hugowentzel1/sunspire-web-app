import { test, expect } from '@playwright/test';

test.describe('Quota Display Debug', () => {
  test('Debug quota display on report page', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Debugging quota display...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-quota-display.png' });
    
    // Look for all text containing "Preview", "runs", "left", "Expires"
    const allText = await page.locator('body').textContent();
    console.log('All text containing "Preview":', allText?.match(/Preview[^]*?/g));
    console.log('All text containing "runs":', allText?.match(/runs[^]*?/g));
    console.log('All text containing "left":', allText?.match(/left[^]*?/g));
    console.log('All text containing "Expires":', allText?.match(/Expires[^]*?/g));
    
    // Check specific selectors
    const selectors = [
      'text=Preview:',
      'text=runs left',
      'text=Expires in',
      '[class*="quota"]',
      '[class*="preview"]',
      '[class*="countdown"]',
      '[data-testid*="quota"]',
      '[data-testid*="preview"]'
    ];
    
    for (const selector of selectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        const texts = await page.locator(selector).allTextContents();
        console.log(`${selector}: ${count} elements - ${texts.join(', ')}`);
      }
    }
    
    // Check for any elements with specific text patterns
    const patterns = [
      /Preview.*runs.*left/i,
      /runs.*left/i,
      /Expires.*in/i,
      /days.*hours.*minutes/i
    ];
    
    for (const pattern of patterns) {
      const matches = allText?.match(pattern);
      if (matches) {
        console.log(`Pattern ${pattern} matched:`, matches);
      }
    }
    
    console.log('✅ Quota debug completed');
  });
});
