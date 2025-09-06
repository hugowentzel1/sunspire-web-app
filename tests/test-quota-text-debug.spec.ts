import { test, expect } from '@playwright/test';

test.describe('Quota Text Debug', () => {
  test('Debug quota text on report page', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Debugging quota text...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Get all text content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText?.length);
    
    // Look for quota-related text
    const quotaKeywords = ['Preview', 'runs', 'left', 'Expires', 'days', 'hours', 'minutes', 'seconds'];
    for (const keyword of quotaKeywords) {
      const matches = bodyText?.match(new RegExp(keyword, 'gi'));
      if (matches) {
        console.log(`Found "${keyword}":`, matches);
      }
    }
    
    // Look for specific patterns
    const patterns = [
      /Preview.*\d+.*run/i,
      /runs.*left/i,
      /Expires.*in/i,
      /\d+d.*\d+h.*\d+m.*\d+s/i
    ];
    
    for (const pattern of patterns) {
      const matches = bodyText?.match(pattern);
      if (matches) {
        console.log(`Pattern ${pattern} matched:`, matches);
      }
    }
    
    // Check if quota display elements exist
    const quotaElements = page.locator('text=Preview:').or(page.locator('text=Expires in')).or(page.locator('text=runs left'));
    const quotaCount = await quotaElements.count();
    console.log('Quota elements found:', quotaCount);
    
    if (quotaCount > 0) {
      const quotaTexts = await quotaElements.allTextContents();
      console.log('Quota texts:', quotaTexts);
    }
    
    console.log('✅ Quota text debug completed');
  });
});
