import { test, expect } from '@playwright/test';

test.describe('Basic Page Loading', () => {
  test('Main page should load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check if basic content is visible
    await expect(page.locator('text=Your Branded Solar Quote Tool')).toBeVisible();
  });
  
  test('Report page should load', async ({ page }) => {
    await page.goto('http://localhost:3000/report');
    await page.waitForLoadState('networkidle');
    
    // Check if basic content is visible
    await expect(page.locator('text=New Analysis')).toBeVisible();
  });
  
  test('Main page with company parameter should load', async ({ page }) => {
    await page.goto('http://localhost:3000?company=TestCompany&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check if basic content is visible
    await expect(page.locator('text=Your Branded Solar Quote Tool')).toBeVisible();
  });
  
  test('Report page with company parameter should load', async ({ page }) => {
    await page.goto('http://localhost:3000/report?company=TestCompany&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check if basic content is visible
    await expect(page.locator('text=New Analysis')).toBeVisible();
  });
});
