#!/usr/bin/env node
// Phoenix OB-1 — Chaos Deploy Script
// 3-phase: pre-deploy audit → deploy → post-deploy verification

const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  try {
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(out);
    return out;
  } catch (e) {
    console.error(`❌ FAILED: ${cmd}`);
    console.error(e.message);
    process.exit(1);
  }
}

console.log('🔥 Phoenix OB-1 Chaos Deploy — START');

// PHASE 1 — Pre-deploy gate
console.log('\n1️⃣  Pre-deploy checks...');
run('grep -q "safeJsonBytes" src/reincarnate.js');
console.log('✅ safeJsonBytes guard confirmed in src/reincarnate.js');

// PHASE 2 — Deploy
console.log('\n2️⃣  Deploying...');
run('npx wrangler deploy');

// PHASE 3 — Post-deploy verification
console.log('\n3️⃣  Post-deploy verification (waiting 10s)...');
execSync('sleep 10');

const baseUrl = 'https://phoenix-ob1.mrmichaelhobbs1234.workers.dev';

run(`curl -f ${baseUrl}/health`);
run(`curl -f ${baseUrl}/evidence`);
run(`curl -f ${baseUrl}/ledgerverify`);

console.log('\n✅ Chaos deploy complete.');
console.log('Rollback if needed: git revert HEAD && npx wrangler deploy');
