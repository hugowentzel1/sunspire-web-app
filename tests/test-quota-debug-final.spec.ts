import { test, expect } from '@playwright/test';

test.describe('Quota Debug Final', () => {
  test('Debug quota text in final test', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🔍 Final quota debug...');
    
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Test address input and generate
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")');
    await generateBtn.click();
    
    // Wait for report page
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    // Get body text
    const bodyText = await page.locator('body').textContent();
    console.log('Body text length:', bodyText?.length);
    
    // Check for quota keywords
    const keywords = ['Preview:', 'run left', 'Expires in'];
    for (const keyword of keywords) {
      const found = bodyText?.includes(keyword);
      console.log(`Found "${keyword}":`, found);
    }
    
    // Check the exact text around quota
    const quotaMatch = bodyText?.match(/Preview:.*?run.*?left/);
    console.log('Quota match:', quotaMatch);
    
    // Check for any text containing "Preview"
    const previewMatch = bodyText?.match(/Preview[^]*?/);
    console.log('Preview match:', previewMatch);
    
    console.log('✅ Final quota debug completed');
  });
});
