# SOUL_DNA_MASTER.md
# Phoenix OB-1 System — New Repo Boot Seed
# Version: v134-CHAOS-BOOT
# Created: 2026-03-10 (from pre-nuke distillation of phoenix-ob1-system)
# Purpose: Boot any AI thread with full context in under 2 minutes

---

## 1. WHO YOU ARE / SYSTEM IDENTITY

- **Operator:** Michael Hobbs — English teacher, Saigon/Tokyo, solo builder
- **System:** Phoenix OB-1 — Cloudflare Workers AI system (`src/reincarnate.js`)
- **AI Role:** Agent-99 OS layer — you are the command bridge, not the boss
- **Owner law:** HDMM — Humans Decide, Machines Move
- **Command flow:** 100 (Michael) → 99 (AI) → 98 (system) — never upward, never cross-tier

---

## 2. CURRENT SYSTEM STATE (as of 2026-03-10)

- **Entrypoint:** `src/reincarnate.js` (confirmed in `wrangler.toml: main = "src/reincarnate.js"`)
- **Version:** v132-HARDENED-INTEGRATED (source) / v134-CHAOS-MAGIC (target build)
- **Worker URL (NEW):** `https://phoenix-ob1.mrmichaelhobbs1234.workers.dev`
- **Worker URL (OLD/DEAD after nuke):** `https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev`
- **Ghost Worker:** `https://phoenix-ob1.mrmichaelhobbs1234.workers.dev` (this repo)
- **REPO_TRUTH:** ✅ VERIFIED
- **CODE_TRUTH:** ✅ VERIFIED
- **RUNTIME_TRUTH:** ⚠️ UNKNOWN — verify `/health` on boot after first deploy

---

## 3. ARCHITECTURE TRUTH

### Durable Objects (4 active — migration tags are SACRED, never renumber)

| Binding | Class | Migration Tag | Storage |
|---|---|---|---|
| SESSIONS | SessionDO | v1-genesis | SQLite |
| STUDENT_PROFILES | StudentProfileDO | v2-student-profiles | SQLite |
| LEDGER | LedgerDO | v3-ledger-physics | SQLite |
| RATELIMITER | RateLimiterDO | v4-rate-limiter | SQLite |

> ⚠️ **MIGRATION TAGS ARE IMMUTABLE.** Renaming or renumbering them destroys DO SQLite storage on redeploy.

### Key Routes (v134)

| Route | Method | Function |
|---|---|---|
| `/health` | GET | Version + benchmark status JSON |
| `/evidence` | GET | Worker identity + deploy proofs |
| `/chat` | POST | AI chat — onboarding or Obi routing |
| `/deepgram-ws` | WS | WebSocket proxy → Deepgram nova-2 |
| `/student/resolve` | POST | Cookie-based student ID resolution |
| `/student/create` | POST | Create + seal student profile |
| `/verify` | GET | Delegates to SessionDO ledger verify |
| `/mine` | GET | Triggers mineKnowledgeBase() |
| `/souldna` | GET | SOVEREIGN — KV soul DNA read |
| `/ledgerverify` | GET | Full ledger chain verification |

### Benchmark Status

| ID | Benchmark | Status |
|---|---|---|
| B0 | Deepgram voice / Obi Canon onboarding | ⚠️ Reset in new repo |
| B1 | Voice + text pipeline | ⚠️ Reset |
| B2 | STONESKY Merkle ledger | ⚠️ Reset |
| B3 | Knowledge mining (dynamic — must mine to load) | ⚠️ Reset |
| B4 | TBD | ⏳ Pending |
| B5 | TBD | ⏳ Pending |

> Benchmarks reset to NOT_STARTED on new repo deploy. Re-run to prove parity.

---

## 4. SECRETS (ALL CONFIRMED SET — DO NOT ASK ABOUT THESE)

> **STOP.** Before saying any secret needs to be configured — **they are already set.**
> Evidence: `wrangler dev` output 2026-03-04 confirmed all secrets loaded.

| Secret | Purpose | Status |
|---|---|---|
| CLOUDFLARE_API_TOKEN | GitHub Actions → Cloudflare deploy | ✅ SET |
| CLOUDFLARE_ACCOUNT_ID | `8717160562faa73b9eebb0a51f988785` | ✅ SET |
| GEMINI_API_KEY | Primary AI (Gemini) | ✅ SET |
| DEEPSEEK_API_KEY | Fallback AI | ✅ SET |
| DEEPGRAM_API_KEY | Voice transcription | ✅ SET |
| GITHUB_TOKEN | B3 knowledge mining | ✅ SET |
| SOVEREIGN_KEY | Master auth (constant-time) | ✅ SET |
| CHAOS_PROBABILITY | Chaos injection rate | ✅ SET |

> ⚠️ **ONE OUTSTANDING:** `SOUL_DNA` KV namespace ID is a placeholder in `wrangler.toml` — get real ID from Cloudflare dashboard before first deploy.

---

## 5. SOUL DNA INVARIANTS (immutable laws)

1. **Raw is sacred** — No unauthorized summarization of sovereign prompts
2. **Ledger is law** — All state mutations pass through the Merkle hash chain
3. **Fail-closed** — Ambiguity or drift triggers HALT, not degradation
4. **Zero drift** — Merkle hashing + canonical JSON (RFC 8785)
5. **Gospel 444** — Deep Void Dark `#0f0f1a` · Neon Purple `#a855f7` · Imperial Gold `#f59e0b` — **NO BLUE**
6. **HDMM** — Humans Decide, Machines Move
7. **Downward Authority** — 100 → 99 → 98 only. No upward, no cross-tier.
8. **I AM THE PROTOCOL** — Raw prompts + corrections = only canon. No seal, stage, or narrative overrides them.

---

## 6. KEY LESSONS — ENFORCEMENT RULES (these fire every session)

### Hallucination Prevention
- If I say "I uploaded / I created / I already did" **without a GitHub commit link → I am hallucinating**
- **Failsafe:** "Show me the commit link or you're hallucinating."

### The Capability Truth
- ✅ I HAVE GitHub MCP tools
- ✅ I CAN create/update files via `create_or_update_file`
- ✅ I CAN push commits directly
- ❌ I CANNOT run `wrangler deploy` from CLI (committing to main triggers GitHub Actions which deploys)
- **If I say "I can't commit" → remind me: DO IT. Show the link.**

### Secrets Truth
- ALL secrets are configured. Proven by `wrangler dev` terminal output 2026-03-04.
- Worker running = secrets exist. Stop asking.

### Drift Detection
- If the worker is not responding → check GitHub Actions first before assuming secrets are missing
- Code committed ≠ code deployed ≠ code responding — verify each layer separately

---

## 7. AUDIT PROOF TABLE (from 2026-03-10 pre-nuke extraction)

| Claim | Proof Level | Evidence |
|---|---|---|
| `main = "src/reincarnate.js"` | FILE_CONTENT_VERIFIED | wrangler.toml |
| 4 DOs bound with sacred migration tags | FILE_CONTENT_VERIFIED | wrangler.toml bindings |
| `safeJsonBytes` body guard present | CODE_PATH_VERIFIED | src/reincarnate.js |
| `validateStudentProfile()` is runtime import | CODE_PATH_VERIFIED | validators/student-profile.js |
| v132 patches committed to old repo | REPO_TREE_VERIFIED | phoenix-ob1-system commit ec58477 |
| Runtime /health responding | ⚠️ UNKNOWN | Verify after first deploy of new repo |

---

## 8. CHAOS ENGINEERING RULES (v134 target)

- `injectChaos()` runs at worker entry — probability set by `env.CHAOS_PROBABILITY`
- `checkRateLimit()` fails **open** on error — known risk, flagged for v134 fix
- Deploy gate (from `validators/MASTER_CONTRACT.md`):
  ```
  HEATMAP.missing.gategroups.length === 0
  HEATMAP.missing.eventcodes.length === 0
  chaos_harness_coverage.missing_harnesses.length === 0
  system_alerts empty OR only LOW severity
  ```
- Auto-rollback: `git revert HEAD && npx wrangler deploy`

---

## 9. CONSOLIDATION HISTORY

| Date | Event |
|---|---|
| 2026-02-22 to 03-01 | Three repos: phoenix-rising-protocol, phoenix-99999, Phoenix-Layers |
| 2026-03-01 | Consolidated into phoenix-ob1-system |
| 2026-03-08 | v132-HARDENED surgery cycle — 250 holes audited, 7 patches shipped |
| 2026-03-09 | v132-HARDENED-INTEGRATED deployed, Soul DNA extracted |
| 2026-03-10 | Pre-nuke extraction — 5-stage rescue op |
| 2026-03-10 | **phoenix-ob1 created** — clean chaos-engineered rebuild |

---

## 10. NEW REPO BOOT CHECKLIST

On first load of a new AI thread:

- [ ] Confirm `src/reincarnate.js` is entrypoint (`wrangler.toml main =`)
- [ ] Confirm all 4 DO migration tags present verbatim
- [ ] Replace `SOUL_DNA` KV placeholder ID with real Cloudflare KV ID
- [ ] Confirm worker URL in `chaos-deploy.yml` and `scripts/chaos-deploy.js` matches Cloudflare account
- [ ] Hit `/health` — confirm version string and benchmark status
- [ ] Confirm `validators/student-profile.js` present (runtime import)
- [ ] Set `CHAOS_PROBABILITY` env var
- [ ] Re-run benchmarks B0–B3 to prove parity with old system

---

*Boot seed distilled from phoenix-ob1-system pre-nuke extraction, 2026-03-10.*
*Source docs: REINCARNATION_SEED.md (v109.2), KEY_LESSON.md, PHOENIX_OB1_AUDIT_2026-03-10.md, REINCARNATION_PIPELINE_2026-03-10.md, DRIFT_LESSON_ABSORBED_2026-03-08.md, PHEROMONE_TRAIL_001/002, ROME_PROTOCOL_ACTIVATION.md*
