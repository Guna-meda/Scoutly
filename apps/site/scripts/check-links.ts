/**
 * Starts the built site (`next start`) and crawls it with linkinator.
 * Broken internal links fail the run; broken external links only warn.
 * Requires `pnpm build` first.
 */
import { spawn } from 'node:child_process';
import { LinkChecker, LinkState } from 'linkinator';
import { siteRoot } from './lib';

const PORT = 3101;
const ORIGIN = `http://localhost:${PORT}`;

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
  {
    cwd: siteRoot,
    stdio: 'ignore',
  },
);

let internalBroken = 0;
try {
  await waitForServer();
  const checker = new LinkChecker();
  const result = await checker.check({ path: ORIGIN, recurse: true, timeout: 15000 });
  const broken = result.links.filter((l) => l.state === LinkState.BROKEN);
  for (const l of broken) {
    // The deliberate 404 page route is not linked from anywhere, so any broken URL is real.
    const internal = l.url.startsWith(ORIGIN);
    if (internal) internalBroken++;
    console.log(
      `${internal ? 'FAIL' : 'WARN'} ${l.status ?? '?'} ${l.url} (from ${l.parent ?? 'root'})`,
    );
  }
  console.log(
    `check-links: ${result.links.length} links, ${internalBroken} internal broken, ${broken.length - internalBroken} external broken (warn)`,
  );
} finally {
  server.kill();
}
process.exit(internalBroken === 0 ? 0 : 1);
