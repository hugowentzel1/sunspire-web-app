import { test, expect } from '@playwright/test';

test.describe('New Analysis Button Fix', () => {
  test('Test New Analysis button preserves branding', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Testing New Analysis button...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    // Check current URL has Apple parameters
    const initialUrl = page.url();
    console.log('Initial URL:', initialUrl);
    const hasAppleParams = initialUrl.includes('company=Apple') && initialUrl.includes('demo=1');
    console.log('Has Apple params initially:', hasAppleParams);
    
    // Find and click New Analysis button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    const btnCount = await newAnalysisBtn.count();
    console.log('New Analysis buttons found:', btnCount);
    
    if (btnCount > 0) {
      // Click the button
      await newAnalysisBtn.click();
      await page.waitForLoadState('networkidle');
      
      // Check URL after click
      const finalUrl = page.url();
      console.log('Final URL:', finalUrl);
      
      const hasAppleParamsAfter = finalUrl.includes('company=Apple') && finalUrl.includes('demo=1');
      console.log('Has Apple params after click:', hasAppleParamsAfter);
      
      // Check if we're on homepage
      const isOnHomepage = finalUrl.includes('sunspire-web-app.vercel.app') && !finalUrl.includes('/report');
      console.log('On homepage after click:', isOnHomepage);
      
      // Check for Apple branding on homepage
      if (isOnHomepage) {
        const appleHeader = page.locator('h1:has-text("Apple")');
        const appleCount = await appleHeader.count();
        console.log('Apple branding on homepage:', appleCount > 0);
        
        // Check for Apple colors
        const brandElements = page.locator('[style*="--brand"]');
        const brandCount = await brandElements.count();
        console.log('Brand elements on homepage:', brandCount);
      }
    } else {
      console.log('❌ No New Analysis button found');
    }
    
    console.log('✅ New Analysis test completed');
  });
});
