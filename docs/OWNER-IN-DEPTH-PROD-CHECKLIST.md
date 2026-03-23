# YOUR in-depth production checklist (after automation)

Use your real production URL everywhere — example: **`https://sunspire-web-app.vercel.app`**. Replace `<your-handle>` with your real tenant slug.

---

## The simple way — just check the live links

**This is enough for “does the dashboard / site work on prod?”** Open real URLs in Chrome (no terminal required).

1. Set **`LIVE`** = your production host, e.g. `https://sunspire-web-app.vercel.app`.

2. **Dashboard (main check)**  
   - Open **`LIVE/c/<your-handle>`** — the same path installers use (bookmark this).  
   - **Good:** checklist / dashboard loads, **or** a clear **Access required** if you’re not allowed in yet — **not** a blank page, endless spinner, or 500.

3. **Leads**  
   - Open **`LIVE/c/<your-handle>/leads`**.  
   - **Good:** “Leads Dashboard” with a table or empty state — **not** stuck on **Loading…** forever.

4. **Optional quick pings** (same session): **`LIVE/status`**, **`LIVE/api/health`**, homepage **`LIVE/`**.

**About `?demo=1`:** Add it only if you want to **peek** at tenant UI **without** going through Stripe first (`LIVE/c/<your-handle>?demo=1`). Real installs use the **same paths without `demo=1`** once they have access. Your routine “is live OK?” check = the **non-demo** links when you’re testing as a real user, or demo links if you just need a fast visual.

**When you’re happy with the live links, you’re done with the dashboard check.** Use **Part 2** below only when you need deeper proof (test lead, Stripe, monitoring, etc.).

---

## Read this first — honest scope

### What “everything worked” means (and does not mean)

| | |
|--|--|
| **If `npm run verify:temp-list:prod` exits green** | A large set of **automated** checks passed: many pages, APIs, and flows against production **as Playwright and the test code define them**. That is strong signal the app behaves as tested **at that moment**. |
| **What automation does *not* replace** | **Your** email inbox (Resend), **your** Stripe dashboard (real payment + webhook delivery), **your** UptimeRobot/Sentry dashboards, **your** eyes on the UI, and **your** Supabase Table Editor for a lead you personally submitted. Those need **you** to confirm. |
| **Typical result without `ADMIN_TOKEN`** | **77 passed, 2 skipped** is normal: admin dashboard screenshot (**G10**) and one GDPR/admin test are skipped until you set `ADMIN_TOKEN`. Set the token and re-run if you want **79** passing. |
| **Who “double-checked”** | CI or an engineer run proves **the last run of that command**. For **your** peace of mind, **you** should run the same command **once on your machine** after deploys. This doc tells you exactly what to do after that. |

**Bottom line:** Green tests = “reproducible automated verification passed.” **Ship confidence** = green tests **plus** you ticking the manual items below (especially **one real test lead** and **monitoring alerts**).

---

## Part 1 — Run automation once (your machine)

**1a. Full prod bundle (headless, ~3 min):**

```bash
cd /path/to/sunspire-clean
export ADMIN_TOKEN="your-admin-token"   # recommended: un-skips admin tests
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
```

**You’re done with 1a when:** Terminal shows **passed** (and only **skipped** if you omitted `ADMIN_TOKEN` on purpose).

**1b. Optional — watch Chromium (same tests, visible browser):**

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod:headed
```

- Uses **`--project=chromium`** and **`HEADED_SLOW_MO=120`**. Faster: `HEADED_SLOW_MO=0` …
- Optional **videos**: `PLAYWRIGHT_VIDEO=1 BASE_URL=… npm run verify:temp-list:prod:headed` → under `test-results/`.

**1c. Optional — review screenshots from the gate spec:**

Open **`test-results/prod-gate-visual/`** — expect **`G01-…png` through `G09-…png`** (and **`G10-…`** if `ADMIN_TOKEN` was set).

---

## Part 2 — Deeper manual checklist (optional; cold-email + ops)

Use this when you need more than “live links load” — e.g. before cold email, or after a big change. **URLs** use `https://sunspire-web-app.vercel.app` — swap if yours differs.

### A — Public site (5–10 min)

| # | You open / do | You tick when… |
|---|----------------|----------------|
| **A1** | `https://sunspire-web-app.vercel.app/?company=YourDemoCo&demo=1` | Company name/branding visible; hero and “How it works” load; no blank page. |
| **A2** | From that page, start a quote **or** open a report URL you use in prod (with address / coords). | Report loads; **annual production or kWh** shows; spinner does not run forever. |
| **A3** | `https://sunspire-web-app.vercel.app/paid?company=paid` (or your paid slug). | Paid messaging loads; no obvious broken demo-only dead end. |
| **A4** | `https://sunspire-web-app.vercel.app/status` | Heading **System Status**; rows for Supabase, Stripe, NREL, etc.; each row is **Operational**, **Degraded**, or **Down** (not an error page). **Synthetic monitoring** section visible. |
| **A5** | `https://sunspire-web-app.vercel.app/api/health` | Browser shows JSON: `timestamp`, `services` (or similar), `config`; HTTP **200** or **503** (503 = at least one dependency unhealthy — still “working as designed” for the endpoint). |
| **A6** | `…/legal/terms` and `…/legal/privacy` | Both load; policy text present. |

### B — Installer dashboard (demo or real session)

| # | You open / do | You tick when… |
|---|----------------|----------------|
| **B1** | `https://sunspire-web-app.vercel.app/c/<your-handle>?demo=1` **or** real URL with `session_id=` after checkout. | Dashboard checklist loads **or** clear **Access required** if not logged in — not infinite loading. |
| **B2** | `…/c/<your-handle>/leads?demo=1` | **Leads Dashboard** title or empty state; not stuck on **Loading…** forever. |
| **B3** | `…/c/<your-handle>/success?demo=1` | Success / onboarding content loads. |
| **B4** | If UI allows: set **notification email** and **CRM webhook** (or set in Supabase `tenants`). | After refresh, values still there. |

### C — One real end-to-end lead (critical for cold email)

| # | You do | You tick when… |
|---|--------|----------------|
| **C1** | On a **production** report for your tenant, open **Book consultation** (or equivalent), submit with a **unique test email** (e.g. `you+test2026@…`). | UI shows success or a **clear** error (not silent failure). |
| **C2** | Supabase → **Table Editor** → **`leads`**. | New row: correct `tenant_id`, email, fields you entered. |
| **C3** | `…/c/<your-handle>/leads`. | That lead appears in the UI. |
| **C4** | Email (Resend → installer inbox or your test inbox). | “New lead” (or your template) received **if** `notification_email` is set. |
| **C5** | If CRM webhook URL is set: your receiver (Zapier/Make/server). | **One** payload per submit; payload looks right. |

### D — Stripe (use **test mode** / test card if you duplicate project)

| # | You do | You tick when… |
|---|--------|----------------|
| **D1** | Stripe Dashboard → **Developers** → **Webhooks**. | Endpoint URL matches prod **`/api/stripe/webhook`** (or your app’s route); recent attempts visible. |
| **D2** | Complete a **test** checkout. | Redirect to `/c/...?session_id=...`; Supabase **tenants** row updated (plan/payment fields). |
| **D3** | Stripe → webhook delivery for `checkout.session.completed`. | **200** response; not stuck failing. |

### E — Admin & GDPR APIs (needs `ADMIN_TOKEN`)

| # | You do | You tick when… |
|---|--------|----------------|
| **E1** | Open `…/admin/dashboard` → paste **ADMIN_TOKEN** when prompted. | Metrics/health load **or** clear error if token wrong. |
| **E2** | *(Optional, legal-sensitive)* `POST /api/gdpr/export` with header `x-admin-token: <ADMIN>` — only for test data. | **401** without token; **200** with token. |

### F — Monitoring you rely on daily (Steps 44 / TEMPORARY list)

| # | You do | You tick when… |
|---|--------|----------------|
| **F1** | GitHub → **Actions** → **Synthetic monitoring** (if configured). | Workflow can complete; optional POST to `/api/synthetic-results`. |
| **F2** | Refresh `…/status`. | Synthetic section shows **Homeowner** / **Buyer** rows with PASS/FAIL and timestamps when data exists. |
| **F3** | **UptimeRobot** (or your uptime tool). | Monitor hits **`GET …/api/health`**; alert email is **support@getsunspire.com** (or yours); you **trigger or simulate** one alert and **receive** it. |
| **F4** | **Sentry** → Alerts. | New issues notify the right email; optional test event. |

### G — Cost alerts (optional, Step 46)

| # | You do |
|---|--------|
| **G1** | Stripe → billing / usage alerts. |
| **G2** | Resend → usage. |
| **G3** | Supabase → usage / cap. |
| **G4** | Vercel → budget / usage. |

---

## Part 3 — Reference tables (same content as above, compact)

### Phase A — Public & demo

| Step | Open / do | What “good” looks like |
|------|-----------|-------------------------|
| **A1** | `/?company=YourDemoCo&demo=1` | Company name/branding visible; hero CTA; “How it works”; lead/inbox messaging. |
| **A2** | From demo, start a quote (or open a report URL with address+lat/lng). | Report loads; **Annual production** (or kWh) appears; no infinite spinner. |
| **A3** | `/paid?company=paid` (or your paid slug). | Paid positioning; launch/checkout language; no demo-only dead ends. |
| **A4** | `/status` | **System Status**; services listed; each **Operational** / **Degraded** / **Down**; **Synthetic monitoring** visible. |
| **A5** | `/api/health` | JSON: `timestamp`, `services[]`, `config`; HTTP **200** or **503**. |
| **A6** | `/legal/terms` and `/legal/privacy` | Pages load; policy text present. |

### Phase B — Installer dashboard

| Step | Open / do | What “good” looks like |
|------|-----------|-------------------------|
| **B1** | `/c/<your-handle>?demo=1` (or real post-checkout URL). | Dashboard checklist **or** clear “Access required”; not stuck loading. |
| **B2** | `/c/<your-handle>/leads?demo=1` | Leads Dashboard or empty state; not “Loading…” forever. |
| **B3** | `/c/<your-handle>/success?demo=1` | Success / onboarding content loads. |
| **B4** | Notification email + CRM webhook in UI or Supabase. | Values persist; new lead triggers email/webhook when configured. |

### Phase C — Lead submission

| Step | Do | Confirm |
|------|-----|---------|
| **C1** | Submit consultation on prod report with unique test email. | UI success or clear error. |
| **C2** | Supabase → `leads`. | Row exists with correct `tenant_id`. |
| **C3** | `/c/<handle>/leads`. | Row in UI. |
| **C4** | Resend / inbox. | Email if `notification_email` set. |
| **C5** | Webhook receiver. | Payload if URL set. |

### Phase D — Stripe

| Step | Do | Confirm |
|------|-----|---------|
| **D1** | Stripe → Webhooks | URL matches prod; recent deliveries. |
| **D2** | Test checkout | Redirect with `session_id`; Supabase tenant updated. |
| **D3** | `checkout.session.completed` | **200** in Stripe logs. |

### Phase E — Admin & compliance

| Step | Do | Confirm |
|------|-----|---------|
| **E1** | `/admin/dashboard` + token | Loads or clear auth error. |
| **E2** | GDPR export (test only) | 401 without token; 200 with token. |

---

## When you’re done

1. In **`docs/TEMPORARY-TO-DO-LIST.md`**, check off **Steps 41** (your boxes), **44**, **46** when true.
2. Open **`TO-DO-LIST.md`** at **STEP 2.1** for cold email.
3. Keep **`MAINTENANCE-GUIDE.md`** for daily/weekly ops.

**Re-run automation anytime:**

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run test:matrix:stable
```

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
```
