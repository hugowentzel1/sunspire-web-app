import { test, expect } from "@playwright/test";

test("Home hero purchase CTA has risk-reversal", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("button", { name: /Start Activation.*Demo Expires Soon/i });
  await expect(cta).toBeVisible();
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance).toBeVisible();
});

test("Pricing page purchase CTA has risk-reversal", async ({ page }) => {
  await page.goto("/pricing");
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance).toBeVisible();
});

test("Report page has risk-reversal under CTAs", async ({ page }) => {
  await page.goto("/report?company=Meta&demo=1");
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance).toBeVisible();
});