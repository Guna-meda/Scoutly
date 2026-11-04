/** Fails on hex colour literals anywhere in src/ or content/ other than tokens.css. */
import { lineOf, printHits, read, rel, sourceFiles, type Hit } from './lib';

const HEX = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const hits: Hit[] = [];

for (const file of sourceFiles(['.ts', '.tsx', '.css'])) {
  if (rel(file) === 'src/styles/tokens.css') continue;
  const text = read(file);
  for (const m of text.matchAll(HEX)) {
    hits.push({ file: rel(file), line: lineOf(text, m.index), rule: 'hex', text: m[0] });
  }
}

printHits(hits, 'FAIL');
console.log(hits.length === 0 ? 'check-hex: ok' : `check-hex: ${hits.length} stray hex value(s)`);
process.exit(hits.length === 0 ? 0 : 1);
