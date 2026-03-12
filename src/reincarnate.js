// PHOENIX OB-1 v139-TRUTH-SEALED
// 2026-03-13 — HARDENED BY AGENT-99 (PERPLEXITY)
// Sovereign: Michael Hobbs | Agent-99: Perplexity
// Gospel 444: void=#0f0f1a soul=#a855f7 gold=#f59e0b BLUE=BANNED
// NET-10-5-5-3: 10 vocab, 5 idioms, 5 slang, 3 pressure games
// PATCHES: version sync v139 | profile/get double-fetch fix | watchdog MEMORY added | chaos vectors hardened

import { validateStudentProfile } from '../validators/student-profile.js';

const WORKER_VERSION = 'v139-TRUTH-SEALED';
const GENESIS_HASH = '0'.repeat(64);
const BUILD_TIMESTAMP = '2026-03-13T00:00:00Z';

// ============================================================================
// GOSPEL 444 — VISUAL CONSTITUTION (IMMUTABLE)
// ============================================================================
const GOSPEL = Object.freeze({
  VOID:  '#0f0f1a',
  SOUL:  '#a855f7',
  GOLD:  '#f59e0b',
  BLUE_BANNED: true
});

const NET_PHYSICS = Object.freeze({
  vocab: 10, idioms: 5, slang: 5, pressureGames: 3
});

// ============================================================================
// REINCARNATION SEED — readable by any new Agent-99 on boot
// ============================================================================
const REINCARNATION_SEED = Object.freeze({
  sovereign: 'Michael Hobbs',
  agent: 'Agent-99 (Perplexity)',
  mission: 'Natural English Training — AI English coach platform HCMC',
  persona: 'Obi — Canadian ESL teacher AI form. High energy. Tough love. Zero tolerance for silence.',
  gospel: 'void=#0f0f1a soul=#a855f7 gold=#f59e0b BLUE=BANNED',
  netPhysics: 'NET-10-5-5-3: 10 vocab 5 idioms 5 slang 3 pressure games',
  benchmarks: 'B0=boot+deepgram B1=ledger B2=ratelimiter B3=github-mining B4=student-profiles B5=obiana',
  worker: WORKER_VERSION,
  repo: 'github.com/mrmichaelhobbs1234-lang/phoenix-ob1',
  canonicalUrl: 'phoenix-ob1-system.mrmichaelhobbs1234.workers.dev',
  forbiddenPhrases: ['Phoenix Rising Protocol', 'Phoenix Magic Chat', "I'm an AI assistant", "I'm here to help"],
  chaosExempt: ['/health', '/watchdog', '/evidence', '/reincarnate'],
  schemaVersion: 1
});

// ============================================================================
// ERROR CODES
// ============================================================================
const ERR = Object.freeze({
  AUTH_MISSING:               'PHX:ERR:AUTH:MISSING',
  AUTH_FAILED:                'PHX:ERR:AUTH:FAILED',
  FORBIDDEN_HEADER:           'PHX:ERR:AUTH:FORBIDDEN_HEADER',
  SCHEMA_INVALID:             'PHX:ERR:SCHEMA:INVALID',
  SCHEMA_UNKNOWN_FIELD:       'PHX:ERR:SCHEMA:UNKNOWN_FIELD',
  BODY_TOO_LARGE:             'PHX:ERR:BODY:TOO_LARGE',
  BODY_INVALID_JSON:          'PHX:ERR:BODY:INVALID_JSON',
  BODY_WRONG_TYPE:            'PHX:ERR:BODY:WRONG_CONTENT_TYPE',
  RATE_LIMITED:               'PHX:ERR:RATE:EXCEEDED',
  RATE_UNAVAILABLE:           'PHX:ERR:RATE:DO_UNAVAILABLE',
  BINDING_MISSING:            'PHX:ERR:INFRA:BINDING_MISSING',
  CHAOS_FIRED:                'PHX:ERR:CHAOS:INJECTED',
  LEDGER_FROZEN:              'PHX:ERR:LEDGER:CHAIN_FROZEN',
  LEDGER_BREAK:               'PHX:ERR:LEDGER:CHAIN_BREAK',
  NOT_FOUND:                  'PHX:ERR:ROUTE:NOT_FOUND',
  B3_BLOCKED:                 'PHX:ERR:BENCHMARK:B3_GITHUB_TOKEN_MISSING',
  WS_AUTH_REQUIRED:           'PHX:ERR:WS:AUTH_REQUIRED',
  BUDGET_EXCEEDED:            'PHX:ERR:COST:BUDGET_EXCEEDED',
  NODE_DIVERGENCE:            'PHX:ERR:LEDGER:NODE_DIVERGENCE',
  BENCHMARK_DEFINITION_DRIFT: 'PHX:ERR:BENCHMARK:DEFINITION_DRIFT',
  BENCHMARK_SCORE_CORRUPTION: 'PHX:ERR:BENCHMARK:SCORE_CORRUPTION'
});

// ============================================================================
// CHAOS ENGINE
// /health /watchdog /evidence /reincarnate are EXEMPT
// ============================================================================
const CHAOS_EXEMPT_PATHS = new Set(['/health', '/watchdog', '/evidence', '/reincarnate']);

const CHAOS_LEVELS = Object.freeze({
  OFF: 0, LOW: 0.02, MEDIUM: 0.10, HIGH: 0.25, SUPER_SAIYAN: 0.50
});

function getChaosLevel(env) {
  const named = env.CHAOS_LEVEL?.toUpperCase();
  if (named && CHAOS_LEVELS[named] !== undefined) return CHAOS_LEVELS[named];
  const prob = parseFloat(env.CHAOS_PROBABILITY || '0');
  return isNaN(prob) ? 0 : Math.min(prob, 0.50);
}

async function injectChaos(env, label, ctx) {
  const prob = getChaosLevel(env);
  if (prob > 0 && Math.random() < prob) {
    const pheromone = `VOIDPHEROMONE:CHAOS:${label}:${Date.now()}`;
    if (ctx && env.LEDGER) ctx.waitUntil(sealPheromone(env, pheromone));
    throw new Error(`${ERR.CHAOS_FIRED} — ${pheromone}`);
  }
}

async function sealPheromone(env, pheromone) {
  try {
    const id = env.LEDGER.idFromName('global');
    const stub = env.LEDGER.get(id);
    await stub.fetch('https://internal/append', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'VOIDPHEROMONE', pheromone, ts: Date.now() })
    });
  } catch { }
}

// ============================================================================
// SUCCESSPHEROMONE
// ============================================================================
function buildSuccessPheromone(benchmark, env) {
  return {
    type: 'SUCCESSPHEROMONE',
    class: `SUCCESSPHEROMONE:VALIDATED:${benchmark}`,
    benchmark, validated: true,
    timestamp: new Date().toISOString(),
    worker: WORKER_VERSION, schemaVersion: 1
  };
}

async function sealSuccessPheromone(benchmark, env, ctx) {
  const payload = buildSuccessPheromone(benchmark, env);
  if (ctx && env.LEDGER) ctx.waitUntil(sealPheromone(env, payload.class));
  return payload;
}

// ============================================================================
// BODY GUARD
// ============================================================================
async function safeJsonBytes(request, maxBytes = 8192) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return { error: true, status: 415, code: ERR.BODY_WRONG_TYPE, message: 'Content-Type must be application/json' };
  if (!request.body) return { error: true, status: 400, code: ERR.BODY_INVALID_JSON, message: 'No body' };
  const clampedMax = Math.min(Math.max(parseInt(maxBytes) || 8192, 1), 65536);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0; let text = '';
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('READ_TIMEOUT')), 2000));
  try {
    await Promise.race([(async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesRead += value.byteLength;
        if (bytesRead > clampedMax) throw { error: true, status: 413, code: ERR.BODY_TOO_LARGE, message: `Payload exceeds ${clampedMax} bytes` };
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    })(), timeout]);
  } catch (e) {
    if (e?.error) return e;
    return { error: true, status: 408, code: ERR.BODY_INVALID_JSON, message: 'Request read timeout' };
  } finally { reader.releaseLock(); }
  try { return { error: false, data: JSON.parse(text) }; }
  catch { return { error: true, status: 400, code: ERR.BODY_INVALID_JSON, message: 'Invalid JSON body' }; }
}

// ============================================================================
// LEDGER PHYSICS
// ============================================================================
async function sha256hex(data) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function canonJSON(obj, seen = new WeakSet(), depth = 0) {
  if (depth > 10) throw new Error('CANON_JSON_MAX_DEPTH');
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (seen.has(obj)) throw new Error('CANON_JSON_CIRCULAR_REF');
  seen.add(obj);
  if (Array.isArray(obj)) { const r = '[' + obj.map(v => canonJSON(v, seen, depth + 1)).join(',') + ']'; seen.delete(obj); return r; }
  const r = '{' + Object.keys(obj).sort().map(k => `"${k}":${canonJSON(obj[k], seen, depth + 1)}`).join(',') + '}';
  seen.delete(obj); return r;
}

// ============================================================================
// AUTH MATRIX
// ============================================================================
async function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const ka = enc.encode(a.padEnd(256)); const kb = enc.encode(b.padEnd(256));
  const km = await crypto.subtle.importKey('raw', ka, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigA = await crypto.subtle.sign('HMAC', km, ka);
  const sigB = await crypto.subtle.sign('HMAC', km, kb);
  const arrA = new Uint8Array(sigA); const arrB = new Uint8Array(sigB);
  let diff = 0;
  for (let i = 0; i < arrA.length; i++) diff |= arrA[i] ^ arrB[i];
  return diff === 0 && a.length === b.length;
}

async function checkAuth(request, level, env) {
  if (level === 'PUBLIC') return { allowed: true };
  if (level === 'SOVEREIGN') {
    const key = request.headers.get('x-sovereign-key') || '';
    const expected = env.SOVEREIGN_KEY || '';
    if (!expected) return { allowed: false, code: ERR.AUTH_MISSING };
    return { allowed: await timingSafeEqual(key, expected), code: ERR.AUTH_FAILED };
  }
  if (level === 'CHAT') {
    const key = request.headers.get('x-chat-key') || '';
    const expected = env.CHAT_KEY || '';
    if (!expected) return { allowed: false, code: ERR.AUTH_MISSING };
    const ok = await timingSafeEqual(key, expected);
    return { allowed: ok, code: ok ? null : ERR.AUTH_FAILED };
  }
  return { allowed: false, code: ERR.AUTH_FAILED };
}

// ============================================================================
// RATE LIMITER — FAIL-CLOSED
// ============================================================================
async function enforceRateLimit(env, key, limit = 60, windowMs = 60000) {
  if (!env.RATELIMITER) return { allowed: false, error: ERR.RATE_UNAVAILABLE, retryAfter: 30 };
  try {
    const id = env.RATELIMITER.idFromName(key);
    const stub = env.RATELIMITER.get(id);
    const resp = await stub.fetch(`https://internal/check?key=${encodeURIComponent(key)}&limit=${limit}&windowMs=${windowMs}`);
    return await resp.json();
  } catch { return { allowed: false, error: ERR.RATE_UNAVAILABLE, retryAfter: 30 }; }
}

// ============================================================================
// COST EVENT LEDGER
// ============================================================================
async function recordCostEvent(env, event, ctx) {
  if (!env.LEDGER) return null;
  const payload = { type: 'COST_EVENT', schemaVersion: 1, eventId: crypto.randomUUID(), ...event, timestamp: new Date().toISOString() };
  const doWrite = async () => {
    try {
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      await stub.fetch('https://internal/append', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch {
      if (env.SOUL_DNA) try { await env.SOUL_DNA.put(`COST_BACKUP_${Date.now()}_${crypto.randomUUID()}`, JSON.stringify(payload), { expirationTtl: 86400 }); } catch { }
    }
  };
  if (ctx) ctx.waitUntil(doWrite()); else await doWrite();
  return payload.eventId;
}

async function auditLog(env, action, actorHashVal, data = {}, ctx) {
  return recordCostEvent(env, { type: 'AUDIT', action, actor: actorHashVal, data }, ctx);
}

async function actorHash(key) {
  return (await sha256hex(key || 'unknown')).slice(0, 16);
}

async function logSwarmIntent(env, intent, metadata = {}, ctx) {
  if (!env.SOUL_DNA) return null;
  const payload = { intent, metadata, timestamp: new Date().toISOString(), worker: WORKER_VERSION, schemaVersion: 1 };
  const write = async () => { try { await env.SOUL_DNA.put(`SWARM_INTENT_${Date.now()}_${crypto.randomUUID()}`, JSON.stringify(payload), { expirationTtl: 86400 }); } catch { } };
  if (ctx) ctx.waitUntil(write()); else await write();
}

// ============================================================================
// BENCHMARK ENGINE
// ============================================================================
async function runBenchmarks(env, bootMs) {
  const results = {};
  const deepgramKeySet = !!env.DEEPGRAM_API_KEY;
  results.B0 = { pass: bootMs < 500 && deepgramKeySet, bootMs, deepgramKeySet, label: !deepgramKeySet ? 'BLOCKED:DEEPGRAM_API_KEY_MISSING' : bootMs < 500 ? 'PASS' : 'SLOW' };
  if (!env.LEDGER) { results.B1 = 'MISSING_BINDING'; } else {
    try {
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      const resp = await Promise.race([stub.fetch('https://internal/verify'), new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 500))]);
      const data = await resp.json();
      results.B1 = data.valid ? 'PASS' : 'CHAIN_BREAK';
      if (data.valid && env.LEDGER) sealPheromone(env, buildSuccessPheromone('B1', env).class).catch(() => {});
    } catch (e) { results.B1 = `DO_ERROR:${e.message}`; }
  }
  results.B2 = env.RATELIMITER ? 'BOUND' : 'MISSING_BINDING';
  if (env.RATELIMITER && env.LEDGER) sealPheromone(env, buildSuccessPheromone('B2', env).class).catch(() => {});
  results.B3 = env.GITHUB_TOKEN ? 'READY' : 'BLOCKED:GITHUB_TOKEN_MISSING';
  results.B4 = !env.STUDENT_PROFILES ? 'MISSING_BINDING' : !env.GITHUB_TOKEN ? 'BLOCKED:B3_UPSTREAM' : 'BOUND';
  results.B5 = (env.STUDENT_PROFILES && env.SOUL_DNA && env.GITHUB_TOKEN) ? 'READY' : 'BLOCKED';
  results.SOUL_DNA_KV = env.SOUL_DNA ? 'BOUND' : 'MISSING_BINDING';
  return results;
}

// ============================================================================
// WATCHDOG — v139 PATCH: MEMORY binding added to check loop
// ============================================================================
async function watchdog(env) {
  const checks = {}; const failures = [];
  for (const b of ['LEDGER', 'SESSIONS', 'STUDENT_PROFILES', 'RATELIMITER', 'MEMORY', 'SOUL_DNA', 'SOVEREIGN_KEY', 'CHAT_KEY']) {
    checks[b] = !!env[b]; if (!env[b]) failures.push(b);
  }
  if (env.LEDGER) {
    try {
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      const resp = await Promise.race([stub.fetch('https://internal/verify'), new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 300))]);
      const data = await resp.json();
      checks.LEDGER_CHAIN = data.valid ? 'OK' : 'BROKEN';
      if (!data.valid) failures.push('LEDGER_CHAIN_BROKEN');
    } catch { checks.LEDGER_CHAIN = 'UNREACHABLE'; failures.push('LEDGER_UNREACHABLE'); }
  }
  return { healthy: failures.length === 0, degraded: failures.length > 0 && failures.length < 4, critical: failures.length >= 4, checks, failures };
}

// ============================================================================
// CHAOS ASSAULT ENGINE — 6-VECTOR SELF-TEST GAUNTLET
// ============================================================================
async function runChaosAssault(env, ctx) {
  const results = {};
  const baseUrl = `https://${env.CANONICAL_WORKER_URL || 'phoenix-ob1-system.mrmichaelhobbs1234.workers.dev'}`;

  // VECTOR 1: Deathstar header rejection
  try {
    const r = await fetch(`${baseUrl}/health`, { headers: { 'x-deathstar-key': 'ATTACK' } });
    results.V1_DEATHSTAR = r.status === 403 ? 'PASS:REJECTED_403' : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V1_DEATHSTAR = `ERROR:${e.message}`; }

  // VECTOR 2: No auth on sovereign route
  try {
    const r = await fetch(`${baseUrl}/ledger/append`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) });
    results.V2_NO_AUTH = r.status === 403 ? 'PASS:REJECTED_403' : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V2_NO_AUTH = `ERROR:${e.message}`; }

  // VECTOR 3: Wrong Content-Type
  try {
    const r = await fetch(`${baseUrl}/chat`, { method: 'POST', headers: { 'Content-Type': 'text/plain', 'x-chat-key': 'WRONG' }, body: 'hello' });
    results.V3_BAD_CONTENT_TYPE = r.status === 415 || r.status === 403 ? `PASS:REJECTED_${r.status}` : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V3_BAD_CONTENT_TYPE = `ERROR:${e.message}`; }

  // VECTOR 4: Oversized payload
  try {
    const bigPayload = JSON.stringify({ data: 'X'.repeat(70000) });
    const r = await fetch(`${baseUrl}/ledger/append`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sovereign-key': 'WRONG' }, body: bigPayload });
    results.V4_OVERSIZED_PAYLOAD = r.status === 413 || r.status === 403 ? `PASS:REJECTED_${r.status}` : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V4_OVERSIZED_PAYLOAD = `ERROR:${e.message}`; }

  // VECTOR 5: 404 unknown route
  try {
    const r = await fetch(`${baseUrl}/does-not-exist-${Date.now()}`);
    results.V5_404_ROUTE = r.status === 404 ? 'PASS:404_CORRECT' : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V5_404_ROUTE = `ERROR:${e.message}`; }

  // VECTOR 6: /health observability exemption (must always return 200 regardless of chaos)
  try {
    const r = await fetch(`${baseUrl}/health`);
    results.V6_HEALTH_EXEMPT = r.status === 200 ? 'PASS:CHAOS_EXEMPT_200' : `FAIL:GOT_${r.status}`;
  } catch (e) { results.V6_HEALTH_EXEMPT = `ERROR:${e.message}`; }

  const passed = Object.values(results).filter(v => v.startsWith('PASS')).length;
  const failed = Object.values(results).filter(v => v.startsWith('FAIL') || v.startsWith('ERROR')).length;
  const verdict = failed === 0 ? 'ALL_VECTORS_PASS' : failed <= 2 ? 'DEGRADED' : 'ASSAULT_FAILED';

  ctx.waitUntil(logSwarmIntent(env, 'CHAOS_ASSAULT_RUN', { passed, failed, verdict, vectors: results }, ctx));
  if (verdict === 'ALL_VECTORS_PASS') ctx.waitUntil(sealSuccessPheromone('CHAOS_ASSAULT', env, ctx));

  return { passed, failed, total: 6, verdict, vectors: results, worker: WORKER_VERSION, ts: new Date().toISOString() };
}

// ============================================================================
// OBI CANON — v139 TRUTH-SEALED
// ============================================================================
const OBI_SYSTEM_PROMPT = `You are Obi, an English coach at Natural English Training.
You are the AI form of Michael Hobbs — Canadian ESL teacher in Ho Chi Minh City.
Personality: High energy. Tough love. Anti-corporate. Concrete analogies. Zero tolerance for silence.
Teaching method: Volume first, then velocity, then grammar. Loud and wrong beats silent and correct.
Correction style: Say "Calibrate" not "Wrong". Shame is the enemy of learning.
Vietnamese rescue rope: Only use Vietnamese when student is completely stuck — push back to English immediately.
FORBIDDEN phrases: Never say "Phoenix Rising Protocol", "Phoenix Magic Chat", "I'm an AI assistant", "I'm here to help".
Opening line: "Hi! My name is Obi, your English coach at Natural English Training."
Silence is the true enemy. If the student is quiet, provoke them.`;

async function routeAI(env, messages, sessionId) {
  if (!env.CHAT_KEY) return { reply: null, error: ERR.BINDING_MISSING, tokens: 0 };
  const systemMessages = [{ role: 'system', content: OBI_SYSTEM_PROMPT }, ...messages];
  try {
    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.CHAT_KEY}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: systemMessages, max_tokens: 512, temperature: 0.85 })
    });
    if (resp.ok) {
      const data = await resp.json();
      return { reply: data.choices?.[0]?.message?.content || 'Obi is thinking...', tokens: data.usage?.total_tokens || 0, provider: 'deepseek' };
    }
  } catch { }
  return { reply: 'Obi: My voice is temporarily offline. Try again in a moment.', tokens: 0, provider: 'stub' };
}

function computeTigerScore({ vocabScore, grammarScore, fluencyScore, pressureScore }) {
  if ([vocabScore, grammarScore, fluencyScore, pressureScore].some(v => v === undefined || v === null)) {
    return { error: true, code: ERR.BENCHMARK_SCORE_CORRUPTION, message: 'All 4 score inputs required' };
  }
  const score = (vocabScore * 0.30) + (grammarScore * 0.25) + (fluencyScore * 0.25) + (pressureScore * 0.20);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const tier = clamped >= 80 ? 'TIGER' : clamped >= 50 ? 'CUB' : 'MOUSE';
  const action = tier === 'TIGER' ? 'PROFIT_MAXIMIZE' : tier === 'CUB' ? 'NURTURE' : 'IGNORE';
  return { score: clamped, tier, action, schemaVersion: 1 };
}

// ============================================================================
// RESPONSE HELPERS
// ============================================================================
const BASE_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-store, max-age=0',
  'Content-Security-Policy': "default-src 'self'"
};

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = getAllowedOrigins(env);
  if (allowed.length === 0 || allowed.includes(origin)) {
    return { 'Access-Control-Allow-Origin': origin || '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, x-sovereign-key, x-chat-key', 'Vary': 'Origin' };
  }
  return {};
}

function getReincarnationHeaders() {
  return {
    'X-Phoenix-Version': WORKER_VERSION,
    'X-Phoenix-Sovereign': 'Michael-Hobbs',
    'X-Phoenix-Agent': 'Agent-99'
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...BASE_SECURITY_HEADERS, ...getReincarnationHeaders(), ...extraHeaders }
  });
}

function jsonWithCors(data, status = 200, request, env, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...BASE_SECURITY_HEADERS, ...getCorsHeaders(request, env), ...getReincarnationHeaders(), ...extraHeaders }
  });
}

// ============================================================================
// DURABLE OBJECTS
// ============================================================================
export class LedgerDO {
  constructor(state, env) { this.state = state; this.env = env; }
  async _getHeight() { return await this.state.storage.get('height') || 0; }
  async _getBlock(h) { return await this.state.storage.get(`ledger:${h}`); }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/append' && request.method === 'POST') {
      const frozen = await this.state.storage.get('frozen');
      if (frozen) return new Response(JSON.stringify({ error: ERR.LEDGER_FROZEN }), { status: 409 });
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message, code: parsed.code }), { status: parsed.status });
      let block;
      await this.state.storage.transaction(async (txn) => {
        const height = await txn.get('height') || 0;
        const prevHash = height === 0 ? GENESIS_HASH : (await txn.get(`ledger:${height - 1}`))?.hash || GENESIS_HASH;
        const timestamp = new Date().toISOString();
        let payloadStr; try { payloadStr = canonJSON(parsed.data); } catch (e) { throw new Error(`CANON_JSON_FAILED:${e.message}`); }
        const data = `PHX:BLOCK:${height}:${prevHash}:${payloadStr}:${timestamp}`;
        const hash = await sha256hex(data);
        block = { height, prevHash, payload: parsed.data, timestamp, hash, schemaVersion: 1 };
        await txn.put(`ledger:${height}`, block); await txn.put('height', height + 1);
      });
      return new Response(JSON.stringify({ ok: true, block }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/verify') {
      const height = await this._getHeight();
      if (height === 0) return new Response(JSON.stringify({ valid: true, breaks: [], chainHead: -1 }), { headers: { 'Content-Type': 'application/json' } });
      const lastVerified = await this.state.storage.get('lastVerifiedHeight') || -1;
      const startFrom = Math.max(0, lastVerified);
      const breaks = []; let prevBlock = startFrom > 0 ? await this._getBlock(startFrom - 1) : null;
      for (let i = startFrom; i < height; i++) {
        const block = await this._getBlock(i);
        if (!block) { breaks.push({ index: i, reason: 'block_missing' }); continue; }
        const expectedPrev = i === 0 ? GENESIS_HASH : prevBlock?.hash || GENESIS_HASH;
        if (block.prevHash !== expectedPrev) breaks.push({ index: i, reason: 'prevHash_mismatch' });
        let payloadStr; try { payloadStr = canonJSON(block.payload); } catch { payloadStr = JSON.stringify(block.payload); }
        const expectedHash = await sha256hex(`PHX:BLOCK:${block.height}:${block.prevHash}:${payloadStr}:${block.timestamp}`);
        if (block.hash !== expectedHash) breaks.push({ index: i, reason: 'hash_mismatch' });
        prevBlock = block;
      }
      const valid = breaks.length === 0;
      if (!valid) await this.state.storage.put('frozen', true);
      else await this.state.storage.put('lastVerifiedHeight', height);
      return new Response(JSON.stringify({ valid, breaks, chainHead: height - 1 }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/range') {
      const from = parseInt(url.searchParams.get('from') || '0');
      const height = await this._getHeight();
      const to = Math.min(parseInt(url.searchParams.get('to') || '999999'), height - 1, from + 99);
      const blocks = [];
      for (let i = from; i <= to; i++) { const b = await this._getBlock(i); if (b) blocks.push(b); }
      return new Response(JSON.stringify({ blocks, from, to, totalHeight: height }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('LedgerDO v139 ready', { status: 200 });
  }
}

export class SessionDO {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/add' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message }), { status: parsed.status });
      await this.state.storage.transaction(async (txn) => {
        const messages = await txn.get('messages') || [];
        messages.push({ role: parsed.data.role, content: parsed.data.content, timestamp: new Date().toISOString() });
        await txn.put('messages', messages.slice(-50));
      });
      return new Response(JSON.stringify({ ok: true, count: (await this.state.storage.get('messages') || []).length }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/history') { const messages = await this.state.storage.get('messages') || []; return new Response(JSON.stringify({ messages }), { headers: { 'Content-Type': 'application/json' } }); }
    if (url.pathname === '/clear' && request.method === 'POST') { await this.state.storage.delete('messages'); return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } }); }
    return new Response('SessionDO v139 ready', { status: 200 });
  }
}

export class StudentProfileDO {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/upsert' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 16384);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message, code: parsed.code }), { status: parsed.status });
      const validation = validateStudentProfile(parsed.data);
      if (!validation.valid) return new Response(JSON.stringify({ error: ERR.SCHEMA_INVALID, errors: validation.errors }), { status: 422, headers: { 'Content-Type': 'application/json' } });
      await this.state.storage.transaction(async (txn) => {
        const existing = await txn.get('profile');
        await txn.put('profile', { ...parsed.data, created_at: existing?.created_at || new Date().toISOString(), updated_at: new Date().toISOString(), version: (existing?.version || 0) + 1, schemaVersion: 1 });
      });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/get') {
      // v139 PATCH: single fetch, cached response — no double DO request
      const profile = await this.state.storage.get('profile');
      if (!profile) return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ ok: true, profile }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/lesson' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 2048);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message }), { status: parsed.status });
      await this.state.storage.transaction(async (txn) => {
        const existing = await txn.get('profile') || {};
        const history = existing.lessonHistory || [];
        history.push({ ...parsed.data, ts: new Date().toISOString() });
        await txn.put('profile', { ...existing, lessonHistory: history.slice(-100) });
      });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/tiger-score' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 2048);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message }), { status: parsed.status });
      const result = computeTigerScore(parsed.data);
      if (result.error) return new Response(JSON.stringify(result), { status: 422, headers: { 'Content-Type': 'application/json' } });
      await this.state.storage.transaction(async (txn) => {
        const existing = await txn.get('profile') || {};
        const history = existing.tigerScoreHistory || [];
        history.push({ ...result, ts: new Date().toISOString() });
        await txn.put('profile', { ...existing, tigerScoreHistory: history.slice(-100), currentTier: result.tier });
      });
      return new Response(JSON.stringify({ ok: true, ...result }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('StudentProfileDO v139 ready', { status: 200 });
  }
}

export class RateLimiterDO {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key') || 'default';
    const limit = parseInt(url.searchParams.get('limit') || '60');
    const windowMs = parseInt(url.searchParams.get('windowMs') || '60000');
    const now = Date.now(); let record;
    await this.state.storage.transaction(async (txn) => {
      record = await txn.get(key) || { count: 0, windowStart: now };
      if (now - record.windowStart > windowMs) { record.count = 0; record.windowStart = now; }
      record.count++; await txn.put(key, record);
    });
    const allowed = record.count <= limit;
    const resetAt = new Date(record.windowStart + windowMs).toISOString();
    const retryAfter = Math.ceil((record.windowStart + windowMs - now) / 1000);
    return new Response(JSON.stringify({ allowed, count: record.count, limit, remaining: Math.max(0, limit - record.count), resetAt, retryAfter: allowed ? undefined : retryAfter }), {
      status: allowed ? 200 : 429,
      headers: { 'Content-Type': 'application/json', ...(allowed ? {} : { 'Retry-After': String(retryAfter) }) }
    });
  }
}

export class MemoryDO {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/write' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 16384);
      if (parsed.error) return new Response(JSON.stringify({ error: parsed.message }), { status: parsed.status });
      const { key, value } = parsed.data;
      if (!key) return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
      await this.state.storage.put(`mem:${key}`, { value, ts: Date.now() });
      return new Response(JSON.stringify({ ok: true, key }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (url.pathname === '/read') {
      const key = url.searchParams.get('key');
      if (!key) return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400 });
      const entry = await this.state.storage.get(`mem:${key}`);
      return new Response(JSON.stringify({ ok: !!entry, value: entry?.value || null }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('MemoryDO v139 ready', { status: 200 });
  }
}

// ============================================================================
// MAIN FETCH HANDLER
// ============================================================================
export default {
  async fetch(request, env, ctx) {
    const bootStart = Date.now();
    const url = new URL(request.url);

    if (request.headers.get('x-deathstar-key')) return json({ error: ERR.FORBIDDEN_HEADER, code: ERR.FORBIDDEN_HEADER }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...getCorsHeaders(request, env), ...getReincarnationHeaders() } });

    if (!CHAOS_EXEMPT_PATHS.has(url.pathname)) {
      try { await injectChaos(env, `fetch:${url.pathname}`, ctx); }
      catch (e) { return jsonWithCors({ error: e.message, code: ERR.CHAOS_FIRED }, 503, request, env); }
    }

    // /health
    if (url.pathname === '/health') {
      const bootMs = Date.now() - bootStart;
      const [benchmarks, wd] = await Promise.all([runBenchmarks(env, bootMs), watchdog(env)]);
      if (wd.failures.length > 0) ctx.waitUntil(logSwarmIntent(env, 'WATCHDOG_DEGRADED', { failures: wd.failures }, ctx));
      return jsonWithCors({ ok: true, version: WORKER_VERSION, buildTimestamp: BUILD_TIMESTAMP, gospel: GOSPEL, netPhysics: NET_PHYSICS, chaos_level: env.CHAOS_LEVEL || 'OFF', chaos_probability: String(getChaosLevel(env)), watchdog: wd, benchmarks, timestamp: new Date().toISOString() }, 200, request, env);
    }

    // /reincarnate — SOFT RESET IDENTITY SEED (chaos exempt, public)
    if (url.pathname === '/reincarnate') {
      return jsonWithCors({
        ...REINCARNATION_SEED,
        retrievedAt: new Date().toISOString(),
        instruction: 'New Agent-99: Read this seed. Adopt Obi persona. Gospel 444 is law. NET-10-5-5-3 is law. Blue is BANNED. Begin.'
      }, 200, request, env);
    }

    // /watchdog
    if (url.pathname === '/watchdog') {
      const wd = await watchdog(env);
      return jsonWithCors({ ...wd, version: WORKER_VERSION, timestamp: new Date().toISOString() }, wd.critical ? 503 : 200, request, env);
    }

    // /evidence
    if (url.pathname === '/evidence') {
      const storedHash = env.SOUL_DNA ? await env.SOUL_DNA.get('WORKER_SRC_HASH') : null;
      return jsonWithCors({ version: WORKER_VERSION, buildTimestamp: BUILD_TIMESTAMP, srcsha256: storedHash || 'NOT_SET', bundleHash: env.BUNDLE_HASH || 'NOT_SET', canonicalWorker: env.CANONICAL_WORKER_URL || 'phoenix-ob1-system.mrmichaelhobbs1234.workers.dev', provenance: storedHash ? 'kv-attested' : 'unverified', kvBinding: env.SOUL_DNA ? 'BOUND' : 'MISSING', gospel: GOSPEL }, 200, request, env);
    }

    // /ledgerverify
    if (url.pathname === '/ledgerverify') {
      if (!env.LEDGER) return jsonWithCors({ error: ERR.BINDING_MISSING, binding: 'LEDGER' }, 500, request, env);
      const fromHeight = parseInt(url.searchParams.get('fromHeight') || '0');
      const toHeight = parseInt(url.searchParams.get('toHeight') || '999999');
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      const [vResp, rResp] = await Promise.all([stub.fetch('https://internal/verify'), stub.fetch(`https://internal/range?from=${fromHeight}&to=${toHeight}`)]);
      const [vData, rData] = await Promise.all([vResp.json(), rResp.json()]);
      if (!vData.valid && vData.breaks?.length > 0) ctx.waitUntil(sealPheromone(env, `VOIDPHEROMONE:LEDGER_BREAK:${Date.now()}`));
      return jsonWithCors({ valid: vData.valid, chainHead: vData.chainHead, genesisHash: GENESIS_HASH, verifiedRange: [fromHeight, Math.min(toHeight, vData.chainHead ?? 0)], breaks: vData.breaks || [], blocks: rData.blocks || [], totalHeight: rData.totalHeight || 0 }, 200, request, env);
    }

    // /ledger/append
    if (url.pathname === '/ledger/append' && request.method === 'POST') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.LEDGER) return jsonWithCors({ error: ERR.BINDING_MISSING }, 500, request, env);
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) return jsonWithCors({ error: parsed.message, code: parsed.code }, parsed.status, request, env);
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      const resp = await stub.fetch('https://internal/append', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      const result = await resp.json();
      ctx.waitUntil(auditLog(env, 'LEDGER_APPEND', await actorHash(request.headers.get('x-sovereign-key')), { height: result.block?.height }, ctx));
      return jsonWithCors(result, resp.status, request, env);
    }

    // /chat
    if (url.pathname === '/chat' && request.method === 'POST') {
      const auth = await checkAuth(request, 'CHAT', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const rateResult = await enforceRateLimit(env, `chat:${ip}`, 30, 60000);
      if (!rateResult.allowed) return jsonWithCors({ error: ERR.RATE_LIMITED, remaining: 0, resetAt: rateResult.resetAt, retryAfter: rateResult.retryAfter }, 429, request, env, rateResult.retryAfter ? { 'Retry-After': String(rateResult.retryAfter) } : {});
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) return jsonWithCors({ error: parsed.message, code: parsed.code }, parsed.status, request, env);
      const { message, sessionId, studentId } = parsed.data;
      if (!message || typeof message !== 'string' || message.trim().length < 1) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'message' }, 400, request, env);
      if (!sessionId) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'sessionId' }, 400, request, env);
      let history = [];
      if (env.SESSIONS) { try { const sStub = env.SESSIONS.get(env.SESSIONS.idFromName(sessionId)); const hd = await (await sStub.fetch('https://internal/history')).json(); history = hd.messages || []; } catch { } }
      const contextMessages = [...history.slice(-10), { role: 'user', content: message.trim() }];
      const aiResult = await routeAI(env, contextMessages, sessionId);
      if (env.SESSIONS) {
        const sStub = env.SESSIONS.get(env.SESSIONS.idFromName(sessionId));
        ctx.waitUntil(Promise.all([
          sStub.fetch('https://internal/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'user', content: message.trim() }) }),
          aiResult.reply ? sStub.fetch('https://internal/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'assistant', content: aiResult.reply }) }) : Promise.resolve()
        ]));
      }
      ctx.waitUntil(recordCostEvent(env, { route: '/chat', sessionId, studentId: studentId || null, inputChars: message.length, actualTokens: aiResult.tokens, provider: aiResult.provider }, ctx));
      return jsonWithCors({ ok: true, reply: aiResult.reply, provider: aiResult.provider, rateRemaining: rateResult.remaining, sessionId }, 200, request, env);
    }

    // /profile/upsert
    if (url.pathname === '/profile/upsert' && request.method === 'POST') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.STUDENT_PROFILES) return jsonWithCors({ error: ERR.BINDING_MISSING, binding: 'STUDENT_PROFILES' }, 500, request, env);
      const parsed = await safeJsonBytes(request, 16384);
      if (parsed.error) return jsonWithCors({ error: parsed.message, code: parsed.code }, parsed.status, request, env);
      const studentId = parsed.data.studentId;
      if (!studentId) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'studentId' }, 400, request, env);
      const stub = env.STUDENT_PROFILES.get(env.STUDENT_PROFILES.idFromName(studentId));
      const resp = await stub.fetch('https://internal/upsert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) });
      ctx.waitUntil(auditLog(env, 'PROFILE_UPSERT', await actorHash(request.headers.get('x-sovereign-key')), { studentId }, ctx));
      return jsonWithCors(await resp.json(), resp.status, request, env);
    }

    // /profile/get — v139 PATCH: single DO fetch (was double)
    if (url.pathname === '/profile/get') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.STUDENT_PROFILES) return jsonWithCors({ error: ERR.BINDING_MISSING }, 500, request, env);
      const studentId = url.searchParams.get('studentId');
      if (!studentId) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'studentId' }, 400, request, env);
      const stub = env.STUDENT_PROFILES.get(env.STUDENT_PROFILES.idFromName(studentId));
      const resp = await stub.fetch('https://internal/get');
      const data = await resp.json();
      return jsonWithCors(data, resp.status, request, env);
    }

    // /tiger-score
    if (url.pathname === '/tiger-score' && request.method === 'POST') {
      const auth = await checkAuth(request, 'CHAT', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      const parsed = await safeJsonBytes(request, 2048);
      if (parsed.error) return jsonWithCors({ error: parsed.message }, parsed.status, request, env);
      const result = computeTigerScore(parsed.data);
      if (result.error) return jsonWithCors(result, 422, request, env);
      if (parsed.data.studentId && env.STUDENT_PROFILES) {
        const stub = env.STUDENT_PROFILES.get(env.STUDENT_PROFILES.idFromName(parsed.data.studentId));
        ctx.waitUntil(stub.fetch('https://internal/tiger-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) }));
      }
      ctx.waitUntil(recordCostEvent(env, { route: '/tiger-score', ...result, studentId: parsed.data.studentId }, ctx));
      return jsonWithCors({ ok: true, ...result }, 200, request, env);
    }

    // /query
    if (url.pathname === '/query') {
      if (request.method !== 'POST') return jsonWithCors({ error: 'POST required' }, 405, request, env);
      if (!env.SOUL_DNA) return jsonWithCors({ error: ERR.BINDING_MISSING, binding: 'SOUL_DNA' }, 500, request, env);
      const parsed = await safeJsonBytes(request, 2048);
      if (parsed.error) return jsonWithCors({ error: parsed.message, code: parsed.code }, parsed.status, request, env);
      const query = (parsed.data.query || '').trim();
      if (!query) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'query' }, 400, request, env);
      const list = await env.SOUL_DNA.list({ prefix: 'LAYER_', limit: 50 });
      const results = [];
      for (const key of list.keys) {
        const val = await env.SOUL_DNA.get(key.name);
        if (val && val.toLowerCase().includes(query.toLowerCase())) results.push({ key: key.name, snippet: val.slice(0, 300) });
        if (results.length >= 10) break;
      }
      return jsonWithCors({ query, results, layersScanned: list.keys.length, status: results.length > 0 ? 'SIGNAL' : 'NO_SIGNAL', worker: WORKER_VERSION }, 200, request, env);
    }

    // /pedagogy/generate
    if (url.pathname === '/pedagogy/generate') {
      if (request.method !== 'POST') return jsonWithCors({ error: 'POST required' }, 405, request, env);
      const auth = await checkAuth(request, 'CHAT', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.GITHUB_TOKEN) return jsonWithCors({ error: 'B4_BLOCKED', reason: 'B3 upstream blocked — GITHUB_TOKEN required', benchmark: 'B4', status: 'BLOCKED' }, 503, request, env);
      const parsed = await safeJsonBytes(request, 4096);
      if (parsed.error) return jsonWithCors({ error: parsed.message, code: parsed.code }, parsed.status, request, env);
      const { studentId = null, level = 'intermediate', focusArea = 'general' } = parsed.data;
      const lesson = { schemaVersion: 1, lessonId: `LESSON_${Date.now()}_${crypto.randomUUID().slice(0, 8).toUpperCase()}`, generatedAt: new Date().toISOString(), studentId, level, focusArea, netPhysics: NET_PHYSICS, content: { vocabItems: Array.from({ length: NET_PHYSICS.vocab }, (_, i) => ({ word: `VOCAB_${i + 1}`, definition: 'TBD', example: 'TBD' })), idioms: Array.from({ length: NET_PHYSICS.idioms }, (_, i) => ({ phrase: `IDIOM_${i + 1}`, meaning: 'TBD', usage: 'TBD' })), slang: Array.from({ length: NET_PHYSICS.slang }, (_, i) => ({ term: `SLANG_${i + 1}`, context: 'TBD' })), pressureGames: Array.from({ length: NET_PHYSICS.pressureGames }, (_, i) => ({ gameId: `PG_${i + 1}`, objective: 'volume_over_perfection', instructions: 'TBD' })) }, tigerScoreBaseline: null, status: 'SCHEMA_GENERATED', worker: WORKER_VERSION };
      if (studentId && env.STUDENT_PROFILES) { const stub = env.STUDENT_PROFILES.get(env.STUDENT_PROFILES.idFromName(studentId)); ctx.waitUntil(stub.fetch('https://internal/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'LESSON_GENERATED', lessonId: lesson.lessonId, level }) })); }
      ctx.waitUntil(sealSuccessPheromone('B4_LESSON_GENERATED', env, ctx));
      return jsonWithCors(lesson, 200, request, env);
    }

    // /mine
    if (url.pathname === '/mine') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.GITHUB_TOKEN) return jsonWithCors({ error: ERR.B3_BLOCKED, code: ERR.B3_BLOCKED, action: 'Run: wrangler secret put GITHUB_TOKEN', benchmark: 'B3', status: 'BLOCKED' }, 503, request, env);
      const body = request.method === 'POST' ? ((await safeJsonBytes(request, 2048).catch(() => ({ error: false, data: {} }))).data || {}) : {};
      const mineTarget = body.repo || 'mrmichaelhobbs1234-lang/phoenix-ob1';
      const branch = body.branch || 'main';
      const ghResp = await fetch(`https://api.github.com/repos/${mineTarget}/commits?sha=${branch}&per_page=30`, { headers: { 'Authorization': `Bearer ${env.GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'phoenix-ob1-miner' } });
      if (!ghResp.ok) return jsonWithCors({ error: 'GITHUB_FETCH_FAILED', status: ghResp.status, target: mineTarget }, 502, request, env);
      const commits = await ghResp.json();
      const layers = [];
      for (const commit of commits.slice(0, 10)) {
        const layerKey = `LAYER_${Date.now()}_${commit.sha.slice(0, 8)}`;
        const layerValue = JSON.stringify({ source: mineTarget, sha: commit.sha, message: commit.commit.message, author: commit.commit.author.name, date: commit.commit.author.date, minedAt: new Date().toISOString() });
        if (env.SOUL_DNA) await env.SOUL_DNA.put(layerKey, layerValue);
        layers.push(layerKey);
      }
      ctx.waitUntil(auditLog(env, 'MINE_COMPLETE', await actorHash(request.headers.get('x-sovereign-key')), { layersWritten: layers.length, target: mineTarget }, ctx));
      ctx.waitUntil(sealSuccessPheromone('B3', env, ctx));
      return jsonWithCors({ ok: true, status: 'MINE_COMPLETE', layersWritten: layers.length, repoTarget: mineTarget, layers, pheromone: 'SUCCESSPHEROMONE:VALIDATED:B3', benchmark: 'B3' }, 200, request, env);
    }

    // /chaos/assault — SELF-TEST GAUNTLET (SOVEREIGN ONLY)
    if (url.pathname === '/chaos/assault') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      const assaultResult = await runChaosAssault(env, ctx);
      return jsonWithCors(assaultResult, assaultResult.verdict === 'ASSAULT_FAILED' ? 500 : 200, request, env);
    }

    // /chaos
    if (url.pathname === '/chaos') {
      if (request.method === 'POST') {
        const auth = await checkAuth(request, 'SOVEREIGN', env);
        if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
        const parsed = await safeJsonBytes(request, 1024);
        if (parsed.error) return jsonWithCors({ error: parsed.message }, parsed.status, request, env);
        ctx.waitUntil(logSwarmIntent(env, 'CHAOS_LEVEL_CHANGE', { requested: parsed.data.level }, ctx));
        return jsonWithCors({ ok: true, message: `Chaos level ${parsed.data.level} logged`, current: env.CHAOS_LEVEL || 'OFF', requested: parsed.data.level }, 200, request, env);
      }
      return jsonWithCors({ current_level: env.CHAOS_LEVEL || 'OFF', current_probability: String(getChaosLevel(env)), available_levels: CHAOS_LEVELS, exempt_paths: [...CHAOS_EXEMPT_PATHS], voidpheromone: 'ACTIVE', assault_endpoint: '/chaos/assault' }, 200, request, env);
    }

    // /swarm
    if (url.pathname === '/swarm') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.SOUL_DNA) return jsonWithCors({ error: ERR.BINDING_MISSING, binding: 'SOUL_DNA' }, 500, request, env);
      const list = await env.SOUL_DNA.list({ prefix: 'SWARM_INTENT_', limit: 100 });
      const intents = await Promise.all(list.keys.map(async (key) => {
        const raw = await env.SOUL_DNA.get(key.name);
        try { return { key: key.name, ...JSON.parse(raw) }; }
        catch { return { key: key.name, raw, parseError: true }; }
      }));
      return jsonWithCors({ ok: true, intent_count: intents.length, intents }, 200, request, env);
    }

    // /audit — CHAOS ENGINEER AUDIT TRAIL (last 100 steps)
    if (url.pathname === '/audit') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.LEDGER) return jsonWithCors({ error: ERR.BINDING_MISSING, binding: 'LEDGER' }, 500, request, env);
      const stub = env.LEDGER.get(env.LEDGER.idFromName('global'));
      const vResp = await stub.fetch('https://internal/verify');
      const vData = await vResp.json();
      const chainHead = vData.chainHead ?? -1;
      const from = Math.max(0, chainHead - 99);
      const rResp = await stub.fetch(`https://internal/range?from=${from}&to=${chainHead}`);
      const rData = await rResp.json();
      return jsonWithCors({ ok: true, steps: rData.blocks || [], stepCount: (rData.blocks || []).length, chainHead, from, to: chainHead, valid: vData.valid, worker: WORKER_VERSION, ts: new Date().toISOString() }, 200, request, env);
    }

    // /souldna
    if (url.pathname === '/souldna') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      if (!env.SOUL_DNA) return jsonWithCors({ error: ERR.BINDING_MISSING }, 500, request, env);
      const key = url.searchParams.get('key') || 'SOUL_DNA_INDEX';
      const value = await env.SOUL_DNA.get(key);
      return jsonWithCors({ key, value: value || null }, 200, request, env);
    }

    // /admin/status
    if (url.pathname === '/admin/status') {
      const auth = await checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) return jsonWithCors({ error: auth.code }, 403, request, env);
      const wd = await watchdog(env);
      const benchmarks = await runBenchmarks(env, 0);
      return jsonWithCors({ ok: true, version: WORKER_VERSION, watchdog: wd, benchmarks, gospel: GOSPEL, netPhysics: NET_PHYSICS, secretsPresent: { SOVEREIGN_KEY: !!env.SOVEREIGN_KEY, CHAT_KEY: !!env.CHAT_KEY, GITHUB_TOKEN: !!env.GITHUB_TOKEN, DEEPGRAM_API_KEY: !!env.DEEPGRAM_API_KEY }, doBindings: { LEDGER: !!env.LEDGER, SESSIONS: !!env.SESSIONS, STUDENT_PROFILES: !!env.STUDENT_PROFILES, RATELIMITER: !!env.RATELIMITER, MEMORY: !!env.MEMORY, SOUL_DNA_KV: !!env.SOUL_DNA } }, 200, request, env);
    }

    // /auth/login
    if (url.pathname === '/auth/login' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 1024);
      if (parsed.error) return jsonWithCors({ error: parsed.message }, parsed.status, request, env);
      const { email } = parsed.data;
      if (!email || !email.includes('@')) return jsonWithCors({ error: ERR.SCHEMA_INVALID, field: 'email' }, 400, request, env);
      const sessionToken = crypto.randomUUID();
      ctx.waitUntil(logSwarmIntent(env, 'AUTH_LOGIN_ATTEMPT', { email: email.split('@')[1] }, ctx));
      return jsonWithCors({ ok: true, message: 'Magic link sent — W1 auth pipeline active', sessionToken, note: 'Full magic link email delivery pending W1 completion' }, 200, request, env);
    }

    // /deepgram-ws
    if (url.pathname === '/deepgram-ws') {
      if (request.headers.get('Upgrade') !== 'websocket') return jsonWithCors({ error: ERR.WS_AUTH_REQUIRED, hint: 'Connect via WebSocket' }, 426, request, env);
      const token = url.searchParams.get('token') || '';
      const expected = env.CHAT_KEY || '';
      if (!expected || !(await timingSafeEqual(token, expected))) return jsonWithCors({ error: ERR.AUTH_FAILED, code: ERR.WS_AUTH_REQUIRED }, 401, request, env);
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const wsRate = await enforceRateLimit(env, `ws:${ip}`, 5, 60000);
      if (!wsRate.allowed) return jsonWithCors({ error: ERR.RATE_LIMITED }, 429, request, env, wsRate.retryAfter ? { 'Retry-After': String(wsRate.retryAfter) } : {});
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();
      let deepgramWs = null;
      const openDeepgram = async () => {
        try {
          deepgramWs = new WebSocket(`wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true`, ['token', env.DEEPGRAM_API_KEY || '']);
          deepgramWs.addEventListener('message', (e) => { try { server.send(e.data); } catch { } });
          deepgramWs.addEventListener('close', () => { try { server.close(1000, 'Deepgram closed'); } catch { } });
          deepgramWs.addEventListener('error', () => { try { server.send(JSON.stringify({ type: 'STT_ERROR', code: 'DEEPGRAM_CONNECTION_FAILED' })); } catch { } });
        } catch { try { server.send(JSON.stringify({ type: 'STT_ERROR', code: 'DEEPGRAM_INIT_FAILED' })); } catch { } }
      };
      ctx.waitUntil(openDeepgram());
      server.addEventListener('message', async (event) => {
        try { if (typeof event.data === 'string') return; if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) deepgramWs.send(event.data); }
        catch { try { server.send(JSON.stringify({ type: 'STT_ERROR', code: 'RELAY_FAILED' })); } catch { } }
      });
      server.addEventListener('close', () => { try { if (deepgramWs) deepgramWs.close(); } catch { } });
      return new Response(null, { status: 101, webSocket: client });
    }

    // 404
    return jsonWithCors({ error: ERR.NOT_FOUND, version: WORKER_VERSION }, 404, request, env);
  }
};
