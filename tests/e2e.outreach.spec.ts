import { test, expect } from "@playwright/test";

test("outreach slug redirects to branded demo", async ({ page }) => {
  const base = process.env.E2E_BASE_URL || "http://localhost:3000";
  await page.goto(`${base}/o/testco-abc123`);
  await page.waitForURL(new RegExp(`${base}/\\?company=testco.*demo=1`));
  // Assert brand markers (adjust selectors to your UI)
  await expect(page.getByTestId("company-badge")).toHaveText(/testco/i);
  await expect(page.getByTestId("cta-primary")).toBeVisible();
});
