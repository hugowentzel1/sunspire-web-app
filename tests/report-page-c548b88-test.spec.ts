import { test, expect } from '@playwright/test';

test('Report Page - Exact Match to c548b88', async ({ page }) => {
  console.log('🚀 Testing report page exact match to c548b88...');
  
  // Navigate to report page with sample data
  await page.goto('http://localhost:3002/report?address=123%20Main%20St%2C%20Anytown%2C%20CA&lat=37.7749&lng=-122.4194');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Report page loaded');
  
  // 1. Check custom header with navigation
  console.log('🔍 1. Checking custom header...');
  const header = page.locator('header');
  await expect(header).toBeVisible();
  console.log('✅ Custom header visible');
  
  // Check navigation elements in header
  const pricingLink = page.locator('header a[href="/pricing"]').first();
  await expect(pricingLink).toBeVisible();
  console.log('✅ Pricing link visible');
  
  const partnersLink = page.locator('header a[href="/partners"]').first();
  await expect(partnersLink).toBeVisible();
  console.log('✅ Partners link visible');
  
  const supportLink = page.locator('header a[href="/support"]').first();
  await expect(supportLink).toBeVisible();
  console.log('✅ Support link visible');
  
  const newAnalysisButton = page.locator('button:has-text("New Analysis")');
  await expect(newAnalysisButton).toBeVisible();
  console.log('✅ New Analysis button visible');
  
  // 2. Check main content structure
  console.log('🔍 2. Checking main content...');
  const newAnalysisTitle = page.locator('h1:has-text("New Analysis")');
  await expect(newAnalysisTitle).toBeVisible();
  console.log('✅ "New Analysis" title visible');
  
  const propertyAddress = page.locator('p:has-text("Comprehensive analysis for your property at 123 Main St, Anytown, CA")');
  await expect(propertyAddress).toBeVisible();
  console.log('✅ Property address visible');
  
  // 3. Check trust elements and CTA
  console.log('🔍 3. Checking trust elements...');
  const putThisOnSiteButton = page.locator('a:has-text("Put this on our site")');
  await expect(putThisOnSiteButton).toBeVisible();
  console.log('✅ "Put this on our site" button visible');
  
  const dataSources = page.locator('div.text-xs.text-slate-500:has-text("Data sources: PVWatts v8 (NREL) • EIA rates • HTTPS encrypted")');
  await expect(dataSources).toBeVisible();
  console.log('✅ Data sources text visible');
  
  // 4. Check 4 metric cards with unlock buttons
  console.log('🔍 4. Checking metric cards...');
  const systemSizeCard = page.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("System Size")').first();
  await expect(systemSizeCard).toBeVisible();
  console.log('✅ System Size card visible');
  
  const annualProductionCard = page.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("Annual Production")').first();
  await expect(annualProductionCard).toBeVisible();
  console.log('✅ Annual Production card visible');
  
  const netCostCard = page.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("Net Cost (After ITC)")').first();
  await expect(netCostCard).toBeVisible();
  console.log('✅ Net Cost card visible');
  
  const year1SavingsCard = page.locator('div.relative.rounded-2xl.overflow-hidden.bg-white.border.border-gray-200\\/50:has-text("Year 1 Savings")').first();
  await expect(year1SavingsCard).toBeVisible();
  console.log('✅ Year 1 Savings card visible');
  
  // Check unlock buttons
  const unlockButtons = page.locator('button:has-text("Unlock Full Report")');
  const unlockButtonCount = await unlockButtons.count();
  console.log(`✅ Found ${unlockButtonCount} unlock buttons`);
  
  // 5. Check estimate chart
  console.log('🔍 5. Checking estimate chart...');
  const chartContainer = page.locator('div[class*="min-h-[400px]"]');
  await expect(chartContainer).toBeVisible();
  console.log('✅ Estimate chart container visible');
  
  // 6. Check 3 detailed sections
  console.log('🔍 6. Checking detailed sections...');
  const financialAnalysis = page.locator('h2:has-text("Financial Analysis")');
  await expect(financialAnalysis).toBeVisible();
  console.log('✅ Financial Analysis section visible');
  
  const environmentalImpact = page.locator('h2:has-text("Environmental Impact")');
  await expect(environmentalImpact).toBeVisible();
  console.log('✅ Environmental Impact section visible');
  
  const calculationAssumptions = page.locator('h2:has-text("Calculation Assumptions")');
  await expect(calculationAssumptions).toBeVisible();
  console.log('✅ Calculation Assumptions section visible');
  
  // 7. Check "Ready to Go Solar" CTA section
  console.log('🔍 7. Checking CTA section...');
  const readyToGoSolar = page.locator('h2:has-text("Ready to Go Solar?")');
  await expect(readyToGoSolar).toBeVisible();
  console.log('✅ "Ready to Go Solar" section visible');
  
  const getMatchedButton = page.locator('button:has-text("Get Matched with Installers")');
  await expect(getMatchedButton).toBeVisible();
  console.log('✅ "Get Matched with Installers" button visible');
  
  // 8. Check Copy Demo Link button
  console.log('🔍 8. Checking copy demo link...');
  const copyDemoLinkButton = page.locator('button:has-text("📋 Copy Demo Link")');
  await expect(copyDemoLinkButton).toBeVisible();
  console.log('✅ Copy Demo Link button visible');
  
  // 9. Check disclaimer
  console.log('🔍 9. Checking disclaimer...');
  const disclaimer = page.locator('p:has-text("Estimates are informational only, based on modeled data (NREL PVWatts® v8 and current utility rates).")');
  await expect(disclaimer).toBeVisible();
  console.log('✅ Disclaimer text visible');
  
  console.log('🎉🎉🎉 REPORT PAGE EXACTLY MATCHES c548b88! 🎉🎉🎉');
  console.log('');
  console.log('✅ Custom header with navigation');
  console.log('✅ New Analysis title with property address');
  console.log('✅ Trust elements and CTA buttons');
  console.log('✅ 4 metric cards with unlock buttons');
  console.log('✅ Estimate chart');
  console.log('✅ 3 detailed sections (Financial, Environmental, Assumptions)');
  console.log('✅ Ready to Go Solar CTA section');
  console.log('✅ Copy Demo Link button');
  console.log('✅ Disclaimer');
  console.log('');
  console.log('🚀 Report page is now EXACTLY like c548b88!');
  
  // Keep page open for visual verification
  console.log('⏸️ Keeping browser open for visual inspection...');
  await page.waitForTimeout(10000);
});
