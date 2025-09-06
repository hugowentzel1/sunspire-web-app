import { test, expect } from '@playwright/test';

test.describe('Deployment Check', () => {
  test('Check if fix is deployed', async ({ page }) => {
    const appleDemoUrl = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
    
    console.log('🔍 Checking deployment...');
    
    await page.goto(appleDemoUrl);
    await page.waitForLoadState('networkidle');
    
    // Check console logs for the fix
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('Navigating to report')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Test address input and generate
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main St, New York, NY');
    await page.waitForTimeout(1000);
    
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Estimate")');
    await generateBtn.click();
    
    // Wait for report page
    await page.waitForURL('**/report**');
    await page.waitForLoadState('networkidle');
    
    console.log('Final URL:', page.url());
    console.log('Console logs:', consoleLogs);
    
    // Check if URL has the right parameters
    const hasCompany = page.url().includes('company=Apple');
    const hasDemo = page.url().includes('demo=1');
    console.log('Has company=Apple:', hasCompany);
    console.log('Has demo=1:', hasDemo);
    
    console.log('✅ Deployment check completed');
  });
});
