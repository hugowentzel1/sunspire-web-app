# YOUR in-depth production checklist (after automation)

Do this **in order** on a **desktop browser** (Chrome). Use your real production URL everywhere below — example: **`https://sunspire-web-app.vercel.app`**. Replace handles with your real tenant slug where noted.

**Before you start**

1. Run the automated gate (so you have screenshots + green tests):

   ```bash
   cd /path/to/sunspire-clean
   export ADMIN_TOKEN="your-admin-token"   # optional but recommended
   BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
   ```

2. Open screenshots folder: **`test-results/prod-gate-visual/`** — you should see `G01-…png` through `G10-…png` (G10 only if `ADMIN_TOKEN` was set).

3. To **watch** the full suite in **Chromium** (visible window, ~3 min, slight slow-mo so you can follow):

   ```bash
   BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod:headed
   ```

   - Uses **`--project=chromium`** and **`HEADED_SLOW_MO=120`**. Faster: `HEADED_SLOW_MO=0 BASE_URL=… npm run verify:temp-list:prod:headed`.
   - Optional **video** per test: `PLAYWRIGHT_VIDEO=1 BASE_URL=… npm run verify:temp-list:prod:headed` → under `test-results/`.
   - **Gate-only** (shorter): `BASE_URL=… npx playwright test tests/e2e/temporary-list-final-gate.spec.ts --workers=1 --headed --timeout=120000 --project=chromium`
   - **Matrix-only** (14 journey tests): `BASE_URL=… npm run test:matrix:headed:live`

---

## Phase A — Public & demo (homeowner + prospect)

| Step | Open / do | What “good” looks like |
|------|-----------|-------------------------|
| **A1** | Open `/?company=YourDemoCo&demo=1` | Company name/branding visible; hero CTA for branded version; “How it works”; lead/inbox messaging. |
| **A2** | From demo, start a quote (or open a report URL with address+lat/lng like in TO-DO-LIST). | Report loads; **Annual production** (or kWh) appears; no infinite spinner. |
| **A3** | Open `/paid?company=paid` (or your paid slug). | Paid positioning; launch/checkout language; no demo-only dead ends. |
| **A4** | Open `/status` | **System Status** heading; list of services (Supabase, Stripe, NREL, …); each row **Operational**, **Degraded**, or **Down** (not all blindly “ok” if health is 503). **Synthetic monitoring** section visible (may say “no recent data” until Actions run). |
| **A5** | Open `/api/health` in browser | JSON: `timestamp`, `services[]`, `config` object; HTTP **200** or **503**. |
| **A6** | Open `/legal/terms` and `/legal/privacy` | Pages load; Sunspire / policy text present. |

---

## Phase B — Installer dashboard (tenant)

Use **`?demo=1`** only if you don’t have a live session yet; use a real **`session_id=`** from Stripe after a test payment when verifying real activation.

| Step | Open / do | What “good” looks like |
|------|-----------|-------------------------|
| **B1** | Open `/c/<your-handle>?demo=1` (or real post-checkout URL). | Dashboard checklist: instant URL, embed, CRM, test lead, docs links — **or** clear “Access required” if not authorized (expected without session). |
| **B2** | Open `/c/<your-handle>/leads?demo=1` | “Leads Dashboard” or empty state; not stuck on “Loading…” forever. |
| **B3** | Open `/c/<your-handle>/success?demo=1` | Success / onboarding style content loads (copy may vary). |
| **B4** | In dashboard, if shown: set **notification email** and **CRM webhook** (or in Supabase `tenants` table). | Values persist after refresh; new lead triggers email (Resend) / webhook if configured. |

---

## Phase C — Lead submission (end-to-end, **you** confirm side effects)

| Step | Do | Confirm |
|------|-----|---------|
| **C1** | On a **report** for a real tenant slug, open **Book consultation** (or equivalent), submit with a **unique test email**. | UI success or clear error (not silent). |
| **C2** | Open **Supabase** → **Table Editor** → **`leads`**. | New row: correct `tenant_id`, email, notes if entered. |
| **C3** | Open `/c/<handle>/leads` for that tenant. | Row appears in UI. |
| **C4** | Check **Resend** (or installer inbox). | “New lead” email if `notification_email` set. |
| **C5** | If webhook URL set, check your **webhook receiver** (Zapier/Make/custom). | Payload received once per submit. |

---

## Phase D — Stripe (real money = careful; prefer **test mode** if duplicated project)

| Step | Do | Confirm |
|------|-----|---------|
| **D1** | Stripe Dashboard → **Developers** → **Webhooks** | Endpoint URL matches your prod `/api/stripe/webhook` (or app route you use); recent deliveries. |
| **D2** | Complete a **test** checkout (or Stripe test card) | Redirect to `/c/...?session_id=...`; tenant row in Supabase updated (`payment_status`, etc.). |
| **D3** | **Webhook** event `checkout.session.completed` | **200** response in Stripe logs; no endless **DLQ** growth in admin. |

---

## Phase E — Admin & compliance APIs

| Step | Do | Confirm |
|------|-----|---------|
| **E1** | Open `/admin/dashboard` — when prompted, paste **ADMIN_TOKEN**. | Metrics / health / circuit breakers load or clear error if token wrong. |
| **E2** | **Do not** run GDPR delete on real customers without legal review. Optional: call **`POST /api/gdpr/export`** with header `x-admin-token: <ADMIN>` and body `{"email":"test@example.com"}` via curl/Postman. | **401** without token; **200**/empty shape with token. |

---

## Phase F — Synthetics & monitoring (Steps 42–44)

| Step | Do | Confirm |
|------|-----|---------|
| **F1** | GitHub → **Actions** → **Synthetic monitoring** workflow (if configured). | Run completes; optional POST to `/api/synthetic-results`. |
| **F2** | Refresh `/status` | **Synthetic monitoring** rows update (PASS/FAIL/timestamps) when data exists. |
| **F3** | **UptimeRobot** | Monitor hits `GET .../api/health`; alert email = **support@getsunspire.com** (or yours). Test alert once. |
| **F4** | **Sentry** | Alerts to support email; trigger a test issue if needed. |

---

## Phase G — Cost alerts (Step 46, optional)

| Step | Do |
|------|-----|
| **G1** | Stripe → billing alerts. |
| **G2** | Resend → usage. |
| **G3** | Supabase → usage / spend cap. |
| **G4** | Vercel → usage / budget. |

---

## When you’re done

1. In **`docs/TEMPORARY-TO-DO-LIST.md`**, check off **Steps 40–46** for items you personally verified.
2. Open **`TO-DO-LIST.md`** at **STEP 2.1** for cold email.
3. Keep **`MAINTENANCE-GUIDE.md`** for daily/weekly ops.

**Re-run automation anytime:**

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run test:matrix:stable
```

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
```
