import { test, expect } from '@playwright/test';

test('Interactive Test - 2 Reports Then Lockout (Stays Open)', async ({ page }) => {
  console.log('🎮 Interactive test - 2 reports then lockout (stays open for 5 minutes)...');
  
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
  
  console.log('🎯 System ready! You can now manually test:');
  console.log('1. First click: Should show full report (quota 2→1)');
  console.log('2. Second click: Should show full report (quota 1→0)');
  console.log('3. Third click: Should show lockout page (quota 0→-1)');
  console.log('⏰ Browser will stay open for 5 minutes...');
  
  // Keep the browser open for 5 minutes
  await page.waitForTimeout(300000); // 5 minutes = 300,000 ms
  
  console.log('⏰ 5 minutes elapsed, test complete');
});
