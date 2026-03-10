# RUNTIME TRUTH
## Phoenix OB-1 — Live Surface Verification Record

```
WORKER: phoenix-ob1-system
CANONICAL_URL: https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev
VERSION: v136-PRODUCTION-HARDENED
LAW: RUNTIME_TRUTH outranks REPO_TRUTH. HTTP response outranks prediction.
```

---

## HOW TO USE THIS FILE

After every deploy, operator runs the 4 probe commands below and records actual responses here.
A claim is only RUNTIME_VERIFIED when a real HTTP response is pasted into this file.
SOURCE_PREDICTED_RESPONSE must never be mistaken for proof.

---

## PROBE COMMANDS

```bash
# Run all 4 after every deploy
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/health | jq .
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/evidence | jq .
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/ledgerverify | jq .
curl -s https://phoenix-ob1-system.mrmichaelhobbs1234.workers.dev/watchdog | jq .
```

---

## RUNTIME VERIFICATION LOG

### Deploy: v136-PRODUCTION-HARDENED

| Route | Status | Last Verified | Response Summary |
|-------|--------|--------------|------------------|
| `/health` | SOURCE_PREDICTED | UNVERIFIED | Pending first probe |
| `/evidence` | SOURCE_PREDICTED | UNVERIFIED | Pending first probe |
| `/ledgerverify` | SOURCE_PREDICTED | UNVERIFIED | Pending first probe |
| `/watchdog` | SOURCE_PREDICTED | UNVERIFIED | Pending first probe |

**Operator instruction:** Replace `SOURCE_PREDICTED` with `RUNTIME_VERIFIED` and paste actual response after running probes.

---

## EXPECTED RESPONSE SHAPES

### /health
```json
{
  "ok": true,
  "version": "v136-PRODUCTION-HARDENED",
  "buildTimestamp": "2026-03-10T14:00:00Z",
  "watchdog": { "healthy": true, "failures": [] },
  "benchmarks": {
    "B0": { "pass": true, "label": "PASS" },
    "B1": "PASS",
    "B2": "BOUND",
    "B3": "BLOCKED:GITHUB_TOKEN_MISSING",
    "B4": "BOUND",
    "B5": "READY"
  }
}
```

### /evidence
```json
{
  "worker": "v136-PRODUCTION-HARDENED",
  "hash": "<sha256 of bundle — set by CI>",
  "provenance": "kv-attested",
  "timestamp": "<ISO timestamp>"
}
```

### /ledgerverify
```json
{
  "valid": true,
  "breaks": [],
  "chainHead": 0
}
```

### /watchdog
```json
{
  "healthy": true,
  "degraded": false,
  "critical": false,
  "checks": {},
  "failures": []
}
```

---

## TRUTH LAYER DEFINITIONS

| Layer | Definition | Proof Required |
|-------|-----------|----------------|
| `REPO_TRUTH` | File exists in git | File SHA in GitHub |
| `CODE_TRUTH` | Logic path present in code | Code snippet reference |
| `RUNTIME_TRUTH` | Live HTTP response received | Actual response pasted here |
| `SOURCE_PREDICTED` | Expected behavior based on code | NOT PROOF — prediction only |

---

## DRIFT ALARM

If `/health` returns a version that does not match `wrangler.toml WORKER_VERSION`:
- Class: `IDENTITY_MISMATCH`
- Action: Do NOT proceed. Verify deploy completed. Check GitHub Actions log.

If `/ledgerverify` returns `valid: false`:
- Class: `LEDGER_CHAIN_BREAK`
- Action: DO NOT append to ledger. Chain is frozen. Escalate immediately.

If `/watchdog` returns `critical: true`:
- Class: `WATCHDOG_CRITICAL`
- Action: Check `failures[]` array. Fix missing bindings before any user traffic.

---

*RUNTIME_TRUTH.md — Phoenix OB-1 v136 — Stage 1 pipeline artifact*
*Sovereign: Michael Hobbs | Agent-99: Perplexity*
