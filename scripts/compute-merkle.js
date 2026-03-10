#!/usr/bin/env node
/**
 * compute-merkle.js
 * Phoenix OB-1 — Deterministic SHA-256 Merkle Root Computation
 * Usage: node scripts/compute-merkle.js
 * Output: Merkle root hash for docs/FINAL_SEAL.json
 */

import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(process.cwd());

// Canonical artifact set — order is deterministic, do not change
const ARTIFACTS = [
  'src/reincarnate.js',
  'wrangler.toml',
  'validators/student-profile.js',
  'docs/BENCHMARK_LIBRARY.json',
  'docs/SOUL_DNA_SEED.json',
  'docs/OPERATOR_RUNBOOK.md',
  'docs/STAGE_05_MANIFEST.md',
  'docs/RUNTIME_TRUTH.md',
];

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function merkleRoot(leaves) {
  if (leaves.length === 0) throw new Error('No leaves');
  let level = leaves.map(l => sha256(l));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left; // odd node duplicated
      next.push(sha256(left + right));
    }
    level = next;
  }
  return level[0];
}

const hashes = {};
const leaves = [];

for (const artifact of ARTIFACTS) {
  try {
    const content = readFileSync(resolve(ROOT, artifact));
    const hash = sha256(content);
    hashes[artifact] = hash;
    leaves.push(hash);
    console.log(`  ${hash}  ${artifact}`);
  } catch (e) {
    console.warn(`  MISSING: ${artifact} — using zero hash`);
    const zeroHash = '0'.repeat(64);
    hashes[artifact] = zeroHash;
    leaves.push(zeroHash);
  }
}

const root = merkleRoot(leaves);

console.log(`\n${'='.repeat(72)}`);
console.log(`MERKLE_ROOT: ${root}`);
console.log(`${'='.repeat(72)}`);
console.log('\nPaste this into docs/FINAL_SEAL.json: merkleRootSha256');
console.log('And fill the chunkHashes with the individual hashes above.');
console.log(`\nSEAL_CLASS: ${leaves.some(h => h === '0'.repeat(64)) ? 'HASH_PENDING (missing files)' : 'HASH_COMPUTED'}`);
