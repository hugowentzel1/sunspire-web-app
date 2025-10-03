import { test, expect } from '@playwright/test';

test.describe('Visual Check - Pages Reverted to This Morning', () => {
  const BASE_URL = 'http://localhost:3003';

  test('Visual check - Pricing page (this morning state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'pricing-this-morning-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Pricing main classes:', mainClasses);
    
    // Check if it has the original spacing (should be py-16 md:py-16 sm:py-8)
    expect(mainClasses).toContain('py-16');
    
    console.log('✅ Pricing page visual check complete');
  });

  test('Visual check - Partners page (this morning state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/partners?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'partners-this-morning-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Partners main classes:', mainClasses);
    
    // Check if it has the original spacing
    expect(mainClasses).toContain('py-16');
    
    console.log('✅ Partners page visual check complete');
  });

  test('Visual check - Support page (this morning state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/support?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'support-this-morning-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    console.log('Support main classes:', mainClasses);
    
    // Check if it has the original spacing
    expect(mainClasses).toContain('py-16');
    
    console.log('✅ Support page visual check complete');
  });

  test('Visual check - Report page (current state)', async ({ page }) => {
    await page.goto(`${BASE_URL}/report?company=Netflix&demo=1`);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see current state
    await page.screenshot({ path: 'report-current-state.png', fullPage: true });
    
    // Check main element classes
    const main = page.locator('main[data-testid="report-page"]');
    const mainClasses = await main.getAttribute('class');
    console.log('Report main classes:', mainClasses);
    
    // Check if it has max-w-7xl (as it was 2 days ago)
    expect(mainClasses).toContain('max-w-7xl');
    
    console.log('✅ Report page visual check complete');
  });
});
