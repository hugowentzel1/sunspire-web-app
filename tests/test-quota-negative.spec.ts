import { test, expect } from '@playwright/test';

test('Test Quota Going Negative', async ({ page }) => {
  console.log('🔍 Testing if quota can go negative...');
  
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
  
  // Test the consume function directly
  const result = await page.evaluate(() => {
    // Simulate the consume function logic
    const KEY = 'demo_quota_v3';
    const allowed = 2;
    const link = 'https://sunspire-web-app.vercel.app/?company=Tesla&demo=1';
    
    const map = JSON.parse(localStorage.getItem(KEY) || '{}');
    const currentRuns = map[link] ?? allowed;
    const newRuns = currentRuns - 1;
    console.log('🔒 Direct test - currentRuns:', currentRuns, 'newRuns:', newRuns);
    map[link] = newRuns;
    localStorage.setItem(KEY, JSON.stringify(map));
    
    return { currentRuns, newRuns, finalMap: map };
  });
  
  console.log('📦 Direct consume test result:', result);
  
  // Test multiple consumes
  for (let i = 0; i < 5; i++) {
    const result = await page.evaluate((iteration) => {
      const KEY = 'demo_quota_v3';
      const link = 'https://sunspire-web-app.vercel.app/?company=Tesla&demo=1';
      
      const map = JSON.parse(localStorage.getItem(KEY) || '{}');
      const currentRuns = map[link] ?? 2;
      const newRuns = currentRuns - 1;
      map[link] = newRuns;
      localStorage.setItem(KEY, JSON.stringify(map));
      
      return { iteration, currentRuns, newRuns };
    }, i);
    
    console.log(`📦 Iteration ${i}:`, result);
  }
  
  console.log('🔍 Quota negative test complete');
});
