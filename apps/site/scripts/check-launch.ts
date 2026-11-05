/**
 * Cross-platform wrapper: runs the scanners with LAUNCH=1 (works in PowerShell, cmd, bash), then
 * the extra launch-only checks (pending links file, WhatsApp number). Runs everything even if one
 * part fails, then exits non-zero if any failed.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { siteRoot } from './lib';
import { buildWhatsAppHref } from '../src/lib/whatsapp';

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

const { pending } = JSON.parse(
  readFileSync(join(siteRoot, 'scripts/links-pending.json'), 'utf8'),
) as { pending: string[] };
if (pending.length > 0) {
  console.log(`\nFAIL: links-pending.json is not empty (${pending.length}):`);
  for (const p of pending) console.log(`  pending link: ${p}`);
  failed = true;
}

if (buildWhatsAppHref(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).isPlaceholder) {
  console.log('\nFAIL: NEXT_PUBLIC_WHATSAPP_NUMBER is unset or not a valid number.');
  failed = true;
}

process.exit(failed ? 1 : 0);
