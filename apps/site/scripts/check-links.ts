/**
 * Starts the built site (`next start`) and crawls it with linkinator.
 * Broken internal links fail the run; broken external links only warn. Internal routes listed in
 * scripts/links-pending.json are expected to be missing until a later phase and only warn.
 * Requires `pnpm build` first.
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LinkChecker, LinkState } from 'linkinator';
import { siteRoot } from './lib';

const PORT = 3101;
const ORIGIN = `http://localhost:${PORT}`;

const { pending } = JSON.parse(
  readFileSync(join(siteRoot, 'scripts/links-pending.json'), 'utf8'),
) as { pending: string[] };
const pendingPaths = new Set(pending.map((p) => p.split('#')[0] || '/'));

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(ORIGIN);
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('server did not start');
}

const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)],
  { cwd: siteRoot, stdio: 'ignore' },
);

let internalBroken = 0;
let pendingHit = 0;
let externalBroken = 0;
let total = 0;
const seen = new Set<string>();
try {
  await waitForServer();
  const result = await new LinkChecker().check({ path: ORIGIN, recurse: true, timeout: 15000 });
  total = result.links.length;
  for (const l of result.links.filter((x) => x.state === LinkState.BROKEN)) {
    const key = `${l.state} ${l.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const status = l.status ?? '?';
    const from = l.parent ?? 'root';
    if (!l.url.startsWith(ORIGIN)) {
      externalBroken++;
      console.log(`WARN external ${status} ${l.url} (from ${from})`);
      continue;
    }
    const path = new URL(l.url).pathname;
    if (pendingPaths.has(path)) {
      pendingHit++;
      console.log(`WARN pending ${status} ${path} (in links-pending.json, from ${from})`);
    } else {
      internalBroken++;
      console.log(`FAIL ${status} ${l.url} (from ${from})`);
    }
  }
} finally {
  server.kill();
}

console.log(
  `check-links: ${total} links, ${internalBroken} internal broken, ${pendingHit} pending (warn), ${externalBroken} external broken (warn)`,
);
console.log(`pending list (${pending.length}): ${pending.join(', ') || 'none'}`);
process.exit(internalBroken === 0 ? 0 : 1);
