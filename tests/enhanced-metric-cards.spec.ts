import { test, expect } from '@playwright/test';

test.describe('Enhanced Metric Cards', () => {
  test('should display enhanced metric cards with brand color gradients and shadows', async ({ page }) => {
    // Navigate to demo result page with GreenFuture branding
    await page.goto('http://localhost:3001/demo-result?company=GreenFuture&primary=%2316A34A&logo=https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=96&h=96&fit=crop&crop=center');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the chart section is visible
    const chartSection = page.locator('text=Your Solar Savings Over Time');
    await expect(chartSection).toBeVisible();
    
    // Check that the 3 enhanced metric cards are present
    const metricCards = page.locator('text=Investment, text=Payback Time, text=25-Year Savings');
    await expect(metricCards).toHaveCount(3);
    
    // Check that the metric cards have enhanced styling
    const investmentCard = page.locator('text=Investment').locator('..').first();
    const paybackCard = page.locator('text=Payback Time').locator('..').first();
    const savingsCard = page.locator('text=25-Year Savings').locator('..').first();
    
    // Verify the cards have shadows and gradients
    await expect(investmentCard).toHaveClass(/shadow-lg/);
    await expect(paybackCard).toHaveClass(/shadow-lg/);
    await expect(savingsCard).toHaveClass(/shadow-lg/);
    
    // Verify the cards have overflow-hidden for gradient effects
    await expect(investmentCard).toHaveClass(/overflow-hidden/);
    await expect(paybackCard).toHaveClass(/overflow-hidden/);
    await expect(savingsCard).toHaveClass(/overflow-hidden/);
    
    // Check that the cards use brand colors for borders and text
    await expect(investmentCard.locator('.text-xl')).toHaveCSS('color', 'rgb(22, 163, 74)'); // #16A34A
    await expect(paybackCard.locator('.text-xl')).toHaveCSS('color', 'rgb(22, 163, 74)');
    await expect(savingsCard.locator('.text-xl')).toHaveCSS('color', 'rgb(22, 163, 74)');
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'enhanced-metric-cards.png', fullPage: true });
    
    console.log('✅ Enhanced metric cards verification completed successfully!');
  });
});
