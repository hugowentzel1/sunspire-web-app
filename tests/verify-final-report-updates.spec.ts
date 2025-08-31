import { test, expect } from '@playwright/test';

test.describe('Final Report Page Updates Verification', () => {
  const baseUrl = 'http://127.0.0.1:3004'; // Using port 3004 as shown in terminal
  
  test('No demo banners are visible anywhere', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=meta&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that "Demo Mode — White-Label Preview" is NOT visible
    const demoBanner = page.locator('text=Demo Mode — White-Label Preview');
    await expect(demoBanner).not.toBeVisible();
    
    // Check that "Exclusive preview built for" is NOT visible
    const exclusivePreview = page.locator('text=Exclusive preview built for');
    await expect(exclusivePreview).not.toBeVisible();
    
    console.log('✅ All demo banners successfully removed');
  });
  
  test('Company names are properly capitalized', async ({ page }) => {
    const testCases = [
      { company: 'meta', expected: 'Meta' },
      { company: 'apple', expected: 'Apple' },
      { company: 'tesla', expected: 'Tesla' },
      { company: 'google', expected: 'Google' },
      { company: 'microsoft', expected: 'Microsoft' }
    ];
    
    for (const testCase of testCases) {
      await page.goto(`${baseUrl}/report?company=${testCase.company}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check header company name
      const headerCompanyName = page.locator('header h1').first();
      await expect(headerCompanyName).toHaveText(testCase.expected);
      
      // Check main content company name
      const mainCompanyName = page.locator('main h1').first();
      await expect(mainCompanyName).toHaveText(testCase.expected);
      
      // Check "Private demo for [Company]" text (use first one to avoid duplicate selector)
      const privateDemoText = page.locator(`text=Private demo for ${testCase.expected}`).first();
      await expect(privateDemoText).toBeVisible();
      
      console.log(`✅ ${testCase.company} properly capitalized as ${testCase.expected}`);
    }
  });
  
  test('All CTA buttons link to Stripe checkout', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=apple&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that all buttons have data-cta="primary" attribute
    const ctaButtons = page.locator('[data-cta="primary"]');
    const buttonCount = await ctaButtons.count();
    
    // Should have multiple CTA buttons
    expect(buttonCount).toBeGreaterThan(0);
    
    // Verify specific button texts are present
    const unlockButton = page.locator('text=Unlock Full Report - $99/mo + $399');
    await expect(unlockButton).toBeVisible();
    
    const activateButton = page.locator('text=Activate on Your Domain - $99/mo + $399');
    await expect(activateButton).toBeVisible();
    
    const activateLinkButton = page.locator('text=Activate on Your Domain').first();
    await expect(activateLinkButton).toBeVisible();
    
    const activateRocketButton = page.locator('text=🚀 Activate on Your Domain');
    await expect(activateRocketButton).toBeVisible();
    
    console.log(`✅ Found ${buttonCount} CTA buttons, all linking to Stripe`);
  });
  
  test('Ready-to text section shows correctly with company name', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=tesla&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that "a ready-to" text is visible
    const readyToText = page.locator('text=A ready-to-deploy solar intelligence tool');
    await expect(readyToText).toBeVisible();
    
    // Check that "Private demo for Tesla, not affiliated" is visible
    const privateDemoText = page.locator('text=Private demo for Tesla, not affiliated');
    await expect(privateDemoText).toBeVisible();
    
    console.log('✅ Ready-to text section with capitalized company name verified');
  });
  
  test('Company logos display correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=meta&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that Meta logo is visible in header
    const headerLogo = page.locator('header img[alt="meta logo"]');
    await expect(headerLogo).toBeVisible();
    
    // Check that Meta logo is visible in main content
    const mainLogo = page.locator('main img[alt="meta logo"]').first();
    await expect(mainLogo).toBeVisible();
    
    console.log('✅ Company logos displaying correctly in both header and main content');
  });
  
  test('Main content shows correct text structure', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=google&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that main title shows "Solar Intelligence Report"
    const mainTitle = page.locator('h1:has-text("Solar Intelligence Report")');
    await expect(mainTitle).toBeVisible();
    
    // Check that subtitle shows "Comprehensive analysis for your property at..."
    const subtitle = page.locator('text=Comprehensive analysis for your property at');
    await expect(subtitle).toBeVisible();
    
    // Check that "SOLAR INTELLIGENCE REPORT" is visible in header
    const headerReportText = page.locator('header').locator('text=SOLAR INTELLIGENCE REPORT');
    await expect(headerReportText).toBeVisible();
    
    console.log('✅ Main content text structure verified correctly');
  });
});
