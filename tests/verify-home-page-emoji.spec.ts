import { test, expect } from '@playwright/test';

test('verify email support emoji was removed from home page', async ({ page }) => {
  // Navigate to the home page
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Check that the email support text exists but without the emoji
  const supportText = await page.locator('text=Support? — Email support 24/7').count();
  expect(supportText).toBe(1);
  
  // Check that there's no emoji in the support section
  const emojiInSupport = await page.locator('h3:has-text("Support?")').locator('text=📮').count();
  expect(emojiInSupport).toBe(0);
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'home-page-emoji-removed.png' });
  
  console.log('✅ Email support emoji successfully removed from home page!');
});
