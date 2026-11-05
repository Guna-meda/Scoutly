import { describe, expect, it } from 'vitest';
import { buildWhatsAppHref } from './whatsapp';

describe('buildWhatsAppHref', () => {
  it('builds a wa.me link with encoded text', () => {
    expect(buildWhatsAppHref('919876543210')).toEqual({
      href: 'https://wa.me/919876543210?text=Hi',
      isPlaceholder: false,
    });
  });
  it('normalises +, spaces, dashes and brackets', () => {
    expect(buildWhatsAppHref(' +91 (98765)-43210 ').href).toBe(
      'https://wa.me/919876543210?text=Hi',
    );
  });
  it.each([
    undefined,
    null,
    '',
    '   ',
    '«PH:whatsapp_number»',
    'abc',
    '12345',
    '0123456789',
    '+',
    '1234567890123456',
    '91 98765 x3210',
  ])('falls back to #join for bad input %j', (bad) => {
    expect(buildWhatsAppHref(bad)).toEqual({ href: '#join', isPlaceholder: true });
  });
  it('never puts unencoded input in the URL', () => {
    expect(buildWhatsAppHref('919876543210&text=evil').isPlaceholder).toBe(true);
  });
});
