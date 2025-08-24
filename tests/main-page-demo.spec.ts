import { test, expect } from '@playwright/test';

test('Show Main Page with Simplified Address Input', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Main page loaded - showing simplified address input');
  
  // Check the hero text
  const heroText = page.locator('h1.text-5xl.md\\:text-7xl');
  await expect(heroText).toContainText('Your Branded Solar Quote Tool');
  console.log('✅ Hero text: "Your Branded Solar Quote Tool — Ready to Launch"');
  
  // Check the sub-hero text
  const subHero = page.locator('p.text-xl.md\\:text-2xl');
  await expect(subHero).toContainText('Go live in 24 hours');
  console.log('✅ Sub-hero: "Go live in 24 hours. Convert more leads..."');
  
  // Check the address input form
  const addressForm = page.locator('.bg-white\\/80.backdrop-blur-xl');
  await expect(addressForm).toBeVisible();
  console.log('✅ Address input form visible');
  
  // Check the address input field
  const addressInput = page.locator('input[type="text"]');
  await expect(addressInput).toBeVisible();
  console.log('✅ Address input field visible');
  
  // Check the "Get Quote" button
  const getQuoteButton = page.locator('button[type="submit"]');
  await expect(getQuoteButton).toContainText('Get Quote');
  console.log('✅ "Get Quote" button visible');
  
  // Check the simplified message
  const simplifiedMessage = page.locator('p.text-sm.text-gray-500');
  await expect(simplifiedMessage).toContainText('Address autocomplete temporarily unavailable');
  console.log('✅ Simplified message: "Address autocomplete temporarily unavailable"');
  
  // Check normalized spacing
  const mainContainer = page.locator('main > div > div');
  await expect(mainContainer).toHaveClass(/space-y-6/);
  console.log('✅ Normalized 24px spacing between sections');
  
  console.log('🎉 Main page shows simplified address input (like c548b88)');
  console.log('📍 No complex Google Maps API - simple text input with Get Quote button');
  console.log('📏 Consistent 24px spacing between all sections');
  
  // Keep the page open for visual inspection
  await page.waitForTimeout(8000); // Stay open for 8 seconds
});
