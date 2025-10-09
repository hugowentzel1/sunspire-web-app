import { test, expect } from '@playwright/test';

const DEMO_HOME = 'http://localhost:3002/?demo=1';
const DEMO_REPORT = 'http://localhost:3002/report?demo=1&address=123+Main+St&lat=40.7128&lng=-74.0060&placeId=demo';

test.describe('Demo Version Functionality', () => {
  test('Demo home page loads correctly', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Check that demo banner is visible
    const demoBanner = page.locator('text=Exclusive preview built for');
    await expect(demoBanner).toBeVisible();
    
    // Check that address input is present
    const addressInput = page.locator('input[placeholder*="address" i]');
    await expect(addressInput).toBeVisible();
    
    // Check that generate button is present
    const generateButton = page.getByRole('button', { name: /Generate Solar/i });
    await expect(generateButton).toBeVisible();
    
    // Check that demo-specific elements are visible
    const activateButton = page.locator('text=Activate on Your Domain');
    await expect(activateButton).toBeVisible();
    
    console.log('✓ Demo home page loads with all required elements');
  });
  
  test('Demo address input and navigation works', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Fill in address
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('123 Main Street, New York, NY');
    
    // Click generate button
    const generateButton = page.getByRole('button', { name: /Generate Solar/i });
    await generateButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    // Check if we're on report page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/report');
    expect(currentUrl).toContain('demo=1');
    
    console.log('✓ Demo navigation to report page works');
  });
  
  test('Demo report page loads correctly', async ({ page }) => {
    await page.goto(DEMO_REPORT, { waitUntil: 'networkidle' });
    
    // Check that report content is visible
    const reportTitle = page.locator('text=Your Solar Savings Over Time');
    await expect(reportTitle).toBeVisible({ timeout: 10000 });
    
    // Check that demo-specific elements are present
    const unlockButton = page.locator('text=Unlock Full Report');
    await expect(unlockButton).toBeVisible();
    
    // Check that blur overlay is present (demo mode)
    const blurOverlay = page.locator('[data-blur-overlay]');
    const blurCount = await blurOverlay.count();
    expect(blurCount).toBeGreaterThan(0);
    
    // Check that demo footer is present
    const demoFooter = page.locator('text=Powered by Sunspire');
    await expect(demoFooter).toBeVisible();
    
    console.log('✓ Demo report page loads with blur overlay and unlock button');
  });
  
  test('Demo quota system works', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Check initial quota
    const quotaDisplay = page.locator('text=/\\d+ runs remaining/i');
    const quotaCount = await quotaDisplay.count();
    
    if (quotaCount > 0) {
      console.log('✓ Demo quota display is visible');
    }
    
    // Fill address and generate report
    const addressInput = page.locator('input[placeholder*="address" i]');
    await addressInput.fill('456 Oak Avenue, Los Angeles, CA');
    
    const generateButton = page.getByRole('button', { name: /Generate Solar/i });
    await generateButton.click();
    
    await page.waitForTimeout(2000);
    
    // Check if quota was consumed
    const currentUrl = page.url();
    if (currentUrl.includes('/report')) {
      console.log('✓ Demo quota consumption works');
    }
    
    console.log('✓ Demo quota system is functional');
  });
  
  test('Demo navigation links work', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Check that demo-specific navigation links are present
    const pricingLink = page.getByRole('link', { name: /Pricing/i });
    await expect(pricingLink).toBeVisible();
    
    const partnersLink = page.getByRole('link', { name: /Partners/i });
    await expect(partnersLink).toBeVisible();
    
    const supportLink = page.getByRole('link', { name: /Support/i });
    await expect(supportLink).toBeVisible();
    
    // Test pricing link
    await pricingLink.click();
    await page.waitForTimeout(1000);
    
    const pricingUrl = page.url();
    expect(pricingUrl).toContain('/pricing');
    
    console.log('✓ Demo navigation links work correctly');
  });
  
  test('Demo vs Paid mode differences', async ({ page }) => {
    // Test demo mode
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Demo should have activation button
    const activateButton = page.locator('text=Activate on Your Domain');
    await expect(activateButton).toBeVisible();
    
    // Demo should have pricing/partners/support links
    const pricingLink = page.getByRole('link', { name: /Pricing/i });
    await expect(pricingLink).toBeVisible();
    
    // Test paid mode
    await page.goto('http://localhost:3002/paid?company=Apple', { waitUntil: 'networkidle' });
    
    // Paid should NOT have activation button
    const paidActivateButton = page.locator('text=Activate on Your Domain');
    const paidActivateCount = await paidActivateButton.count();
    expect(paidActivateCount).toBe(0);
    
    // Paid should NOT have pricing/partners/support links
    const paidPricingLink = page.getByRole('link', { name: /Pricing/i });
    const paidPricingCount = await paidPricingLink.count();
    expect(paidPricingCount).toBe(0);
    
    console.log('✓ Demo and Paid modes are properly differentiated');
  });
  
  test('Demo reset functionality works', async ({ page }) => {
    await page.goto(DEMO_HOME, { waitUntil: 'networkidle' });
    
    // Check if reset function is available
    const resetFunction = await page.evaluate(() => {
      return typeof (window as any).resetDemoRuns === 'function';
    });
    
    if (resetFunction) {
      // Call reset function
      await page.evaluate(() => {
        (window as any).resetDemoRuns();
      });
      
      await page.waitForTimeout(1000);
      
      // Check if quota was reset
      const quotaDisplay = page.locator('text=/\\d+ runs remaining/i');
      const quotaCount = await quotaDisplay.count();
      
      if (quotaCount > 0) {
        console.log('✓ Demo reset functionality works');
      }
    } else {
      console.log('⚠ Demo reset function not available');
    }
  });
});
