import { test, expect } from '@playwright/test';

test('Live Site Console Errors - Check for JavaScript Issues', async ({ page }) => {
  console.log('🔍 Checking for JavaScript errors on live site...');
  
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for page errors
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(`Page error: ${error.message}`);
  });
  
  // Listen for network errors
  const networkErrors: string[] = [];
  page.on('response', response => {
    if (!response.ok()) {
      networkErrors.push(`Network error: ${response.status()} ${response.url()}`);
    }
  });
  
  // Navigate to the page
  console.log('\n🌐 Navigating to live site...');
  await page.goto('https://sunspire-web-app.vercel.app/report?address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  // Check console messages
  console.log('\n📝 Console messages:');
  consoleMessages.forEach(msg => console.log('  ', msg));
  
  // Check page errors
  console.log('\n❌ Page errors:');
  pageErrors.forEach(error => console.log('  ', error));
  
  // Check network errors
  console.log('\n🌐 Network errors:');
  networkErrors.forEach(error => console.log('  ', error));
  
  // Check if the brand takeover hook is loaded
  console.log('\n🔧 Checking if brand takeover hook is loaded...');
  const hookLoaded = await page.evaluate(() => {
    // Check if the hook function exists
    return typeof (window as any).useBrandTakeover !== 'undefined';
  });
  console.log('🔧 useBrandTakeover hook loaded:', hookLoaded);
  
  // Check if the BrandProvider is loaded
  console.log('\n🔧 Checking if BrandProvider is loaded...');
  const providerLoaded = await page.evaluate(() => {
    // Check if the provider component exists
    return document.querySelector('[data-brand-provider]') !== null;
  });
  console.log('🔧 BrandProvider loaded:', providerLoaded);
  
  // Check if there are any React errors
  console.log('\n⚛️ Checking for React errors...');
  const reactErrors = await page.evaluate(() => {
    // Check if there are any React error boundaries
    const errorBoundaries = document.querySelectorAll('[data-react-error-boundary]');
    return errorBoundaries.length > 0;
  });
  console.log('⚛️ React error boundaries found:', reactErrors);
  
  // Check if the page is hydrated
  console.log('\n💧 Checking if page is hydrated...');
  const isHydrated = await page.evaluate(() => {
    return (window as any).__NEXT_DATA__ !== undefined;
  });
  console.log('💧 Page hydrated:', isHydrated);
  
  // Check if the brand takeover state is being set
  console.log('\n🎨 Checking brand takeover state...');
  const brandState = await page.evaluate(() => {
    return {
      localStorage: localStorage.getItem('sunspire-brand-takeover'),
      cssVars: {
        brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
        brand: getComputedStyle(document.documentElement).getPropertyValue('--brand')
      }
    };
  });
  console.log('🎨 Brand state:', brandState);
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-console-errors.png' });
  console.log('📸 Console errors screenshot saved');
  
  console.log('\n🎯 Console errors check complete!');
});
