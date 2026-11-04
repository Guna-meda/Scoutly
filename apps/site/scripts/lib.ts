import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const siteRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const IGNORED_DIRS = new Set(['node_modules', '.next', 'scripts', 'coverage', '.lighthouseci']);

export function walk(dir: string, exts: readonly string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!IGNORED_DIRS.has(name)) out.push(...walk(full, exts));
    } else if (exts.some((e) => name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

/** Source files under src/ and content/ (never scripts/, never node_modules). */
export function sourceFiles(exts: readonly string[]): string[] {
  return ['src', 'content'].flatMap((d) => walk(join(siteRoot, d), exts));
}

export function read(file: string): string {
  return readFileSync(file, 'utf8');
}

export function rel(file: string): string {
  return relative(siteRoot, file).replaceAll('\\', '/');
}

export function lineOf(text: string, index: number): number {
  return text.slice(0, index).split('\n').length;
}

export const isLaunch = process.env.LAUNCH === '1' || process.argv.includes('--launch');

export interface Hit {
  file: string;
  line: number;
  rule: string;
  text: string;
}

export function printHits(hits: readonly Hit[], label: 'FAIL' | 'WARN'): void {
  for (const h of hits) console.log(`${label} ${h.file}:${h.line} [${h.rule}] ${h.text}`);
}
