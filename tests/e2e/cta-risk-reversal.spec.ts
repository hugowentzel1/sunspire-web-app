import { test, expect } from "@playwright/test";

test("Home page demo CTA has risk-reversal text", async ({ page }) => {
  await page.goto("http://localhost:3000/?company=Google&demo=1");
  
  await page.waitForTimeout(2000);
  
  // Check for the inline risk reversal text (not the component, the actual text)
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance.first()).toBeVisible();
});

test("Home page bottom CTA has risk-reversal text", async ({ page }) => {
  await page.goto("http://localhost:3000/?company=Google&demo=1");
  
  await page.waitForTimeout(2000);
  
  // Should have the text inline with pricing
  const bottomSection = page.locator('text=$99/mo + $399 setup • 14-day money-back guarantee. Cancel anytime.').last();
  await expect(bottomSection).toBeVisible();
});

test("Report page bottom CTA has risk-reversal text", async ({ page }) => {
  await page.goto("http://localhost:3000/report?company=Google&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo");
  
  await page.waitForTimeout(3000);
  
  // Check bottom CTA band has the risk reversal
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance).toBeVisible();
});

test("Pricing page has risk-reversal text", async ({ page }) => {
  await page.goto("http://localhost:3000/pricing?company=Google&demo=1");
  
  await page.waitForTimeout(2000);
  
  const reassurance = page.locator("text=14-day money-back guarantee. Cancel anytime.");
  await expect(reassurance).toBeVisible();
});

