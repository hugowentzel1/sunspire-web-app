import { test, expect } from '@playwright/test';

test('Test Fresh Brand Consistency', async ({ page }) => {
  console.log('🔍 Testing fresh brand consistency...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // Clear ALL localStorage and sessionStorage
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  console.log('🔍 Loading Tesla report page with fresh cache...');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Check brand state on report page
  const reportBrandState = await page.evaluate(() => {
    return {
      brandPrimary: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(document.documentElement).getPropertyValue('--brand'),
      localStorage: localStorage.getItem('sunspire-brand-takeover')
    };
  });
  console.log('📊 Report page brand state:', reportBrandState);
  
  // Check if the stored brand state has the correct Tesla red
  if (reportBrandState.localStorage) {
    const parsed = JSON.parse(reportBrandState.localStorage);
    console.log('📊 Stored primary color:', parsed.primary);
    console.log('📊 Expected Tesla red: #CC0000');
    console.log('📊 Color match:', parsed.primary === '#CC0000' ? '✅' : '❌');
  }
  
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
  
  // Check if all CTA buttons are Tesla red
  const ctaButtons = homeButtonColors.filter(btn => 
    btn.text.includes('Activate') || 
    btn.text.includes('Launch') ||
    btn.className.includes('btn-primary')
  );
  
  const teslaRedButtons = ctaButtons.filter(btn => 
    btn.backgroundColor.includes('204, 0, 0') // Tesla red
  );
  
  console.log('🎯 CTA Button Analysis:');
  console.log('  - Total CTA buttons:', ctaButtons.length);
  console.log('  - Tesla red buttons:', teslaRedButtons.length);
  console.log('  - Consistency:', teslaRedButtons.length === ctaButtons.length ? '✅' : '❌');
  
  // Take screenshot
  await page.screenshot({ path: 'fresh-brand-consistency-test.png' });
  
  console.log('🎯 Fresh brand consistency test complete');
});
