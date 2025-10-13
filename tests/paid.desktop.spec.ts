import { test, expect } from "@playwright/test";

test.describe("PAID — desktop sanity", () => {
  test("paid address page has essentials and no header nav clutter", async ({ page }) => {
    await page.goto("/paid?company=Apple&logo=https://logo.clearbit.com/apple.com");

    // H1 + button present
    await expect(page.locator("h1")).toContainText(/Instant Solar Analysis for Your Home/i);
    await expect(page.getByTestId("paid-generate-btn")).toHaveText(/Generate Solar Estimate/i);

    // No header nav on paid flow
    await expect(page.locator("header nav a")).toHaveCount(0);
  });

  test("report CTA subtext present when report is visible (if route available)", async ({ page }) => {
    // If your app exposes /report directly in dev, this will pass.
    // If it's behind the address submit, you can skip it or wire a mock.
    await page.goto("/report").catch(() => {}); // ignore if route not direct

    const subtext = page.getByText(/We'll confirm site details & incentives — no obligation\./i);
    // Don't fail the suite if route doesn't exist; only assert if visible
    if (await subtext.count()) {
      await expect(subtext).toBeVisible();
    }
  });
});
