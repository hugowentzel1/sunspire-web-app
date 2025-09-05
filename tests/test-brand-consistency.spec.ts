import { test, expect } from '@playwright/test';

test('Test Brand Color Consistency', async ({ page }) => {
  console.log('🔍 Testing brand color consistency...');
  
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
  await page.waitForTimeout(3000);
  
  // Check CSS variables
  const cssVars = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      brandPrimary: getComputedStyle(root).getPropertyValue('--brand-primary'),
      brand: getComputedStyle(root).getPropertyValue('--brand'),
      brand2: getComputedStyle(root).getPropertyValue('--brand-2'),
      brandSecondary: getComputedStyle(root).getPropertyValue('--brand-secondary')
    };
  });
  console.log('🎨 CSS Variables:', cssVars);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    return localStorage.getItem('sunspire-brand-takeover');
  });
  console.log('📊 Brand takeover state:', brandState);
  
  // Check all buttons and their colors
  const buttonColors = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, [data-cta], .btn-primary, .btn-secondary'));
    return buttons.map(btn => {
      const styles = window.getComputedStyle(btn);
      return {
        text: btn.textContent?.trim().substring(0, 30) || 'No text',
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor
      };
    });
  });
  console.log('🔘 Button colors:', buttonColors);
  
  // Check all elements with brand-related classes
  const brandElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('[class*="brand"], [style*="var(--brand"]'));
    return elements.map(el => {
      const styles = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        className: el.className,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor
      };
    });
  });
  console.log('🎨 Brand elements:', brandElements);
  
  // Check if report is visible (should be locked after quota consumption)
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const lockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Report visible:', reportVisible);
  console.log('📊 Lock visible:', lockVisible);
  
  // Take screenshot
  await page.screenshot({ path: 'brand-consistency-test.png' });
  
  console.log('🎯 Brand consistency test complete');
});
