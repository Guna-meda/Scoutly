/**
 * Cross-platform wrapper: runs the three scanners with LAUNCH=1 (works in PowerShell, cmd, bash).
 * Runs all of them even if one fails, then exits non-zero if any failed.
 */
import { spawnSync } from 'node:child_process';
import { siteRoot } from './lib';

const scanners = ['check-placeholders', 'check-claims', 'check-content'];
let failed = false;

for (const name of scanners) {
  const res = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', `scripts/${name}.ts`], {
    cwd: siteRoot,
    stdio: 'inherit',
    env: { ...process.env, LAUNCH: '1' },
  });
  if (res.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
