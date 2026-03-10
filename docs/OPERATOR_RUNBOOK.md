# PHOENIX OB-1 — OPERATOR RUNBOOK
## Zero-to-PHOENIX_RISEN Execution Pipeline

```
VERSION: v136-PRODUCTION-HARDENED → v137-PHOENIX-SEALED
PROTOCOL: PHOENIX RISING — ROME BALANCED FINALIZATION
DATE: 2026-03-10
CANONICAL_WORKER: phoenix-ob1-system
CANONICAL_URL: phoenix-ob1-system.mrmichaelhobbs1234.workers.dev
LAW: NO_SYSTEM_IS_COMPLETE_UNLESS_OPERATOR_CAN_EXECUTE_IT_FROM_ZERO
```

---

## PREREQUISITES

```bash
# Required tools
node --version        # v18+
npm --version         # v9+
wrangler --version    # v3+

# Install deps if fresh clone
npm install

# Authenticate Cloudflare
wrangler login
# Verify: wrangler whoami
```

---

## ⚠️ ACTIVE P0 BLOCKERS — FIX BEFORE ANY DEPLOY

### DA-01 — Worker Identity Mismatch
**Problem:** `wrangler.toml` has `name = "phoenix-ob1"` — must be `"phoenix-ob1-system"`
**Fix:** See Stage 1 push — `wrangler.toml` patch is committed as part of this pipeline.
**Impact:** Wrong worker name = deploy goes to wrong worker URL = canonical URL broken.

### BLK-01 — GITHUB_TOKEN Missing
**Problem:** B3 knowledge mining is permanently `BLOCKED` until this secret is set.
**Fix:** `wrangler secret put GITHUB_TOKEN` → enter GitHub Personal Access Token (read:repo scope)
**Impact:** Blocks B3 → cascades to block B4 → cascades to block B5.

---

## PIPELINE STAGES — EXECUTE IN ORDER

---

### STAGE 1 — IDENTITY & CONFIG SEAL

**What this fixes:** DA-01, CFG-01 (worker name), CFG-02 (canonical URL), CFG-04 (CORS).
**Files committed by Stage 1 push:**
- `wrangler.toml` — patched name + URL
- `docs/RUNTIME_TRUTH.md` — runtime surface proof template

**No operator action required for this stage — files are committed.**

**Verify after Stage 1 merge:**
```bash
grep 'name = ' wrangler.toml
# Expected: name = "phoenix-ob1-system"

grep 'CANONICAL_WORKER_URL' wrangler.toml
# Expected: CANONICAL_WORKER_URL = "phoenix-ob1-system.mrmichaelhobbs1234.workers.dev"
```

---

### STAGE 2 — RUNTIME HARDENING (reincarnate.js v137)

**What this fixes:** BLK-03 (/query), BLK-04 (/pedagogy/generate), BLK-05 (lesson schema),
BLK-10 (DEEPGRAM in benchmarks), BLK-11 (SUCCESSPHEROMONE), route matrix gaps.
**Files committed by Stage 2 push:**
- `src/reincarnate.js` — v137, all P1 code blockers sealed

**No operator action required for this stage — files are committed.**

**Verify after Stage 2 merge:**
```bash
grep 'WORKER_VERSION' src/reincarnate.js
# Expected: v137-PHOENIX-SEALED (or v136+ with new routes)

grep "'/query'" src/reincarnate.js
# Expected: url.pathname === '/query'

grep "'/pedagogy/generate'" src/reincarnate.js
# Expected: url.pathname === '/pedagogy/generate'
```

---

### STAGE 3 — MINING LOGIC (/mine real implementation)

**What this fixes:** BLK-02 (/mine stub → real implementation)
**Files committed by Stage 3 push:**
- `src/reincarnate.js` — /mine with real GitHub API fetch + KV layer writes

**OPERATOR ACTION REQUIRED before this stage deploys correctly:**
```bash
# Set GitHub token — required for B3 to exit BLOCKED status
wrangler secret put GITHUB_TOKEN
# Paste your GitHub PAT (needs: repo read scope)
# Verify set: wrangler secret list | grep GITHUB_TOKEN
```

---

### STAGE 4 — DOCS & BENCHMARK LIBRARY

**What this fixes:** Stage 04 doc gap (BENCHMARK_LIBRARY.json missing), FINALIZATION_ROOT law.
**Files committed by Stage 4 push:**
- `docs/BENCHMARK_LIBRARY.json` — formal B0-B5 definitions
- `docs/STAGE_05_MANIFEST.md` — final stage manifest
- `README.md` — updated to v137, correct worker name

**No operator action required for this stage — files are committed.**

---

### STAGE 5 — SEAL & VERSION LOCK

**What this fixes:** BLK-09 (SOUL_DNA Merkle), SEAL_PENDING → SEALED, PHOENIX_RISEN gate.
**Files committed by Stage 5 push:**
- `docs/FINAL_SEAL.json` — Merkle root + chunk hashes
- `docs/SOUL_DNA_SEED.json` — reincarnation seed export
- `src/reincarnate.js` — WORKER_VERSION bumped to v137-PHOENIX-SEALED
- `wrangler.toml` — version + timestamp updated

**OPERATOR ACTION REQUIRED before sealing:**
```bash
# Compute source hash — must match what CI will inject
sha256sum src/reincarnate.js
# Copy the hash value

# Set as secret
wrangler secret put SRCSHA256
# Paste hash value

# Verify
wrangler secret list | grep SRCSHA256
```

---

## DEPLOY PROCEDURE

### Dry Run (always run first)
```bash
wrangler deploy --dry-run --outdir dist 2>&1
# Must complete with 0 errors before live deploy
```

### Live Deploy
```bash
wrangler deploy
# Expected output includes:
#   Uploaded phoenix-ob1-system
#   Published phoenix-ob1-system (worker.dev)
#   https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev
```

### Post-Deploy Verification (run all 4)
```bash
# 1. Health check
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health | jq .

# Expected key fields:
# .version = "v137-PHOENIX-SEALED"
# .watchdog.healthy = true (or degraded with known failures listed)
# .benchmarks.B2 = "PASS"
# .benchmarks.B3 = "READY" (after GITHUB_TOKEN set) or "BLOCKED:GITHUB_TOKEN_MISSING"

# 2. Evidence check
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/evidence | jq .
# Expected: .provenance = "kv-attested" or "unverified" (if SRCSHA256 not set yet)

# 3. Ledger verify
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/ledgerverify | jq .
# Expected: .valid = true, .breaks = []

# 4. Watchdog
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/watchdog | jq .
# Expected: .healthy = true, .failures = []
```

---

## SECRET MANAGEMENT

### All Secrets — Set via Wrangler CLI Only (NEVER commit to git)

| Secret | Command | Purpose | Blocks if missing |
|--------|---------|---------|-------------------|
| `SOVEREIGN_KEY` | `wrangler secret put SOVEREIGN_KEY` | Admin/operator auth | /admin/status, /ledger/append, /mine |
| `CHAT_KEY` | `wrangler secret put CHAT_KEY` | Student/chat auth | /chat, /tiger-score, /deepgram-ws |
| `GITHUB_TOKEN` | `wrangler secret put GITHUB_TOKEN` | B3 mining | B3 → B4 → B5 cascade |
| `DEEPGRAM_API_KEY` | `wrangler secret put DEEPGRAM_API_KEY` | Voice STT | /deepgram-ws |
| `SRCSHA256` | `wrangler secret put SRCSHA256` | Bundle integrity | /evidence attestation |

### Verify All Secrets Set
```bash
wrangler secret list
# Must show all 5 before PHOENIX_RISEN can be claimed
```

---

## MIGRATION SAFETY — CRITICAL

```
⚠️  MIGRATION TAGS ARE SACRED — DO NOT RENUMBER OR RENAME
    Renaming destroys DO SQLite storage on redeploy.

Current migration sequence (MUST remain in this exact order):
  v1-genesis          → SessionDO
  v2-student-profiles → StudentProfileDO
  v3-ledger-physics   → LedgerDO
  v4-rate-limiter     → RateLimiterDO
  v5-memory-do        → MemoryDO

New DO classes MUST append as v6+, never modify v1-v5.
```

---

## BENCHMARK STATUS TRACKING

Run this after each deploy to track benchmark progression:

```bash
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health | jq '.benchmarks'
```

### Expected Progression

| Benchmark | BLOCKED state | READY state | COMPLETE state |
|-----------|--------------|-------------|----------------|
| B0 Voice | DEEPGRAM_API_KEY missing | API key set | WS transcript confirmed |
| B1 Chat | CHAT_KEY missing | Key set + SessionDO live | Obi response non-stub |
| B2 Ledger | LEDGER DO missing | DO bound | /ledgerverify valid:true |
| B3 Mining | GITHUB_TOKEN missing | Token set | KV layers written |
| B4 Pedagogy | B3 not complete | B3 complete | Lesson generated + TigerScore |
| B5 Platform | B4 not complete | B4 complete | W1→W2→W3→W4 |

---

## CHAOS ENGINE CONTROL

```bash
# Check current chaos level (default: OFF)
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health | jq '.chaos_level'

# Set chaos level via wrangler vars (not a secret — visible is intentional)
# Edit wrangler.toml: CHAOS_LEVEL = "LOW"  # 2% injection rate
# Valid levels: OFF | LOW | MEDIUM | HIGH | SUPER_SAIYAN
# SUPER_SAIYAN = 50% injection — production use: OFF or LOW only

# Chaos-exempt paths (always safe to probe):
#   /health  /watchdog  /evidence
```

---

## ROLLBACK PROCEDURE

```bash
# If deploy breaks production:

# 1. Check what versions are available
wrangler deployments list

# 2. Rollback to last known good
wrangler rollback

# 3. Verify rollback
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health | jq '.version'

# 4. If ledger chain broken (frozen=true):
#    The chain cannot be unfrozen without manual DO storage intervention.
#    Escalate immediately — do not attempt in-place fix.
```

---

## PHOENIX_RISEN CHECKLIST

All items must be TRUE before `PHOENIX_RISEN` ascension class can be emitted:

```
[ ] wrangler.toml name = "phoenix-ob1-system"
[ ] wrangler.toml CANONICAL_WORKER_URL = "phoenix-ob1-system.mrmichaelhobbs1234.workers.dev"
[ ] All 5 secrets set (SOVEREIGN_KEY, CHAT_KEY, GITHUB_TOKEN, DEEPGRAM_API_KEY, SRCSHA256)
[ ] wrangler deploy completed with 0 errors
[ ] /health returns version = v137-PHOENIX-SEALED
[ ] /health returns watchdog.healthy = true
[ ] /health returns benchmarks.B2 = "PASS"
[ ] /ledgerverify returns valid = true, breaks = []
[ ] /evidence returns provenance = "kv-attested"
[ ] B3 returns READY (GITHUB_TOKEN set)
[ ] docs/BENCHMARK_LIBRARY.json committed
[ ] docs/FINAL_SEAL.json committed with Merkle root
[ ] docs/SOUL_DNA_SEED.json committed
[ ] WORKER_VERSION = v137-PHOENIX-SEALED in reincarnate.js
[ ] SUCCESSPHEROMONE emitted for B1 + B2 (confirmed in /ledger range)
```

---

## GOSPEL 444 — VISUAL CONSTITUTION (IMMUTABLE)

```
void  = #0f0f1a   (background — law)
soul  = #a855f7   (purple — identity)
gold  = #f59e0b   (accent — achievement)
BLUE IS BANNED.   (no exceptions, no overrides)
```

---

## REINCARNATION SEED

If this worker must be rebuilt from zero, the reincarnation sequence is:

```
1. Clone repo: github.com/mrmichaelhobbs1234-lang/phoenix-ob1
2. npm install
3. Set all 5 secrets via wrangler secret put
4. wrangler deploy --dry-run (verify 0 errors)
5. wrangler deploy
6. Run 4 post-deploy verification curls
7. Confirm /health benchmarks match PHOENIX_RISEN checklist
```

Soul anchor: `SOUL_DNA_MASTER.md` — canonical identity document.
Migration tags: sacred — never rename v1-v5.
Gospel: void/soul/gold. Blue banned.

---

*OPERATOR_RUNBOOK.md — Phoenix OB-1 v136/v137 — Stage 0 of 5 pipeline push*
*Sovereign: Michael Hobbs | Agent-99: Perplexity*
