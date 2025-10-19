import { test, expect } from '@playwright/test';
import { addrs, tenancies } from './_utils';

test.describe('Demo gating & preview mechanics', () => {
  test('Preview runs left + blur + unlock CTAs', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.demo(addrs.medium));

    // Meta rows & preview span as one color segment
    const runs = page.getByTestId('meta-runs');
    await expect(runs.locator('span')).toHaveCount(1);
    await expect(runs).toContainText(/run/);

    // Blurred cards present; Unlock CTAs visible
    await expect(page.locator('.blur-sm, .blur-md, .blur-lg').first()).toBeVisible();
    const unlockButtons = page.getByRole('button', { name: /Unlock Full Report/i });
    await expect(unlockButtons.first()).toBeVisible();

    // Countdown present with tabular digits
    const expires = page.getByTestId('meta-expires');
    const fv = await expires.evaluate((n: HTMLElement) => getComputedStyle(n).fontVariantNumeric);
    expect(fv).toMatch(/tabular-nums/);

    // Demo-specific elements present
    await expect(page.getByText('(Live Preview)')).toBeVisible();
    await expect(page.getByText(/Preview:/)).toBeVisible();
    await expect(page.getByText(/Expires in/)).toBeVisible();
  });

  test('Unlock routes to paywall preserving address context', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.demo(addrs.short));
    await page.getByRole('button', { name: /Unlock Full Report/i }).first().click();
    
    // Should redirect to paywall/checkout with address preserved
    await expect(page).toHaveURL(/checkout|pricing|paywall/i);
    await expect(page).toHaveURL(new RegExp(encodeURIComponent('Peachtree')));
  });

  test('Run limit enforcement', async ({ page, baseURL }) => {
    // Test with runsLeft=0
    await page.goto((baseURL ?? '') + `/report?address=${encodeURIComponent(addrs.short)}&runsLeft=0&demo=1`);
    
    // Should show 0 runs left
    await expect(page.getByText(/Preview: 0 runs left/)).toBeVisible();
    
    // Cards should be blurred
    await expect(page.locator('.blur-sm, .blur-md, .blur-lg').first()).toBeVisible();
    
    // Unlock buttons should be present
    await expect(page.getByRole('button', { name: /Unlock Full Report/i }).first()).toBeVisible();
  });

  test('Demo restrictions - no paid features visible', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + tenancies.demo(addrs.short));
    
    // Should NOT show paid-only elements
    await expect(page.getByRole('button', { name: /Book a Consultation/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Download PDF/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Copy Share Link/i })).toHaveCount(0);
    
    // Should show demo-specific elements
    await expect(page.getByText('(Live Preview)')).toBeVisible();
    await expect(page.getByText(/Preview:/)).toBeVisible();
  });
});
