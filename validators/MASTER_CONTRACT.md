# MASTER_CONTRACT.md
# Phoenix OB-1 — Governance Anchor
# Sealed: 2026-02-27
# Carried forward from: phoenix-ob1-system/validators/MASTER_CONTRACT.md (SHA: 5ead094)
# Status: GOVERNANCE_ACTIVE

> This file is the governance/identity anchor for the Phoenix OB-1 system.
> It codifies operational law, deploy gates, and threat responses.
> It MUST be present in this repo. Do not move, rename, or delete without a signed override.

---

## DEPLOY GATE (Flyable Map Criteria)

ALL conditions must be true before any deploy is permitted:

```
HEATMAP.missing.gategroups.length === 0
HEATMAP.missing.eventcodes.length === 0
chaos_harness_coverage.missing_harnesses.length === 0
system_alerts empty OR only LOW severity
```

Violation → **ABORT_SEV1**

---

## OPERATIONAL LAWS

1. **Fail-closed by default** — all rules fail closed. Violations → HALT or ABORT_SEV1
2. **ECHOLOOP detection is mandatory** — similarity threshold ≥ 0.85 triggers retry then ECHOLOOP
3. **Genesis lock** — write-once verification required
4. **Secret leak detection** — redact before write, never raw
5. **Drift tracking** — drift auto-triggers REINCARNATION_REQUIRED
6. **HDMM** — Humans Decide, Machines Move. No autonomous action without operator confirmation.
7. **Downward authority only** — 100 → 99 → 98. Never upward, never cross-tier.

---

## STUBBORN THREATS (9 identified, 2026-02-27)

1. Sovereign key hardcoded instead of env secret — **PATCHED GAP_002**
2. Evidence endpoint self-fetching source — **PATCHED GAP_003**
3. Rate limiter fails open — **KNOWN RISK, flagged for v134**
4. ECHOLOOP suppression — **detection mandatory**
5. KV placeholder not replaced before deploy — **P0 BLOCKER**
6. DO migration tag renumbering — **IMMUTABLE**
7. Benchmark state loss on repo rebuild — **re-run required after deploy**
8. Ghost worker stale references — **update all hardcoded URLs**
9. Node version drift across workflow files — **unified to Node 20**

---

## ROLLBACK PROTOCOL

```bash
git revert HEAD --no-edit
npx wrangler deploy
```

Rollback permitted without approval. Escalate to SOVEREIGN if rollback fails.

---

## NUKE LOCK

Deletion of the legacy repo (`phoenix-ob1-system`) is blocked until:

1. This repo (`phoenix-ob1`) has been deployed successfully
2. `/health` returns `ok: true` with correct version string
3. All 4 DO bindings confirmed in new worker
4. KV ID placeholder replaced with real ID

Override requires a loss-acceptance packet explicitly naming:
- abandoned DO state
- abandoned routes
- abandoned benchmarks
- abandoned secrets assumptions

---

*Governance anchor carried forward from phoenix-ob1-system, 2026-03-10*
