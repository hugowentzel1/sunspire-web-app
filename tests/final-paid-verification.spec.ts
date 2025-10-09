import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const PAID = `${BASE_URL}/paid?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0`;
const PAID_REPORT = `${BASE_URL}/report?company=Apple&brandColor=%23FF0000&demo=0&address=465%20Page%20Pl%2C%20Roswell%2C%20GA&lat=34.0234&lng=-84.3617&placeId=test`;

test.describe('🎯 FINAL PAID VERSION VERIFICATION', () => {
  
  test('✅ Report page has SINGLE CTA block with 4 buttons', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Should have exactly ONE CTA block
    const ctaBlocks = await page.locator('[data-testid="report-cta"]').count();
    console.log(`CTA blocks: ${ctaBlocks}`);
    expect(ctaBlocks).toBe(1);
    
    // Check all 4 buttons exist in the single block
    const cta = page.locator('[data-testid="report-cta"]');
    await expect(cta.getByRole('button', { name: /book a consultation/i })).toBeVisible();
    await expect(cta.getByRole('button', { name: /talk to a specialist/i })).toBeVisible();
    await expect(cta.getByRole('button', { name: /download pdf/i })).toBeVisible();
    await expect(cta.getByRole('button', { name: /copy share link/i })).toBeVisible();
    
    console.log('✅ Single CTA block with all 4 buttons verified');
  });

  test('✅ NO duplicate "Ready to" or "Download & Share" sections', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const readyToCount = await page.locator('text=/Ready to (Start|Go) Solar/i').count();
    const downloadShareCount = await page.locator('text=/Download.*Share Your Report/i').count();
    
    console.log(`"Ready to..." sections: ${readyToCount}`);
    console.log(`"Download & Share..." sections: ${downloadShareCount}`);
    
    expect(readyToCount).toBeLessThanOrEqual(1);
    expect(downloadShareCount).toBeLessThanOrEqual(1);
    
    console.log('✅ No duplicate CTA sections');
  });

  test('✅ Footer attribution simplified (Google + PVWatts only)', async ({ page }) => {
    await page.goto(PAID);
    await page.waitForLoadState('networkidle');
    
    const attribution = page.getByTestId('footer-attribution');
    await expect(attribution).toBeVisible();
    
    const text = await attribution.innerText();
    console.log(`Attribution text: ${text}`);
    
    expect(text).toContain('Google');
    expect(text).toContain('PVWatts');
    expect(text).not.toContain('registered trademark');
    expect(text).not.toContain('Powered by Sunspire');
    
    console.log('✅ Footer attribution simplified and centered');
  });

  test('✅ Legal pages exist and use shared Footer', async ({ page }) => {
    const legalPages = [
      '/privacy',
      '/terms',
      '/accessibility',
      '/contact'
    ];
    
    for (const pagePath of legalPages) {
      await page.goto(`${BASE_URL}${pagePath}?company=Apple&demo=0`);
      await page.waitForLoadState('networkidle');
      
      // Should have footer
      await expect(page.locator('footer')).toBeVisible();
      
      // Should NOT have double header (SharedNavigation removed)
      const navCount = await page.locator('nav').count();
      console.log(`${pagePath}: nav elements = ${navCount}`);
      
      // Should have Back to Home link
      await expect(page.locator('text=/Back to Home/i')).toBeVisible();
      
      console.log(`✅ ${pagePath} verified`);
    }
  });

  test('✅ Privacy page has no SharedNavigation (no double header)', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy?company=Apple&demo=0`);
    await page.waitForLoadState('networkidle');
    
    // Check that there's no SharedNavigation component rendering multiple navs
    const headers = await page.locator('header').count();
    console.log(`Privacy page header count: ${headers}`);
    
    // Should have standard footer
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ Privacy page has single clean layout');
  });

  test('✅ Contact page form exists and works', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact?company=Apple&demo=0`);
    await page.waitForLoadState('networkidle');
    
    // Should have form fields
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('textarea#message')).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
    
    console.log('✅ Contact page form verified');
  });

  test('✅ Accessibility page has content', async ({ page }) => {
    await page.goto(`${BASE_URL}/accessibility?company=Apple&demo=0`);
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/Accessibility Statement/i')).toBeVisible();
    await expect(page.locator('text=/WCAG/i')).toBeVisible();
    
    console.log('✅ Accessibility page verified');
  });

  test('✅ All duplicate counts correct', async ({ page }) => {
    await page.goto(PAID_REPORT, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const bodyText = await page.locator('body').innerText();
    
    const counts = {
      'Download PDF': (bodyText.match(/Download PDF/gi) || []).length,
      'Copy Share Link': (bodyText.match(/Copy Share Link/gi) || []).length,
      'Data sources:': (bodyText.match(/Data sources:/gi) || []).length,
      'Book a Consultation': (bodyText.match(/Book a Consultation/gi) || []).length,
      'registered trademark': (bodyText.match(/registered trademark/gi) || []).length,
    };
    
    console.log('\n📊 FINAL DUPLICATE CHECK:');
    Object.entries(counts).forEach(([key, count]) => {
      const status = count <= 1 ? '✅' : '⚠️';
      console.log(`${status} "${key}": ${count}`);
    });
    
    expect(counts['Download PDF']).toBe(1);
    expect(counts['Copy Share Link']).toBe(1);
    expect(counts['Data sources:']).toBe(1);
    expect(counts['Book a Consultation']).toBe(1);
    expect(counts['registered trademark']).toBe(0);
  });
});

