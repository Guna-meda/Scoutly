import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { global, hero } from '@content/en';

export const alt = global.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Reads a colour token from tokens.css so no hex literal lives in code. */
function token(name: string): string {
  const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');
  return new RegExp(`--${name}:\s*(#[0-9a-fA-F]{6})`).exec(css)?.[1] ?? 'white';
}

export default function Image() {
  const ink = token('ink');
  const outer = {
    display: 'flex',
    width: size.width,
    height: size.height,
    background: token('bg'),
    padding: 56,
  } as const;
  const card = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    background: token('surface'),
    border: `4px solid ${ink}`,
    borderRadius: 40,
    padding: 56,
    color: ink,
  } as const;
  const name = { fontSize: 44, fontWeight: 700 } as const;
  const brand = { display: 'flex', alignItems: 'center', gap: 20 } as const;
  const h1 = {
    display: 'flex',
    fontSize: 80,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: -2,
  } as const;
  const tag = {
    display: 'flex',
    alignSelf: 'flex-start',
    background: token('beat-1'),
    border: `3px solid ${ink}`,
    borderRadius: 999,
    padding: '8px 24px',
    fontSize: 28,
  } as const;
  return new ImageResponse(
    <div style={outer}>
      <div style={card}>
        <div style={brand}>
          <svg
            width="72"
            height="72"
            viewBox="0 0 32 32"
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="16" cy="16" r="11" strokeDasharray="52 17.1" />
            <path d="M14 18 L25 7 M17.5 7 H25 V14.5" />
          </svg>
          <div style={name}>{global.siteName}</div>
        </div>
        <div style={h1}>{hero.h1}</div>
        <div style={tag}>{hero.eyebrow}</div>
      </div>
    </div>,
    size,
  );
}
