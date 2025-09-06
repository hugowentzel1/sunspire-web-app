import { test, expect } from '@playwright/test';

test.describe('URL Debug', () => {
  test('Debug URL navigation', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🔍 URL debug...');
    
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    console.log('1. Homepage URL:', page.url());
    
    // Test address input and generate
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")');
    await generateBtn.click();
    
    // Wait for report page
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    console.log('2. Report URL:', page.url());
    
    // Check if URL has the right parameters
    const hasCompany = page.url().includes('company=Apple');
    const hasDemo = page.url().includes('demo=1');
    console.log('Has company=Apple:', hasCompany);
    console.log('Has demo=1:', hasDemo);
    
    // Check body text
    const bodyText = await page.locator('body').textContent();
    const hasQuotaText = bodyText?.includes('Preview:') || bodyText?.includes('run left') || bodyText?.includes('Expires in');
    console.log('Has quota text:', hasQuotaText);
    
    console.log('✅ URL debug completed');
  });
});
