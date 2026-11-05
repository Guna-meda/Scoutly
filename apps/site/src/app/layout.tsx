import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { global, hero } from '@content/en';
import { FloatingCta } from '@/components/shell/FloatingCta';
import { Footer } from '@/components/shell/Footer';
import { Header } from '@/components/shell/Header';
import { HeaderBehavior } from '@/components/shell/HeaderBehavior';
import { MobileMenu } from '@/components/shell/MobileMenu';
import { SkipLink } from '@/components/shell/SkipLink';
import { ConsentAnalytics } from '@/components/legal/ConsentAnalytics';
import { pageMetadata } from '@/lib/metadata';
import { getWhatsAppLink } from '@/lib/whatsapp';
import '@/styles/globals.css';

const font = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-sans',
});

const jsFlag = { __html: "document.documentElement.classList.add('js')" };

export const metadata: Metadata = pageMetadata({ title: null, description: hero.lead, path: '/' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const wa = getWhatsAppLink();
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <head>
        {/* Before first paint: lets CSS enable the pinned stage. Without JS the stacked layout shows. */}
        <script dangerouslySetInnerHTML={jsFlag} />
      </head>
      <body>
        <SkipLink />
        <Header />
        <HeaderBehavior />
        <MobileMenu />
        <main id="main" tabIndex={-1} data-inert-when-menu>
          {children}
        </main>
        <Footer />
        <ConsentAnalytics />
        <FloatingCta
          label={global.primaryButton}
          helpLabel={global.helpLabel}
          href={wa.href}
          isPlaceholder={wa.isPlaceholder}
        />
      </body>
    </html>
  );
}
