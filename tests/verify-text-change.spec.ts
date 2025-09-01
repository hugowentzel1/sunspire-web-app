import { test, expect } from '@playwright/test';

test('Verify Text Change - "in 24 hours" instead of "within 24 hours"', async ({ page }) => {
  console.log('🔧 Verifying text change on report page...');
  
  await page.goto('http://localhost:3001/report?company=Apple&demo=1&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check that the correct text is showing
  const readyToDeployText = page.locator('p:has-text("A ready-to-deploy solar intelligence tool — live on your site in 24 hours.")');
  await expect(readyToDeployText).toBeVisible();
  console.log('✅ Correct text showing: "A ready-to-deploy solar intelligence tool — live on your site in 24 hours."');
  
  // Check that the old text is NOT showing
  const oldText = page.locator('p:has-text("within 24 hours")');
  const hasOldText = await oldText.count();
  expect(hasOldText).toBe(0);
  console.log('✅ Old text "within 24 hours" correctly NOT showing');
  
  console.log('🎉 Text change verified successfully!');
});
