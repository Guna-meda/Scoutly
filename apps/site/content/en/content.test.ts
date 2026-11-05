import { describe, expect, it } from 'vitest';
import { flags, global, hero, ph, placeholderKeys, placeholders } from './index';

describe('content', () => {
  it('ph() returns the marker string', () => {
    expect(ph('whatsapp_number')).toBe('«PH:whatsapp_number»');
  });
  it('has every placeholder key from CONTENT.md', () => {
    expect(Object.keys(placeholders).sort()).toEqual([...placeholderKeys].sort());
    for (const k of placeholderKeys) expect(placeholders[k]).toBe(`«PH:${k}»`);
  });
  it('flags default as specified', () => {
    expect(flags).toEqual({ pricing: false, repliesBeat: true, waitlist: true });
  });
  it('global and hero match CONTENT.md', () => {
    expect(global.siteName).toBe('Scoutly');
    expect(global.primaryButton).toBe('Start on WhatsApp');
    expect(hero.h1).toBe('Find the startup. Write the email. You press SEND.');
  });
});
