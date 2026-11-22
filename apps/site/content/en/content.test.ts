import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL } from './contact';
import { flags, global, hero, nav, ph, placeholderKeys, placeholders } from './index';

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
  it('nav lists the five items in order, Contact is a mailto link', () => {
    expect(nav.items).toEqual([
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
    ]);
  });
});
