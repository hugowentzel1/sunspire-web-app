import { test, expect } from "@playwright/test";

const pages = [
  { path: "/?company=Google&demo=1", name: "Home" },
  { path: "/report?company=Google&demo=1&address=123%20Main%20St&lat=40.7128&lng=-74.0060&placeId=demo", name: "Report" },
  { path: "/pricing?company=Google&demo=1", name: "Pricing" },
  { path: "/partners?company=Google&demo=1", name: "Partners" },
  { path: "/support?company=Google&demo=1", name: "Support" },
  { path: "/terms?company=Google&demo=1", name: "Terms" },
  { path: "/security?company=Google&demo=1", name: "Security" },
  { path: "/dpa?company=Google&demo=1", name: "DPA" },
  { path: "/legal/refund?company=Google&demo=1", name: "Refund Policy" },
  { path: "/do-not-sell?company=Google&demo=1", name: "Do Not Sell" },
];

for (const { path, name } of pages) {
  test(`${name} page has consistent Footer component`, async ({ page }) => {
    await page.goto(`http://localhost:3000${path}`);
    
    await page.waitForTimeout(2000);
    
    // Check for Footer component (not LegalFooter)
    const footer = page.locator('footer[data-testid="footer"]');
    await expect(footer).toBeVisible();
    
    // Check for consistent footer structure - all pages should have these
    await expect(footer.getByText('Sunspire Solar Intelligence')).toBeVisible();
    await expect(footer.getByText('Quick Links')).toBeVisible();
    await expect(footer.getByText('Legal & Support')).toBeVisible();
    
    // Check for legal links in footer
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Refund Policy' })).toBeVisible();
  });
}

