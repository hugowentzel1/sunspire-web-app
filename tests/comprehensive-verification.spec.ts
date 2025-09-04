import { test, expect } from '@playwright/test';

test('Comprehensive verification of all features', async ({ page }) => {
  console.log('🎯 Comprehensive verification of all features...');
  
  // Clear localStorage first
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  // Test 1: Tesla should have red colors
  console.log('\n🚗 Test 1: Tesla brand colors');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&test=tesla');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const teslaBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  expect(teslaBrandColor).toBe('#CC0000');
  console.log('✅ Tesla brand color:', teslaBrandColor);
  
  // Check Tesla company name is displayed
  const teslaCompanyName = await page.locator('text=Tesla').count();
  expect(teslaCompanyName).toBeGreaterThan(0);
  console.log('✅ Tesla company name is displayed');
  
  // Test 2: Apple should have blue colors
  console.log('\n🍎 Test 2: Apple brand colors');
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1&test=apple');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const appleBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  expect(appleBrandColor).toBe('#0071E3');
  console.log('✅ Apple brand color:', appleBrandColor);
  
  // Check Apple company name is displayed
  const appleCompanyName = await page.locator('text=Apple').count();
  expect(appleCompanyName).toBeGreaterThan(0);
  console.log('✅ Apple company name is displayed');
  
  // Test 3: Demo limitation system
  console.log('\n🔒 Test 3: Demo limitation system');
  
  // First run should work
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1&test=google1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const firstRunReport = await page.locator('div[data-demo="true"]').count();
  const firstRunLock = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(firstRunReport).toBeGreaterThan(0);
  expect(firstRunLock).toBe(0);
  console.log('✅ First run: Report visible, no lock overlay');
  
  // Second run should work
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1&test=google2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const secondRunReport = await page.locator('div[data-demo="true"]').count();
  const secondRunLock = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(secondRunReport).toBeGreaterThan(0);
  expect(secondRunLock).toBe(0);
  console.log('✅ Second run: Report visible, no lock overlay');
  
  // Third run should be locked
  await page.goto('http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1&test=google3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const thirdRunReport = await page.locator('div[data-demo="true"]').count();
  const thirdRunLock = await page.locator('div[style*="position: fixed"][style*="inset: 0"]').count();
  expect(thirdRunReport).toBe(0);
  expect(thirdRunLock).toBeGreaterThan(0);
  console.log('✅ Third run: Report locked, lock overlay visible');
  
  // Test 4: Different companies have different colors
  console.log('\n🎨 Test 4: Different companies have different colors');
  
  const companies = [
    { name: 'Netflix', expectedColor: '#E50914' },
    { name: 'Amazon', expectedColor: '#FF9900' },
    { name: 'Microsoft', expectedColor: '#00A4EF' }
  ];
  
  for (const company of companies) {
    await page.goto(`http://localhost:3000/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=${company.name}&demo=1&test=${company.name.toLowerCase()}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const brandColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    });
    expect(brandColor).toBe(company.expectedColor);
    console.log(`✅ ${company.name} brand color: ${brandColor}`);
  }
  
  console.log('\n🎉 All features are working correctly!');
  console.log('✅ Company colors change dynamically by URL');
  console.log('✅ Company names change dynamically by URL');
  console.log('✅ Demo limitation system works (2 runs then lock)');
  console.log('✅ Different companies have distinct brand colors');
});
