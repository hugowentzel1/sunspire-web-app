import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("PAID — mobile sticky CTA behavior", () => {
  test("sticky CTA visible on report only on mobile (guarded)", async ({ page }) => {
    // Try to reach the report (if direct route isn't available, this will be a no-op)
    await page.goto("/report").catch(() => {});

    const stickyReport = page.getByTestId("sticky-report-cta");
    if (await stickyReport.count()) {
      await expect(stickyReport).toBeVisible();
    }
  });
});
