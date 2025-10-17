import { test, expect } from '@playwright/test';

test.describe('Navigation Parameters Preservation', () => {
  
  test('Setup Guide - Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToHomeButton = page.locator('a:has-text("Back to Home")');
    const href = await backToHomeButton.getAttribute('href');
    
    // Should go to demo homepage with parameters
    expect(href).toContain('/?');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('Setup Guide - Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToSupportButton = page.locator('a:has-text("Back to Support")');
    const href = await backToSupportButton.getAttribute('href');
    
    // Should go to support page with parameters
    expect(href).toContain('/support');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('Branding Guide - Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/branding?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToHomeButton = page.locator('a:has-text("Back to Home")');
    const href = await backToHomeButton.getAttribute('href');
    
    expect(href).toContain('/?');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('API Docs - Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/api?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToHomeButton = page.locator('a:has-text("Back to Home")');
    const href = await backToHomeButton.getAttribute('href');
    
    expect(href).toContain('/?');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('CRM - Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/crm?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToSupportButton = page.locator('a:has-text("Back to Support")');
    const href = await backToSupportButton.getAttribute('href');
    
    expect(href).toContain('/support');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('Privacy - Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/privacy?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    const backToHomeButton = page.locator('a:has-text("Back to Home")');
    const href = await backToHomeButton.getAttribute('href');
    
    expect(href).toContain('/?');
    expect(href).toContain('demo=1');
    expect(href).toContain('company=testcompany');
  });

  test('Paid pages - Back to Home goes to /paid with parameters', async ({ page }) => {
    const paidUrl = '/privacy?company=testcompany&brandColor=%23FF0000';
    await page.goto(paidUrl);
    
    const backToHomeButton = page.locator('a:has-text("Back to Home")');
    const href = await backToHomeButton.getAttribute('href');
    
    expect(href).toContain('/paid?');
    expect(href).toContain('company=testcompany');
    expect(href).not.toContain('demo=1');
  });
});
