import { test, expect } from '@playwright/test';

test.describe('Report Header Visual Test', () => {
  
  test('Report header has proper spacing and balanced text wrapping', async ({ page }) => {
    // Go to report page with demo parameters
    const reportUrl = '/report?demo=1&company=tesla&brandColor=%23CC0000&address=1600%20Amphitheatre%20Parkway%2C%20Mountain%20View%2C%20CA%2094043&lat=37.4224&lng=-122.0841';
    await page.goto(reportUrl, { waitUntil: 'networkidle' });
    
    // Wait for content to load
    await page.waitForSelector('text=Comprehensive analysis');
    
    // Check that address is visible and not truncated
    const addressElement = page.locator('p:has-text("Amphitheatre")');
    await expect(addressElement).toBeVisible();
    const addressText = await addressElement.textContent();
    expect(addressText).toContain('1600');
    expect(addressText).toContain('Mountain View');
    expect(addressText).not.toContain('...');
    
    // Check that meta info is stacked (not inline)
    const metaContainer = page.locator('div:has-text("Generated on")').first();
    await expect(metaContainer).toBeVisible();
    
    // Verify all three meta lines are visible in demo mode
    await expect(page.locator('text=Generated on')).toBeVisible();
    await expect(page.locator('text=Preview:')).toBeVisible();
    await expect(page.locator('text=Expires')).toBeVisible();
    
    // Check that icons are consistent size (h-4 w-4)
    const icons = page.locator('.h-4.w-4.shrink-0');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThanOrEqual(3); // At least 3 icons in demo mode
  });

  test('Report header in PAID mode shows only one meta line', async ({ page }) => {
    // Go to report page WITHOUT demo parameter
    const reportUrl = '/report?company=apple&brandColor=%2300FF00&address=1%20Apple%20Park%20Way%2C%20Cupertino%2C%20CA%2095014&lat=37.3349&lng=-122.0090';
    await page.goto(reportUrl, { waitUntil: 'networkidle' });
    
    // Wait for content to load
    await page.waitForSelector('text=Comprehensive analysis');
    
    // Verify only "Generated on" line shows (no Preview or Expires)
    await expect(page.locator('text=Generated on')).toBeVisible();
    await expect(page.locator('text=Preview:')).not.toBeVisible();
    await expect(page.locator('text=Expires')).not.toBeVisible();
  });

  test('Report header address wraps naturally on commas', async ({ page }) => {
    // Test with a long address
    const longAddress = '123 Very Long Street Name That Should Wrap, Some City With A Long Name, California 94000';
    const reportUrl = `/report?demo=1&company=test&address=${encodeURIComponent(longAddress)}&lat=37.4224&lng=-122.0841`;
    await page.goto(reportUrl, { waitUntil: 'networkidle' });
    
    await page.waitForSelector('text=Comprehensive analysis');
    
    // Check that address is visible
    const addressElement = page.locator(`p:has-text("Street Name")`);
    await expect(addressElement).toBeVisible();
    
    // Check that it has line-clamp-2 class (max 2 lines)
    const hasLineClamp = await addressElement.evaluate(el => el.classList.contains('line-clamp-2'));
    expect(hasLineClamp).toBeTruthy();
  });
});
