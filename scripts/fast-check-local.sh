#!/usr/bin/env bash
set -euo pipefail

DEFAULT_BASE="http://localhost:3001"   # swap if your dev port differs
BASE_URL="${1:-$DEFAULT_BASE}"

echo "▶ FAST CHECK (local, headed) → $BASE_URL"
node scripts/run-verify.js "$BASE_URL"

echo "▶ Git commit & push"
git add -A
git commit -m "fast-check: apply change + verify locally"
git push

echo "✅ FAST CHECK done (local verified, changes pushed)"
