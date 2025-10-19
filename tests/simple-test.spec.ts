import { test, expect } from '@playwright/test';

test.describe('Simple Test Suite', () => {
  test('Homepage loads', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Demo report page loads', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/report?address=123%20W%20Peachtree%20St%20NW%2C%20Atlanta%2C%20GA%2030309%2C%20USA&runsLeft=0&demo=1');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Paid report page loads', async ({ page, baseURL }) => {
    await page.goto((baseURL ?? '') + '/report?address=123%20W%20Peachtree%20St%20NW%2C%20Atlanta%2C%20GA%2030309%2C%20USA&company=Apple&brandColor=%23FF0000&logo=https%3A%2F%2Flogo.clearbit.com%2Fapple.com');
    await expect(page.locator('h1')).toBeVisible();
  });
});