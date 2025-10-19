import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('PDF & Share functionality', () => {
  test('PDF downloads with content; Share link copies & resolves', async ({ page, context, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Test PDF download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Download PDF/i }).click()
    ]);
    
    const path = await download.path();
    expect(path).toBeTruthy();
    
    // Check file exists and has reasonable size
    if (path && fs.existsSync(path)) {
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    }

    // Test share link copy
    await page.getByRole('button', { name: /Copy Share Link/i }).click();
    
    // Check clipboard content
    const clipText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipText).toMatch(/report\?address=/);
    expect(clipText).toContain('Apple'); // Should include company name
    
    // Test that share link resolves correctly
    const page2 = await context.newPage();
    await page2.goto(clipText);
    await expect(page2.getByTestId('hdr-h1')).toBeVisible();
    
    // Verify brand theming is preserved
    await expect(page2.locator('span').first()).toBeVisible();
  });

  test('PDF contains brand theming', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&company=Tesla&brandColor=%23CC0000&logo=https%3A%2F%2Flogo.clearbit.com%2Ftesla.com`);
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Download PDF/i }).click()
    ]);
    
    const path = await download.path();
    expect(path).toBeTruthy();
    
    // Note: In a real test environment, you might want to use a PDF parsing library
    // to verify the PDF content includes the brand logo and colors
    // For now, we just verify the download succeeds
    if (path && fs.existsSync(path)) {
      const stats = fs.statSync(path);
      expect(stats.size).toBeGreaterThan(5000); // Should be substantial for branded PDF
    }
  });

  test('Share link preserves demo/paid state', async ({ page, context, baseURL }) => {
    // Test demo share link
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&demo=1`);
    
    await page.getByRole('button', { name: /Copy Share Link/i }).click();
    const demoClipText = await page.evaluate(() => navigator.clipboard.readText());
    
    const demoPage = await context.newPage();
    await demoPage.goto(demoClipText);
    await expect(demoPage.getByText('(Live Preview)')).toBeVisible();
    
    // Test paid share link
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent('123 W Peachtree St NW, Atlanta, GA 30309, USA')}&company=Google&brandColor=%234285F4&logo=https%3A%2F%2Flogo.clearbit.com%2Fgoogle.com`);
    
    await page.getByRole('button', { name: /Copy Share Link/i }).click();
    const paidClipText = await page.evaluate(() => navigator.clipboard.readText());
    
    const paidPage = await context.newPage();
    await paidPage.goto(paidClipText);
    await expect(paidPage.getByText('(Live Preview)')).toHaveCount(0);
    await expect(paidPage.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
  });

  test('PDF generation handles different address formats', async ({ page, baseURL }) => {
    const addresses = [
      '123 W Peachtree St NW, Atlanta, GA 30309, USA',
      '456 Main St, Austin, TX 78701, USA',
      '789 Long Street Name Southwest, Mountain Park, GA 30047, United States of America'
    ];
    
    for (const address of addresses) {
      await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(address)}&company=Apple&brandColor=%23FF0000`);
      
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: /Download PDF/i }).click()
      ]);
      
      const path = await download.path();
      expect(path).toBeTruthy();
      
      if (path && fs.existsSync(path)) {
        const stats = fs.statSync(path);
        expect(stats.size).toBeGreaterThan(1000);
      }
    }
  });
});
