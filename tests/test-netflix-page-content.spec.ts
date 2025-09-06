import { test, expect } from '@playwright/test';

test('Check Netflix demo page content', async ({ page }) => {
  console.log('🔍 Checking Netflix demo page content...');
  
  // Navigate to Netflix demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Netflix&demo=1');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Get page title
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  // Check if we're on the right page
  const url = page.url();
  console.log('🌐 Current URL:', url);
  
  // Look for address input specifically
  const addressInput = page.locator('input[type="text"]');
  const inputCount = await addressInput.count();
  console.log('📝 Address inputs found:', inputCount);
  
  if (inputCount > 0) {
    for (let i = 0; i < inputCount; i++) {
      const placeholder = await addressInput.nth(i).getAttribute('placeholder');
      const value = await addressInput.nth(i).inputValue();
      console.log(`Input ${i}: placeholder="${placeholder}", value="${value}"`);
    }
  }
  
  // Look for any form elements
  const forms = await page.locator('form').all();
  console.log('📋 Forms found:', forms.length);
  
  // Look for the main content area
  const mainContent = page.locator('main, [role="main"], .main-content');
  const mainCount = await mainContent.count();
  console.log('🏠 Main content areas found:', mainCount);
  
  // Check for any demo-related text
  const demoText = await page.locator('text=Preview:').first();
  const demoVisible = await demoText.isVisible();
  console.log('🎯 Demo text visible:', demoVisible);
  
  if (demoVisible) {
    const demoContent = await demoText.textContent();
    console.log('📊 Demo content:', demoContent);
  }
  
  // Check for any lockout messages
  const lockoutText = await page.locator('text=Demo limit reached, text=quota exhausted, text=locked').first();
  const lockoutVisible = await lockoutText.isVisible();
  console.log('🔒 Lockout text visible:', lockoutVisible);
  
  if (lockoutVisible) {
    const lockoutContent = await lockoutText.textContent();
    console.log('🚫 Lockout content:', lockoutContent);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'netflix-page-content.png' });
  console.log('📸 Screenshot saved as netflix-page-content.png');
});
