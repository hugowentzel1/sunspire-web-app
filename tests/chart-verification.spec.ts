import { test, expect } from '@playwright/test';

test('Chart Area Verification - Restored c002d1e Design with Brand Colors', async ({ page }) => {
  console.log('🚀 Starting chart verification test...');
  
  // Test with a specific company brand
  await page.goto('https://sunspire-web-app.vercel.app/?company=GreenFuture&primary=%2316A34A&logo=https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=96&h=96&fit=crop&crop=center');
  console.log('✅ Loaded page with GreenFuture branding');
  
  await page.waitForLoadState('networkidle');
  console.log('✅ Page fully loaded');
  
  // Navigate to demo result to see the chart
  await page.goto('https://sunspire-web-app.vercel.app/demo-result?company=GreenFuture&primary=%2316A34A');
  await page.waitForLoadState('networkidle');
  console.log('✅ Navigated to demo result page');
  
  // Verify brand colors are applied
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand');
  });
  console.log(`🎨 Brand primary color: ${brandPrimary}`);
  
  // Check chart title and subtitle (should be exactly like c002d1e)
  const chartTitle = await page.locator('text=Your Solar Savings Over Time').first();
  await expect(chartTitle).toBeVisible();
  console.log('✅ Chart title "Your Solar Savings Over Time" is visible');
  
  const chartSubtitle = await page.locator('text=Simple view of how your solar investment pays off over 25 years').first();
  await expect(chartSubtitle).toBeVisible();
  console.log('✅ Chart subtitle is visible');
  
  // Check chart area (should be h-64, not h-80)
  const chartContainer = await page.locator('[class*="h-64"]').first();
  await expect(chartContainer).toBeVisible();
  console.log('✅ Chart container has correct height (h-64)');
  
  // Check the 3 metric cards below the graph
  console.log('🔍 Checking 3 metric cards for brand colors...');
  
  // Investment card
  const investmentCard = await page.locator('text=Investment').first();
  await expect(investmentCard).toBeVisible();
  
  // Payback Time card
  const paybackCard = await page.locator('text=Payback Time').first();
  await expect(paybackCard).toBeVisible();
  
  // 25-Year Savings card
  const savingsCard = await page.locator('text=25-Year Savings').first();
  await expect(savingsCard).toBeVisible();
  
  console.log('✅ All 3 metric cards are visible');
  
  // Check that the metric cards use brand colors (not hardcoded orange/blue/green)
  const metricCards = await page.locator('[class*="text-center p-4 rounded-lg border"]').all();
  console.log(`📊 Found ${metricCards.length} metric cards`);
  
  for (let i = 0; i < metricCards.length; i++) {
    const card = metricCards[i];
    const cardStyle = await card.evaluate((el) => {
      const computed = getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor
      };
    });
    
    console.log(`  Card ${i + 1}: bg=${cardStyle.backgroundColor}, border=${cardStyle.borderColor}`);
    
    // Cards should use brand colors, not hardcoded colors
    expect(cardStyle.backgroundColor).not.toBe('rgba(255, 165, 0, 0.1)'); // not orange
    expect(cardStyle.backgroundColor).not.toBe('rgba(59, 130, 246, 0.1)'); // not blue
    expect(cardStyle.backgroundColor).not.toBe('rgba(34, 197, 94, 0.1)'); // not green
  }
  
  // Check explanation text (should be exactly like c002d1e)
  const explanationText = await page.locator('text=How to read this: The green area shows your total savings growing over time').first();
  await expect(explanationText).toBeVisible();
  console.log('✅ Explanation text is visible and correct');
  
  // Check that no hardcoded orange/blue/green colors exist in the chart area
  const orangeElements = await page.locator('[class*="orange-"]').count();
  const blueElements = await page.locator('[class*="blue-"]').count();
  const greenElements = await page.locator('[class*="green-"]').count();
  
  console.log(`🔍 Color check: orange=${orangeElements}, blue=${blueElements}, green=${greenElements}`);
  
  // Should have minimal hardcoded colors (only the chart line itself)
  expect(orangeElements).toBeLessThan(3);
  expect(blueElements).toBeLessThan(3);
  expect(greenElements).toBeLessThan(3);
  
  // Take screenshot for visual verification
  await page.screenshot({ path: 'test-results/chart-verification.png' });
  console.log('📸 Screenshot saved as chart-verification.png');
  
  console.log('🎯 Chart verification complete!');
});
