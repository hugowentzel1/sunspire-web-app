import { test, expect } from '@playwright/test';

test('Debug simple CTA button click', async ({ page }) => {
  console.log('🔍 Simple CTA button debug...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.clear());
  
  // Navigate to demo page and exhaust quota quickly
  for (let i = 0; i < 3; i++) {
    await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  
  // Check if lock overlay is visible
  const lockOverlay = page.locator('text=Your Solar Intelligence Tool is now locked');
  const isLockVisible = await lockOverlay.isVisible();
  console.log('🔒 Lock overlay visible:', isLockVisible);
  
  if (!isLockVisible) {
    console.log('❌ Lock overlay not visible, checking demo quota...');
    const quotaData = await page.evaluate(() => localStorage.getItem('demo_quota_v3'));
    console.log('💾 Demo quota data:', quotaData);
    return;
  }
  
  // Find the CTA button
  const ctaButton = page.locator('button:has-text("Launch Your Solar Tool")');
  const isButtonVisible = await ctaButton.isVisible();
  console.log('🔘 CTA button visible:', isButtonVisible);
  
  if (!isButtonVisible) {
    console.log('❌ CTA button not found');
    return;
  }
  
  // Add a simple click handler to test
  await page.evaluate(() => {
    const button = document.querySelector('button:has-text("Launch Your Solar Tool")');
    if (button) {
      button.addEventListener('click', (e) => {
        console.log('Button clicked!');
        e.preventDefault();
        // Test direct navigation
        window.location.href = 'https://checkout.stripe.com/test';
      });
    }
  });
  
  console.log('🖱️ Clicking CTA button...');
  await ctaButton.click();
  
  // Wait for navigation
  await page.waitForTimeout(2000);
  
  const currentUrl = page.url();
  console.log('🔗 Current URL after click:', currentUrl);
  
  if (currentUrl.includes('checkout.stripe.com')) {
    console.log('✅ Successfully redirected to Stripe!');
  } else {
    console.log('❌ Not redirected to Stripe');
  }
});
