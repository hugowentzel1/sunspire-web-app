import { test, expect } from "@playwright/test";

test("Report header shows new exact text with company param", async ({ page }) => {
  await page.goto("/report?company=Acme&demo=1");
  const h1 = page.locator("h1").first();
  await expect(h1).toHaveText("Your Acme Solar Quote (Live Preview)");
});

test("Report header shows default company when no param", async ({ page }) => {
  await page.goto("/report?demo=1");
  const h1 = page.locator("h1").first();
  await expect(h1).toHaveText("Your Company Solar Quote (Live Preview)");
});