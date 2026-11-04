import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MIN_RATIO, contrastPairs, forbiddenPairs, type TokenName } from './contrast-pairs';

const css = readFileSync(join(__dirname, 'tokens.css'), 'utf8');

function token(name: TokenName): string {
  const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`).exec(css);
  if (!m?.[1]) throw new Error(`token --${name} not found as a 6-digit hex in tokens.css`);
  return m[1];
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
}

export function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe('contrast pairs', () => {
  for (const p of contrastPairs) {
    it(`${p.fg} on ${p.bg} (${p.kind}) >= ${MIN_RATIO[p.kind]}`, () => {
      expect(ratio(token(p.fg), token(p.bg))).toBeGreaterThanOrEqual(MIN_RATIO[p.kind]);
    });
  }

  it('never pairs --ink-2 with --beat-2 (fails at 4.0:1)', () => {
    for (const f of forbiddenPairs) {
      expect(contrastPairs.some((p) => p.fg === f.fg && p.bg === f.bg)).toBe(false);
    }
    expect(ratio(token('ink-2'), token('beat-2'))).toBeLessThan(4.5);
  });

  it('matches the verified values in DESIGN_SYSTEM.md', () => {
    const near = (a: TokenName, b: TokenName, v: number) =>
      expect(ratio(token(a), token(b))).toBeCloseTo(v, 0);
    near('ink', 'bg', 16.2);
    near('ink', 'surface', 18.4);
    near('ink', 'beat-1', 16.0);
    near('ink', 'beat-2', 9.6);
    near('ink', 'chat-bg', 14.6);
    near('ink-2', 'bg', 6.8);
    near('ink-2', 'surface', 7.7);
  });
});
