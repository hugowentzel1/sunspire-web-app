import { test, expect } from '@playwright/test';

test.describe('Navigation Everywhere Testing', () => {
  test('should have navigation on main page', async ({ page }) => {
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenSolar&primary=%2316A34A');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    console.log('✅ Main page navigation is visible');
  });

  test('should have navigation on pricing page', async ({ page }) => {
    // Go to pricing page
    await page.goto('https://sunspire-web-app.vercel.app/pricing');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Check pricing page content
    await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible();
    await expect(page.locator('text=$399')).toBeVisible();
    await expect(page.locator('text=$99')).toBeVisible();
    
    console.log('✅ Pricing page navigation and content is visible');
  });

  test('should have navigation on partners page', async ({ page }) => {
    // Go to partners page
    await page.goto('https://sunspire-web-app.vercel.app/partners');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Check partners page content
    await expect(page.locator('text=Partner with Sunspire')).toBeVisible();
    await expect(page.locator('text=30% recurring commission')).toBeVisible();
    
    console.log('✅ Partners page navigation and content is visible');
  });

  test('should have navigation on support page', async ({ page }) => {
    // Go to support page
    await page.goto('https://sunspire-web-app.vercel.app/support');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Check support page content
    await expect(page.locator('text=Support Center')).toBeVisible();
    await expect(page.locator('text=Create Support Ticket')).toBeVisible();
    
    console.log('✅ Support page navigation and content is visible');
  });

  test('should have navigation on report page', async ({ page }) => {
    // Go to report page
    await page.goto('https://sunspire-web-app.vercel.app/report?demo=1&address=123%20Test%20St&lat=33.4484&lng=-112.0740');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Check report page content
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    console.log('✅ Report page navigation and content is visible');
  });

  test('should have navigation on demo result page', async ({ page }) => {
    // Go to demo result page
    await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=GreenSolar&primary=%2316A34A');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all navigation links are visible
    await expect(page.locator('text=Pricing')).toBeVisible();
    await expect(page.locator('text=Partners')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();
    
    // Check demo result page content
    await expect(page.locator('text=Solar Intelligence Report')).toBeVisible();
    
    console.log('✅ Demo result page navigation and content is visible');
  });

  test('should have all three feature cards on main page', async ({ page }) => {
    // Go to main page
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6');
    
    await page.waitForLoadState('networkidle');
    
    // Check that all three feature cards are visible
    await expect(page.locator('text=Advanced Analytics')).toBeVisible();
    await expect(page.locator('text=Premium Network')).toBeVisible();
    await expect(page.locator('text=Enterprise Security')).toBeVisible();
    
    console.log('✅ All three feature cards are visible');
  });

  test('navigation should work from any page', async ({ page }) => {
    // Start on pricing page
    await page.goto('https://sunspire-web-app.vercel.app/pricing');
    await page.waitForLoadState('networkidle');
    
    // Click Partners link
    await page.click('text=Partners');
    await expect(page).toHaveURL(/.*\/partners/);
    await expect(page.locator('text=Partner with Sunspire')).toBeVisible();
    
    // Click Support link
    await page.click('text=Support');
    await expect(page).toHaveURL(/.*\/support/);
    await expect(page.locator('text=Support Center')).toBeVisible();
    
    // Click Pricing link
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/.*\/pricing/);
    await expect(page.locator('text=Simple, Transparent Pricing')).toBeVisible();
    
    // Click Get Started button
    await page.click('text=Get Started');
    
    console.log('✅ Navigation works from any page');
  });
});
