# Production checklist (owner)

## What to actually use

**Click through live prod in order (simple):**  
→ **[`docs/TEMPORARY-TO-DO-LIST.md`](./TEMPORARY-TO-DO-LIST.md)** — **Step 46** + **Step 47** under the title (**1–51** + **52–55**; DEMO/PAID/INSTALLER legend; full duplicate in §11).

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
