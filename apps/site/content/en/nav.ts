import { CONTACT_EMAIL } from './contact';
import { global } from './global';
import { navSchema } from './schema';

/** Header and phone-menu navigation (one list, shared). Contact is a mailto link. */
export const nav = navSchema.parse({
  items: [
    { label: global.nav.howItWorks, href: '/#how-it-works' },
    { label: global.nav.faq, href: '/#faq' },
    { label: global.nav.privacy, href: '/privacy' },
    { label: global.nav.terms, href: '/terms' },
    { label: global.nav.contact, href: `mailto:${CONTACT_EMAIL}` },
  ],
});
