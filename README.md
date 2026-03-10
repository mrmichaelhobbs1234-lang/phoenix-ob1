# Phoenix OB-1

> v134-CHAOS-MAGIC · Cloudflare Workers · Clean chaos-engineered rebuild

## Entrypoint

`src/reincarnate.js` — confirmed in `wrangler.toml: main = "src/reincarnate.js"`

## Quick Start

```bash
npm install
npm run dev           # local dev
npm run deploy        # deploy to Cloudflare
npm run chaos-deploy  # gated deploy — pre/post checks + auto-rollback
```

## Routes

| Route | Method | Function |
|---|---|---|
| `/` `/magic-chat` `/voice-chat` | GET | Magic Chat UI |
| `/health` | GET | Version + benchmark status |
| `/evidence` | GET | Worker identity + deploy proof |
| `/chat` | POST | AI routing (Gemini → DeepSeek fallback) |
| `/deepgram-ws` | WS | WebSocket proxy → Deepgram nova-2 |
| `/verify` | GET | SessionDO ledger verification |
| `/mine` | GET | Knowledge base mining |
| `/query` | GET | KB lookup |
| `/student/resolve` | POST | Cookie-based student ID resolution |
| `/student/create` | POST | Create + seal student profile |

## Durable Objects

| Binding | Class | Migration Tag |
|---|---|---|
| `SESSIONS` | `SessionDO` | `v1-genesis` |
| `STUDENT_PROFILES` | `StudentProfileDO` | `v2-student-profiles` |
| `LEDGER` | `LedgerDO` | `v3-ledger-physics` |
| `RATELIMITER` | `RateLimiterDO` | `v4-rate-limiter` |

> ⚠️ Migration tags are immutable. Do not renumber.

## Benchmarks

| ID | Name | Status |
|---|---|---|
| B0 | Deepgram voice + Obi Canon onboarding | ✅ |
| B1 | Voice + text pipeline | ✅ |
| B2 | STONESKY Merkle ledger | ✅ |
| B3 | Knowledge mining (dynamic) | ⚠️ mine to load |
| B4 | TBD | ⏳ Pending |
| B5 | TBD | ⏳ Pending |

## Secrets

`wrangler secret put` for each:
```
GEMINI_API_KEY  DEEPSEEK_API_KEY  DEEPGRAM_API_KEY
GITHUB_TOKEN    CHAOS_PROBABILITY  SOVEREIGN_KEY
```

GitHub Actions secrets:
```
CLOUDFLARE_API_TOKEN    CLOUDFLARE_ACCOUNT_ID
```

> ⚠️ P0 Blocker: Fill `SOUL_DNA` KV namespace ID in `wrangler.toml` from Cloudflare dashboard before first deploy.

## Structure

```
phoenix-ob1/
├── src/                  # Runtime workers + DOs
│   ├── reincarnate.js    # ← ENTRYPOINT
│   ├── error-hardening.js
│   ├── monitoring.js
│   ├── seal_phase2.js
│   ├── ledger-hardening.js
│   ├── rate-limiter-do.js
│   ├── watchdog.js
│   └── chaos.js
├── validators/
│   ├── student-profile.js   # runtime import — CRITICAL
│   └── MASTER_CONTRACT.md   # governance anchor
├── frontend/
│   ├── magic-chat.html
│   └── test-voice.html
├── docs/                 # Soul DNA + context docs
├── scripts/
│   └── chaos-deploy.js
├── .github/workflows/
│   ├── deploy.yml
│   ├── chaos-deploy.yml
│   └── diagnostic.yml
└── wrangler.toml
```

## Boot Context

See [`docs/SOUL_DNA_MASTER.md`](docs/SOUL_DNA_MASTER.md) — full system boot seed.

## Governance

See [`validators/MASTER_CONTRACT.md`](validators/MASTER_CONTRACT.md) — sealed 2026-02-27.

---
*Rebuilt from phoenix-ob1-system via 5-stage pre-nuke extraction — 2026-03-10*
