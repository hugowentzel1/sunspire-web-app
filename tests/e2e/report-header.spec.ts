import { test, expect } from "@playwright/test";

test("Report header shows new exact text with company param", async ({ page }) => {
  await page.goto("http://localhost:3000/report?company=Acme&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo");
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  const header = page.getByTestId("report-header");
  await expect(header).toBeVisible();
  
  // Check the text contains the key parts
  await expect(header).toContainText("Your Acme Solar Quote");
  await expect(header).toContainText("(Live Preview)");
});

test("Report header uses company name from URL param", async ({ page }) => {
  await page.goto("http://localhost:3000/report?company=Google&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo");
  
  await page.waitForTimeout(2000);
  
  const header = page.getByTestId("report-header");
  await expect(header).toContainText("Your Google Solar Quote");
  await expect(header).toContainText("(Live Preview)");
});

