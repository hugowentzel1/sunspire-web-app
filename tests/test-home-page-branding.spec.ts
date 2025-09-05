import { test, expect } from '@playwright/test';

test('Test Home Page Branding After New Analysis', async ({ page }) => {
  console.log('🔍 Testing home page branding after New Analysis...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // Clear any existing quota and brand state
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('sunspire-brand-takeover');
  });
  
  console.log('🔍 Loading Tesla report page...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check brand state on report page
  const reportBrandState = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand'),
      localStorage: localStorage.getItem('sunspire-brand-takeover')
    };
  });
  console.log('📊 Report page brand state:', reportBrandState);
  
  // Click "New Analysis" button
  console.log('🔍 Clicking New Analysis button...');
  await page.click('text=New Analysis');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check brand state on home page
  const homeBrandState = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand'),
      localStorage: localStorage.getItem('sunspire-brand-takeover'),
      url: window.location.href
    };
  });
  console.log('📊 Home page brand state:', homeBrandState);
  
  // Check all buttons on home page
  const homeButtonColors = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [data-cta], .btn-primary, .btn-secondary, .btn'));
    return buttons.map(btn => {
      const styles = window.getComputedStyle(btn);
      return {
        text: btn.textContent?.trim().substring(0, 30) || 'No text',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor,
        className: btn.className
      };
    });
  });
  console.log('🔘 Home page button colors:', homeButtonColors);
  
  // Check if there are any yellow or blue elements that should be red
  const inconsistentElements = homeButtonColors.filter(btn => 
    btn.backgroundColor.includes('255, 193, 7') || // yellow
    btn.backgroundColor.includes('59, 130, 246') || // blue
    btn.backgroundColor.includes('37, 99, 235') // blue
  );
  
  if (inconsistentElements.length > 0) {
    console.log('❌ Found inconsistent colored elements:', inconsistentElements);
  } else {
    console.log('✅ All elements are using consistent brand colors');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'home-page-branding-test.png' });
  
  console.log('🎯 Home page branding test complete');
});
