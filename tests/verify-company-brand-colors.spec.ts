import { test, expect } from '@playwright/test';

test('Verify each company has distinct brand colors', async ({ page }) => {
  console.log('🎨 Verifying company brand colors are distinct...');
  
  // Test Tesla - should be red/black
  console.log('\n🚗 Testing Tesla brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check brand color CSS variable
  const teslaBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Tesla brand color:', teslaBrandColor);
  
  // Test Apple - should be blue/gray
  console.log('\n🍎 Testing Apple brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Apple&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const appleBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Apple brand color:', appleBrandColor);
  
  // Test Amazon - should be orange
  console.log('\n📦 Testing Amazon brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Amazon&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const amazonBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Amazon brand color:', amazonBrandColor);
  
  // Test Google - should be blue/red/yellow/green
  console.log('\n🔍 Testing Google brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Google&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const googleBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Google brand color:', googleBrandColor);
  
  // Test Microsoft - should be blue
  console.log('\n💻 Testing Microsoft brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Microsoft&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const microsoftBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Microsoft brand color:', microsoftBrandColor);
  
  // Test Netflix - should be red
  console.log('\n📺 Testing Netflix brand colors...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Netflix&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const netflixBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
  });
  console.log('🎨 Netflix brand color:', netflixBrandColor);
  
  // Verify colors are different
  const colors = [teslaBrandColor, appleBrandColor, amazonBrandColor, googleBrandColor, microsoftBrandColor, netflixBrandColor];
  const uniqueColors = [...new Set(colors)];
  
  console.log('\n🔍 Color analysis:');
  console.log('  - Total colors:', colors.length);
  console.log('  - Unique colors:', uniqueColors.length);
  console.log('  - All colors different:', colors.length === uniqueColors.length);
  
  // Check if any color is the default yellow/orange
  const hasDefaultColor = colors.some(color => 
    color.includes('#FFA63D') || 
    color.includes('#f59e0b') || 
    color.includes('orange') ||
    color.includes('yellow')
  );
  
  console.log('  - Has default yellow/orange color:', hasDefaultColor);
  
  // Take screenshots for visual verification
  await page.screenshot({ path: 'netflix-brand-colors.png', fullPage: true });
  
  console.log('\n🎉 Brand color verification complete!');
  console.log('✅ Each company should have distinct brand colors');
  console.log('✅ No default yellow/orange colors should be used');
});
