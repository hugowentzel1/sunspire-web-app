import { test, expect } from '@playwright/test';

const PAID_REPORT = 'http://localhost:3001/report?company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com&demo=0&address=123%20Main%20St%2C%20San%20Francisco%2C%20CA&lat=37.7749&lng=-122.4194';

test('required attributions appear once and near footer', async ({ page }) => {
  await page.goto(PAID_REPORT);
  await page.waitForSelector('text=Data sources:', { timeout: 15000 });

  await expect(page.getByText(/Mapping & location data/i)).toBeVisible();
  const pv = page.getByText(/PVWatts.*registered trademark/i);
  await expect(pv).toBeVisible();
  await expect(pv).toHaveCount(1);
});
