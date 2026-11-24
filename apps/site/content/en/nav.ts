import { CONTACT_EMAIL } from './contact';
import { global } from './global';
import { navSchema } from './schema';

/** Header and phone-menu navigation (one list, shared). Privacy and Terms live in the footer. Contact is a mailto link. */
export const nav = navSchema.parse({
  items: [
    { label: global.nav.howItWorks, href: '/#how-it-works' },
    { label: global.nav.faq, href: '/#faq' },
    { label: global.nav.contact, href: `mailto:${CONTACT_EMAIL}` },
  ],
});
