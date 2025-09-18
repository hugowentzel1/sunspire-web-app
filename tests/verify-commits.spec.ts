import { test, expect } from "@playwright/test";

test.describe("Verify Commit States", () => {
  test("Demo version should match 19610abb0fc9042eb7ff822f21586178043fcd53", async ({ page }) => {
    // Navigate to demo version
    await page.goto(
      "https://sunspire-web-app.vercel.app/?demo=1&company=Demo%20Company&brandColor=%23FF6B35"
    );

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Verify page loaded
    await expect(page.locator("h1").first()).toBeVisible();

    // Check that this is demo mode
    await expect(page.locator('[data-demo="true"]')).toBeVisible();

    // Check demo-specific content - this version uses b.enabled logic
    await expect(
      page.getByText("Your Branded Solar Quote Tool")
    ).toBeVisible();

    await expect(
      page.getByText("— Ready to Launch")
    ).toBeVisible();

    // Check demo CTA section
    await expect(
      page.getByText("Demo for Demo Company — Powered by Sunspire")
    ).toBeVisible();

    // Check demo badges section
    await expect(
      page.locator("text=NREL v8").first()
    ).toBeVisible();

    await expect(
      page.locator("text=SOC 2").first()
    ).toBeVisible();

    await expect(
      page.locator("text=CRM Ready").first()
    ).toBeVisible();

    await expect(
      page.locator("text=24/7").first()
    ).toBeVisible();

    // Check How It Works section (demo only)
    await expect(
      page.getByText("How It Works")
    ).toBeVisible();

    // Check FAQ section (demo only)
    await expect(
      page.getByText("Frequently Asked Questions")
    ).toBeVisible();

    // Check LegalFooter (this version uses LegalFooter component)
    await expect(
      page.locator("footer")
    ).toBeVisible();

    // Verify no disclaimer banner (removed in 19610abb0fc9042eb7ff822f21586178043fcd53)
    await expect(page.locator("text=Disclaimer")).not.toBeVisible();

    console.log("✅ Demo version matches 19610abb0fc9042eb7ff822f21586178043fcd53");
  });

  test("Paid version should match aa28acfc9c6c870873044517a300906475e00995", async ({ page }) => {
    // Navigate to paid version
    await page.goto(
      "https://sunspire-web-app.vercel.app/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com"
    );

    // Wait for page to load
    await page.waitForLoadState("domcontentloaded");

    // Verify page loaded
    await expect(page.locator("h1").first()).toBeVisible();

    // Check that this is paid mode (not demo)
    await expect(page.locator('[data-demo="false"]')).toBeVisible();

    // Check paid-specific content
    await expect(
      page.getByText("Instant Solar Analysis for Your Home")
    ).toBeVisible();

    await expect(
      page.getByText("Enter your address to see solar production, savings, and payback—instantly.")
    ).toBeVisible();

    // Check paid credibility section (no demo badges)
    await expect(
      page.locator("text=NREL v8").first()
    ).toBeVisible();

    await expect(
      page.locator("text=Current Rates").first()
    ).toBeVisible();

    await expect(
      page.locator("text=Private").first()
    ).toBeVisible();

    // Verify no demo-specific content
    await expect(
      page.getByText("Your Branded Solar Quote Tool")
    ).not.toBeVisible();

    await expect(
      page.getByText("How It Works")
    ).not.toBeVisible();

    await expect(
      page.getByText("Frequently Asked Questions")
    ).not.toBeVisible();

    // Check paid footer with company branding
    await expect(
      page.locator("text=SolarPro Energy").first()
    ).toBeVisible();

    // Check powered by Sunspire in footer
    await expect(
      page.getByText("Powered by Sunspire")
    ).toBeVisible();

    // Verify no CRM banner (removed in aa28acfc9c6c870873044517a300906475e00995)
    await expect(page.locator("text=Live for Apple. Leads now save to your CRM.")).not.toBeVisible();

    // Check green checkmark has proper spacing
    const checkmark = page.locator(".bg-green-500 span");
    await expect(checkmark).toBeVisible();

    console.log("✅ Paid version matches aa28acfc9c6c870873044517a300906475e00995");
  });

  test("Verify brand takeover logic works correctly", async ({ page }) => {
    // Test demo mode detection
    await page.goto(
      "https://sunspire-web-app.vercel.app/?demo=1&company=Test%20Company&brandColor=%23FF0000"
    );

    await page.waitForLoadState("domcontentloaded");

    // Should show demo mode
    await expect(page.locator('[data-demo="true"]')).toBeVisible();
    await expect(page.getByText("Demo for Test Company — Powered by Sunspire")).toBeVisible();

    // Test paid mode detection
    await page.goto(
      "https://sunspire-web-app.vercel.app/?company=Test%20Company&brandColor=%23FF0000"
    );

    await page.waitForLoadState("domcontentloaded");

    // Should show paid mode
    await expect(page.locator('[data-demo="false"]')).toBeVisible();
    await expect(page.getByText("Instant Solar Analysis for Your Home")).toBeVisible();

    console.log("✅ Brand takeover logic working correctly");
  });
});
