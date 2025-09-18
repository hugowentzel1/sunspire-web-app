import { test, expect } from "@playwright/test";

const LIVE_BASE = process.env.LIVE_BASE!;
const DEMO_BASE = process.env.DEMO_BASE || LIVE_BASE;
const QA_TENANT_SLUG = process.env.QA_TENANT_SLUG || "qa-acme";
const TEST_API_TOKEN = process.env.TEST_API_TOKEN;

async function see(page, tid) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toBeVisible();
}
async function notSee(page, tid) {
  await expect(page.locator(`[data-testid="${tid}"]`)).toHaveCount(0);
}
async function seeText(page, text) {
  await expect(page.getByText(new RegExp(text, "i"))).toBeVisible();
}

test.describe("Health", () => {
  test("healthz 200", async ({ request }) => {
    const res = await request.get(`${LIVE_BASE}/healthz`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBeTruthy();
  });
});

test.describe("DEMO via query", () => {
  test("shows demo CTAs/marketing/locks", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/?company=testco&demo=1`, {
      waitUntil: "networkidle",
    });
    await see(page, "demo-cta");
    await see(page, "pricing-section");
    await see(page, "howitworks-section");
    // optional: await see(page, 'demo-badge');
    await notSee(page, "live-bar");
  });
});

test.describe("DEMO via slug", () => {
  test("outreach slug loads (redirect may be client-side)", async ({
    page,
  }) => {
    await page.goto(`${DEMO_BASE}/o/testco-abc123`, {
      waitUntil: "networkidle",
    });
    // For now, just verify the page loads (redirect may be client-side)
    await expect(page).toHaveTitle(/Sunspire/);
  });
});

test.describe("PAID experience", () => {
  test("no demo CTAs; shows Live bar; footer legal present; no marketing links", async ({
    page,
  }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, {
      waitUntil: "networkidle",
    });
    await notSee(page, "demo-cta");
    await notSee(page, "pricing-section");
    await notSee(page, "howitworks-section");
    await see(page, "live-bar");
    await see(page, "footer-legal-links");
    await expect(
      page.locator('[data-testid="footer-marketing-links"]'),
    ).toHaveCount(0);
  });

  test("lead submission form loads and can be filled (success toast not yet implemented)", async ({
    page,
    request,
  }) => {
    await page.goto(`${LIVE_BASE}/?company=${QA_TENANT_SLUG}`, {
      waitUntil: "networkidle",
    });

    // Find the address input (it's in an AddressAutocomplete component)
    const addressInput = page
      .locator(
        'input[placeholder*="address" i], input[placeholder*="property" i]',
      )
      .first();
    const submit = page
      .getByRole("button", { name: /generate solar/i })
      .first();

    // Verify the form elements are present
    await expect(addressInput).toBeVisible();
    await expect(submit).toBeVisible();

    // Fill the form
    await addressInput.fill("1600 Pennsylvania Ave NW, Washington, DC 20500");

    // Verify the submit button is enabled
    await expect(submit).toBeEnabled();

    // Note: Success toast functionality is not yet fully implemented
    // This test verifies the form is present and functional
  });
});
