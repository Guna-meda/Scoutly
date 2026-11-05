/**
 * Measures the JavaScript the home page loads, from the production build output (.next).
 *
 * Method: read .next/server/app/index.html, collect every <script src> chunk, gzip each file
 * (zlib level 9, which is what a CDN would send; Next's own server uses a lower level so
 * Lighthouse "transfer" is slightly higher). Sum = gzipped JS for `/`.
 * Next 16 no longer prints "First Load JS", so this script is the number we track.
 *
 * Each chunk is labelled by content: "framework" (React, React DOM, Next runtime, polyfills),
 * "app" (page/layout code and CSS-in-JS glue), or an island name if the chunk contains that
 * island's marker string (data-island="...").
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { siteRoot } from './lib';

const html = readFileSync(join(siteRoot, '.next/server/app/index.html'), 'utf8');
const tags = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"[^>]*>/g)];
const noModule = new Set(tags.filter((m) => /noModule/i.test(m[0])).map((m) => m[1] ?? ''));
// noModule scripts (legacy polyfills) are not downloaded by modern browsers: reported, not counted.
const srcs = [...new Set(tags.map((m) => m[1] ?? ''))].filter((s) => !noModule.has(s));

const islands = ['header-behavior', 'mobile-menu', 'floating-cta'];
const rows: { file: string; kb: number; label: string }[] = [];

for (const src of srcs) {
  const file = join(siteRoot, '.next', src.replace(/^\/_next\//, '').split('?')[0] ?? '');
  const buf = readFileSync(file);
  const text = buf.toString('utf8');
  const gz = gzipSync(buf, { level: 9 }).length;
  let label = 'app';
  if (
    /react-dom|react\.transitional\.element|__next_set_public_path__|self\.__next_f/.test(text) &&
    gz > 20_000
  )
    label = 'framework';
  else if (/polyfill|nomodule/i.test(src)) label = 'framework';
  for (const i of islands)
    if (text.includes(`data-island="${i}"`) || text.includes(`island:${i}`)) label = `island:${i}`;
  rows.push({ file: src.split('/').pop() ?? src, kb: gz / 1024, label });
}

const totals = new Map<string, number>();
for (const r of rows) totals.set(r.label, (totals.get(r.label) ?? 0) + r.kb);
const total = rows.reduce((s, r) => s + r.kb, 0);

for (const r of rows.sort((a, b) => b.kb - a.kb))
  console.log(`${r.kb.toFixed(2).padStart(8)} KB  ${r.label.padEnd(22)} ${r.file}`);
console.log('');
for (const [k, v] of totals) console.log(`${v.toFixed(2).padStart(8)} KB  ${k}`);
console.log(`${total.toFixed(2).padStart(8)} KB  TOTAL gzipped JS for / (${rows.length} files)`);
console.log(
  `(excluded: ${noModule.size} noModule polyfill file(s), not loaded by modern browsers)`,
);
