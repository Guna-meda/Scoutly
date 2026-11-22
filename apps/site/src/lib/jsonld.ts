import { global } from '@content/en';
import { siteUrl } from './metadata';

/** Organization: name, URL and logo only. No social links or numbers are invented. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: global.siteName,
    url: siteUrl,
    logo: `${siteUrl}/scoutly-logo-512.png`,
  };
}

/** FAQPage, generated from the same FAQ content the page renders. */
export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}
