// Playwright Fast Check — opens one URL, verifies app renders and commit identity
const { chromium } = require('playwright');

(async () => {
  const url = process.env.TARGET_URL || 'http://localhost:3001/?company=Apple&demo=1';
  const expectSha = process.env.NEXT_PUBLIC_COMMIT_SHA || process.env.EXPECT_SHA || null;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`🌐 Fast Check → ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Basic "is our app" sanity (adjust selectors to your UI)
  await page.waitForSelector('h1', { timeout: 15000 });

  // Verify build identity if provided
  if (expectSha) {
    const base = new URL(url).origin;
    const res = await page.request.get(`${base}/api/version`, { headers: { 'cache-control': 'no-store' } });
    const json = await res.json();
    if (json.sha !== expectSha) throw new Error(`Live build SHA ${json.sha} !== expected ${expectSha}`);
    console.log(`🔒 SHA OK: ${json.sha}`);
  }

  // Optional screenshot
  await page.screenshot({ path: 'fast-check.png', fullPage: true });
  console.log('📸 Saved fast-check.png');

  await browser.close();
  console.log('✅ Fast Check passed');
})().catch((e) => { console.error(e); process.exit(1); });