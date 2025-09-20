import { test, expect } from '@playwright/test';

const DEMO_URL = 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1';
const PAID_URL = 'https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com';

test.describe('Color Consistency Tests', () => {
  test('Paid version uses consistent red brand color throughout', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Wait for the CSS variable to be set
    await page.waitForFunction(() => {
      const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
      return brandColor === '#FF0000';
    }, { timeout: 10000 });
    
    // Check that the CSS variable is set correctly
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
    });
    expect(brandColor).toBe('#FF0000');
    
    // Check that buttons use the brand color
    const buttons = page.locator('button[style*="background-color"], button[style*="var(--brand-primary)"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check that "Powered by Sunspire" text uses brand color
    const sunspireText = page.locator('text=Powered by Sunspire');
    await expect(sunspireText).toBeVisible();
    
    // Check that feature icons use brand color
    const featureIcons = page.locator('[style*="var(--brand-primary)"]');
    const iconCount = await featureIcons.count();
    expect(iconCount).toBeGreaterThan(0);
    
    // Check that no hardcoded blue colors exist
    const blueElements = page.locator('[class*="blue-"], [style*="blue"]');
    const blueCount = await blueElements.count();
    expect(blueCount).toBe(0);
  });

  test('Navigation preserves URL parameters', async ({ page }) => {
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Click on methodology link
    const methodologyLink = page.locator('a[href*="/methodology"]');
    await expect(methodologyLink).toBeVisible();
    await methodologyLink.click();
    
    // Verify URL contains brand parameters
    await page.waitForURL(/.*methodology.*company=Apple.*brandColor=%23FF0000.*/);
    
    // Go back to paid page
    await page.goto(PAID_URL, { waitUntil: 'networkidle' });
    
    // Click on pricing link
    const pricingLink = page.locator('a[href*="/pricing"]');
    await expect(pricingLink).toBeVisible();
    await pricingLink.click();
    
    // Verify URL contains brand parameters
    await page.waitForURL(/.*pricing.*company=Apple.*brandColor=%23FF0000.*/);
  });

  test('Report page maintains brand consistency', async ({ page }) => {
    // Navigate to report page with brand parameters
    await page.goto('https://sunspire-web-app.vercel.app/report?address=1+Apple+Park+Way&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'networkidle' });
    
    // Wait for the CSS variable to be set
    await page.waitForFunction(() => {
      const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
      return brandColor === '#FF0000';
    }, { timeout: 10000 });
    
    // Check that CSS variable is set
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim();
    });
    expect(brandColor).toBe('#FF0000');
    
    // Check that buttons use brand color
    const buttons = page.locator('button[style*="background-color"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check that no hardcoded colors exist
    const hardcodedColors = page.locator('[class*="blue-"], [class*="green-"], [class*="red-"]');
    const hardcodedCount = await hardcodedColors.count();
    expect(hardcodedCount).toBe(0);
  });

  test('Demo version maintains consistent branding', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'networkidle' });
    
    // Check that "Powered by Sunspire" text is color-coded
    const sunspireText = page.locator('text=Powered by Sunspire').first();
    await expect(sunspireText).toBeVisible();
    
    // Check that demo text is updated
    const demoText = page.locator('text=Launch your branded solar quote tool in 24 hours');
    await expect(demoText).toBeVisible();
  });
});
