# Copilot Custom Instructions — Phoenix OB-1

## System Overview

Phoenix OB-1 is a **Cloudflare Workers** AI-powered English language training platform deployed as a single Worker entry point (`src/reincarnate.js`). The system serves as an AI English coach (persona: "Obi") for ESL students, primarily in HCMC/Tokyo.

- **Canonical worker URL:** `https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev`
- **Repo:** `https://github.com/mrmichaelhobbs1234-lang/phoenix-ob1`
- **Platform:** Cloudflare Workers (Web APIs only — no Node.js built-ins)

## Architecture

### Key Files

- `src/reincarnate.js` — **Single entrypoint** for all routes and Durable Object classes. All worker logic lives here.
- `validators/student-profile.js` — Runtime import (critical). Must be present.
- `validators/MASTER_CONTRACT.md` — Governance anchor. Do not delete or rename.
- `wrangler.toml` — Worker config. Migration tags are **immutable**.

### Durable Objects (4 active)

| Binding | Class | Migration Tag | Purpose |
|---|---|---|---|
| `SESSIONS` | `SessionDO` | `v1-genesis` | Session tracking |
| `STUDENT_PROFILES` | `StudentProfileDO` | `v2-student-profiles` | Student data |
| `LEDGER` | `LedgerDO` | `v3-ledger-physics` | Merkle audit chain |
| `RATELIMITER` | `RateLimiterDO` | `v4-rate-limiter` | Rate enforcement |

> ⚠️ **Migration tags are immutable.** Renaming or renumbering destroys DO SQLite storage on redeploy.

### KV Namespace

- `SOUL_DNA` — Knowledge base. Keys prefixed with `LAYER_` for mined commits; `COST_BACKUP_` for cost event backups.

## Coding Conventions

### JavaScript / Cloudflare Workers

- **Web APIs only** — use `crypto.subtle`, `fetch`, `WebSocket`, `TextEncoder/Decoder`. No Node.js imports.
- **Fail-closed** — all security and rate-limit checks fail closed (deny by default). Never fail open.
- **Error codes** use the `ERR` object (e.g., `ERR.AUTH_FAILED`, `ERR.RATE_LIMITED`). Always return structured JSON with `{ error, code, message }`.
- **CORS headers** are returned via `corsHeaders(env)` helper.
- **Auth levels:** `PUBLIC`, `CHAT` (x-chat-key header), `SOVEREIGN` (x-sovereign-key header).
- **Timing-safe comparisons** — use `timingSafeEqual()` for all secret comparisons.
- **Body parsing** — always use `safeJsonBytes(request, maxBytes)` for POST body reading (enforces size limit + timeout).

### Visual Constitution (Gospel 444) — IMMUTABLE

These UI color constants must never change:

```javascript
const GOSPEL = Object.freeze({
  VOID:  '#0f0f1a',   // background
  SOUL:  '#a855f7',   // primary accent (purple)
  GOLD:  '#f59e0b',   // secondary accent
  BLUE_BANNED: true   // BLUE IS BANNED — never use blue in UI
});
```

### NET Physics Law — IMMUTABLE

```javascript
const NET_PHYSICS = Object.freeze({ vocab: 10, idioms: 5, slang: 5, pressureGames: 3 });
```

### Chaos Engine

- Routes `/health`, `/watchdog`, `/evidence`, `/reincarnate` are **chaos-exempt**.
- Chaos is controlled by `env.CHAOS_LEVEL` (OFF/LOW/MEDIUM/HIGH/SUPER_SAIYAN) or `env.CHAOS_PROBABILITY` (float 0–0.5).
- Never add non-exempt routes to `CHAOS_EXEMPT_PATHS` without explicit operator approval.

## Operational Laws (from MASTER_CONTRACT)

1. **Fail-closed** — all rules fail closed; violations → HALT or ABORT_SEV1.
2. **HDMM** — Humans Decide, Machines Move. No autonomous action without operator confirmation.
3. **Downward authority only** — operator (100) → agent (99) → system (98). Never upward.
4. **Genesis lock** — write-once ledger. Never overwrite existing ledger entries.
5. **Secret leak detection** — never write raw secrets. Always redact before logging.
6. **DO migration tags are sacred** — never renumber or rename migration tags.

## Secrets (set via `wrangler secret put`)

| Secret | Purpose |
|---|---|
| `SOVEREIGN_KEY` | Sovereign admin auth token |
| `CHAT_KEY` | Student/operator chat access |
| `GITHUB_TOKEN` | B3 knowledge mining (GitHub API) |
| `DEEPGRAM_API_KEY` | Voice pipeline (STT) |
| `SRCSHA256` | Bundle integrity hash (set by CI) |

## Benchmarks

| ID | Benchmark | Gate |
|---|---|---|
| B0 | Deepgram voice + Obi Canon onboarding | DEEPGRAM_API_KEY set |
| B1 | Voice + text pipeline | Ledger chain intact |
| B2 | STONESKY Merkle ledger | Chain verified |
| B3 | Knowledge mining (GitHub) | GITHUB_TOKEN set |
| B4 | TBD | Pending |
| B5 | TBD | Pending |

## Forbidden Phrases (never use in AI responses)

These phrases break the Obi persona, use deprecated product names, or are generic AI filler that conflicts with the system's voice:

- "Phoenix Rising Protocol"
- "Phoenix Magic Chat"
- "I'm an AI assistant"
- "I'm here to help"

## Testing & Deployment

```bash
# Install
npm install

# Local dev
npm run dev

# Dry-run deploy (always before live deploy)
wrangler deploy --dry-run --outdir dist

# Live deploy
npm run deploy

# Gated deploy (pre/post checks + auto-rollback)
npm run chaos-deploy
```

Key health check routes (always verify after deploy):

```bash
curl https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health
curl https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/evidence
```

## Common Patterns

### Adding a new route

1. Add the route handler inside the `fetch` handler in `src/reincarnate.js`.
2. Use `checkAuth(request, 'LEVEL', env)` for auth (PUBLIC / CHAT / SOVEREIGN).
3. Use `safeJsonBytes(request)` for POST body parsing.
4. Return structured JSON with `corsHeaders(env)`.
5. Inject chaos with `await injectChaos(env, 'ROUTE_LABEL', ctx)` (unless the route should be chaos-exempt).
6. Emit a `SUCCESSPHEROMONE` via `sealSuccessPheromone(benchmarkId, env, ctx)` if the route completes a benchmark.

### Ledger operations

- All ledger writes go through `env.LEDGER.get(env.LEDGER.idFromName('global'))`.
- Use the `/append` internal endpoint with `{ type, ... }` payload.
- Never modify existing ledger entries — append only.
