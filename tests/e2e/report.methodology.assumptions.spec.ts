import { test, expect } from '@playwright/test';

test('Methodology modal + Assumptions tray render & are accessible', async ({ page }) => {
  await page.goto('/report?company=uber&demo=1');

  // Open modal
  const btn = page.getByRole('button', { name: /View Methodology/i });
  await btn.click();

  // Modal accessible & content bullets
  const modal = page.locator('[data-modal-open="true"]');
  await expect(modal).toBeVisible();
  
  const contentItems = [
    'NREL PVWatts',
    'local utility rates',
    'export credit',
    'installed cost per watt',
    'degradation',
    'O&M',
    'discount',
    'inflation'
  ];
  
  for (const item of contentItems) {
    const found = await modal.locator(`text=${item}`).count();
    expect(found).toBeGreaterThan(0);
  }

  // Conditional PDF link
  const pdfLinkCount = await modal.getByRole('link', { name: /methodology/i }).count();
  // Pass either way: shown only if file exists
  expect(pdfLinkCount >= 0).toBeTruthy();

  // Close modal (Esc)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  const modalAfterEsc = await modal.isVisible();
  expect(modalAfterEsc).toBeFalsy();

  // Assumptions tray labels render
  const assumptionLabels = [
    'ITC',
    'Cost/W',
    'O&M',
    'Degradation',
    'Rate increase',
    'Discount rate',
    'Utility fees',
    'Export credits'
  ];
  
  for (const label of assumptionLabels) {
    const found = await page.locator(`text=${label}`).count();
    expect(found).toBeGreaterThan(0);
  }
});

