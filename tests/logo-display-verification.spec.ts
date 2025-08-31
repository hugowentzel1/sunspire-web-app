import { test, expect } from '@playwright/test';

test.describe('Company Logo Display Verification', () => {
  const baseUrl = 'http://127.0.0.1:3000';
  
  test('Meta logo displays correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=meta&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Meta logo is visible
    const logo = page.locator('img[alt="meta logo"]');
    await expect(logo).toBeVisible();
    
    // Check that company name shows as "meta"
    const companyName = page.locator('h1:has-text("meta")');
    await expect(companyName).toBeVisible();
    
    // Check that "SOLAR INTELLIGENCE REPORT" text is visible
    const reportText = page.locator('text=SOLAR INTELLIGENCE REPORT');
    await expect(reportText).toBeVisible();
    
    console.log('✅ Meta logo and branding verified successfully');
  });
  
  test('Apple logo displays correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=apple&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Apple logo is visible
    const logo = page.locator('img[alt="apple logo"]');
    await expect(logo).toBeVisible();
    
    // Check that company name shows as "apple"
    const companyName = page.locator('h1:has-text("apple")');
    await expect(companyName).toBeVisible();
    
    console.log('✅ Apple logo and branding verified successfully');
  });
  
  test('Tesla logo displays correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=tesla&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Tesla logo is visible
    const logo = page.locator('img[alt="tesla logo"]');
    await expect(logo).toBeVisible();
    
    // Check that company name shows as "tesla"
    const companyName = page.locator('h1:has-text("tesla")');
    await expect(companyName).toBeVisible();
    
    console.log('✅ Tesla logo and branding verified successfully');
  });
  
  test('Google logo displays correctly', async ({ page }) => {
    await page.goto(`${baseUrl}/report?company=google&demo=1`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Google logo is visible
    const logo = page.locator('img[alt="google logo"]');
    await expect(logo).toBeVisible();
    
    // Check that company name shows as "google"
    const companyName = page.locator('h1:has-text("google")');
    await expect(companyName).toBeVisible();
    
    console.log('✅ Google logo and branding verified successfully');
  });
  
  test('Default fallback when no company specified', async ({ page }) => {
    await page.goto(`${baseUrl}/report`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that default sun emoji is shown
    const defaultIcon = page.locator('text=☀️');
    await expect(defaultIcon).toBeVisible();
    
    // Check that "Your Company" is shown
    const companyName = page.locator('h1:has-text("Your Company")');
    await expect(companyName).toBeVisible();
    
    console.log('✅ Default fallback verified successfully');
  });
});
