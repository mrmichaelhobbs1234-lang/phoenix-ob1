// PHOENIX OB-1 v134-CHAOS-MAGIC
// MAXOUT MODE: Minimal viable runtime surface
// Burned v132 bloat - rebuilt from v134 spec
// PATCHED 2026-03-10: GAP_002 sovereign key env, GAP_003 evidence fix
// PATCHED 2026-03-10 (new repo): import path fixed src/ -> ../validators/

const WORKER_VERSION = 'v134-CHAOS-MAGIC';
const GENESIS_HASH = '0'.repeat(64);

// CHAOS ENGINE — v134-CHAOS-MAGIC
// VOIDPHEROMONE: probabilistic fault injection
function injectChaos(env, label) {
  const prob = parseFloat(env.CHAOS_PROBABILITY || '0');
  if (prob > 0 && Math.random() < prob) {
    throw new Error(`VOIDPHEROMONE: chaos injected at [${label}]`);
  }
}

// ============================================================================
// BODY GUARD: safeJsonBytes
// ============================================================================

async function safeJsonBytes(request, maxBytes = 8192) {
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    bytesRead += value.byteLength;
    if (bytesRead > maxBytes) {
      return {
        error: true,
        status: 413,
        message: `Payload exceeds ${maxBytes} bytes`
      };
    }
    text += decoder.decode(value, { stream: true });
  }
  
  try {
    return { error: false, data: JSON.parse(text) };
  } catch (err) {
    return { error: true, status: 400, message: 'Invalid JSON' };
  }
}

// ============================================================================
// LEDGER PHYSICS: PHX:BLOCK
// ============================================================================

async function sha256(data) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function canonJSON(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonJSON).join(',') + ']';
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${canonJSON(obj[k])}`);
  return '{' + pairs.join(',') + '}';
}

async function appendBlock(ledger, payload) {
  const height = ledger.length;
  const prevHash = height === 0 ? GENESIS_HASH : ledger[height - 1].hash;
  const timestamp = new Date().toISOString();
  const data = `PHX:BLOCK:${height}:${prevHash}:${canonJSON(payload)}:${timestamp}`;
  const hash = await sha256(data);
  
  const block = { height, prevHash, payload, timestamp, hash };
  ledger.push(block);
  return block;
}

async function verifyChain(ledger) {
  if (ledger.length === 0) return { valid: true, breaks: [] };
  
  const breaks = [];
  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : ledger[i - 1].hash;
    
    if (block.prevHash !== expectedPrevHash) {
      breaks.push({ index: i, reason: 'prevHash mismatch' });
    }
    
    const data = `PHX:BLOCK:${block.height}:${block.prevHash}:${canonJSON(block.payload)}:${block.timestamp}`;
    const expectedHash = await sha256(data);
    
    if (block.hash !== expectedHash) {
      breaks.push({ index: i, reason: 'hash mismatch' });
    }
  }
  
  return { valid: breaks.length === 0, breaks, chainHead: ledger.length - 1 };
}

// ============================================================================
// DURABLE OBJECTS
// ============================================================================

export class LedgerDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/append' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) {
        return new Response(JSON.stringify({ error: parsed.message }), { 
          status: parsed.status 
        });
      }
      
      const ledger = await this.state.storage.get('ledger') || [];
      const block = await appendBlock(ledger, parsed.data);
      await this.state.storage.put('ledger', ledger);
      
      return new Response(JSON.stringify({ ok: true, block }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/verify') {
      const ledger = await this.state.storage.get('ledger') || [];
      const result = await verifyChain(ledger);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/range') {
      const from = parseInt(url.searchParams.get('from') || '0');
      const to = parseInt(url.searchParams.get('to') || '999999');
      const ledger = await this.state.storage.get('ledger') || [];
      const slice = ledger.slice(from, to + 1);
      return new Response(JSON.stringify({ blocks: slice }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('LedgerDO ready', { status: 200 });
  }
}

export class SessionDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/add' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) {
        return new Response(JSON.stringify({ error: parsed.message }), { 
          status: parsed.status 
        });
      }
      
      const messages = await this.state.storage.get('messages') || [];
      messages.push({
        role: parsed.data.role,
        content: parsed.data.content,
        timestamp: new Date().toISOString()
      });
      
      const trimmed = messages.slice(-50);
      await this.state.storage.put('messages', trimmed);
      
      return new Response(JSON.stringify({ ok: true, count: trimmed.length }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/history') {
      const messages = await this.state.storage.get('messages') || [];
      return new Response(JSON.stringify({ messages }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('SessionDO ready', { status: 200 });
  }
}

export class StudentProfileDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    return new Response('StudentProfileDO stub', { status: 200 });
  }
}

export class RateLimiterDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key') || 'default';
    const limit = parseInt(url.searchParams.get('limit') || '60');
    const windowMs = parseInt(url.searchParams.get('windowMs') || '60000');

    const now = Date.now();
    const record = await this.state.storage.get(key) || { count: 0, windowStart: now };

    if (now - record.windowStart > windowMs) {
      record.count = 0;
      record.windowStart = now;
    }

    record.count++;
    await this.state.storage.put(key, record);

    const allowed = record.count <= limit;
    return new Response(JSON.stringify({
      allowed,
      count: record.count,
      limit,
      remaining: Math.max(0, limit - record.count),
      resetAt: new Date(record.windowStart + windowMs).toISOString()
    }), {
      status: allowed ? 200 : 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ============================================================================
// AUTH MATRIX — GAP_002 PATCHED: sovereign key from env secret
// ============================================================================

function checkAuth(request, level, env) {
  if (level === 'PUBLIC') return { allowed: true };
  
  if (level === 'SOVEREIGN') {
    const key = request.headers.get('x-sovereign-key');
    const expectedKey = env.SOVEREIGN_KEY;
    if (!expectedKey) return { allowed: false, reason: 'SOVEREIGN_KEY not configured' };
    return { allowed: key === expectedKey };
  }
  
  return { allowed: false, reason: 'Unknown auth level' };
}

export default {
  async fetch(request, env, ctx) {
    injectChaos(env, 'fetch-entry');
    const url = new URL(request.url);
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        ok: true,
        version: WORKER_VERSION,
        chaos_probability: env.CHAOS_PROBABILITY || '0',
        deployedAt: env.DEPLOYED_AT || 'UNKNOWN',
        benchmarks: {
          B0: 'NOT_STARTED',
          B1: 'NOT_STARTED',
          B2: 'NOT_STARTED',
          B3: 'NOT_STARTED',
          B4: 'NOT_STARTED',
          B5: 'NOT_STARTED'
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    if (url.pathname === '/evidence') {
      const storedHash = env.SOUL_DNA ? await env.SOUL_DNA.get('WORKER_SRC_HASH') : null;
      
      return new Response(JSON.stringify({
        version: WORKER_VERSION,
        srcsha256: storedHash || 'NOT_SET — run wrangler kv:key put WORKER_SRC_HASH <hash>',
        canonicalWorker: 'phoenix-ob1.mrmichaelhobbs1234.workers.dev',
        deployedAt: env.DEPLOYED_AT || 'UNKNOWN',
        provenance: storedHash ? 'kv-attested' : 'unverified',
        kvBinding: env.SOUL_DNA ? 'BOUND' : 'MISSING'
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    if (url.pathname === '/ledgerverify') {
      const fromHeight = parseInt(url.searchParams.get('fromHeight') || '0');
      const toHeight = parseInt(url.searchParams.get('toHeight') || '999999');
      
      if (!env.LEDGER) {
        return new Response(JSON.stringify({
          error: 'LEDGER binding not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      const ledgerId = env.LEDGER.idFromName('global');
      const ledgerStub = env.LEDGER.get(ledgerId);
      
      const verifyResp = await ledgerStub.fetch('https://fake/verify');
      const verifyData = await verifyResp.json();
      
      const rangeResp = await ledgerStub.fetch(`https://fake/range?from=${fromHeight}&to=${toHeight}`);
      const rangeData = await rangeResp.json();
      
      return new Response(JSON.stringify({
        valid: verifyData.valid,
        chainHead: verifyData.chainHead,
        genesisHash: GENESIS_HASH,
        verifiedRange: [fromHeight, Math.min(toHeight, verifyData.chainHead ?? 0)],
        breaks: verifyData.breaks || [],
        blocks: rangeData.blocks || []
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (url.pathname === '/souldna' && request.method === 'GET') {
      const auth = checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      if (!env.SOUL_DNA) {
        return new Response(JSON.stringify({ error: 'SOUL_DNA KV not bound' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      const key = url.searchParams.get('key') || 'SOUL_DNA_INDEX';
      const value = await env.SOUL_DNA.get(key);
      return new Response(JSON.stringify({ key, value: value || null }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    if (url.pathname === '/chat' && request.method === 'POST') {
      const parsed = await safeJsonBytes(request, 8192);
      if (parsed.error) {
        return new Response(JSON.stringify({ error: parsed.message }), { 
          status: parsed.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      const { message, sessionId } = parsed.data;
      if (!message || !sessionId) {
        return new Response(JSON.stringify({ error: 'Missing message or sessionId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      return new Response(JSON.stringify({
        ok: true,
        reply: 'Chat endpoint stub - AI routing not implemented in v134',
        aiUsed: 'stub'
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    if (url.pathname === '/mine') {
      const auth = checkAuth(request, 'SOVEREIGN', env);
      if (!auth.allowed) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      
      return new Response(JSON.stringify({
        ok: true,
        message: 'Mining endpoint stub - not implemented in v134'
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-sovereign-key'
        }
      });
    }
    
    return new Response('Phoenix OB-1 ' + WORKER_VERSION, { status: 404 });
  }
};
