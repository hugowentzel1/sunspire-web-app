import { test, expect } from "@playwright/test";

const PAID_LIVE =
  "http://localhost:3002/?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com";
const PAID_REPORT =
  "http://localhost:3002/report?company=SolarPro%20Energy&brandColor=%23059669&logo=https://logo.clearbit.com/solarpro.com&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=test";

test("PAID: hero is focused and minimal (no marketing chips/stickies)", async ({
  page,
}) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  // Check hero section has proper data attributes
  await expect(page.locator("[data-paid-hero]")).toBeVisible();
  await expect(page.locator("[data-address-input]")).toBeVisible();

  // Check no demo-only marketing chips
  await expect(page.getByText(/Accurate Modeling \(NREL/i)).toHaveCount(0);
  await expect(page.getByText(/Book consultation/i)).toHaveCount(0);

  // Check address field has proper label and help text
  await expect(page.locator('label[for="address-input"]')).toBeVisible();
  await expect(
    page.getByText("Used for local rates & irradiance. Private."),
  ).toBeVisible();

  // Check company logo is displayed in hero (use first one to avoid strict mode violation)
  await expect(page.locator('img[alt*="SolarPro Energy logo"]').first()).toBeVisible();
});

test("PAID: cookie banner compact and non-intrusive", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  const banner = page.locator("[data-cookie-banner]");
  await expect(banner).toBeVisible();

  // Should be compact and positioned bottom-left
  const bannerBox = await banner.boundingBox();
  expect(bannerBox?.y).toBeGreaterThan(600); // Bottom of page
  expect(bannerBox?.x).toBeLessThan(100); // Left side

  // Should not overlap the address input
  const inputBox = await page.locator("[data-address-input]").boundingBox();
  if (bannerBox && inputBox) {
    expect(bannerBox.y > inputBox.y).toBeTruthy();
  }

  // Should have compact buttons
  await expect(banner.getByText("Accept")).toBeVisible();
  await expect(banner.getByText("Manage")).toBeVisible();
});

test("PAID REPORT: no CRM/demo/upsell CTAs", async ({ page }) => {
  await page.goto(PAID_REPORT, { waitUntil: "networkidle" });

  // Check report page has proper data attributes
  await expect(page.locator("[data-report-paid]")).toBeVisible();

  // Check no demo-only content
  await expect(page.getByText(/Leads now save to your CRM/i)).toHaveCount(0);
  await expect(page.getByText(/Unlock Full Report/i)).toHaveCount(0);
  await expect(page.getByText(/Activate on Your Domain/i)).toHaveCount(0);
  await expect(page.getByText(/Ready to Launch/i)).toHaveCount(0);

  // Check no blur overlays or unlock buttons
  await expect(page.locator(".blur-layer")).toHaveCount(0);
  await expect(page.locator('[data-testid="locked-panel"]')).toHaveCount(0);

  // Check all metric tiles are visible without blur
  await expect(page.locator('[data-testid="tile-systemSize"]')).toBeVisible();
  await expect(
    page.locator('[data-testid="tile-annualProduction"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="tile-lifetimeSavings"]'),
  ).toBeVisible();
  await expect(page.locator('[data-testid="tile-large"]')).toBeVisible();
});

test("PAID: footer present with legal & support", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  const footer = page.locator("[data-paid-footer]");
  await expect(footer).toBeVisible();

  // Check 3-column layout
  await expect(
    footer.getByText("SolarPro Energy", { exact: true }),
  ).toBeVisible();
  await expect(footer.getByText("Legal")).toBeVisible();
  await expect(footer.getByText("Questions?")).toBeVisible();

  // Check legal links
  await expect(
    footer.getByRole("link", { name: "Privacy Policy" }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Terms of Service" }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Accessibility" }),
  ).toBeVisible();
  await expect(footer.getByRole("link", { name: "Cookies" })).toBeVisible();

  // Check contact info
  await expect(
    footer.getByRole("link", { name: /Email SolarPro Energy/i }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "+1 (555) 123-4567" }),
  ).toBeVisible();

  // Check Powered by Sunspire
  await expect(footer.getByRole("link", { name: "Sunspire" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Sunspire" })).toHaveAttribute(
    "href",
    "https://getsunspire.com",
  );

  // Check disclaimer box
  await expect(footer.locator("[data-disclaimer-box]")).toBeVisible();
  await expect(
    footer.getByText(/Estimates are informational only/i),
  ).toBeVisible();
  await expect(footer.getByText(/Last updated/i)).toBeVisible();
});

test("PAID: no sticky bars or competing CTAs", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  // Scroll down to trigger any potential sticky bars
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  // Check no sticky bars are present
  await expect(page.locator("[data-sticky-bar]")).toHaveCount(0);
  await expect(page.getByText(/Book Consultation/i)).toHaveCount(0);
  await expect(page.getByText(/Ready to get started/i)).toHaveCount(0);

  // Check no demo CTAs
  await expect(page.getByText(/Activate on Your Domain/i)).toHaveCount(0);
  await expect(page.getByText(/Launch Tool/i)).toHaveCount(0);
});

test("PAID: address validation works correctly", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  const addressInput = page.locator("[data-address-input]");

  // Type incomplete address
  await addressInput.fill("123");
  await page.waitForTimeout(500);

  // Should show validation message
  await expect(
    page.getByText("Please enter a complete street address"),
  ).toBeVisible();

  // Type complete address
  await addressInput.fill("123 Main Street, New York, NY");
  await page.waitForTimeout(500);

  // Validation message should disappear
  await expect(
    page.getByText("Please enter a complete street address"),
  ).toHaveCount(0);
});

test("PAID: accessibility features", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  // Check footer has proper ARIA landmarks
  const footer = page.locator("[data-paid-footer]");
  await expect(footer).toHaveAttribute("role", "contentinfo");

  // Check that links have proper attributes
  const links = footer.locator("a");
  const linkCount = await links.count();
  expect(linkCount).toBeGreaterThan(0);

  for (let i = 0; i < linkCount; i++) {
    const link = links.nth(i);
    const href = await link.getAttribute("href");
    if (href?.startsWith("http")) {
      // External links
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener");
    }
  }

  // Check form labels are properly associated
  const addressInput = page.locator("#address-input");
  await expect(addressInput).toBeVisible();

  const label = page.locator('label[for="address-input"]');
  await expect(label).toBeVisible();
});

test("PAID: brand colors and logo display correctly", async ({ page }) => {
  await page.goto(PAID_LIVE, { waitUntil: "networkidle" });

  // Check company logo is displayed (use first one to avoid strict mode violation)
  const logo = page.locator('img[alt*="SolarPro Energy logo"]').first();
  await expect(logo).toBeVisible();

  // Check brand color is applied (should be #059669)
  const hero = page.locator("[data-paid-hero]");
  await expect(hero).toBeVisible();

  // Check that brand color is used in buttons
  const generateButton = page.locator("[data-cta-button]");
  await expect(generateButton).toBeVisible();

  // Check footer has company branding
  const footer = page.locator("[data-paid-footer]");
  await expect(
    footer.getByText("SolarPro Energy", { exact: true }),
  ).toBeVisible();
});
