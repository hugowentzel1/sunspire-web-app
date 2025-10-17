import { test, expect } from '@playwright/test';

test.describe('Click Navigation - Full Parameter Preservation', () => {
  
  test('Setup Guide - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
    
    // Verify demo banner is visible
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
    await expect(demoBanner).toContainText('testcompany');
  });

  test('Setup Guide - Click Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Support
    await page.click('a:has-text("Back to Support")');
    
    // Verify we're on support page with all parameters
    await expect(page).toHaveURL(/\/support\?demo=1&company=testcompany&brandColor=%23FF0000/);
    
    // Verify demo banner is visible on support page
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
  });

  test('Branding Guide - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/branding?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
    
    // Verify demo banner is visible
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
  });

  test('Branding Guide - Click Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/branding?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Support
    await page.click('a:has-text("Back to Support")');
    
    // Verify we're on support page with all parameters
    await expect(page).toHaveURL(/\/support\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('API Docs - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/api?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('API Docs - Click Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/api?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Support
    await page.click('a:has-text("Back to Support")');
    
    // Verify we're on support page with all parameters
    await expect(page).toHaveURL(/\/support\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('CRM - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/crm?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('CRM - Click Back to Support preserves demo parameters', async ({ page }) => {
    const demoUrl = '/docs/crm?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Support
    await page.click('a:has-text("Back to Support")');
    
    // Verify we're on support page with all parameters
    await expect(page).toHaveURL(/\/support\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Support - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/support?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Privacy - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/privacy?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Terms - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/terms?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Security - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/security?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Do Not Sell - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/do-not-sell?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  test('Refund Policy - Click Back to Home preserves demo parameters', async ({ page }) => {
    const demoUrl = '/legal/refund?demo=1&company=testcompany&brandColor=%23FF0000';
    await page.goto(demoUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on demo homepage with all parameters
    await expect(page).toHaveURL(/\/\?demo=1&company=testcompany&brandColor=%23FF0000/);
  });

  // PAID VERSION TESTS
  test('Setup Guide PAID - Click Back to Home goes to /paid with parameters', async ({ page }) => {
    const paidUrl = '/docs/setup?company=testcompany&brandColor=%23FF0000';
    await page.goto(paidUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on PAID homepage with all parameters
    await expect(page).toHaveURL(/\/paid\?company=testcompany&brandColor=%23FF0000/);
    
    // Verify NO demo banner
    const demoBanner = page.locator('[data-testid="demo-banner"]');
    await expect(demoBanner).not.toBeVisible();
  });

  test('Privacy PAID - Click Back to Home goes to /paid with parameters', async ({ page }) => {
    const paidUrl = '/privacy?company=testcompany&brandColor=%23FF0000';
    await page.goto(paidUrl);
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    
    // Verify we're on PAID homepage with all parameters
    await expect(page).toHaveURL(/\/paid\?company=testcompany&brandColor=%23FF0000/);
  });
});
