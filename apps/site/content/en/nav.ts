import { global } from './global';
import { navSchema } from './schema';

/** Header navigation. Anchors point at sections that later phases add (see scripts/links-pending.json). */
export const nav = navSchema.parse({
  items: [
    { label: global.nav.howItWorks, href: '/#how-it-works' },
    { label: global.nav.privacy, href: '/privacy' },
    { label: global.nav.faq, href: '/#faq' },
  ],
});
