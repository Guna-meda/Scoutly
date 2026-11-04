/**
 * Fails on TODO, FIXME, lorem, {{ and xxx in src/ and content/.
 * Lists every «PH:key» (literal or via ph('key')). Warning normally, failure with LAUNCH=1.
 */
import { isLaunch, lineOf, printHits, read, rel, sourceFiles, type Hit } from './lib';

const BANNED = /\bTODO\b|\bFIXME\b|lorem|\{\{|\bxxx\b/gi;
const PH_LITERAL = /«PH:([a-z0-9_*]+)»/g;
const PH_CALL = /\bph\(\s*['"]([a-z0-9_]+)['"]\s*\)/g;

const failures: Hit[] = [];
const placeholders = new Map<string, string[]>();

for (const file of sourceFiles(['.ts', '.tsx', '.css', '.md', '.json'])) {
  const text = read(file);
  for (const m of text.matchAll(BANNED)) {
    failures.push({
      file: rel(file),
      line: lineOf(text, m.index),
      rule: 'banned-token',
      text: m[0],
    });
  }
  // Tests and the ph() implementation mention the marker format; they are not content.
  if (/\.test\.tsx?$/.test(file) || file.endsWith('ph.ts')) continue;
  for (const re of [PH_LITERAL, PH_CALL]) {
    for (const m of text.matchAll(re)) {
      const key = m[1] ?? '?';
      const where = `${rel(file)}:${lineOf(text, m.index)}`;
      placeholders.set(key, [...(placeholders.get(key) ?? []), where]);
    }
  }
}

printHits(failures, 'FAIL');

console.log(`\nPlaceholders found: ${placeholders.size}`);
for (const [key, where] of [...placeholders].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`  «PH:${key}»  (${where.join(', ')})`);
}

let failed = failures.length > 0;
if (placeholders.size > 0) {
  if (isLaunch) {
    console.log('\nFAIL: LAUNCH=1 and placeholders remain.');
    failed = true;
  } else {
    console.log('\nWARN: placeholders remain (these fail with LAUNCH=1).');
  }
}
if (failures.length > 0) console.log(`\nFAIL: ${failures.length} banned token(s).`);
process.exit(failed ? 1 : 0);
