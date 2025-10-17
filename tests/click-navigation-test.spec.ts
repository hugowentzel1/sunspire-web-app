import { test, expect } from '@playwright/test';

test.describe('Click Navigation Test - Parameter Preservation', () => {
  
  test('Setup Guide - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
    expect(url).toContain('brandColor=%23FF0000');
  });

  test('Setup Guide - Click Back to Support preserves parameters', async ({ page }) => {
    await page.goto('/docs/setup?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Support")');
    
    await page.waitForURL(/\/support/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Branding - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/docs/branding?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Branding - Click Back to Support preserves parameters', async ({ page }) => {
    await page.goto('/docs/branding?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Support")');
    
    await page.waitForURL(/\/support/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('API Docs - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/docs/api?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('API Docs - Click Back to Support preserves parameters', async ({ page }) => {
    await page.goto('/docs/api?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Support")');
    
    await page.waitForURL(/\/support/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('CRM - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/docs/crm?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('CRM - Click Back to Support preserves parameters', async ({ page }) => {
    await page.goto('/docs/crm?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Support")');
    
    await page.waitForURL(/\/support/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Support - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/support?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Privacy - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/privacy?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Terms - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/terms?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Security - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/security?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Do Not Sell - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/do-not-sell?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });

  test('Refund Policy - Click Back to Home preserves parameters', async ({ page }) => {
    await page.goto('/legal/refund?demo=1&company=testcompany&brandColor=%23FF0000');
    
    await page.click('a:has-text("Back to Home")');
    
    await page.waitForURL(/\/\?.*demo=1/);
    const url = page.url();
    expect(url).toContain('demo=1');
    expect(url).toContain('company=testcompany');
  });
});
