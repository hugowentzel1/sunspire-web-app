import { test, expect } from '@playwright/test';

test.describe('No Double Headers Check', () => {
  test('Security page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/security?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
    
    // Check that the page has the back button
    await expect(page.locator('text=Back to Home')).toBeVisible();
    
    // Check that the page has footer (use more specific locator)
    await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
  });

  test('CRM docs page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/docs/crm?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
    
    // Check that the page has footer (use more specific locator)
    await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
  });

  test('Refund policy page should have back button and footer', async ({ page }) => {
    await page.goto('http://localhost:3001/legal/refund?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
    
    // Check that the page has the back button
    await expect(page.locator('text=Back to Home')).toBeVisible();
    
    // Check that the page has footer (use more specific locator)
    await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
  });

  test('DPA page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/dpa?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
    
    // Check that the page has the back button
    await expect(page.locator('text=Back to Home')).toBeVisible();
    
    // Check that the page has footer (use more specific locator)
    await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
  });

  test('Terms page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/terms?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
    
    // Check that the page has footer (use more specific locator)
    await expect(page.locator('footer').locator('text=Powered by Sunspire').first()).toBeVisible();
  });

  test('Home page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/?company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
  });

  test('Paid page should not have double headers', async ({ page }) => {
    await page.goto('http://localhost:3001/paid?company=Tesla&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftesla.com');
    await page.waitForLoadState('networkidle');
    
    // Check that there's only one header with logo (in navigation)
    const navLogoElements = await page.locator('header img[alt*="logo"], header img[alt*="Tesla"]').count();
    expect(navLogoElements).toBeLessThanOrEqual(1);
    
    // Check that there's only one navigation header
    const headerElements = await page.locator('header').count();
    expect(headerElements).toBeLessThanOrEqual(1);
  });
});
