import { test, expect } from '@playwright/test';

test.describe('New Analysis Simple Test', () => {
  test('Test New Analysis button click', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Simple New Analysis test...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('Initial URL:', page.url());
    
    // Find the button using a different selector
    const newAnalysisBtn = page.locator('button').filter({ hasText: 'New Analysis' });
    const btnCount = await newAnalysisBtn.count();
    console.log('New Analysis buttons found:', btnCount);
    
    if (btnCount > 0) {
      // Check button properties
      const isVisible = await newAnalysisBtn.isVisible();
      const isEnabled = await newAnalysisBtn.isEnabled();
      console.log('Button visible:', isVisible, 'Button enabled:', isEnabled);
      
      // Try clicking
      console.log('Clicking button...');
      await newAnalysisBtn.click();
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log('Final URL:', finalUrl);
      
      // Check if URL changed
      const urlChanged = finalUrl !== reportUrl;
      console.log('URL changed:', urlChanged);
      
      if (urlChanged) {
        console.log('✅ Button click worked - URL changed');
      } else {
        console.log('❌ Button click did not work - URL unchanged');
      }
    } else {
      console.log('❌ No New Analysis button found');
    }
    
    console.log('✅ Simple test completed');
  });
});
