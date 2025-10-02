#!/usr/bin/env bash
set -euo pipefail

# ===== Required env (configure in CI or export locally) =====
: "${VERCEL_TOKEN:?}"        # Vercel auth token
: "${VERCEL_ORG_ID:?}"       # Vercel org/scope
: "${VERCEL_PROJECT_ID:?}"   # Vercel project id

# ===== Inputs =====
DEFAULT_URL="https://sunspire-web-app.vercel.app/?company=Netflix&demo=1"
RAW_ARG_URL="${1:-}"
export CHECK_URL="${RAW_ARG_URL:-${CHECK_URL:-$DEFAULT_URL}}"

export GIT_SHA="${GIT_SHA:-$(git rev-parse HEAD)}"
export NEXT_PUBLIC_COMMIT_SHA="$GIT_SHA"

echo "🔧 Long Check for commit: $GIT_SHA"
echo "🔗 Target URL: $CHECK_URL"

# Validate URL (must parse; preserves exact casing of path/query)
node -e "try{new URL(process.env.CHECK_URL)}catch(e){process.exit(1)}" || { echo "❌ Invalid CHECK_URL"; exit 1; }

# Parse origin and path+query
read -r PROD_ORIGIN PROD_PATHQUERY <<< "$(
  node -e "const u=new URL(process.env.CHECK_URL);process.stdout.write(u.origin+' ');process.stdout.write(u.pathname+(u.search||''))"
)"

export APP_URL_PROD="${APP_URL_PROD:-$PROD_ORIGIN}"

echo "🏗️  Install & build (stamped with SHA)"
npm ci
npm run build

echo "🚀 Deploy Vercel Preview"
PREVIEW_URL="$(npx vercel --token "$VERCEL_TOKEN" --scope "$VERCEL_ORG_ID" --confirm --prebuilt | tail -n1)"
echo "🔎 Preview URL: $PREVIEW_URL"

# Construct preview target by swapping origin, keeping exact path+query
PREVIEW_TARGET="${PREVIEW_URL}${PROD_PATHQUERY}"

echo "🧪 Fast Check on Preview"
export TARGET_URL="$PREVIEW_TARGET"
export EXPECT_SHA="$GIT_SHA"
node fast-check.js

echo "⬆️  Promote Preview → Production"
npx vercel promote "$PREVIEW_URL" --yes --token "$VERCEL_TOKEN"

echo "🔁 Wait for Production to serve the new commit"
for i in {1..30}; do
  HDR=$(curl -sI "$APP_URL_PROD" | awk -F': ' 'tolower($1)=="x-commit-sha"{print $2}' | tr -d '\r')
  if [ -z "$HDR" ]; then
    HDR=$(curl -s "$APP_URL_PROD/api/version" | sed -n 's/.*"sha":"\([^"]*\)".*/\1/p')
  fi
  echo "   Prod SHA: ${HDR:-<none>} (want $GIT_SHA)"
  [ "$HDR" = "$GIT_SHA" ] && break || sleep 5
  [ $i -eq 30 ] && { echo "❌ Prod never served expected commit"; exit 1; }
done
echo "✅ Prod is on expected commit"

echo "🧪 Fast Check on Production (same path/query)"
PROD_TARGET="${APP_URL_PROD}${PROD_PATHQUERY}"
export TARGET_URL="$PROD_TARGET"
export EXPECT_SHA="$GIT_SHA"
node fast-check.js

echo "🎉 Long Check complete"
