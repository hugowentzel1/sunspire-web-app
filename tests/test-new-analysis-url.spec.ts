import { test, expect } from '@playwright/test';

test.describe('New Analysis URL Test', () => {
  test('Check New Analysis button URL', async ({ page }) => {
    const reportUrl = 'https://sunspire-web-app.vercel.app/report?address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1';
    
    console.log('🔍 Testing New Analysis button URL...');
    
    await page.goto(reportUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('Initial URL:', page.url());
    
    // Find and click New Analysis button
    const newAnalysisBtn = page.locator('button:has-text("New Analysis")');
    await newAnalysisBtn.click();
    await page.waitForLoadState('networkidle');
    
    const finalUrl = page.url();
    console.log('Final URL:', finalUrl);
    
    // Check if we're on homepage
    const isOnHomepage = finalUrl.includes('sunspire-web-app.vercel.app') && !finalUrl.includes('/report');
    console.log('On homepage:', isOnHomepage);
    
    // Check for Apple parameters
    const hasCompany = finalUrl.includes('company=Apple');
    const hasDemo = finalUrl.includes('demo=1');
    console.log('Has company=Apple:', hasCompany);
    console.log('Has demo=1:', hasDemo);
    
    // Check for Apple branding on the page
    const appleHeader = page.locator('h1:has-text("Apple")');
    const appleCount = await appleHeader.count();
    console.log('Apple header found:', appleCount > 0);
    
    console.log('✅ URL test completed');
  });
});
