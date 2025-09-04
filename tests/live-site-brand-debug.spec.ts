import { test, expect } from '@playwright/test';

test('Live Site Brand Debug - Fix Brand Takeover', async ({ page }) => {
  console.log('🎨 Debugging brand takeover on live site...');
  
  // Test 1: Check URL parameters
  console.log('\n🔍 Testing URL parameter detection...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check URL parameters
  const urlParams = await page.evaluate(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      company: sp.get('company'),
      demo: sp.get('demo'),
      brand: sp.get('brand'),
      primary: sp.get('primary'),
      brandColor: sp.get('brandColor')
    };
  });
  console.log('🔍 URL parameters:', urlParams);
  
  // Check if brand takeover is enabled
  const brandEnabled = await page.evaluate(() => {
    const sp = new URLSearchParams(window.location.search);
    return sp.get("demo") === "1" || sp.get("demo") === "true" || !!sp.get("company");
  });
  console.log('🔍 Brand takeover should be enabled:', brandEnabled);
  
  // Check localStorage
  const brandState = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('🔍 Brand state in localStorage:', brandState);
  
  // Check CSS variables
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
  
  // Check if BrandProvider is working
  const brandProviderWorking = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const brandPrimary = computedStyle.getPropertyValue('--brand-primary');
    return brandPrimary !== '' && brandPrimary !== '#FFA63D';
  });
  console.log('🔧 BrandProvider working:', brandProviderWorking);
  
  // Test 2: Check console logs for brand takeover
  console.log('\n📝 Checking console logs...');
  const consoleLogs = await page.evaluate(() => {
    return (window as any).consoleLogs || [];
  });
  console.log('📝 Console logs:', consoleLogs);
  
  // Test 3: Check if useBrandTakeover hook is running
  console.log('\n🔧 Checking useBrandTakeover hook...');
  const hookRunning = await page.evaluate(() => {
    // Check if the hook has run by looking for specific console logs
    return (window as any).consoleLogs?.some((log: string) => 
      log.includes('useBrandTakeover') || 
      log.includes('BrandProvider') ||
      log.includes('CSS variables set')
    ) || false;
  });
  console.log('🔧 useBrandTakeover hook running:', hookRunning);
  
  // Test 4: Check if the brand state is being set
  console.log('\n🎯 Checking brand state setting...');
  const brandStateSet = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const brandPrimary = computedStyle.getPropertyValue('--brand-primary');
    return brandPrimary === '#CC0000'; // Tesla red
  });
  console.log('🎯 Brand state set to Tesla red:', brandStateSet);
  
  // Test 5: Check CTA button color
  console.log('\n🔘 Checking CTA button color...');
  const ctaButton = page.locator('button:has-text("Activate")').first();
  const ctaColor = await ctaButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      background: styles.background,
      color: styles.color
    };
  });
  console.log('🔘 CTA button color:', ctaColor);
  
  // Test 6: Check if the button should be using CSS variables
  console.log('\n🎨 Checking CTA button CSS variables...');
  const ctaUsesVars = await ctaButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundUsesVar: styles.background.includes('var(--brand-primary)'),
      backgroundColorUsesVar: styles.backgroundColor.includes('var(--brand-primary)'),
      computedBackground: styles.background,
      computedBackgroundColor: styles.backgroundColor
    };
  });
  console.log('🎨 CTA uses CSS variables:', ctaUsesVars);
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-brand-debug.png' });
  console.log('📸 Brand debug screenshot saved');
  
  console.log('\n🎯 Brand debug complete!');
});
