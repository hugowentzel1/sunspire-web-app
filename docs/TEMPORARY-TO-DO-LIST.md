# Temporary to‑do list — Supabase migration (every button, every step)

**Goal:** Remove Airtable completely, move everything to Supabase (staging + prod), full E2E tests, and **finalize so the system is bulletproof and ready for cold emailing**. Completing every step below = all success criteria met = **Sunspire ready to ship**.

**Success = all of the following:**

- **Sunspire customer (installer/tenant):** Every flow works end-to-end on production — dashboard, tenant config, CRM webhook setup, leads list, Stripe subscription/checkout, post-purchase setup. All APIs and backend paths used by the dashboard and tenant management are checked and tested.
- **Homeowner (on customer’s white-labeled site):** Full journey works — land on white-labeled page → get quote/report → open consultation modal → submit lead → see success. Estimate API, lead API, and every backend used by the report/lead flow are checked and tested.
- **Every single API and backend:** Health, estimate, geo, lead, tenant, Stripe webhook, GDPR export/delete, status page, docs routes — all exercised by tests or a runbook and verified working.
- **Maintenance methods/APIs you check daily:** The same ones you use in practice (e.g. GET /api/health, /status page, UptimeRobot monitor, Sentry alerts) are fully tested and documented; they work 24/7 and the runbooks (MAINTENANCE-GUIDE, HEALTH-DEPTH, etc.) are updated and accurate so you can rely on them daily.
- **Cold-email ready:** Lead capture from white-labeled report → storage (Supabase) → installer notification (Resend) → dashboard visibility and optional CRM webhook — all verified; no silent failures; bulletproof for sending cold traffic to white-labeled links.

- **ME** = I do it in the repo (code, docs, scripts, git).  
- **YOU** = only you can do it (external dashboards, secrets, browser clicks, or final sign-off). I do everything else.

**Step-by-step:** We go in order. You say when you’re ready for the next step (e.g. “on to step 10” or “next step”). Then whoever that step is (ME or YOU) does it. No one runs ahead; each step is done when we’re on it.

**Airtable is completely gone when we’re done.** There is no dual backend and no `STORAGE_BACKEND` switch. The app will use **Supabase only** for tenants, leads, users, and links. All code that currently uses Airtable will be replaced by Supabase (DAL + routes). Then `src/lib/airtable.ts` and every Airtable env var will be removed. When the list is complete, Sunspire is **ready to ship** with Supabase as the single source of truth and all goals below met.

**Local first, then push and test live:** For steps that involve running tests (e.g. 31, 32), get everything passing **locally** first (`npm run dev` then `npm run verify:local` or `verify:local:headed`). Only then push your branch, wait for Vercel deploy, and run the same matrix against the live URL. Don't push until local is green.

**Optional "additional comments" box — answer (sources amalgamated):** Solar forms (Sky Power, Progressive Energy, Mobile2b) often include an optional Message / Additional information field. Research: optional fields can help when clearly optional; one optional line on a high-intent step is common. **Verdict: Yes — add one optional "Any additional comments or notes?" so installers get context; keep it optional and short.** Saved in backend; no Zapier needed.

**Supabase: what gets saved and who sees it**

- **Every homeowner submit** is saved in Supabase in the **leads** table. Each row has **tenant_id** linking to the white-label company (installer), so each lead is tied to the correct owner.
- **Categories of data stored per lead:** **Contact** (name, email, phone), **Property** (address, street, city, state, postal_code, country, place_id, lat/long), **Estimate** (system_size_kw, estimated_cost, estimated_savings, payback_period_years, npv_25_year, co2_offset_per_year), **Notes** (notes — optional comments from the consultation modal), **Status** (status, e.g. New), **Attribution** (token). The UI and API use these; no Zapier or Airtable.
- **Who sees it:** (1) **White-label owner (installer):** Dashboard at `/c/<handle>/leads` shows name, email, address, phone, notes, submitted date. Resend sends an instant email to the tenant’s notification_email when configured; CRM webhook receives payload when configured. (2) **Someone buying Sunspire (cold email):** Stripe checkout → success → Supabase **tenants** table updated (subscription, plan) + Resend onboarding email; no Airtable. So Supabase is fully accounted for for both the buyer flow and the homeowner → installer flow.

---

## 0. Security + environment prep

- [ ] **Step 1** — Rotate all previously exposed secrets — **YOU** (only you: Stripe/Resend/Airtable/Google/Vercel dashboards + paste new values)

### Step 1 — Rotate all previously exposed secrets — **YOU**

You pasted live keys in chat. Rotate every one and update Vercel.

**Stripe (dashboard.stripe.com):**
1. Log in → **Developers** → **API keys**.
2. Under **Standard keys**, click **Roll key** (or Create new) for the **Secret key**; copy the new key.
3. **Developers** → **Webhooks** → your endpoint → **Roll signing secret**; copy the new secret.
4. Save both in a password manager (do not paste in chat).

**Resend (resend.com):**
1. Log in → **API Keys** (sidebar or account).
2. Create a new API key; copy it; save in password manager.
3. If you use a webhook: **Webhooks** → create or regenerate webhook secret; save it.

**Airtable (airtable.com):**
1. Log in → **Developer hub** or **Account** → **Personal access tokens** (or API key).
2. Revoke the old key/token; create a new one; save it.

**Google (console.cloud.google.com):**
1. **APIs & Services** → **Credentials**.
2. For Geocoding and Maps keys: edit each → **Regenerate key** or create new; restrict as before; save.

**Vercel (vercel.com):**
1. **Settings** (account or team) → **Tokens** (or similar).
2. Revoke the exposed token; create a new one; save it.

**Upstash/KV (upstash.com or Vercel Storage):**
1. In the dashboard for your Redis/KV database, rotate the password/token if possible; copy new values; save.

**JWT_SECRET and ADMIN_TOKEN:**
1. Generate new random strings (e.g. `openssl rand -hex 32` in terminal for JWT; similar for ADMIN_TOKEN).
2. Save both.

**Update Vercel project env vars:**
1. Go to **vercel.com** → your **team/account** → **Projects** → click your **Sunspire project** (e.g. `sunspire-web-app`).
2. **Settings** → **Environment Variables**.
3. For each rotated secret, find the existing variable (e.g. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `AIRTABLE_API_KEY`, `GOOGLE_GEOCODING_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `VERCEL_TOKEN`, `JWT_SECRET`, `ADMIN_TOKEN`, KV/Redis vars) and **Edit** (pencil) → paste the **new** value → **Save**.
4. Repeat for **Production**, **Preview**, and **Development** if you use them.
5. **Redeploy** the latest deployment so the new env is picked up (Deployments → ⋮ on latest → Redeploy).

---

- [x] **Step 2** — Create Supabase projects: staging and prod (YOU) ✅

### Step 2 — Create Supabase projects: staging and prod (YOU)

**2a — First project (we’ll use this as STAGING):**

1. Open **https://app.supabase.com** in your browser; log in.
2. If you see an org selector at the top, select **Sunspire** (or create an org first: **New organization** → name **Sunspire** → Create).
3. Click **“New project”** (top-right, or from the project dropdown **“+ New project”**).
4. **Organization:** leave or select **Sunspire**.
5. **Project name:** type **sunspire-staging** (or **Sunspire** if you prefer; we’ll treat it as staging).
6. **Database password:** click **“Generate a password”** (or type a strong one); **Copy** and paste into your password manager as “Supabase staging DB password”; do not lose it.
7. **Region:** open dropdown; choose **East US (North Virginia)** or the Americas option closest to your users.
8. **Security:**
   - **Enable Data API:** check the box (must be on for supabase-js).
   - **Enable automatic RLS:** leave **unchecked**.
9. Click **“Create new project”** (or **“Next”** if there’s another screen, then **Create**).
10. Wait until the project shows **STATUS: Healthy** (and “Last migration: No migrations” is fine).

**2b — Get staging Project URL and Secret key:**

1. In the **left sidebar**, click the **gear icon** (**Settings**).
2. In Settings, click **API** (or **API Keys**).
3. **Project URL:** at the top of the page you’ll see **Project URL** or **API URL** (e.g. `https://xxxxx.supabase.co`). Click the **copy** icon next to it. Paste into your password manager as **SUPABASE_URL_STAGING**.
4. Scroll to **Secret keys** (not “Publishable key”). Under **Secret keys**, find the row **NAME: default**. Click the **eye** icon to reveal the key, then click the **copy** icon. Paste into your password manager as **SUPABASE_SERVICE_ROLE_KEY_STAGING**. (Do **not** use the Publishable key for the backend.)

**2c — Second project (PROD):**

1. At the **top** of the Supabase dashboard, click the **project name** (e.g. “sunspire-staging”) to open the project switcher.
2. Click **“+ New project”** (or **“New project”**).
3. **Organization:** **Sunspire**.
4. **Project name:** **sunspire-prod**.
5. **Database password:** Generate or type a strong password; **Copy**; save in password manager as “Supabase prod DB password”.
6. **Region:** same as staging (e.g. East US).
7. **Enable Data API:** checked. **Enable automatic RLS:** unchecked.
8. Click **“Create new project”**; wait until **Healthy**.

**2d — Get prod Project URL and Secret key:**

1. Left sidebar → **Settings** (gear) → **API**.
2. Copy **Project URL** → password manager as **SUPABASE_URL_PROD**.
3. Under **Secret keys** → **default** → **eye** → **copy** → password manager as **SUPABASE_SERVICE_ROLE_KEY_PROD**.

**2e — Add these into Vercel (so we don’t forget):**

1. Go to **vercel.com** → your **Sunspire project** → **Settings** → **Environment Variables**.
2. **Production:**
   - Click **Add New** (or **Add**). **Key:** `SUPABASE_URL`. **Value:** paste **SUPABASE_URL_PROD**. **Environments:** check **Production**. **Save**.
   - **Add New**. **Key:** `SUPABASE_SERVICE_ROLE_KEY`. **Value:** paste **SUPABASE_SERVICE_ROLE_KEY_PROD**. **Environments:** Production. **Save**.
3. **Preview** and **Development:**
   - **Add New**. **Key:** `SUPABASE_URL`. **Value:** paste **SUPABASE_URL_STAGING**. **Environments:** Preview + Development. **Save**.
   - **Add New**. **Key:** `SUPABASE_SERVICE_ROLE_KEY`. **Value:** paste **SUPABASE_SERVICE_ROLE_KEY_STAGING**. **Environments:** Preview + Development. **Save**.
4. Do **not** redeploy yet; we’ll use these after the code is wired.

---

- [x] **Step 3** — Airtable policy (YOU) ✅ (no action; hard cut confirmed)

### Step 3 — Airtable policy (YOU)

No action now. We’re doing a **hard cut**: after cutover, Airtable is gone from the app. No hybrid. I’ll remove Airtable env vars and code; you’ll turn off Airtable Zaps when we get there.

---

- [x] **Step 4** — Cursor model (YOU) ✅

### Step 4 — Cursor model (YOU)

1. In **Cursor**, click **Cursor** (menu) → **Settings** (or **Preferences**), or press **⌘ ,**.
2. In the left sidebar, click **Cursor Settings** or **Features** / **AI**.
3. Find **Model** or **Default model** (for Chat / Composer). Open the dropdown.
4. Select **Claude Opus** or the highest-quality Claude option (e.g. **Claude 3.5 Sonnet** / **Opus**).
5. Close settings. From here on, I’ll be using that model for this repo.

---

## 1. Baseline docs and planning

- [x] **Step 5** — Create Supabase migration design doc (ME) ✅

### Step 5 — Create Supabase migration design doc (ME)

I will add `docs/SUPABASE-MIGRATION-PLAN.md` with goal, env vars, table list, and Airtable→Postgres mapping. Nothing for you to click.

---

- [x] **Step 6** — Branch for migration work (YOU) ✅

### Step 6 — Branch for migration work (YOU)

1. Open the **Sunspire** repo in Cursor (or your terminal in the repo root).
2. Ensure you’re on **main** and up to date: run **Source Control** (branch icon) → click **main**; or in terminal: `git checkout main && git pull`.
3. Create a new branch: **Source Control** → **Create new branch** (or terminal: `git checkout -b supabase-migration`). Name: **supabase-migration**.
4. All my changes will go on this branch until we merge.

---

- [x] **Step 7** — Freeze Airtable schema — **YOU** ✅

### Step 7 — Freeze Airtable schema — **YOU**

From now until cutover: in **Airtable**, do **not** rename columns, add/remove tables, or change structure for **Tenants** or **Leads**. We need a stable schema to export and map. You can still add/edit **rows** (data) if needed.

---

## 2. Supabase schema design and creation

- [x] **Step 8** — Design Postgres schema — **ME** ✅

### Step 8 — Design Postgres schema — **ME**

Done: `supabase/schema.sql` added with `tenants`, `leads`, `users`, `links`, and indexes. Nothing for you to click.

---

- [x] **Step 9** — Review proposed schema — **YOU** ✅

### Step 9 — Review proposed schema — **YOU**

1. In the repo, open **docs/SUPABASE-MIGRATION-PLAN.md** and **supabase/schema.sql** (or the migration file I added).
2. Skim the table and column list. If you rely on any Airtable field that isn’t listed (e.g. a custom Notes or Status column), tell me the exact name and I’ll add it before you run the SQL.

---

- [x] **Step 10** — Apply schema to Supabase staging and prod — **YOU** ✅

### Step 10 — Apply schema to Supabase staging and prod — **YOU**

**Schema file:** [supabase/schema.sql](../supabase/schema.sql) (open in Cursor, Select All → Copy, then paste in Supabase).

**Staging:**

1. Open **app.supabase.com** → select **sunspire-staging** (or your first project).
2. Left sidebar → **SQL Editor** (or **Database** → **SQL Editor**).
3. Click **New query** (or the + tab).
4. Open **[supabase/schema.sql](../supabase/schema.sql)** in Cursor; **Select All** → **Copy**.
5. Paste into the Supabase SQL Editor.
6. Click **Run** (or **Execute**). Confirm no errors.
7. Left sidebar → **Table Editor**. Confirm you see **tenants** and **leads** (and any other tables we added) with the expected columns.

**Prod:**

1. Switch project (top dropdown) to **sunspire-prod**.
2. **SQL Editor** → **New query**.
3. Paste the **same** `supabase/schema.sql` content.
4. **Run**. Confirm no errors.
5. **Table Editor** → confirm same tables exist. (Data will be empty until we import.)

---

## 3. New Supabase data access layer (DAL)

- [x] **Steps 11–14** — Supabase client, DAL, replace Airtable everywhere — **ME** ✅

### Steps 11–14 — Supabase client, DAL, replace Airtable everywhere — **ME**

When we’re on this step: I will add `src/lib/supabase.ts`, `src/lib/db-tenants.ts`, `src/lib/db-leads.ts` (and `db-users.ts` / `db-links.ts` if used), then change every route and caller that currently uses `@/src/lib/airtable` to use the Supabase DAL instead. Airtable is no longer used; Supabase is the only backend. Nothing for you to click.

---

- [x] **Step 15** — Local smoke test of Supabase backend — **YOU** (minimal) + **ME** ✅

### Step 15 — Local smoke test of Supabase backend — **YOU** (minimal) + **ME**

**YOU (only you: .env.local has secrets; run one command):**

1. In the repo root, open or create **.env.local**. Add: `SUPABASE_URL=<staging URL>`, `SUPABASE_SERVICE_ROLE_KEY=<staging secret>` (staging Supabase credentials).
2. Run: **`node scripts/seed-supabase-staging.mjs`** (I will add this script so you don’t insert rows by hand). This seeds one test tenant and one test lead.
3. Tell me “15 done” and I’ll run the API + E2E subset and fix any issues until green.

---

## 4. Route-by-route Supabase migration

- [x] **Steps 16–22** — Wire all routes to Supabase; health/docs; no Airtable left — **ME** ✅

### Steps 16–22 — Wire all routes to Supabase; health/docs; no Airtable left — **ME**

When we’re on this step: I will ensure every route (tenant, leads, dashboard, Stripe webhook, GDPR, health, status, etc.) uses Supabase only; update health and status to check Supabase (not Airtable); and confirm there are no remaining imports or calls to Airtable. Nothing for you to click.

---

## 5. Data migration from Airtable to Supabase

- [ ] **Step 23** — Export Airtable data — **YOU** (only you: Airtable UI → download Tenants + Leads as CSV)

### Step 23 — Export Airtable data — **YOU**

1. Open **airtable.com** → your Sunspire base.
2. **Tenants** table: click the table name or view. **⋮** (three dots) or **View** menu → **Download CSV** (or **Export** → CSV). Save as **tenants.csv** in a folder like **data/airtable/** (do not commit this folder if it has real data).
3. **Leads** table: same → **Download CSV** (or Export CSV). Save as **leads.csv** in the same folder.
4. Tell me where you saved them (e.g. `data/airtable/tenants.csv` and `data/airtable/leads.csv`) so the import script can assume that path or I’ll document it.

---

- [x] **Step 24** — Write import script — **ME** ✅

### Step 24 — Write import script — **ME**

Added **scripts/import-airtable-to-supabase.mjs**. Run: `node scripts/import-airtable-to-supabase.mjs` (uses **data/airtable/tenants.csv** and **data/airtable/leads.csv** by default; optional `--tenants <path>` and `--leads <path>`). Loads .env.local for Supabase URL/key (or _STAGING/_PROD).

---

- [x] **Step 25** — Run import against Supabase staging — **YOU** ✅

### Step 25 — Run import against Supabase staging — **YOU**

1. Open **terminal** in the repo root.
2. Set env vars to **staging** (replace with your real values):
   - `export SUPABASE_URL="https://xxxxx.supabase.co"`
   - `export SUPABASE_SERVICE_ROLE_KEY="sb_secret_xxxx..."`
3. Run: `npx ts-node scripts/import-airtable-to-supabase.ts` (or `node scripts/import-airtable-to-supabase.mjs` if I ship .mjs). If the script expects file paths, I’ll document them (e.g. `--tenants data/airtable/tenants.csv --leads data/airtable/leads.csv`).
4. In **Supabase** (staging): **Table Editor** → **tenants** and **leads**. Check row counts match (or are close to) your Airtable export. Tell me “25 done” or if counts look wrong.

---

- [x] **Step 26** — Validate staging via app — **YOU** (run dev) + **ME** (run Playwright, fix failures) ✅

### Step 26 — Validate staging via app (YOU + ME)

**YOU:** Keep **.env.local** with staging `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Run the app locally (`npm run dev`). In the browser: open a demo URL (e.g. `/?company=TestCo&demo=1`), then `/c/<a-tenant-handle>/leads`, and submit one test lead from the report modal. I’ll run Playwright and fix any failures.

---

- [x] **Step 27** — Repeat import for Supabase prod — **YOU** ✅

### Step 27 — Repeat import for Supabase prod — **YOU**

1. Do a **fresh export** of **Tenants** and **Leads** from Airtable (same as step 23) right before this, to minimize drift. Save as e.g. `~/Downloads/Tenants-Grid view.csv` and `~/Downloads/Leads-Grid view.csv` (or use `data/airtable/tenants.csv` and `data/airtable/leads.csv`).
2. Add **prod** Supabase credentials to **.env.local** (so the script can target prod without overwriting staging):
   - `SUPABASE_URL_PROD` = your **prod** Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY_PROD` = your **prod** Supabase service role key
3. From repo root, run the import **for prod** (uses `--prod` so it reads `_PROD` env vars only):
   ```bash
   node scripts/import-airtable-to-supabase.mjs --prod --tenants "$HOME/Downloads/Tenants-Grid view.csv" --leads "$HOME/Downloads/Leads-Grid view.csv"
   ```
   Or if CSVs are in `data/airtable/`: `node scripts/import-airtable-to-supabase.mjs --prod`
4. In **Supabase** (prod project): **Table Editor** → confirm **tenants** and **leads** row counts.

---

## 6. Remove Zapier completely and add optional notes

**You are here: Step 29.** Do steps in order; do not skip.

- [x] **Step 28** — Remove Zapier completely so it does not interfere with Sunspire — **YOU** (only you: Zapier + Supabase) ✅

### Step 28 — Remove Zapier completely (YOU)

Do these in order so no Zapier automation runs against Sunspire and the Supabase webhook no longer points to Zapier.

---

**28a. Turn off (or delete) every Sunspire-related Zap**

Easiest: **turn the Zap off** with the toggle so it never runs. You can also delete the Zap if you prefer.

1. Open **https://zapier.com** in your browser. Log in.
2. In the **left sidebar**, **click** **"Zaps"**. You will see a list of your Zaps.
3. For **each** Zap that touches Sunspire (e.g. "Untitled Zap Draft" with Catch Hook): **click** the Zap to open it. At the **top** you will see the **"Turn Zap off"** toggle — **click** it so it is **off** (gray, not blue). That toggle only affects *this* Zap, not all Zaps; so if you have more than one Sunspire Zap, open each and turn its toggle off. (To remove a Zap completely instead, use **⋮** → **Delete**.)
4. When done, every Sunspire-related Zap is either off or deleted.

---

**28b. Remove the Supabase Database Webhook that posted to Zapier (exact clicks)**

If you previously created a Supabase webhook that sends new leads to Zapier, remove it so Supabase stops sending data to Zapier.

1. Open **https://app.supabase.com** in your browser. Log in.
2. At the **top left**, **click** the **project dropdown** and select your **production** project (the one where leads are stored — e.g. sunspire-prod).
3. In the **left sidebar**, **click** **"Integrations"** (or find it under Build / Project).
4. **Click** **"Database Webhooks"** (under Postgres Modules or INSTALLED).
5. **Click** the **"Webhooks"** tab (next to Overview).
6. In the list of webhooks, find the one you created for Zapier (e.g. name **leads_to_zapier** or URL containing **hooks.zapier.com**).
7. On that row, **click** the **⋮** (three dots) or **Delete** / trash icon.
8. **Click** **"Delete"** or **"Remove webhook"** to confirm. The webhook is removed; new inserts into `leads` will no longer be sent to Zapier.
9. If you have a **staging** project and created the same webhook there, repeat: switch to **staging** project → **Integrations** → **Database Webhooks** → **Webhooks** tab → delete the Zapier webhook if present.

When step 28 is complete: every Sunspire Zap is deleted (or off), and no Supabase webhook points to Zapier. **Zapier and Airtable do not take the place of or interfere with Sunspire; Supabase is the only store and no Zapier automation runs.**

---

- [x] **Step 29** — Add optional "Any additional comments or notes?" to report lead modal — **ME** + **YOU** (verify) ✅

### Step 29 — Add optional notes field to report lead modal (ME) + verify on paid report (YOU)

**ME (done in code):**

1. **ReportLeadModal.tsx:** One optional form field: label **"Any additional comments or notes? (optional)"**, placeholder e.g. "e.g. timeline, questions, or how you’d like to be contacted". Include it in the `onSubmit` payload as `notes` or `additionalNotes` (and pass it through the existing `onSubmit` callback so the parent receives it).
2. **app/report/page.tsx:** In `handleLeadSubmit`, extend the payload to include `notes: leadData.notes ?? ''` (or the key we use) when calling `POST /api/lead`. The lead API already accepts `body.notes` and stores it in the lead record (`notes: body.notes || ""` in `app/api/lead/route.ts`), so no backend change is required beyond the frontend sending the value.
3. **Dashboard:** GET /api/leads and `/c/<handle>/leads` include **notes** so the white-label owner sees each lead's optional comments in the Leads table.

**YOU — Verify the optional comments box on the paid report page (every button):**

1. Open your browser. In the address bar type your **production or staging report URL** (e.g. `https://<your-app>/report?company=<tenant-handle>` or the full white-label report URL). Press **Enter**.
2. Wait for the **report/quote page** to load (estimate, savings, CTA). Scroll if needed so the main CTA is visible (e.g. **"Book your free consultation"** or **"Get your consultation"**).
3. **Click** that **"Book your free consultation"** (or equivalent) button. The **consultation modal** (popup) opens.
4. In the modal, confirm you see (in order): **First name ***, **Email ***, **Phone (optional)**, then **"Any additional comments or notes? (optional)"** — a text area with placeholder "e.g. timeline, questions, or how you'd like to be contacted". Then "How would you like to be contacted? *" (Call / Email), consent checkbox, and **"Book your consultation"** submit button.
5. Fill **First name**, **Email**, choose **Call** or **Email**. In **"Any additional comments or notes? (optional)"** type a short note (e.g. "Prefer call after 5pm").
6. Check the consent checkbox. **Click** **"Book your consultation"**. Wait for success (toast or modal message).
7. Open the **tenant dashboard**: go to `https://<your-app>/c/<tenant-handle>/leads` (or click **View Leads** from the dashboard). Log in / use API key if the app requires it.
8. Confirm the **Leads** table has a **Notes** column and the lead you just submitted shows your test note in that column. If you have Supabase access, open **Table Editor** → **leads** → find the new row and confirm **notes** is populated.

When step 29 is done: the optional comments box is in the popup on the paid report page, saved to Supabase, and visible to the white-label owner. No Zapier involved.

---

- [x] **Step 30** — Update tests — **ME** ✅

### Step 30 — Update tests — **ME** (done)

Tests are storage-agnostic and Supabase-backed: **tests/e2e/report-lead-modal-notes.spec.ts** (optional notes E2E), **tests/api/route-integration.spec.ts** (POST /api/lead with notes), **getLastLeadForTenant** returns notes. No Airtable in test code.

---

- [x] **Step 31** — Run full matrix locally — **YOU** (.env.local + run dev) + **ME** (run tests, fix)

### Step 31 — Run full matrix locally — **YOU** + **ME**

**YOU:** Ensure **.env.local** has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (staging). From repo root run: `npm run dev`. I’ll run the full Playwright + API suite and fix failures until green. You confirm when I say “run: npm run test:e2e” (or similar) and paste the result if anything fails.

**Local-first flow (do this before pushing):** (1) Ensure `.env.local` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. (2) Terminal 1: `npm run dev`. (3) Terminal 2: **`npm run verify:local`** — waits for server, runs API check, then full Playwright matrix (Chromium). To see the browser: **`npm run verify:local:headed`**. (4) When all pass, Step 31 done; then do Step 32.

**Local URLs:** Demo: `http://localhost:3000/?company=Metaca&demo=1`. Paid: `http://localhost:3000/paid?company=paid`.

---

- [ ] **Step 32** — Run full matrix against staging Vercel — **YOU** (only you: deploy + set Preview env; I’ll give exact test command)

### Step 32 — Run full matrix against staging Vercel (YOU)

1. **Vercel** → your Sunspire project → **Deployments**.
2. Ensure the **supabase-migration** branch is deployed (push the branch if needed; Vercel will build it). Or **Settings** → **Git** → ensure the repo is connected and the branch is in the list.
3. Open the **Preview** deployment URL for **supabase-migration** (from Deployments list).
4. In that deployment, **Settings** → **Environment Variables**: for **Preview**, set staging Supabase (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, **or** `SUPABASE_URL_STAGING` + `SUPABASE_SERVICE_ROLE_KEY_STAGING`). For **Production**, set prod pair or generic keys. Also set `RESEND_API_KEY` if you want installer emails; the lead API uses a **bounded Resend timeout** so a stuck email send cannot cause a 504. Redeploy after env changes.
5. **After deploy is Ready**, in terminal: `BASE_URL=<your-preview-or-prod-url> npm run test:matrix:stable`. Example prod: `BASE_URL=https://sunspire-web-app.vercel.app npm run test:matrix:stable`. When all tests pass, mark Step 32 done.

**Rule:** Do Step 32 only after Step 31 passes locally. Push → wait for deploy → run matrix against live URL.

---

## 8. Production cutover and Airtable removal

- [ ] **Step 33** — Prepare for cutover — **YOU** (only you: pick window, don’t edit Airtable during it)

### Step 33 — Prepare for cutover (YOU)

Pick a quiet time window. During it: don’t edit Airtable manually; avoid creating leads in production if possible until we’ve flipped to Supabase.

---

- [ ] **Step 34** — Final import sync to Supabase prod — **YOU** (only you: export CSV, run script with prod env)

### Step 34 — Final import sync to Supabase prod (YOU)

1. In **Airtable**: export **Tenants** and **Leads** to CSV again (same as step 23).
2. In terminal: set **SUPABASE_URL** and **SUPABASE_SERVICE_ROLE_KEY** to **prod**. Run the import script again so prod has the latest data. Check **Table Editor** in Supabase prod for counts.

---

- [ ] **Step 35** — Flip production to Supabase-only — **YOU** (only you: Vercel env vars + redeploy)

### Step 35 — Flip production to Supabase-only (YOU)

1. **Vercel** → Sunspire project → **Settings** → **Environment Variables**.
2. For **Production** environment:
   - **Edit** (or add) **SUPABASE_URL** → value = your **prod** Project URL. Save.
   - **Edit** (or add) **SUPABASE_SERVICE_ROLE_KEY** → value = your **prod** Secret key. Save.
   - **Delete** (trash icon) **AIRTABLE_API_KEY** and **AIRTABLE_BASE_ID** for Production (app no longer uses them).
3. **Deployments** → find the latest **Production** deployment (usually from **main**) → click **⋮** → **Redeploy**. Wait until the deployment is **Ready**.

---

- [ ] **Step 36** — Post-cutover verification — **YOU** (quick prod check) + **ME** (update VERIFICATION-RESULTS)

### Step 36 — Post-cutover verification (YOU + ME)

**YOU:** On **production**, run a quick pass of both personas: (1) **Sunspire customer:** open dashboard `/c/<handle>`, check leads list `/c/<handle>/leads`, confirm branding/config from Supabase. (2) **Homeowner:** open a white-labeled report URL, submit one **test** lead (e.g. test@sunspire-test.com); confirm it appears in the tenant’s leads list and that notification/Zap (if any) fired. Also check **/api/health** (200, body mentions Supabase or “ok”) and **/status** page loads. Tell me “38 done” or describe any failure. I’ll update **docs/VERIFICATION-RESULTS.md** with the Supabase cutover section.

---

- [ ] **Step 37** — Remove Airtable from codebase entirely — **ME**

### Step 37 — Remove Airtable from codebase entirely — **ME**

When we’re on this step: I will delete `src/lib/airtable.ts`, remove the `airtable` dependency from package.json, remove any remaining Airtable env or references from docs and config, and ensure the app uses only Supabase. Nothing for you to click.

---

- [ ] **Step 38** — Archive Airtable base — **YOU** (only you: Airtable UI)

### Step 38 — Archive Airtable base (YOU)

1. In **Airtable**, open your Sunspire base.
2. **Settings** (gear) or **Base** menu → find **Archive base** or **Duplicate base** (for read-only backup). Optionally archive so it’s no longer editable. The app and Zapier no longer use it.

---

## 9. Final readiness and sign-off

- [ ] **Step 39** — Final doc pass — **ME**

### Step 39 — Final doc pass (ME)

I will update:

- **docs/PRODUCTION-READINESS-FINAL-REPORT.md** — Supabase as DB; remove Airtable references.
- **docs/NEXT-VERIFICATION-STEPS.md** — Mark Airtable removal complete.
- **docs/VERIFICATION-RESULTS.md** — Supabase cutover verification outcomes.
- **MAINTENANCE-GUIDE.md** — Replace all Airtable references with Supabase (env vars, runbooks, health/backup steps, links). Ensure maintenance instructions describe Supabase projects (staging/prod), connection strings, and any new ops steps (e.g. Supabase backups, RLS). **Ensure the “daily check” methods are explicit:** GET /api/health, /status page, UptimeRobot, Sentry — and that the guide states these are the same endpoints/methods that are fully tested so you can rely on them 24/7.
- **TO-DO-LIST.md** — Replace every Airtable reference with Supabase (1.8: Stripe webhook → Supabase Tenants + Resend; bookmarks: airtable.com → Supabase dashboard or remove; 15.3 / FIRST SALE: Airtable → Supabase; Lead delivery / health bullets: Airtable → Supabase). Add under WHERE YOU ARE: **After TEMPORARY-TO-DO-LIST is complete, you are ready for cold email. From then on: follow TO-DO-LIST.md from STEP 2.1 onward + MAINTENANCE-GUIDE.md only. No other checklist.**
- **API & maintenance verification checklist** — Add or update a doc (e.g. `docs/API-AND-MAINTENANCE-VERIFICATION.md`) that lists every API route and every maintenance check (health, status, UptimeRobot, Sentry) with “tested: yes/no” and how to run the check, so you can re-run before go-live and after big changes.

Nothing for you to click.

---

- [ ] **Step 40** — Owner review and “ready to ship” — **YOU** (only you: final sign-off + merge to main)

### Step 40 — Owner review and “ready to ship” (YOU)

1. Open **docs/TEMPORARY-TO-DO-LIST.md** (this file), **docs/SUPABASE-MIGRATION-PLAN.md**, **docs/VERIFICATION-RESULTS.md**, **MAINTENANCE-GUIDE.md**, and **TO-DO-LIST.md**.
2. Confirm: all tests green; production uses Supabase only (no Airtable code or env); Zapier fully removed (no Zaps on, no Supabase webhook to Zapier); maintenance guide and main to-do list describe Supabase only. If anything is off, tell me the step number.
3. If all good: merge **supabase-migration** into **main** (Source Control → **Merge branch** or `git checkout main && git merge supabase-migration && git push`). Migration is **complete** and Sunspire is **ready to ship** — all goals at the top of this doc are met, Supabase is the single source of truth.
4. **From then on:** Open **TO-DO-LIST.md**. Your next action is **STEP 2.1** (or wherever you are). Follow that list for cold email and growth. Follow **MAINTENANCE-GUIDE.md** for daily/weekly/monthly ops. Nothing else required.

---

- [ ] **Step 41** — Final verification gate — **YOU** (run checkboxes on prod) + **ME** (checklist doc + tests)

### Step 41 — Final verification gate: bulletproof & cold-email ready — **YOU** + **ME**

Before you sign off as **ready for cold emailing**, every item below must be verified and checked off.

**Sunspire customer (installer/tenant) — E2E on prod (every part of the dashboard):**

- [ ] Dashboard home (`/c/<handle>`) loads; branding (logo, name, colors) and CRM/setup sections load from Supabase; no Airtable.
- [ ] Leads page (`/c/<handle>/leads`) loads; leads from Supabase appear (name, email, address, phone, notes, submitted); table and “View Leads” flow work; no Airtable.
- [ ] **New-lead flow (backend):** When a homeowner submits the consultation form, POST /api/lead runs → lead is stored in Supabase → lead appears on the tenant’s Leads page; installer gets notification email (Resend) when configured; CRM webhook receives payload when configured. Verified with at least one test submit.
- [ ] Success page (`/c/<handle>/success`) loads after Stripe checkout; subscription/activation flow updates Supabase tenant; no Airtable.
- [ ] Tenant config (CRM webhook URL, notification email) is read from Supabase and used correctly.
- [ ] Every API used by dashboard/tenant flows is covered by tests or a one-off verification (tenant by handle, tenant by subscription ID, list leads).

**Homeowner on white-labeled site — E2E on prod:**

- [ ] White-labeled landing loads with correct company/branding.
- [ ] Report/quote page loads; estimate is generated (NREL/backend); no broken APIs.
- [ ] Consultation modal opens; form submit hits POST /api/lead; success or clear error.
- [ ] Lead is stored in Supabase; installer gets notification email (Resend) when configured; lead appears in tenant’s dashboard (and CRM webhook fires if configured).
- [ ] Every API used by report/lead flow is covered by tests or verification (estimate, geo, lead, tenant lookup).

**Every API and backend — checked:**

- [ ] GET /api/health — returns 200 or 503; body includes Supabase (or DB) check; all dependencies you rely on are listed and probed.
- [ ] GET /api/estimate — tested with valid params; schema/behavior correct.
- [ ] GET /api/geo/normalize (or geo routes) — tested; 200 or expected error.
- [ ] POST /api/lead — validation (400), success (200), and error (500) paths tested; writes to Supabase.
- [ ] /api/tenant, /api/tenant/crm-webhook, /api/admin/create-tenant — exercised and working.
- [ ] POST /api/stripe/webhook — signature rejection (400) and, if possible, one real/simulated event; tenant update in Supabase.
- [ ] /api/gdpr/export and /api/gdpr/delete — tested against Supabase data.
- [ ] /status page — loads; shows all services (Supabase, Stripe, NREL, etc.) with **real** status (not always "operational"); no Airtable. (See Step 43.)
- [ ] Docs/legal routes used in production — reachable and correct (covered by full-docs-and-pages or manual check).

**Maintenance methods/APIs you check daily — fully tested and working:**

- [ ] GET /api/health is the single source of truth; it is tested in CI or prod-smoke; response shape and status (200/503) are asserted.
- [ ] /status page is tested (loads, shows System Status, service list); you can open it daily and rely on it.
- [ ] MAINTENANCE-GUIDE.md and HEALTH-DEPTH.md describe Supabase (not Airtable), list every service health checks, and state that UptimeRobot + Sentry alerts go to support@getsunspire.com; runbooks are accurate.
- [ ] Any script or “daily check” you run (e.g. curl /api/health) is documented and verified to work against production.

**Cold-email ready:**

- [ ] End-to-end path is verified: homeowner on white-labeled report → submit lead → Supabase write → Resend notification (if configured) → lead visible in tenant dashboard (and CRM webhook if configured). No silent failures.
- [ ] Rate limiting and validation on /api/lead are in place; abuse won’t break the app.
- [ ] You have run at least one full live test (real or test tenant + test lead) and confirmed delivery and visibility; ready to send cold traffic to white-labeled links.

**ME:** I will add or update an **API & maintenance verification checklist** (e.g. in docs or as a test file) that lists every route and maintenance check above so it can be run before go-live and after any big change. I will ensure the test suite (Playwright + API tests) covers as many of these as possible; the rest are documented as manual runbook steps.

**YOU:** Run through the checkboxes above on **production** (or staging first, then prod). Check off each item when verified. If any fails, fix before declaring bulletproof and cold-email ready.

---

## 10. Status page and synthetic monitoring (post-merge to main)

After **supabase-migration** is merged to **main** and production is deployed from main, complete the following so the status page and synthetic monitoring are fully correct and trustworthy on live.

- [ ] **Step 42** — Synthetic tests and status page on main — **ME** + **YOU**

### Step 42 — Synthetic tests and status page on main (ME + YOU)

**Goal:** Ensure both synthetic tests fully work on the status page, results are accurate, and you can check visually on **live (main)** and finalize that it's there.

**ME:**

1. After merge to main and production deploy: run both synthetic tests against production (`SYNTHETIC_BASE_URL=<prod-url> npm run test:synthetic:homeowner` and `test:synthetic:buyer`). Fix any failures.
2. Confirm the workflow (or manual run) posts results to production `/api/synthetic-results` and that GET returns the payload.
3. Ensure the status page displays the **Synthetic monitoring** section with **Homeowner flow** and **Buyer checkout flow** rows, PASS/FAIL/DEGRADED, last run time, and summary — and that the format matches the rest of the page (see `tests/synthetics/status-page-synthetic-display.spec.ts`). Run `SYNTHETIC_APP_URL=<prod-url> npm run test:synthetic:status` against production and fix until all three tests pass (section present, data accurate, visual snapshot within tolerance).
4. Document in **docs/SYNTHETIC-MONITORING.md** that post-merge verification is done and that live status URL is the production `/status` page.

**YOU:**

1. Open **production** (main) in the browser and go to **/status**.
2. Confirm the **Synthetic monitoring** section is visible and shows **Homeowner flow** and **Buyer checkout flow** with correct status (PASS/FAIL) and last run time.
3. Optionally trigger the "Synthetic monitoring" workflow in GitHub Actions, wait for it to finish, refresh **/status** on production, and confirm the displayed results match the run (e.g. both PASS and updated timestamp). Visually finalize that synthetic monitoring is live and correct on main.

---

- [ ] **Step 43** — Status page reflects real API state (not always "working") — **ME**

### Step 43 — Status page reflects real API state (ME)

**Goal:** The status page must show whether **each** API/service is actually working or not — not just always saying they're operational. If an API is down, the page should display it as down/degraded so you can rely on it when something is ever not working.

**ME:**

1. **Review current behavior:** Confirm `/api/health` (and thus the status page) probes each dependency (Supabase, Stripe, NREL, EIA, Google Geocoding/Places, Resend, Vercel KV, USGS 3DEP, etc.) and returns per-service status (`ok` / `degraded` / `down`) and that the status page renders each row with the correct label and status (Operational / Degraded / Down). See `app/status/page.tsx` and `app/api/health/route.ts`.
2. **Add tests that fake failures:** Add tests (e.g. in `tests/api/` or `tests/e2e/`) that:
   - Call GET `/api/health` (or load `/status`) under normal conditions and assert the response/page shows the expected services and that at least one service is reported (e.g. Supabase or a configured service).
   - **Simulate or mock one or more APIs as failing** (e.g. in a test that mocks the health route's dependencies, or a dedicated test environment where an env is unset or a probe is forced to fail). Assert that the health response includes that service with status `degraded` or `down` (and optionally error message).
   - Load the **status page** (or its data) in a test and assert that when health returns a service as `down` or `degraded`, the page displays that service as **Down** or **Degraded** (not Operational). So: fake "not working" → assert the status page shows "not working" for that service.
3. **Document:** In **docs/API-HEALTH-COVERAGE.md** or **docs/SYNTHETIC-MONITORING.md** (or a short "Status page verification" section), note that (a) each API/service is probed by `/api/health`, (b) the status page displays the real state from health, and (c) tests exist that verify a failed (or mocked-failed) service appears as down/degraded on the status page so you can trust the page when something is ever not working.

**Outcome:** When any dependency is actually down or degraded, the status page will correctly show it as such; tests guard against the page always showing "operational" regardless of real state.

---

## 11. Hands-off and 100% shippable (ready for cold email)

- [ ] **Step 44** — UptimeRobot + Sentry alerts verified — **YOU**

### Step 44 — UptimeRobot + Sentry alerts verified (YOU)

1. **UptimeRobot:** Log in. Confirm a monitor for production GET /api/health. Alert Contacts = support@getsunspire.com (or your email). Test that you get an alert when status is not 200.
2. **Sentry:** Project Settings → Alerts. Alerts to support@getsunspire.com on new issues. Test if needed. Daily check = UptimeRobot + /status + Sentry only (per MAINTENANCE-GUIDE).

---

- [ ] **Step 45** — Single source for maintenance — **ME**

### Step 45 — Single source for maintenance (ME)

I will ensure MAINTENANCE-GUIDE.md is the single place for daily/weekly/monthly ops: Airtable → Supabase; daily check = UptimeRobot + /status + Sentry. Add one line: Hands-off after go-live: follow only MAINTENANCE-GUIDE for ongoing ops. Nothing for you to click.

---

- [ ] **Step 46** — Cost and usage awareness (optional) — **YOU**

### Step 46 — Cost and usage awareness (YOU)

Set alerts or caps so you are not surprised by bills: Stripe (billing alert), Resend (usage alert if offered), Supabase (spend cap or alert), Vercel (usage alert). Note in MAINTENANCE-GUIDE or calendar: Monthly quick check Stripe/Resend/Supabase/Vercel usage.

## When this list is complete — you are ready

When **every step in this document** is checked off (1 through 46):

1. **Migration is complete.** Airtable and Zapier are **fully gone** — no Airtable code or env, no Zaps running, no Supabase webhook to Zapier. Supabase is the single source of truth. Production is bulletproof and tested. You are **ready for cold email**.

2. **All you have to do next (only two things):**
   - **Cold email:** Open **TO-DO-LIST.md** and follow from **STEP 2.1** onward (Instantly, Snov.io, Google Workspace, DNS, campaigns, Add Leads, sequence, launch, first sale, scale). That list is your only operational checklist for getting to 1,000 customers.
   - **Maintenance:** Open **MAINTENANCE-GUIDE.md** and check health/status/UptimeRobot/Sentry **however and whenever that guide specifies** (e.g. daily quick check, weekly review, monthly backup). That guide is your only maintenance checklist.

3. **These two docs work together.** You do cold email (TO-DO-LIST) and maintenance (MAINTENANCE-GUIDE). No other checklist is required. When you finish this temporary list, you only press the buttons in TO-DO-LIST and MAINTENANCE-GUIDE and Sunspire runs flawlessly.

---

**When you’re ready for the next step,** say so (e.g. “next step” or “on to step 11”). I’ll do every **ME** step when we’re on it; you do every **YOU** step when we’re on it. When all steps are done, all goals at the top are met and Sunspire is ready to ship.
