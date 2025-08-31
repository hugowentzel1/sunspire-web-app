import { test, expect } from '@playwright/test';

test.describe('Report Page Updates Verification', () => {
  const baseUrl = 'http://127.0.0.1:3003'; // Using port 3003 as shown in terminal
  
  test('Company logos display correctly in header', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=meta&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that Meta logo is visible in the header
    const headerLogo = page.locator('header img[alt="meta logo"]');
    await expect(headerLogo).toBeVisible();
    
    // Check that company name shows as "meta"
    const companyName = page.locator('header h1:has-text("meta")');
    await expect(companyName).toBeVisible();
    
    // Check that "SOLAR INTELLIGENCE REPORT" text is visible in header
    const headerReportText = page.locator('header').locator('text=SOLAR INTELLIGENCE REPORT');
    await expect(headerReportText).toBeVisible();
    
    console.log('✅ Meta logo and branding in header verified successfully');
  });
  
  test('Main content shows correct text and logo', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=apple&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that main title shows "Solar Intelligence Report"
    const mainTitle = page.locator('h1:has-text("Solar Intelligence Report")');
    await expect(mainTitle).toBeVisible();
    
    // Check that subtitle shows "Comprehensive analysis for your property at..."
    const subtitle = page.locator('text=Comprehensive analysis for your property at');
    await expect(subtitle).toBeVisible();
    
    // Check that Apple logo is visible in main content (use first one to avoid duplicate selector)
    const mainLogo = page.locator('main img[alt="apple logo"]').first();
    await expect(mainLogo).toBeVisible();
    
    console.log('✅ Main content text and logo verified successfully');
  });
  
  test('Ready-to text section displays correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=tesla&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that "a ready-to" text is visible
    const readyToText = page.locator('text=A ready-to-deploy solar intelligence tool');
    await expect(readyToText).toBeVisible();
    
    // Check that "Private demo for tesla, not affiliated" is visible
    const privateDemoText = page.locator('text=Private demo for tesla, not affiliated');
    await expect(privateDemoText).toBeVisible();
    
    console.log('✅ Ready-to text section verified successfully');
  });
  
  test('No demo popup components are visible', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=google&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that InstallSheet is not visible (should be removed)
    const installSheet = page.locator('[data-testid="install-sheet"]');
    await expect(installSheet).not.toBeVisible();
    
    // Check that StickyBuyBar is not visible (should be removed)
    const stickyBuyBar = page.locator('[data-testid="sticky-buy-bar"]');
    await expect(stickyBuyBar).not.toBeVisible();
    
    console.log('✅ Demo popup components successfully removed');
  });
  
  test('Company-specific branding works dynamically', async ({ page }) => {
    // Test with different companies
    const companies = ['meta', 'apple', 'tesla', 'google'];
    
    for (const company of companies) {
      await page.goto(`${baseUrl}/report?company=${company}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check that company name shows correctly (use first one to avoid duplicate selector)
      const companyName = page.locator(`h1:has-text("${company}")`).first();
      await expect(companyName).toBeVisible();
      
      // Check that "Private demo for [company], not affiliated" shows correctly
      const privateDemoText = page.locator(`text=Private demo for ${company}, not affiliated`);
      await expect(privateDemoText).toBeVisible();
      
      console.log(`✅ ${company} branding verified successfully`);
    }
  });
  
  test('Default fallback when no company specified', async ({ page }) => {
    await page.goto(`${baseUrl}/report`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that default sun emoji is shown (use first one to avoid duplicate selector)
    const defaultIcon = page.locator('text=☀️').first();
    await expect(defaultIcon).toBeVisible();
    
    // Check that "Your Company" is shown
    const companyName = page.locator('h1:has-text("Your Company")');
    await expect(companyName).toBeVisible();
    
    // Check that "Private demo for..." text is NOT shown
    const privateDemoText = page.locator('text=Private demo for');
    await expect(privateDemoText).not.toBeVisible();
    
    console.log('✅ Default fallback verified successfully');
  });
});
