import { test, expect } from '@playwright/test';

test('Test Demo Runs and Visual Consistency', async ({ page }) => {
  console.log('🔍 Testing demo runs and visual consistency...');
  
  const testUrl = 'https://sunspire-web-app.vercel.app/report?address=1&lat=40.7128&lng=-74.0060&placeId=demo&company=Tesla&demo=1';
  
  // Clear any existing quota
  await page.goto('https://sunspire-web-app.vercel.app/');
  await page.evaluate(() => {
    localStorage.removeItem('demo_quota_v3');
  });
  
  console.log('🔍 FIRST VISIT - Should show report with Tesla branding');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(12000); // Wait for quota consumption
  
  // Check first visit
  const firstQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 First visit quota:', firstQuota);
  
  const firstReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 First visit - Report visible:', firstReportVisible);
  
  // Check Tesla branding on first visit
  const firstBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('🎨 First visit - Brand color:', firstBrandColor);
  
  const firstCtaButtons = page.locator('[data-cta="primary"]');
  const firstCtaCount = await firstCtaButtons.count();
  console.log('📊 First visit - CTA button count:', firstCtaCount);
  
  if (firstCtaCount > 0) {
    const firstCtaStyle = await firstCtaButtons.first().evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    console.log('🎨 First visit - CTA button style:', firstCtaStyle);
  }
  
  // Take screenshot of first visit
  await page.screenshot({ path: 'demo-first-visit.png' });
  
  console.log('🔍 SECOND VISIT - Should show report again with same Tesla branding');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(12000); // Wait for quota consumption
  
  // Check second visit
  const secondQuota = await page.evaluate(() => {
    const quota = localStorage.getItem('demo_quota_v3');
    return quota ? JSON.parse(quota) : null;
  });
  console.log('📊 Second visit quota:', secondQuota);
  
  const secondReportVisible = await page.locator('text=Your Solar Savings Over Time').isVisible();
  console.log('📊 Second visit - Report visible:', secondReportVisible);
  
  // Check Tesla branding on second visit
  const secondBrandColor = await page.evaluate(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-primary');
  });
  console.log('🎨 Second visit - Brand color:', secondBrandColor);
  
  const secondCtaButtons = page.locator('[data-cta="primary"]');
  const secondCtaCount = await secondCtaButtons.count();
  console.log('📊 Second visit - CTA button count:', secondCtaCount);
  
  if (secondCtaCount > 0) {
    const secondCtaStyle = await secondCtaButtons.first().evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    console.log('🎨 Second visit - CTA button style:', secondCtaStyle);
  }
  
  // Take screenshot of second visit
  await page.screenshot({ path: 'demo-second-visit.png' });
  
  console.log('🔍 THIRD VISIT - Should show lock overlay with red elements');
  await page.goto(testUrl);
  await page.waitForLoadState('networkidle');
  
  // Check third visit
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
    console.log('🎨 Third visit - "What You See Now" color:', whatYouSeeNowColor);
    
    const blurredData = page.locator('text=Blurred Data');
    const blurredDataColor = await blurredData.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log('🎨 Third visit - "Blurred Data" color:', blurredDataColor);
  }
  
  // Take screenshot of third visit
  await page.screenshot({ path: 'demo-third-visit.png' });
  
  console.log('🎯 DEMO RUNS AND CONSISTENCY TEST COMPLETE');
  console.log('📊 Results:');
  console.log('  - First visit report visible:', firstReportVisible);
  console.log('  - Second visit report visible:', secondReportVisible);
  console.log('  - Third visit lock visible:', thirdLockVisible);
  console.log('  - Quota progression:', firstQuota, '->', secondQuota, '->', thirdQuota);
  console.log('  - Brand color consistency:', firstBrandColor === secondBrandColor ? '✅' : '❌');
  console.log('  - CTA button count consistency:', firstCtaCount === secondCtaCount ? '✅' : '❌');
});
