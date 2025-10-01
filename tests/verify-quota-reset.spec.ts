import { test, expect } from '@playwright/test';

test('Verify all demos start with 2 runs', async ({ page }) => {
  console.log('🔍 Verifying quota reset to 2 runs...\n');
  
  const demos = [
    { name: 'Apple', url: 'https://sunspire-web-app.vercel.app/?company=Apple&demo=1' },
    { name: 'Netflix', url: 'https://sunspire-web-app.vercel.app/?company=Netflix&demo=1&brandColor=%23E50914' },
    { name: 'Starbucks', url: 'https://sunspire-web-app.vercel.app/?company=Starbucks&demo=1&brandColor=%2300704A' },
  ];
  
  for (const demo of demos) {
    console.log(`Testing ${demo.name}...`);
    
    // Clear storage before each test
    await page.goto(demo.url);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await page.waitForSelector('[data-demo="true"]', { timeout: 10000 });
    
    // Check quota display
    const quotaText = await page.locator('text=/2 runs left|Preview: 2/i').first().textContent();
    console.log(`  ✅ ${demo.name}: ${quotaText}`);
    
    expect(quotaText).toContain('2');
  }
  
  console.log('\n✅ All demos verified with 2 runs!');
});

