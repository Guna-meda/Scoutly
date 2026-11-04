/**
 * Warns on user-facing string literals in JSX under src/ (components must read content/).
 * Heuristic, regex-based; warnings only (exit 0). See README "check:content limits".
 *
 * Catches:  <p>Some text</p>   and   alt|aria-label|title|placeholder="Some text"
 * Misses:   strings built in expressions, template literals, strings passed via props to
 *           other components, and generics like Array<string> can produce a false positive.
 */
import { lineOf, printHits, read, rel, sourceFiles, type Hit } from './lib';

const TEXT_NODE = />([^<>{}=]*?[A-Za-z]{2,}[^<>{}]*?)</g;
const ATTR = /\b(?:alt|aria-label|title|placeholder)="([^"{}]*[A-Za-z]{2,}[^"{}]*)"/g;

const hits: Hit[] = [];
for (const file of sourceFiles(['.tsx'])) {
  if (/\.test\.tsx$/.test(file)) continue;
  const text = read(file).replaceAll('=>', '  ');
  for (const [re, rule] of [
    [TEXT_NODE, 'jsx-text'],
    [ATTR, 'jsx-attr'],
  ] as const) {
    for (const m of text.matchAll(re)) {
      const value = (m[1] ?? '').trim();
      if (!value) continue;
      hits.push({
        file: rel(file),
        line: lineOf(text, m.index),
        rule,
        text: JSON.stringify(value),
      });
    }
  }
}

printHits(hits, 'WARN');
console.log(hits.length === 0 ? 'check-content: ok' : `check-content: ${hits.length} warning(s)`);
process.exit(0);
