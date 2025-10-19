import { test, expect } from '@playwright/test';
import { addrs, tenancies } from './_utils';

test.describe('Paid visibility & CTA panel', () => {
  test('All sections visible; no blur; CTA row present', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.paid(addrs.short));

    // No blurred content
    await expect(page.locator('.blur-sm, .blur-md, .blur-lg')).toHaveCount(0);

    // Key sections visible (Savings chart & tables)
    await expect(page.locator('[data-testid*="chart"], [data-testid*="savings"]').first()).toBeVisible();
    await expect(page.locator('[data-testid*="financial"], [data-testid*="table"]').first()).toBeVisible();
    await expect(page.locator('[data-testid*="environmental"], [data-testid*="eco"]').first()).toBeVisible();
    await expect(page.locator('[data-testid*="assumptions"], [data-testid*="methodology"]').first()).toBeVisible();

    // Bottom CTA panel buttons
    await expect(page.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Talk to a Specialist/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Share Link/i })).toBeVisible();
  });

  test('CTA block spacing consistent', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.paid(addrs.short));
    const financialSection = page.locator('[data-testid="report-cta-footer"], .report-cta-footer').first();
    
    const book = page.getByRole('button', { name: /Book a Consultation/i });
    const talk = page.getByRole('button', { name: /Talk to a Specialist/i });
    const pdf = page.getByRole('button', { name: /Download PDF/i });
    const share = page.getByRole('button', { name: /Copy Share Link/i });

    // Check that buttons are properly spaced and aligned
    const topButtons = [book, talk];
    const bottomButtons = [pdf, share];

    // Verify top buttons are horizontally aligned
    const bookBox = await book.boundingBox();
    const talkBox = await talk.boundingBox();
    expect(Math.abs((bookBox?.y || 0) - (talkBox?.y || 0))).toBeLessThanOrEqual(5);

    // Verify bottom buttons are horizontally aligned
    const pdfBox = await pdf.boundingBox();
    const shareBox = await share.boundingBox();
    expect(Math.abs((pdfBox?.y || 0) - (shareBox?.y || 0))).toBeLessThanOrEqual(5);

    // Verify proper vertical spacing between top and bottom rows
    const topRowY = Math.min(bookBox?.y || 0, talkBox?.y || 0);
    const bottomRowY = Math.min(pdfBox?.y || 0, shareBox?.y || 0);
    const verticalGap = bottomRowY - topRowY;
    expect(verticalGap).toBeGreaterThan(40); // Should have reasonable spacing
    expect(verticalGap).toBeLessThan(120); // But not too much
  });

  test('Paid-only features - no demo elements', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.paid(addrs.short));
    
    // Should NOT show demo-specific elements
    await expect(page.getByText('(Live Preview)')).toHaveCount(0);
    await expect(page.getByText(/Preview:/)).toHaveCount(0);
    await expect(page.getByText(/runs left/)).toHaveCount(0);
    await expect(page.getByText(/Expires in/)).toHaveCount(0);
    
    // Should NOT show unlock buttons
    await expect(page.getByRole('button', { name: /Unlock Full Report/i })).toHaveCount(0);
    
    // Should show paid features
    await expect(page.getByRole('button', { name: /Book a Consultation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
  });

  test('Brand theming applied correctly', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.paid(addrs.short));
    
    // Check that brand color is applied to primary CTA button
    const bookButton = page.getByRole('button', { name: /Book a Consultation/i });
    const buttonColor = await bookButton.evaluate((n: HTMLElement) => getComputedStyle(n).backgroundColor);
    
    // Should not be default gray/white
    expect(buttonColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(buttonColor).not.toContain('rgb(107, 114, 128)'); // gray-500
    
    // Company name in header should have brand color
    const h1 = page.getByTestId('hdr-h1');
    const brandSpan = h1.locator('span');
    const brandColor = await brandSpan.evaluate((n: HTMLElement) => getComputedStyle(n).color);
    expect(brandColor).not.toBe('rgb(0, 0, 0)'); // Should be brand color, not black
  });
});
