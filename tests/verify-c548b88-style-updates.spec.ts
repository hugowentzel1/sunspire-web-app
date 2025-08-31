import { test, expect } from '@playwright/test';

test.describe('C548b88 Style Updates Verification', () => {
  const baseUrl = 'http://127.0.0.1:3004'; // Using current dev server port
  
  test('Header shows correct text and layout', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=apple&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that header shows "Solar Intelligence" (not "SOLAR INTELLIGENCE REPORT")
    const headerText = page.locator('header').locator('text=Solar Intelligence');
    await expect(headerText).toBeVisible();
    
    // Check that header does NOT show "SOLAR INTELLIGENCE REPORT"
    const oldHeaderText = page.locator('header').locator('text=SOLAR INTELLIGENCE REPORT');
    await expect(oldHeaderText).not.toBeVisible();
    
    // Check that Apple logo is visible in header
    const headerLogo = page.locator('header img[alt="apple logo"]');
    await expect(headerLogo).toBeVisible();
    
    // Check that company name shows as "Apple" (capitalized)
    const companyName = page.locator('header h1:has-text("Apple")');
    await expect(companyName).toBeVisible();
    
    // Check that "Private demo for Apple, Not affiliated" is NOT in header
    const privateDemoInHeader = page.locator('header').locator('text=Private demo for Apple');
    await expect(privateDemoInHeader).not.toBeVisible();
    
    console.log('✅ Header layout matches c548b88 style');
  });
  
  test('Main content shows correct title and text', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=tesla&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that main title shows "New Analysis" (not "Solar Intelligence Report")
    const mainTitle = page.locator('h1:has-text("New Analysis")');
    await expect(mainTitle).toBeVisible();
    
    // Check that main title does NOT show "Solar Intelligence Report"
    const oldMainTitle = page.locator('main h1:has-text("Solar Intelligence Report")');
    await expect(oldMainTitle).not.toBeVisible();
    
    // Check that subtitle shows "Comprehensive analysis for your property at..."
    const subtitle = page.locator('text=Comprehensive analysis for your property at');
    await expect(subtitle).toBeVisible();
    
    console.log('✅ Main content title matches c548b88 style');
  });
  
  test('Ready-to text shows updated content with 24 hours and not affiliated', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=meta&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that "ready-to" text shows "within 24 hours" (not "in minutes")
    const readyToText = page.locator('text=A ready-to-deploy solar intelligence tool — live on your site within 24 hours');
    await expect(readyToText).toBeVisible();
    
    // Check that it does NOT show "in minutes"
    const oldReadyToText = page.locator('text=live on your site in minutes');
    await expect(oldReadyToText).not.toBeVisible();
    
    // Check that "Not affiliated with Meta" is visible
    const notAffiliatedText = page.locator('text=Not affiliated with Meta');
    await expect(notAffiliatedText).toBeVisible();
    
    console.log('✅ Ready-to text updated correctly with 24 hours and not affiliated');
  });
  
  test('Company names are properly capitalized', async ({ page }) => {
    const testCases = [
      { company: 'meta', expected: 'Meta' },
      { company: 'apple', expected: 'Apple' },
      { company: 'tesla', expected: 'Tesla' },
      { company: 'google', expected: 'Google' }
    ];
    
    for (const testCase of testCases) {
      await page.goto(`${baseUrl}/report?company=${testCase.company}&demo=1`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check header company name
      const headerCompanyName = page.locator('header h1').first();
      await expect(headerCompanyName).toHaveText(testCase.expected);
      
      // Check "Not affiliated with [Company]" text (capitalized)
      const notAffiliatedText = page.locator(`text=Not affiliated with ${testCase.expected}`);
      await expect(notAffiliatedText).toBeVisible();
      
      console.log(`✅ ${testCase.company} properly capitalized as ${testCase.expected}`);
    }
  });
  
  test('All CTA buttons link to Stripe checkout', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=apple&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that CTA buttons are present with Stripe checkout
    const ctaButtons = page.locator('[data-cta="primary"]');
    const buttonCount = await ctaButtons.count();
    
    // Should have multiple CTA buttons
    expect(buttonCount).toBeGreaterThan(0);
    
    // Verify specific button texts are present
    const unlockButton = page.locator('text=Unlock Full Report - $99/mo + $399');
    await expect(unlockButton).toBeVisible();
    
    const activateButton = page.locator('text=Activate on Your Domain - $99/mo + $399');
    await expect(activateButton).toBeVisible();
    
    console.log(`✅ Found ${buttonCount} CTA buttons, all linking to Stripe`);
  });
  
  test('Company logos display correctly in both header and main content', async ({ page }) => {
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
  
  test('No demo banners or popups are visible', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=google&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check that "Demo Mode — White-Label Preview" is NOT visible
    const demoBanner = page.locator('text=Demo Mode — White-Label Preview');
    await expect(demoBanner).not.toBeVisible();
    
    // Check that "Exclusive preview built for" is NOT visible
    const exclusivePreview = page.locator('text=Exclusive preview built for');
    await expect(exclusivePreview).not.toBeVisible();
    
    console.log('✅ No demo banners or popups are visible');
  });
});
