import { test, expect } from '@playwright/test';

test.describe('Visual Check - Pages Reverted to Specific Commit', () => {
  const BASE_URL = 'http://localhost:3003';

  test('Visual check - Pricing page (reverted state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'pricing-reverted-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Pricing main classes:', mainClasses);
    
    console.log('✅ Pricing page visual check complete');
  });

  test('Visual check - Partners page (reverted state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/partners?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'partners-reverted-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Partners main classes:', mainClasses);
    
    console.log('✅ Partners page visual check complete');
  });

  test('Visual check - Support page (reverted state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/support?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'support-reverted-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Support main classes:', mainClasses);
    
    console.log('✅ Support page visual check complete');
  });

  test('Visual check - Report page (unchanged)', async ({ page }) => {
    await page.goto(`${BASE_URL}/report?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'report-unchanged-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main[data-testid="report-page"]');
    const mainClasses = await main.getAttribute('class');
    console.log('Report main classes:', mainClasses);
    
    // Should still have max-w-7xl
    expect(mainClasses).toContain('max-w-7xl');
    
    console.log('✅ Report page visual check complete');
  });
});
