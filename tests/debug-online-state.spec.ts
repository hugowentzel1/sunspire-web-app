import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://sunspire-web-app.vercel.app';

test.describe('Debug Online State', () => {
  test('Check refund page status', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/refund`);
    console.log('Refund page status:', response?.status());
    
    if (response?.status() === 200) {
      const content = await page.textContent('body');
      console.log('Refund page content preview:', content?.substring(0, 200));
    }
  });

  test('Check terms page for last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/terms`);
    
    const lastUpdatedElements = page.getByText(/Last updated/i);
    const count = await lastUpdatedElements.count();
    console.log('Last updated text count:', count);
    
    if (count > 0) {
      const text = await lastUpdatedElements.first().textContent();
      console.log('Last updated text:', text);
    }
  });

  test('Check privacy page for last updated text', async ({ page }) => {
    await page.goto(`${LIVE_URL}/privacy`);
    
    const lastUpdatedElements = page.getByText(/Last updated/i);
    const count = await lastUpdatedElements.count();
    console.log('Privacy page - Last updated text count:', count);
    
    if (count > 0) {
      const text = await lastUpdatedElements.first().textContent();
      console.log('Privacy page - Last updated text:', text);
    }
  });

  test('Check footer for refunds link', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    
    const refundsLinks = page.getByRole('link', { name: 'Refunds' });
    const count = await refundsLinks.count();
    console.log('Refunds link count in footer:', count);
    
    if (count > 0) {
      const href = await refundsLinks.first().getAttribute('href');
      console.log('Refunds link href:', href);
    }
  });

  test('Take screenshot of homepage', async ({ page }) => {
    await page.goto(`${LIVE_URL}/?company=Apple&demo=1`);
    await page.screenshot({ path: 'homepage-current.png', fullPage: true });
    console.log('Screenshot saved as homepage-current.png');
  });

  test('Take screenshot of terms page', async ({ page }) => {
    await page.goto(`${LIVE_URL}/terms`);
    await page.screenshot({ path: 'terms-current.png', fullPage: true });
    console.log('Screenshot saved as terms-current.png');
  });
});
