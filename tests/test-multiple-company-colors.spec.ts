import { test, expect } from '@playwright/test';

test('Test multiple company colors locally', async ({ page }) => {
  console.log('🎨 Testing multiple company colors locally...');
  
  const companies = [
    { name: 'Tesla', expectedColor: '#CC0000' },
    { name: 'Apple', expectedColor: '#0071E3' },
    { name: 'Amazon', expectedColor: '#FF9900' },
    { name: 'Google', expectedColor: '#4285F4' },
    { name: 'Microsoft', expectedColor: '#00A4EF' },
    { name: 'Netflix', expectedColor: '#E50914' }
  ];
  
  const results: { company: string; expected: string; actual: string }[] = [];
  
  for (const company of companies) {
    console.log(`\n🏢 Testing ${company.name}...`);
    
    // Clear localStorage
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Navigate to company page
    await page.goto(`http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=${company.name}&demo=1`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get the actual brand color
    const actualColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    });
    
    console.log(`  Expected: ${company.expectedColor}`);
    console.log(`  Actual: ${actualColor}`);
    
    results.push({
      company: company.name,
      expected: company.expectedColor,
      actual: actualColor
    });
    
    // Verify the color matches
    expect(actualColor).toBe(company.expectedColor);
  }
  
  // Summary
  console.log('\n📊 Summary:');
  results.forEach(result => {
    const status = result.expected === result.actual ? '✅' : '❌';
    console.log(`  ${status} ${result.company}: ${result.actual}`);
  });
  
  // Verify all colors are unique
  const uniqueColors = [...new Set(results.map(r => r.actual))];
  console.log(`\n🎯 Unique colors: ${uniqueColors.length}/${results.length}`);
  expect(uniqueColors.length).toBe(results.length);
  
  console.log('\n🎉 All company colors are working correctly!');
});
