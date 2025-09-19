import { test, expect } from '@playwright/test';

test.describe('Live Site Tests', () => {
  test('demo page basics', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', { waitUntil: 'domcontentloaded' });
    
    // Check hero renders
    await expect(page.getByRole('heading', { name: 'Your Branded Solar Quote Tool' })).toBeVisible();
    
    // Check address input present
    const addressInput = page.getByPlaceholder('Enter your property address');
    await expect(addressInput).toBeVisible();
    
    // Check CTAs visible
    await expect(page.getByRole('button', { name: /unlock full report/i })).toBeVisible();
    
    // Type address and test autocomplete
    await addressInput.click();
    await addressInput.fill('1 Apple Park Way, Cupertino, CA');
    await page.waitForTimeout(500); // debounce + suggestions
    
    // Check for suggestions
    await expect(page.locator('[role="option"]').first()).toBeVisible();
    
    // Select first suggestion
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Wait for chart to load
    await expect(page.getByText('Year-1 Savings')).toBeVisible();
    
    // Check money KPIs are masked in demo
    await expect(page.getByText('— — —')).toBeVisible();
    
    // Check Stripe CTA exists
    await expect(page.getByRole('button', { name: /unlock full report/i })).toBeVisible();
    
    // Check brand color coordination
    await expect(page.locator('[style*="color:#FF0000"]').first()).toBeVisible();
    
    // Check footer Sunspire color
    await expect(page.locator('footer').getByText('Powered by').locator('span')).toBeVisible();
  });

  test('paid page basics', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com', { waitUntil: 'domcontentloaded' });
    
    // Check hero renders
    await expect(page.getByRole('heading', { name: 'Instant Solar Analysis for Your Home' })).toBeVisible();
    
    // Check address input present
    const addressInput = page.getByPlaceholder('Enter your property address');
    await expect(addressInput).toBeVisible();
    
    // Check PDF/Share buttons present
    await expect(page.getByRole('button', { name: /download pdf report/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /copy share link/i })).toBeVisible();
    
    // Check no Stripe CTA
    await expect(page.getByRole('button', { name: /unlock full report/i })).toHaveCount(0);
    
    // Check no masking on paid
    await expect(page.getByText('— — —')).toHaveCount(0);
    
    // Check brand color coordination
    await expect(page.locator('[style*="color:#FF0000"]').first()).toBeVisible();
    
    // Check footer Sunspire color
    await expect(page.locator('footer').getByText('Powered by').locator('span')).toBeVisible();
  });

  test('activate page loads', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/activate?session_id=test', { waitUntil: 'domcontentloaded' });
    
    // Check page loads
    await expect(page.getByRole('heading', { name: 'Your Solar Tool is Ready!' })).toBeVisible();
    
    // Check tabs are present
    await expect(page.getByRole('button', { name: 'Instant URL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Custom Domain' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Embed Code' })).toBeVisible();
  });

  test('embed page loads', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/embed/apple', { waitUntil: 'domcontentloaded' });
    
    // Check page loads
    await expect(page.getByRole('heading', { name: 'Get Your Instant Solar Quote' })).toBeVisible();
    
    // Check address input present
    await expect(page.getByPlaceholder('Enter your property address')).toBeVisible();
    
    // Check brand color coordination
    await expect(page.locator('[style*="color:#FF0000"]').first()).toBeVisible();
  });

  test('health endpoint works', async ({ page }) => {
    const response = await page.request.get('https://sunspire-web-app.vercel.app/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.timestamp).toBeDefined();
  });

  test('stripe button navigation', async ({ page }) => {
    await page.goto('https://sunspire-web-app.vercel.app/?company=Apple&demo=1', { waitUntil: 'domcontentloaded' });
    
    // Click Stripe button
    const stripeButton = page.getByRole('button', { name: /unlock full report/i }).first();
    await stripeButton.click();
    
    // Should navigate to Stripe domain
    await page.waitForURL(/stripe\.com/);
    expect(page.url()).toContain('stripe.com');
  });
});
