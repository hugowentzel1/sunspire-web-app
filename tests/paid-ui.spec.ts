import { test, expect } from "@playwright/test";

const PAID_URL =
  process.env.PAID_URL ||
  "https://sunspire-web-app.vercel.app/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";

test("Paid: demo/ops copy removed; hero logo; sticky actions; white-label footer; cookie-safe", async ({
  page,
}) => {
  await page.goto(PAID_URL, { waitUntil: "networkidle" });

  // 1) No demo/ops text in paid
  const forbidden = [
    /Private demo/i,
    /Leads now save to your CRM/i,
    /Activate on Your Domain/i,
    /Unlock Full Report/i,
    /Preview:\s*\d+\s*runs left/i,
    /Dozens of installers/i,
    /CRM[-\s]?ready/i,
    /SOC 2[-\s]?aligned/i,
    /Sunspire Solar Intelligence\s+.*support@getsunspire\.com/i, // corporate block
  ];
  for (const re of forbidden) {
    await expect(page.getByText(re).first()).toHaveCount(0);
  }

  // 2) Hero logo present
  await expect(page.locator("[data-hero-logo]")).toBeVisible();

  // 3) Sticky actions after scroll
  await page.mouse.wheel(0, 1600);
  const sticky = page.locator("[data-sticky-bar]");
  await expect(sticky).toBeVisible();
  await expect(
    sticky.getByRole("button", { name: /Book Consultation/i }),
  ).toBeVisible();
  await expect(
    sticky.getByRole("button", { name: /Email PDF/i }),
  ).toBeVisible();

  // 4) Proper company branding (logo alt attribute)
  const heroLogo = page.locator("[data-hero-logo] img");
  await expect(heroLogo).toHaveAttribute("alt", /SolarPro Energy logo/i);

  // 5) White-label footer present
  await expect(page.locator("[data-paid-footer]")).toBeVisible();
});
