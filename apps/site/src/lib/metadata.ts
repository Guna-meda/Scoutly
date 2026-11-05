import type { Metadata } from 'next';
import { global } from '@content/en';
import { isProduction } from './env';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

type Input = {
  /** Page name. null on the home page (the title is just the site name). */
  title: string | null;
  description: string;
  path: string;
};

/** Title pattern "Scoutly: {page}", canonical URL, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path }: Input): Metadata {
  const full = title ? `${global.siteName}: ${title}` : global.siteName;
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: full },
    description,
    alternates: { canonical: url },
    robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: full,
      description,
      url,
      siteName: global.siteName,
      type: 'website',
      locale: 'en',
    },
    twitter: { card: 'summary_large_image', title: full, description },
  };
}
