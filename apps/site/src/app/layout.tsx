import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { global, hero } from '@content/en';
import { isProduction } from '@/lib/env';
import '@/styles/globals.css';

const font = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: global.siteName,
  description: hero.lead,
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <a className="skip-link" href="#main">
          {global.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
