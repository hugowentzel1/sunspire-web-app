import { test, expect } from '@playwright/test';

test.describe('Functional Navigation Testing', () => {
  test('should have working Enterprise link', async ({ page }) => {
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A');
    
    await page.waitForLoadState('networkidle');
    
    // Click Enterprise link
    await page.click('text=Enterprise');
    
    // Should be on enterprise page
    await expect(page).toHaveURL(/.*\/enterprise/);
    
    // Check enterprise page content
    await expect(page.locator('text=Enterprise Solar Intelligence')).toBeVisible();
    await expect(page.locator('text=Get Enterprise Quote')).toBeVisible();
    
    console.log('✅ Enterprise page working correctly');
  });

  test('should have working Partners link', async ({ page }) => {
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6');
    
    await page.waitForLoadState('networkidle');
    
    // Click Partners link
    await page.click('text=Partners');
    
    // Should be on partners page
    await expect(page).toHaveURL(/.*\/partners/);
    
    // Check partners page content
    await expect(page.locator('text=Partner with Sunspire')).toBeVisible();
    await expect(page.locator('text=30% recurring commission')).toBeVisible();
    
    console.log('✅ Partners page working correctly');
  });

  test('should have working Support link', async ({ page }) => {
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=PurplePower&primary=%238B5CF6');
    
    await page.waitForLoadState('networkidle');
    
    // Click Support link
    await page.click('text=Support');
    
    // Should be on support page
    await expect(page).toHaveURL(/.*\/support/);
    
    // Check support page content
    await expect(page.locator('text=Support Center')).toBeVisible();
    await expect(page.locator('text=Create Support Ticket')).toBeVisible();
    
    console.log('✅ Support page working correctly');
  });

  test('should have functional forms on each page', async ({ page }) => {
    // Test Enterprise form
    await page.goto('https://sunspire-web-app.vercel.app/enterprise');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="company"]', 'Test Solar Company');
    await page.fill('input[name="name"]', 'John Test');
    await page.fill('input[name="email"]', 'john@testsolar.com');
    
    // Form should be fillable
    const companyInput = await page.inputValue('input[name="company"]');
    expect(companyInput).toBe('Test Solar Company');
    
    console.log('✅ Enterprise form is functional');
    
    // Test Partners form
    await page.goto('https://sunspire-web-app.vercel.app/partners');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="name"]', 'Jane Partner');
    const nameInput = await page.inputValue('input[name="name"]');
    expect(nameInput).toBe('Jane Partner');
    
    console.log('✅ Partners form is functional');
    
    // Test Support form
    await page.goto('https://sunspire-web-app.vercel.app/support');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="subject"]', 'Test Support Request');
    const subjectInput = await page.inputValue('input[name="subject"]');
    expect(subjectInput).toBe('Test Support Request');
    
    console.log('✅ Support form is functional');
  });
});
