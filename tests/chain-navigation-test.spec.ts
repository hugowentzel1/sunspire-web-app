import { test, expect } from '@playwright/test';

test.describe('Chain Navigation - Parameter Preservation', () => {
  
  test('Home → Support → Setup → Home preserves all parameters', async ({ page }) => {
    // Start at branded demo homepage
    await page.goto('/?demo=1&company=tesla&brandColor=%23CC0000');
    
    // Verify initial branding
    const demoBanner1 = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner1).toBeVisible();
    await expect(demoBanner1).toContainText('tesla');
    
    // Click to Support (use Quick Links section to avoid email)
    await page.locator('footer').getByRole('link', { name: 'Support', exact: true }).click();
    await expect(page).toHaveURL(/\/support/);
    
    // Verify branding on Support
    const demoBanner2 = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner2).toBeVisible();
    await expect(demoBanner2).toContainText('tesla');
    
    // Click to Setup Guide
    await page.click('a:has-text("Setup Guide")');
    await expect(page).toHaveURL(/\/docs\/setup\?demo=1&company=tesla&brandColor=%23CC0000/);
    
    // Verify branding on Setup
    const demoBanner3 = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner3).toBeVisible();
    await expect(demoBanner3).toContainText('tesla');
    
    // Click Back to Home
    await page.click('a:has-text("Back to Home")');
    await expect(page).toHaveURL(/\/\?demo=1&company=tesla&brandColor=%23CC0000/);
    
    // Verify branding STILL on Home (THIS IS THE CRITICAL CHECK)
    const demoBanner4 = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner4).toBeVisible();
    await expect(demoBanner4).toContainText('tesla');
  });

  test('Home → Support → Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/?demo=1&company=tesla&brandColor=%23CC0000');
    
    // Go to Support via footer link
    await page.locator('footer').getByRole('link', { name: 'Support', exact: true }).click();
    await expect(page).toHaveURL(/\/support/);
    
    // Back to Home
    await page.click('a:has-text("Back to Home")');
    await expect(page).toHaveURL(/\/\?demo=1&company=tesla&brandColor=%23CC0000/);
    
    // Verify branding
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
    await expect(demoBanner).toContainText('tesla');
  });

  test('Support → CRM → Back to Support preserves parameters', async ({ page }) => {
    await page.goto('/support?demo=1&company=tesla&brandColor=%23CC0000');
    
    // Click to CRM
    await page.click('a:has-text("CRM Integration Tutorial")');
    await expect(page).toHaveURL(/\/docs\/crm\?demo=1&company=tesla&brandColor=%23CC0000/);
    
    // Back to Support
    await page.click('a:has-text("Back to Support")');
    await expect(page).toHaveURL(/\/support\?demo=1&company=tesla&brandColor=%23CC0000/);
    
    // Verify branding
    const demoBanner = page.locator('[data-testid="demo-banner"]').first();
    await expect(demoBanner).toBeVisible();
  });

  test('Every link in footer from home preserves parameters', async ({ page }) => {
    await page.goto('/?demo=1&company=tesla&brandColor=%23CC0000');
    
    // Test Support link (use more specific selector to avoid email link)
    const supportLink = page.locator('footer').locator('a:has-text("Support")').filter({hasNotText: '@'}).first();
    const supportHref = await supportLink.getAttribute('href');
    expect(supportHref).toContain('demo=1');
    expect(supportHref).toContain('company=tesla');
    
    // Test Privacy link
    const privacyLink = page.locator('footer a:has-text("Privacy Policy")');
    const privacyHref = await privacyLink.getAttribute('href');
    expect(privacyHref).toContain('demo=1');
    expect(privacyHref).toContain('company=tesla');
  });
});
