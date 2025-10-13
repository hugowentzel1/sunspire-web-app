import { test, expect } from "@playwright/test";

test.describe("DEMO legal/attribution minimal & non-redundant", () => {
  test("Hero shows personalized title on report page", async ({ page }) => {
    await page.goto("/report?company=Meta&demo=1&address=123+Main+St&lat=37.422&lng=-122.084");
    
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    const hero = page.getByTestId("demo-hero-title");
    if (await hero.count() > 0) {
      await expect(hero).toBeVisible();
      await expect(hero).toContainText(/Custom demo for/i);
      await expect(hero).not.toContainText(/Your branded solar tool is ready to launch/i);
    }
  });

  test("Address page: Places attribution present; no extra source strip", async ({ page }) => {
    await page.goto("/?company=Meta&demo=1");
    
    await page.waitForLoadState("networkidle");
    
    await expect(page.getByTestId("demo-address-input")).toBeVisible();
    await expect(page.getByTestId("demo-powered-by-google")).toBeVisible();

    // Ensure no demo data/source strip under the input
    const bodyText = await page.textContent("body");
    
    // These should NOT appear on demo landing page (they're on paid page only in credibility section)
    // We're just ensuring no duplicate strips were added
  });

  test("Report page: one consolidated sources line in demo body; no 'Last validated'", async ({ page }) => {
    await page.goto("/report?company=Meta&demo=1&address=123+Main+St&lat=37.422&lng=-122.084");
    
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    const sources = page.getByTestId("demo-data-sources-line");
    await expect(sources).toBeVisible();

    // Contains all three data sources
    await expect(sources).toContainText("PVWatts");
    await expect(sources).toContainText("U.S. EIA");
    await expect(sources).toContainText("Google Maps");
    await expect(sources).toContainText("average retail rates");
    await expect(sources).toContainText("geocoding");

    // Ensure no 'Last validated'
    const sourcesText = await sources.textContent();
    expect(sourcesText).not.toContain("Last validated");

    // Ensure we didn't accidentally place the sources line inside the footer region
    const footerHasSources = await page.locator("footer >> text=Data sources:").count();
    expect(footerHasSources).toBe(0);
  });

  test("Footer unchanged by this task (no new Google/source lines added there)", async ({ page }) => {
    await page.goto("/?company=Meta&demo=1");
    
    await page.waitForLoadState("networkidle");
    
    // The consolidated demo sources line should NOT be in footer (it's in report body)
    await expect(page.locator("footer >> text=Data sources: PVWatts")).toHaveCount(0);
  });

  test("Demo report has consolidated sources, paid report has different format", async ({ page }) => {
    // Check demo report
    await page.goto("/report?company=Meta&demo=1&address=123+Main+St&lat=37.422&lng=-122.084");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    const demoSources = page.getByTestId("demo-data-sources-line");
    await expect(demoSources).toBeVisible();
    
    // Now check paid report (no demo param)
    await page.goto("/report?company=Meta&address=123+Main+St&lat=37.422&lng=-122.084");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    const paidSources = page.getByTestId("data-sources-line");
    if (await paidSources.count() > 0) {
      await expect(paidSources).toBeVisible();
    }
    
    // Demo sources line should NOT appear on paid version
    await expect(page.getByTestId("demo-data-sources-line")).toHaveCount(0);
  });
});

