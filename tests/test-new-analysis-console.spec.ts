import { test, expect } from '@playwright/test';

test.describe('New Analysis Console Test', () => {
  test('Check New Analysis button console logs', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Testing New Analysis button console...');
    
    // Listen for console logs
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
      console.log(`Console ${msg.type()}:`, msg.text());
    });
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('Initial URL:', page.url());
    
    // Add a click listener to see if the button click is registered
    await page.evaluate(() => {
      const btn = document.querySelector('button:has-text("New Analysis")');
      if (btn) {
        btn.addEventListener('click', (e) => {
          console.log('Button clicked!', e);
        });
      }
    });
    
    // Find and click New Analysis button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    console.log('Button found:', await newAnalysisBtn.count());
    
    await newAnalysisBtn.click();
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    
    // Check if URL changed
    const urlChanged = finalUrl !== reportUrl;
    console.log('URL changed:', urlChanged);
    
    // Check console logs
    console.log('Console logs:', consoleLogs);
    
    console.log('✅ Console test completed');
  });
});
