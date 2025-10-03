import { test, expect } from '@playwright/test';

test.describe('Support Page Final Updates', () => {
  test('Support Page - Updated Icon Circles and Removed Call Text', async ({ page }) => {
    await page.goto('http://localhost:3000/support?company=Netflix&brandColor=E50914&demo=1');
    await page.waitForLoadState('networkidle');
    
    // Check that "Prefer a quick call?" text is NOT present
    const callText = page.locator('text=Prefer a quick call?');
    await expect(callText).toHaveCount(0);
    
    // Check that icon circles have the correct gradient (brand-primary to white)
    const emailIconCircle = page.locator('.w-12.h-12.bg-gradient-to-br').first();
    await expect(emailIconCircle).toBeVisible();
    
    // Check that icons are black (text-gray-900)
    const emailIcon = emailIconCircle.locator('svg.text-gray-900');
    await expect(emailIcon).toBeVisible();
    
    // Check that Documentation icon also has black color
    const docIconCircle = page.locator('.w-12.h-12.bg-gradient-to-br').nth(1);
    const docIcon = docIconCircle.locator('svg.text-gray-900');
    await expect(docIcon).toBeVisible();
    
    // Check that System Status icon is also black
    const statusIconCircle = page.locator('.w-12.h-12.bg-gradient-to-br').nth(2);
    const statusIcon = statusIconCircle.locator('svg.text-gray-900');
    await expect(statusIcon).toBeVisible();
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'support-final-updates.png', fullPage: true });
    
    console.log('Support page updates verified successfully');
  });
});
