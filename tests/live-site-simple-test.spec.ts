import { test, expect } from '@playwright/test';

test('Live Site Simple Test - Check Basic Functionality', async ({ page }) => {
  console.log('🔧 Simple test of live site functionality...');
  
  // Test 1: Check if the page loads
  console.log('\n📄 Testing page load...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check if the page title is correct
  const title = await page.title();
  console.log('📄 Page title:', title);
  expect(title).toContain('Tesla');
  
  // Test 2: Check if console logs are working
  console.log('\n📝 Testing console logs...');
  const consoleLogs = await page.evaluate(() => {
    return (window as any).consoleLogs || [];
  });
  console.log('📝 Console logs found:', consoleLogs.length);
  
  // Test 3: Check if the brand takeover hook is running
  console.log('\n🔧 Testing brand takeover hook...');
  const hookRunning = await page.evaluate(() => {
    // Check if the hook has run by looking for specific console logs
    return (window as any).consoleLogs?.some((log: string) => 
      log.includes('useBrandTakeover') || 
      log.includes('BrandProvider') ||
      log.includes('getBrandTheme')
    ) || false;
  });
  console.log('🔧 Brand takeover hook running:', hookRunning);
  
  // Test 4: Check if the function is being called
  console.log('\n🎨 Testing getBrandTheme function...');
  const functionCalled = await page.evaluate(() => {
    return (window as any).consoleLogs?.some((log: string) => 
      log.includes('getBrandTheme: companyHandle=')
    ) || false;
  });
  console.log('🎨 getBrandTheme function called:', functionCalled);
  
  // Test 5: Check if the CSS variables are being set
  console.log('\n🎨 Testing CSS variables...');
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    return {
      brandPrimary: computedStyle.getPropertyValue('--brand-primary'),
      brand: computedStyle.getPropertyValue('--brand'),
      brand2: computedStyle.getPropertyValue('--brand-2')
    };
  });
  console.log('🎨 CSS variables:', cssVars);
  
  // Test 6: Check if the brand state is in localStorage
  console.log('\n💾 Testing localStorage...');
  const brandState = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('💾 Brand state in localStorage:', brandState);
  
  // Test 7: Check if the CTA buttons are visible
  console.log('\n🔘 Testing CTA buttons...');
  const ctaButtons = await page.locator('button:has-text("Activate")').count();
  console.log('🔘 CTA buttons found:', ctaButtons);
  
  // Test 8: Check if the buttons have the right styling
  if (ctaButtons > 0) {
    const ctaButton = page.locator('button:has-text("Activate")').first();
    const ctaStyles = await ctaButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        background: styles.background,
        color: styles.color
      };
    });
    console.log('🔘 CTA button styles:', ctaStyles);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-simple-test.png' });
  console.log('📸 Simple test screenshot saved');
  
  console.log('\n🎯 Simple test complete!');
});
