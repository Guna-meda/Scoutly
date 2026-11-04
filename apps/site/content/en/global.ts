import { globalSchema } from './schema';

export const global = globalSchema.parse({
  siteName: 'Scoutly',
  primaryButton: 'Start on WhatsApp',
  secondaryButton: 'Join the waitlist',
  nav: { howItWorks: 'How it works', privacy: 'Privacy', faq: 'FAQ' },
  skipToContent: 'Skip to content',
  footerDisclaimer: 'Scoutly is not affiliated with WhatsApp or Meta.',
  notFound: {
    title: 'Page not found',
    body: 'That page does not exist. Head back home.',
    homeLink: 'Back to home',
  },
});
