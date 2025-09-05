import { test, expect } from '@playwright/test';

test('Test Brand Takeover State on Home Page', async ({ page }) => {
  console.log('🔍 Testing brand takeover state on home page...');
  
  // Add cache busting parameter
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1&cb=' + Date.now();
  
  // Clear ALL localStorage and sessionStorage
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log('🔍 Loading Tesla report page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click "New Analysis" button
  console.log('🔍 Clicking New Analysis button...');
  await page.click('text=New Analysis');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check brand takeover state on home page
  const brandState = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    let parsed = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored brand state:', e);
      }
    }
    
    return {
      stored: stored,
      parsed: parsed,
      enabled: parsed?.enabled,
      brand: parsed?.brand,
      primary: parsed?.primary
    };
  });
  console.log('📊 Brand takeover state:', brandState);
  
  // Check if BrandProvider is running
  const brandProviderInfo = await page.evaluate(() => {
    // Check if there are any console logs from BrandProvider
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      if (args[0] && args[0].includes('BrandProvider')) {
        logs.push(args.join(' '));
      }
      originalLog.apply(console, args);
    };
    
    // Trigger a re-render by changing a CSS variable
    document.documentElement.style.setProperty('--test-var', 'test');
    
    return {
      logs: logs,
      hasBrandProviderLogs: logs.length > 0
    };
  });
  console.log('📊 BrandProvider info:', brandProviderInfo);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand')
    };
  });
  console.log('🎨 CSS Variables:', cssVars);
  
  // Force apply brand colors manually
  const manualApply = await page.evaluate(() => {
    const stored = localStorage.getItem('sunspire-brand-takeover');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.enabled && parsed.primary) {
        document.documentElement.style.setProperty('--brand-primary', parsed.primary);
        document.documentElement.style.setProperty('--brand', parsed.primary);
        console.log('Manually applied brand colors:', parsed.primary);
        return true;
      }
    }
    return false;
  });
  console.log('📊 Manual apply result:', manualApply);
  
  // Check CSS variables after manual apply
  const cssVarsAfter = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand')
    };
  });
  console.log('🎨 CSS Variables after manual apply:', cssVarsAfter);
  
  console.log('🎯 Brand takeover state test complete');
});
