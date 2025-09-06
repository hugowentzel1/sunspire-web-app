import { test, expect } from '@playwright/test';

test('Interactive Demo - Stay Open for Manual Testing', async ({ page }) => {
  console.log('🎮 Interactive Demo - Browser will stay open for manual testing');
  console.log('🔗 Navigate to: https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  
  // Clear any existing demo quota to start fresh
  await page.goto('https://sunspire-web-app.vercel.app');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('demo_countdown_deadline');
    console.log('🗑️ Cleared demo quota and countdown data');
  });
  
  // Navigate to Tesla demo
  await page.goto('https://sunspire-web-app.vercel.app/?company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Tesla demo loaded - you can now test manually:');
  console.log('   1. Enter an address in the input field');
  console.log('   2. Click "Generate Solar Intelligence Report" (first time - should work)');
  console.log('   3. Go back to home page and try again (second time - should work)');
  console.log('   4. Go back to home page and try again (third time - should show lockout page)');
  console.log('   5. The lockout page should have red "What You See Now" elements');
  console.log('   6. Click "Activate on Your Domain" to test Stripe redirect');
  console.log('');
  console.log('🔒 Current quota status:');
  
  // Show current quota
  const quota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📦 Demo quota:', quota);
  
  // Keep the browser open for manual testing
  console.log('⏳ Browser will stay open for 5 minutes for manual testing...');
  console.log('   You can interact with the page and test the lockout system!');
  
  // Wait for 5 minutes (300 seconds) to allow manual testing
  await page.waitForTimeout(300000);
  
  console.log('⏰ 5 minutes elapsed - test completed');
});
