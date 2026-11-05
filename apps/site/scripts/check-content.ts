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
const ATTR = /(?<![\w-])(?:alt|aria-label|title|placeholder)="([^"{}]*[A-Za-z]{2,}[^"{}]*)"/g;

const blank = (m: string) => m.replace(/[^\n]/g, ' ');

/** Blank out comments (keeping line numbers) so JSDoc prose is not mistaken for JSX text. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|\s)\/\/[^\n]*/g, blank);
}

const hits: Hit[] = [];
for (const file of sourceFiles(['.tsx'])) {
  if (/\.test\.tsx$/.test(file)) continue;
  const text = stripComments(read(file)).replaceAll('=>', '  ');
  for (const [re, rule] of [
    [TEXT_NODE, 'jsx-text'],
    [ATTR, 'jsx-attr'],
  ] as const) {
    for (const m of text.matchAll(re)) {
      const value = (m[1] ?? '').trim();
      // Code between JSX tags (arrow bodies, statements) is not prose.
      if (!value || /[;(){}=]/.test(value) || /^[\s,]*[\w'-]+:\s*$/.test(value)) continue;
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
