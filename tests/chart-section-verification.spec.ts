import { test, expect } from '@playwright/test';

test.describe('Chart Section Verification', () => {
  test('should display chart section with brand colors and correct design', async ({ page }) => {
    // Navigate to demo result page with GreenFuture branding
    await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A&logo=https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=96&h=96&fit=crop&crop=center');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the chart section is visible
    const chartSection = page.locator('text=Your Solar Savings Over Time');
    await expect(chartSection).toBeVisible();
    
    // Check that the chart subtitle is correct
    const chartSubtitle = page.locator('text=Simple view of how your solar investment pays off over 25 years');
    await expect(chartSubtitle).toBeVisible();
    
    // Check that the chart area is visible (should be 64 units tall)
    const chartArea = page.locator('.h-64');
    await expect(chartArea).toBeVisible();
    
    // Check that the 3 metric cards are present and use brand colors
    const metricCards = page.locator('text=Investment, text=Payback Time, text=25-Year Savings');
    await expect(metricCards).toHaveCount(3);
    
    // Check that the metric cards use brand colors (green for GreenFuture)
    const investmentCard = page.locator('text=Investment').locator('..').first();
    const paybackCard = page.locator('text=Payback Time').locator('..').first();
    const savingsCard = page.locator('text=25-Year Savings').locator('..').first();
    
    // Verify the cards have the correct background and border colors
    await expect(investmentCard).toHaveCSS('background-color', 'rgba(22, 163, 74, 0.125)'); // #16A34A with 20% opacity
    await expect(paybackCard).toHaveCSS('background-color', 'rgba(22, 163, 74, 0.125)');
    await expect(savingsCard).toHaveCSS('background-color', 'rgba(22, 163, 74, 0.125)');
    
    // Check that the chart line and dots use brand colors
    const chartLine = page.locator('path[stroke="var(--brand)"]');
    await expect(chartLine).toBeVisible();
    
    // Check that the explanation text is present
    const explanationText = page.locator('text=How to read this:');
    await expect(explanationText).toBeVisible();
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'chart-section-verification.png', fullPage: true });
    
    console.log('✅ Chart section verification completed successfully!');
  });
  
  test('should work with different company colors', async ({ page }) => {
    // Test with a different company (blue theme)
    await page.goto('https://sunspire-web-app.vercel.app/?company=BlueSolar&primary=%233B82F6&logo=https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=96&h=96&fit=crop&crop=center');
    
    await page.waitForLoadState('networkidle');
    
    // Check that the chart section is visible
    const chartSection = page.locator('text=Your Solar Savings Over Time');
    await expect(chartSection).toBeVisible();
    
    // Check that the metric cards use the blue brand color
    const investmentCard = page.locator('text=Investment').locator('..').first();
    await expect(investmentCard).toHaveCSS('background-color', 'rgba(59, 130, 246, 0.125)'); // #3B82F6 with 20% opacity
    
    console.log('✅ Different company color test completed successfully!');
  });
});
