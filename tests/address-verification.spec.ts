import { test, expect } from "@playwright/test";

const LIVE_BASE =
  process.env.LIVE_BASE || "https://sunspire-web-app.vercel.app";

test.describe("Address Verification", () => {
  test("footer shows new address", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=qa-acme`, {
      waitUntil: "networkidle",
    });

    // Check that the new address appears in the footer
    await expect(
      page.getByText("1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318"),
    ).toBeVisible();

    // Verify old address is not present
    await expect(
      page.getByText("3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305"),
    ).toHaveCount(0);
  });

  test("privacy page shows new address", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/privacy`, { waitUntil: "networkidle" });

    // Check that the new address appears in the privacy page (use first() to handle multiple matches)
    await expect(
      page
        .getByText("1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318")
        .first(),
    ).toBeVisible();

    // Verify old address is not present
    await expect(
      page.getByText("3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305"),
    ).toHaveCount(0);
  });

  test("terms page shows new address", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/terms`, { waitUntil: "networkidle" });

    // Check that the new address appears in the terms page (use first() to handle multiple matches)
    await expect(
      page
        .getByText("1700 Northside Drive Suite A7 #5164 Atlanta, GA 30318")
        .first(),
    ).toBeVisible();

    // Verify old address is not present
    await expect(
      page.getByText("3133 Maple Dr Ne Ste 240 #1156 Atlanta, GA 30305"),
    ).toHaveCount(0);
  });
});
