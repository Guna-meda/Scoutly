import type { Metadata } from 'next';
import { cookies } from '@content/en';
import { CookiePrefs } from '@/components/legal/CookiePrefs';
import { LegalPage, Placeholdered } from '@/components/legal/LegalPage';
import { Body } from '@/components/ui/Text';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: cookies.title,
  description: cookies.description,
  path: '/cookies',
});

export default function Page() {
  return (
    <LegalPage
      doc={{
        title: cookies.title,
        description: cookies.description,
        intro: cookies.intro,
        sections: [],
      }}
    >
      <CookiePrefs />
      <Body as="p">
        <Placeholdered text={cookies.providerLine} />
      </Body>
    </LegalPage>
  );
}
