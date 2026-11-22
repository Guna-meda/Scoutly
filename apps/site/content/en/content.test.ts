import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL } from './contact';
import {
  control,
  faq,
  flags,
  gmail,
  privacy,
  global,
  hero,
  nav,
  ph,
  placeholderKeys,
  placeholders,
} from './index';

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
  it('has no scraping or LinkedIn claims, and no scraping FAQ item', () => {
    const all = JSON.stringify([faq, privacy, gmail, control]);
    expect(all).not.toMatch(/scrap/i);
    expect(faq.items.some((i) => /linkedin/i.test(i.q))).toBe(false);
    expect(control.items.map((i) => i.body)).toContain('Scoutly does not read private data.');
  });
  it('privacy has the Google user data section with the Limited Use statement', () => {
    const section = privacy.sections.find((s) => s.id === 'google-user-data');
    expect(section?.heading).toBe('Google user data');
    expect(section?.paragraphs?.[0]).toBe(
      'Scoutly’s use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.',
    );
    expect(section?.links?.[0]?.href).toBe(
      'https://developers.google.com/terms/api-services-user-data-policy',
    );
    const text = JSON.stringify(section);
    expect(text).toContain('gmail.send');
    expect(text).toContain('gmail.readonly');
    expect(text).toContain('DISCONNECT');
    expect(gmail.linkHref).toBe('/privacy#google-user-data');
  });
  it('privacy lists link sharing under What we collect', () => {
    const collect = privacy.sections.find((s) => s.heading === 'What we collect');
    expect(collect?.bullets).toContain(
      'Links you share, such as a portfolio or LinkedIn page: we read the public details on that page to build your profile.',
    );
  });
});
