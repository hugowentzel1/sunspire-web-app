import { test, expect } from '@playwright/test';

test('quick visual check - report loads', async ({ page }) => {
  console.log('🚀 Navigating to report page...');
  await page.goto('http://localhost:3001/report?address=123+Main+St,+Atlanta,+GA&company=Tesla&demo=1', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  
  console.log('⏳ Waiting for page to hydrate...');
  await page.waitForTimeout(5000);
  
  // Check for error message
  const errorText = await page.textContent('body').catch(() => '');
  console.log('Page loaded, checking for errors...');
  
  if (errorText.includes('missing required error')) {
    console.log('❌ Error found on page');
    await page.screenshot({ path: 'test-results/error-screenshot.png' });
    throw new Error('Page shows error');
  }
  
  console.log('✅ No error message found');
  
  // Look for H1 - wait for it to appear
  console.log('🔍 Looking for H1...');
  const h1 = page.locator('h1').first();
  
  try {
    await h1.waitFor({ state: 'visible', timeout: 15000 });
    const h1Text = await h1.textContent();
    console.log('✅ H1 found:', h1Text);
    await page.screenshot({ path: 'test-results/success-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved');
  } catch (e) {
    console.log('❌ H1 not found after waiting');
    await page.screenshot({ path: 'test-results/no-h1-screenshot.png', fullPage: true });
    throw e;
  }
});

