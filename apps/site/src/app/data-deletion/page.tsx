import type { Metadata } from 'next';
import { dataDeletionPage, deletion } from '@content/en';
import { SubmitForm } from '@/components/forms/SubmitForm';
import { LegalPage, Placeholdered } from '@/components/legal/LegalPage';
import { Body } from '@/components/ui/Text';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: deletion.title,
  description: dataDeletionPage.description,
  path: '/data-deletion',
});

const doc = {
  title: deletion.title,
  description: dataDeletionPage.description,
  intro: deletion.intro,
  sections: [],
};

export default function Page() {
  return (
    <LegalPage doc={doc}>
      <Body as="p">
        <Placeholdered text={deletion.slaLine} />
      </Body>
      <SubmitForm endpoint="/api/data-deletion" text={deletion} />
    </LegalPage>
  );
}
