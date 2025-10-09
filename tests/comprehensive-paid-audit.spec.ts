import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const PAID = `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0`;
const PAID_REPORT = `${BASE_URL}/report?company=Apple&brandColor=%23FF0000&demo=0&address=465%20Page%20Pl%2C%20Roswell%2C%20GA&lat=34.0234&lng=-84.3617&placeId=test`;

test.describe('🔍 COMPREHENSIVE PAID VERSION AUDIT', () => {
  
  test('✅ REMOVE/HIDE: Pricing/Partners/Support nav (paid)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header, nav').first();
    await expect(header.getByRole('link', { name: /Pricing/i })).toHaveCount(0);
    await expect(header.getByRole('link', { name: /Partners/i })).toHaveCount(0);
    await expect(header.getByRole('link', { name: /Support/i })).toHaveCount(0);
    console.log('✅ B2B nav items hidden');
  });

  test('✅ REMOVE/HIDE: Activation/pricing copy ($99/mo, $399, etc)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Activate on Your Domain/i')).toHaveCount(0);
    await expect(page.locator('text=/\\$99.*mo/i')).toHaveCount(0);
    await expect(page.locator('text=/\\$399.*setup/i')).toHaveCount(0);
    await expect(page.locator('text=/14-day refund/i')).toHaveCount(0);
    await expect(page.locator('text=/\\$2,500.*mo/i')).toHaveCount(0);
    console.log('✅ Pricing/activation copy hidden');
  });

  test('✅ REMOVE/HIDE: Demo ribbon', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Exclusive preview built for/i')).toHaveCount(0);
    await expect(page.locator('text=/Launch on/i')).toHaveCount(0);
    console.log('✅ Demo ribbon hidden');
  });

  test('✅ REMOVE/HIDE: Unlock/blur gates on report', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Unlock Full Report/i')).toHaveCount(0);
    await expect(page.locator('.blur-layer')).toHaveCount(0);
    console.log('✅ No unlock gates/blurs');
  });

  test('✅ REMOVE/HIDE: Sunspire support/billing emails (paid footer)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer.locator('text=/support@getsunspire/i')).toHaveCount(0);
    await expect(footer.locator('text=/billing@getsunspire/i')).toHaveCount(0);
    console.log('✅ Sunspire contact info hidden');
  });

  test('✅ ADD: Address reassurance text', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/We only use your address to estimate sun, rates, and savings.*Nothing is shared/i')).toBeVisible();
    console.log('✅ Address reassurance present');
  });

  test('✅ ADD: Compact trust strip beneath CTA', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Industry-standard modeling.*NREL PVWatts.*v8.*Local utility rates.*Private/i')).toBeVisible();
    console.log('✅ Compact trust strip present');
  });

  test('✅ ADD: Report top CTAs (Book + Talk)', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByTestId('paid-cta-top')).toBeVisible();
    await expect(page.getByText(/Book a Consultation/i).first()).toBeVisible();
    await expect(page.getByText(/Talk to a Specialist/i).first()).toBeVisible();
    console.log('✅ Top CTAs present');
  });

  test('✅ ADD: Report bottom CTAs', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByTestId('paid-cta-bottom')).toBeVisible();
    console.log('✅ Bottom CTAs present');
  });

  test('✅ ADD: Mobile sticky CTA', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    const stickyCTA = page.getByTestId('mobile-sticky-cta');
    const count = await stickyCTA.count();
    expect(count).toBe(1);
    console.log('✅ Mobile sticky CTA present');
  });

  test('✅ ADD: Tooltips on result tiles', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    // Net Cost tooltip
    const itcTooltip = await page.locator('text=/Includes 30%.*federal.*investment.*tax credit/i').count();
    expect(itcTooltip).toBeGreaterThan(0);
    
    // Year-1 Savings tooltip
    const savingsTooltip = await page.locator('text=/Based on current local utility rate.*modeled production/i').count();
    expect(savingsTooltip).toBeGreaterThan(0);
    
    console.log('✅ Tooltips present on tiles');
  });

  test('✅ KEEP ONE: Download PDF / Copy Link section', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    const downloadButtons = await page.locator('text=/Download.*PDF/i').count();
    const copyButtons = await page.locator('text=/Copy.*Share.*Link/i').count();
    
    expect(downloadButtons).toBe(1);
    expect(copyButtons).toBe(1);
    console.log('✅ Single Download/Share section');
  });

  test('✅ KEEP ONE: Data sources footnote', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    const dataSourcesLine = page.getByTestId('data-sources-line');
    await expect(dataSourcesLine).toBeVisible();
    await expect(dataSourcesLine.locator('text=/Data sources:.*NREL PVWatts.*v8.*Google Maps.*Last validated/i')).toBeVisible();
    
    // Should only be ONE data-sources line on report page (not in footer)
    const allDataSources = await page.locator('text=/Data sources:/i').count();
    expect(allDataSources).toBe(1);
    console.log('✅ Single data sources line');
  });

  test('✅ ADD: Footer legal links (paid)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer.locator('a, button').filter({ hasText: /Privacy Policy/i })).toBeVisible();
    await expect(footer.locator('a, button').filter({ hasText: /Terms of Service/i })).toBeVisible();
    await expect(footer.locator('a, button').filter({ hasText: /Cookie Preferences/i })).toBeVisible();
    await expect(footer.locator('a, button').filter({ hasText: /Accessibility/i })).toBeVisible();
    await expect(footer.locator('a, button').filter({ hasText: /Contact/i })).toBeVisible();
    console.log('✅ Footer legal links present');
  });

  test('✅ ADD: Footer attribution row', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const attribution = page.getByTestId('footer-attribution');
    await expect(attribution).toBeVisible();
    await expect(attribution.locator('text=/Mapping.*location data.*Google/i')).toBeVisible();
    await expect(attribution.locator('text=/Estimates generated using NREL PVWatts.*v8/i')).toBeVisible();
    await expect(attribution.locator('text=/PVWatts.*registered trademark.*Alliance for Sustainable Energy/i')).toBeVisible();
    await expect(attribution.locator('text=/Powered by Sunspire/i')).toBeVisible();
    console.log('✅ Footer attribution complete');
  });

  test('✅ VERIFY: No CPRA link (default)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('link', { name: /Do Not Sell or Share/i })).toHaveCount(0);
    console.log('✅ CPRA link hidden by default');
  });

  test('✅ VERIFY: Cookie banner hidden (default)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const acceptBtn = await page.getByRole('button', { name: /Accept/i }).count();
    const rejectBtn = await page.getByRole('button', { name: /Reject/i }).count();
    expect(acceptBtn + rejectBtn).toBe(0);
    console.log('✅ Cookie banner hidden by default');
  });

  test('✅ VERIFY: View Methodology present', async ({ page }) => {
    await page.goto(PAID_REPORT);
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/View Methodology/i)).toBeVisible();
    console.log('✅ View Methodology button present');
  });

  test('✅ VERIFY: Google attribution in footer', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Mapping.*Google|Map data.*Google/i')).toBeVisible();
    console.log('✅ Google attribution in footer');
  });
});
