import type { Metadata } from 'next';
import { dataDeletionPage, deletion } from '@content/en';
import { SubmitForm } from '@/components/forms/SubmitForm';
import { LegalPage, Placeholdered } from '@/components/legal/LegalPage';
import { Body, H3 } from '@/components/ui/Text';
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
      <section className="legal-section" aria-labelledby="revoke-h">
        <H3 as="h2" id="revoke-h">
          {dataDeletionPage.revokeHeading}
        </H3>
        <Body as="p">{dataDeletionPage.revokeIntro}</Body>
        <ol className="legal-list">
          {dataDeletionPage.revokeSteps.map((step) => (
            <li key={step} className="t-body">
              {step}
            </li>
          ))}
        </ol>
        <Body as="p">
          <a
            href={dataDeletionPage.revokeLink.href}
            className="footer-link"
            rel="noopener noreferrer"
          >
            {dataDeletionPage.revokeLink.label}
          </a>
        </Body>
      </section>
      <section className="legal-section" aria-labelledby="deleted-h">
        <H3 as="h2" id="deleted-h">
          {dataDeletionPage.deletedHeading}
        </H3>
        <Body as="p">{dataDeletionPage.deletedIntro}</Body>
        <ul className="legal-list">
          {dataDeletionPage.deletedItems.map((item) => (
            <li key={item} className="t-body">
              {item}
            </li>
          ))}
        </ul>
        <Body as="p">{dataDeletionPage.deletedNote}</Body>
      </section>
      <section className="legal-section" aria-labelledby="request-h">
        <H3 as="h2" id="request-h">
          {dataDeletionPage.formHeading}
        </H3>
        <Body as="p">
          <Placeholdered text={deletion.slaLine} />
        </Body>
        <SubmitForm endpoint="/api/data-deletion" text={deletion} />
      </section>
    </LegalPage>
  );
}
