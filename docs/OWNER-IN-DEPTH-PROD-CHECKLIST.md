# Production checklist (owner)

## What to actually use

**Click through live prod in order (simple):**  
→ **[`docs/LIVE-CLICK-CHECKLIST.md`](./LIVE-CLICK-CHECKLIST.md)**

That file has **one example company (TestCo / testco)**, **clickable links** for every Sunspire page, plus **Stripe, UptimeRobot, Sentry, Supabase, Vercel, Resend, GitHub** in a second table.

---

## Optional: automated tests (terminal)

From the repo:

```bash
cd /path/to/sunspire-clean
export ADMIN_TOKEN="your-token"   # optional — skips fewer tests
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod
```

Watch Chromium (faster slow-mo):

```bash
BASE_URL=https://sunspire-web-app.vercel.app npm run verify:temp-list:prod:headed
```

Screenshots after gate spec: folder **`test-results/prod-gate-visual/`** (gitignored).

---

## Then

- **Ops:** [MAINTENANCE-GUIDE.md](../MAINTENANCE-GUIDE.md)  
- **Growth:** [TO-DO-LIST.md](../TO-DO-LIST.md)  
- **Long migration history:** [TEMPORARY-TO-DO-LIST.md](./TEMPORARY-TO-DO-LIST.md) — not required for daily checks
