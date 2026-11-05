import { global } from './global';
import { CONTACT_EMAIL } from './contact';
import { footerSchema } from './schema';

export const footer = footerSchema.parse({
  tagline: 'A talent agent on WhatsApp. You press SEND.',
  exploreLabel: 'Explore',
  exploreLinks: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Frequently asked questions', href: '/#faq' },
    { label: 'Start or join the waitlist', href: '/#join' },
  ],
  legalLabel: 'Legal',
  legalLinks: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie preferences', href: '/cookies' },
    { label: 'Data deletion request', href: '/data-deletion' },
    { label: 'Security', href: '/security' },
  ],
  contactLabel: 'Contact',
  contactValue: CONTACT_EMAIL,
  languageNote: 'English for now. More languages later.',
  disclaimer: global.footerDisclaimer,
});
