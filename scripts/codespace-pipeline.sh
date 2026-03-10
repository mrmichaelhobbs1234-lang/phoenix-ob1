#!/usr/bin/env bash
# ================================================================
# PHOENIX OB-1 — 20-STEP CODESPACE CHAOS MAGIC PIPELINE
# v135-MAX-CHAOS | 2026-03-10
# Run from: /workspaces/phoenix-ob1
# Paste each step output back to audit AI
# ================================================================

set -euo pipefail
WORKER_URL="https://phoenix-ob1.mrmichaelhobbs1234.workers.dev"

step() { echo ""; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; echo "  STEP $1 — $2"; echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; }

# ----------------------------------------------------------------
step 1 "GIT SITUATION CHECK"
git status
git log --oneline -5

# ----------------------------------------------------------------
step 2 "REPO STRUCTURE TRUTH"
find . -not -path './.git/*' -not -path './node_modules/*' | sort

# ----------------------------------------------------------------
step 3 "ENTRYPOINT TRUTH"
grep 'main\s*=' wrangler.toml
grep '^name' wrangler.toml
grep 'WORKER_VERSION' src/reincarnate.js | head -1

# ----------------------------------------------------------------
step 4 "CHAOS HOOKS VERIFIED IN CODE"
grep -n 'VOIDPHEROMONE\|injectChaos\|CHAOS_PROBABILITY\|CHAOS_LEVEL\|CHAOS_LEVELS' src/reincarnate.js

# ----------------------------------------------------------------
step 5 "MIGRATION TAG GUARDIAN"
grep -E 'v1-genesis|v2-student-profiles|v3-ledger-physics|v4-rate-limiter' wrangler.toml

# ----------------------------------------------------------------
step 6 "DEPENDENCY + WRANGLER VERSION"
npx wrangler --version
node --version
cat package.json | python3 -c "import json,sys;d=json.load(sys.stdin);print('name:',d['name'],'version:',d.get('version','?'))"

# ----------------------------------------------------------------
step 7 "DRY RUN BUNDLE"
npx wrangler deploy --dry-run --outdir /tmp/phoenix-bundle 2>&1 | tail -20
echo "Bundle files:"
ls /tmp/phoenix-bundle/ 2>/dev/null || echo "(no bundle dir)"

# ----------------------------------------------------------------
step 8 "HASH SEAL"
HASH=$(sha256sum src/reincarnate.js | cut -d' ' -f1)
VHASH=$(sha256sum validators/student-profile.js | cut -d' ' -f1)
WHASH=$(sha256sum wrangler.toml | cut -d' ' -f1)
echo "reincarnate.js:       $HASH"
echo "student-profile.js:   $VHASH"
echo "wrangler.toml:        $WHASH"
export REINCARNATE_HASH=$HASH

# ----------------------------------------------------------------
step 9 "LIVE WORKER — PRE-DEPLOY STATE"
curl -s --max-time 10 $WORKER_URL/health | python3 -m json.tool || echo "UNREACHABLE"

# ----------------------------------------------------------------
step 10 "DEPLOY TO CLOUDFLARE"
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "⚠️  CLOUDFLARE_API_TOKEN not set — skipping deploy"
  echo "Set it with: export CLOUDFLARE_API_TOKEN=your_token"
else
  npx wrangler deploy --config ./wrangler.toml ./src/reincarnate.js
  echo "✅ DEPLOYED"
fi

# ----------------------------------------------------------------
step 11 "PROPAGATION WAIT"
echo "Waiting 15 seconds..."
sleep 15

# ----------------------------------------------------------------
step 12 "SMOKE: /health"
curl -s --max-time 15 $WORKER_URL/health | python3 -m json.tool

# ----------------------------------------------------------------
step 13 "SMOKE: /evidence"
curl -s --max-time 15 $WORKER_URL/evidence | python3 -m json.tool

# ----------------------------------------------------------------
step 14 "SMOKE: /ledgerverify"
curl -s --max-time 15 $WORKER_URL/ledgerverify | python3 -m json.tool

# ----------------------------------------------------------------
step 15 "SMOKE: /watchdog"
curl -s --max-time 15 $WORKER_URL/watchdog | python3 -m json.tool

# ----------------------------------------------------------------
step 16 "SMOKE: /chaos state"
curl -s --max-time 15 $WORKER_URL/chaos | python3 -m json.tool

# ----------------------------------------------------------------
step 17 "SMOKE: /chat rate-limited"
curl -s --max-time 15 -X POST \
  -H 'Content-Type: application/json' \
  -d '{"message":"ping v135","sessionId":"codespace-smoke-001"}' \
  $WORKER_URL/chat | python3 -m json.tool

# ----------------------------------------------------------------
step 18 "SMOKE: CORS preflight"
STATUS=$(curl -so /dev/null -w '%{http_code}' --max-time 15 \
  -X OPTIONS \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Origin: https://obiana.ai' \
  $WORKER_URL/chat)
echo "CORS preflight status: $STATUS"
[ "$STATUS" = "200" ] && echo "✅ CORS OK" || echo "❌ CORS FAILED: $STATUS"

# ----------------------------------------------------------------
step 19 "SEAL KV EVIDENCE HASH"
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "⚠️  CLOUDFLARE_API_TOKEN not set"
  echo "Run manually after setting token:"
  echo "  npx wrangler kv:key put --binding=SOUL_DNA WORKER_SRC_HASH $REINCARNATE_HASH"
else
  npx wrangler kv:key put --binding=SOUL_DNA WORKER_SRC_HASH "$REINCARNATE_HASH"
  echo "✅ Evidence hash sealed in KV"
fi

# ----------------------------------------------------------------
step 20 "FINAL SEAL REPORT"
echo ""
echo "═══════════════════════════════════════════════"
echo "  🔥 PHOENIX OB-1 v135-MAX-CHAOS — SEAL"
echo "═══════════════════════════════════════════════"
echo "  Timestamp:  $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  HEAD:       $(git log --oneline -1)"
echo "  Hash:       $REINCARNATE_HASH"
echo "  Worker:     $WORKER_URL"
echo "═══════════════════════════════════════════════"
echo ""
echo "PIPELINE COMPLETE. Paste this output to audit AI."
