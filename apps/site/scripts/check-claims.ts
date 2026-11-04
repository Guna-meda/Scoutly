/**
 * Fails on banned hype words (ACCESSIBILITY_AND_PERFORMANCE.md section 3 item 9) and on a digit
 * followed by "users", "%" or "interviews" unless the match is in claims-allowlist.json.
 * Scans .ts and .tsx under src/ and content/.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lineOf, printHits, read, rel, siteRoot, sourceFiles, type Hit } from './lib';

const BANNED_WORDS = /revolutionary|supercharge|\b10x\b|guarantee/gi; // "guarantee" also catches "guaranteed"
const NUMERIC_CLAIM = /\d[\d,.]*\s*(?:users|%|interviews)/gi;

const { allow } = JSON.parse(
  readFileSync(join(siteRoot, 'scripts/claims-allowlist.json'), 'utf8'),
) as {
  allow: string[];
};
const allowed = new Set(allow.map((a) => a.toLowerCase().replace(/\s+/g, ' ')));

const hits: Hit[] = [];
for (const file of sourceFiles(['.ts', '.tsx'])) {
  const text = read(file);
  for (const [re, rule] of [
    [BANNED_WORDS, 'banned-word'],
    [NUMERIC_CLAIM, 'numeric-claim'],
  ] as const) {
    for (const m of text.matchAll(re)) {
      if (allowed.has(m[0].toLowerCase().replace(/\s+/g, ' '))) continue;
      hits.push({ file: rel(file), line: lineOf(text, m.index), rule, text: m[0] });
    }
  }
}

printHits(hits, 'FAIL');
console.log(hits.length === 0 ? 'check-claims: ok' : `check-claims: ${hits.length} problem(s)`);
process.exit(hits.length === 0 ? 0 : 1);
