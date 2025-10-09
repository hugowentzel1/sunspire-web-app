import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", name: "home" },
  { path: "/report?demo=0&company=Apple&brandColor=%23FF6B35&address=123%20Main%20St&lat=33.7490&lng=-84.3880", name: "report" },
  { path: "/paid?demo=0&company=Apple&brandColor=%23FF6B35", name: "paid landing" },
  { path: "/pricing", name: "pricing" },
  { path: "/partners", name: "partners" },
  { path: "/support", name: "support" },
];

for (const page of pages) {
  test(`footer exists and links work on ${page.name}`, async ({ page: p }) => {
    await p.goto(`http://localhost:3000${page.path}`, { waitUntil: "domcontentloaded", timeout: 10000 });

    const footer = p.locator('footer[aria-label="Site footer"]');
    await expect(footer).toBeVisible({ timeout: 10000 });

    const links = [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Accessibility", href: "/legal/accessibility" },
      { label: "Contact", href: "/contact" },
    ];

    for (const l of links) {
      const a = footer.getByRole("link", { name: l.label });
      await expect(a).toBeVisible();
      const href = await a.getAttribute("href");
      expect(href).toContain(l.href);
    }

    // Check for Cookie Preferences button
    const cookieBtn = footer.getByRole("button", { name: "Cookie Preferences" });
    await expect(cookieBtn).toBeVisible();

    // Footnotes text exists (three items only)
    await expect(footer).toContainText("Mapping & location data © Google");
    await expect(footer).toContainText("Estimates generated using NREL PVWatts® v8");
    await expect(footer).toContainText("Powered by Sunspire");
  });
}

test("footer has correct structure and accessibility", async ({ page }) => {
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

  const footer = page.locator('footer[aria-label="Site footer"]');
  await expect(footer).toBeVisible();

  // Check nav has correct aria-label
  const nav = footer.locator('nav[aria-label="Legal and support"]');
  await expect(nav).toBeVisible();

  // Check bullet separators are hidden from screen readers
  const bullets = footer.locator('span[aria-hidden="true"]');
  const count = await bullets.count();
  expect(count).toBeGreaterThan(0);

  // Check all links are focusable
  const allLinks = footer.getByRole("link");
  const linkCount = await allLinks.count();
  for (let i = 0; i < linkCount; i++) {
    const link = allLinks.nth(i);
    await link.focus();
    await expect(link).toBeFocused();
  }
});

test("footer contains 3 required footnote items", async ({ page }) => {
  await page.goto("http://localhost:3000/report?demo=0&company=Apple&brandColor=%23FF6B35&address=123%20Main%20St&lat=33.7490&lng=-84.3880", { waitUntil: "domcontentloaded", timeout: 10000 });

  const footer = page.locator('footer[aria-label="Site footer"]');
  await expect(footer).toBeVisible();

  // Should contain exactly 3 footnote items (no trademark line)
  await expect(footer).toContainText("Mapping & location data © Google");
  await expect(footer).toContainText("Estimates generated using NREL PVWatts® v8");
  await expect(footer).toContainText("Powered by Sunspire");
  
  // Should NOT contain the trademark line
  await expect(footer).not.toContainText("PVWatts® is a registered trademark of the Alliance for Sustainable Energy, LLC.");
});

