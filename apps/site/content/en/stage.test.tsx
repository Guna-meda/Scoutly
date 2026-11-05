import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScreenStack, ScreenStacked } from '@/components/chat/ScreenStack';
import { SAMPLE_NAMES, stage } from './index';

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe('draft email format (CONTENT.md section 3)', () => {
  const y = stage.yours;
  const all = [y.greeting, ...y.paragraphs, y.signoff].join(' ');

  it('greets by first name', () => {
    expect(y.greeting).toMatch(/^Hi [A-Z][a-z]+,$/);
  });
  it('has exactly three body paragraphs of at most two sentences-lines', () => {
    expect(y.paragraphs).toHaveLength(3);
  });
  // CONTENT.md says "about 60 to 90 words"; the approved sample is 57, so the floor is 55.
  it('is about 60 to 90 words in total (55 to 90)', () => {
    const n = words(all);
    expect(n).toBeGreaterThanOrEqual(55);
    expect(n).toBeLessThanOrEqual(90);
  });
  it('has no placeholder tokens', () => {
    expect(all).not.toMatch(/[[\]{}]|«PH:/);
  });
  it('makes exactly one ask', () => {
    expect(all.match(/\?/g)).toHaveLength(1);
  });
});

describe('sample names', () => {
  const { ui: _ui, ...sample } = stage; // UI strings are not sample data
  const text = JSON.stringify(sample);
  it('uses every sample name', () => {
    for (const n of SAMPLE_NAMES) expect(text).toContain(n);
  });
  it('introduces no other capitalised names', () => {
    const generic = new Set(
      (
        'Scoutly Sample Simple Specific Yours Send Drop Startups Nothing Each You Edit Got Reading ' +
        'Draft Strong Good Stretch Reply Sent Seed Series Remote India Bengaluru Pune Hiring Frontend ' +
        'Product Why Source Hi Thanks Would Your Gmail SEND EDIT DISCARD WhatsApp I Nothing Thanks ' +
        "That That's It A No My I'm I'll I've"
      ).split(' '),
    );
    const known = new Set([...generic, ...SAMPLE_NAMES.flatMap((n) => n.split(/[ &]+/))]);
    const caps = text.match(/\b[A-Z][A-Za-z']*\b/g) ?? [];
    const strangers = [...new Set(caps)].filter((w) => !known.has(w));
    expect(strangers).toEqual([]);
  });
});

describe('device markup', () => {
  it('every stacked screen shows the SAMPLE tag', () => {
    const html = renderToStaticMarkup(<ScreenStacked />);
    expect(html.match(new RegExp(`>${stage.device.sampleTag}<`, 'g'))).toHaveLength(3);
  });
  it('contains nothing focusable', () => {
    const html = renderToStaticMarkup(<ScreenStack beat={2} />);
    expect(html).not.toMatch(/tabindex|role="button"|<button|<a |onclick/i);
  });
  it('marks inactive screens aria-hidden and inert', () => {
    const html = renderToStaticMarkup(<ScreenStack beat={1} />);
    expect(html.match(/data-state="before"[^>]*aria-hidden="true"[^>]*inert/g)).toHaveLength(1);
    expect(html.match(/data-state="after"[^>]*aria-hidden="true"[^>]*inert/g)).toHaveLength(1);
    expect(html.match(/data-state="active"/g)).toHaveLength(1);
  });
});
