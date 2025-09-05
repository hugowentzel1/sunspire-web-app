import { test, expect } from '@playwright/test';

test('Debug Live Site - Comprehensive Test', async ({ page }) => {
  console.log('🔍 Comprehensive live site debug test...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // Clear any existing quota
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
    localStorage.removeItem('brand_takeover_v1');
  });
  
  console.log('🔍 FIRST VISIT - Testing everything');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    if (text.includes('🔒') || text.includes('🎨') || text.includes('useBrandTakeover')) {
      console.log('📝 Console:', text);
    }
  });
  
  // Wait for everything to load
  await page.waitForTimeout(5000);
  
  // Check quota
  const firstQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 First visit quota:', firstQuota);
  
  // Check if report is visible
  const reportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Report visible:', reportVisible);
  
  // Check brand colors
  const brandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('🎨 Brand primary color:', brandPrimary);
  
  const brand = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand');
  });
  console.log('🎨 Brand color:', brand);
  
  // Check CTA buttons
  const ctaButtons = page.locator('[data-cta="primary"]');
  const ctaCount = await ctaButtons.count();
  console.log('📊 CTA button count:', ctaCount);
  
  if (ctaCount > 0) {
    const ctaStyle = await ctaButtons.first().evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    console.log('🎨 CTA button style:', ctaStyle);
  }
  
  // Check for Tesla logo
  const teslaLogo = page.locator('img[alt*="Tesla"], img[src*="tesla"], img[alt*="logo"]');
  const logoCount = await teslaLogo.count();
  console.log('📊 Tesla logo count:', logoCount);
  
  // Check brand takeover state
  const brandState = await page.evaluate(() => {
    return localStorage.getItem('brand_takeover_v1');
  });
  console.log('📊 Brand takeover state:', brandState);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-first-visit.png' });
  
  console.log('🔍 SECOND VISIT - Testing quota consumption');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  
  const secondQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 Second visit quota:', secondQuota);
  
  const secondReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const secondLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Second visit - Report visible:', secondReportVisible);
  console.log('📊 Second visit - Lock visible:', secondLockVisible);
  
  // Check brand colors on second visit
  const secondBrandPrimary = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('🎨 Second visit brand color:', secondBrandPrimary);
  
  await page.screenshot({ path: 'debug-second-visit.png' });
  
  console.log('🔍 THIRD VISIT - Testing lockout');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  const thirdQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 Third visit quota:', thirdQuota);
  
  const thirdReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  const thirdLockVisible = await page.locator('text=What You See Now').isVisible();
  console.log('📊 Third visit - Report visible:', thirdReportVisible);
  console.log('📊 Third visit - Lock visible:', thirdLockVisible);
  
  // Check lock overlay red elements
  if (thirdLockVisible) {
    const whatYouSeeNow = page.locator('text=What You See Now').first();
    const whatYouSeeNowColor = await whatYouSeeNow.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 "What You See Now" color:', whatYouSeeNowColor);
    
    const blurredData = page.locator('text=Blurred Data');
    const blurredDataColor = await blurredData.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 "Blurred Data" color:', blurredDataColor);
  }
  
  await page.screenshot({ path: 'debug-third-visit.png' });
  
  console.log('🎯 COMPREHENSIVE DEBUG COMPLETE');
  console.log('📊 Final Results:');
  console.log('  - First visit report visible:', reportVisible);
  console.log('  - Second visit report visible:', secondReportVisible);
  console.log('  - Third visit lock visible:', thirdLockVisible);
  console.log('  - Brand color consistency:', brandPrimary === secondBrandPrimary ? '✅' : '❌');
  console.log('  - Expected Tesla red (#CC0000):', brandPrimary === '#CC0000' ? '✅' : '❌');
  console.log('  - CTA button count:', ctaCount);
  console.log('  - Tesla logo count:', logoCount);
});
