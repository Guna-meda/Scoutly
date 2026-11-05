import Link from 'next/link';
import { legalCommon, type LegalDoc } from '@content/en';
import { Section } from '../layout/Section';
import { Body, BodyL, H2, H3 } from '../ui/Text';
import type { ReactNode } from 'react';

/** Shared layout for legal pages: draft banner, title, effective date, sections. */
export function LegalPage({ doc, children }: { doc: LegalDoc; children?: ReactNode }) {
  return (
    <Section as="div" className="legal">
      <p className="legal-banner" role="note">
        {legalCommon.banner}
      </p>
      <H2 as="h1">{doc.title}</H2>
      <Body as="p" className="legal-meta">
        {legalCommon.effectiveLabel}: <span data-placeholder="true">{legalCommon.effective}</span>
      </Body>
      <BodyL as="p" className="legal-intro">
        {doc.intro}
      </BodyL>
      {doc.sections.map((s) => (
        <section key={s.heading} className="legal-section">
          <H3 as="h2">{s.heading}</H3>
          {s.paragraphs?.map((p) => (
            <Body as="p" key={p}>
              <Placeholdered text={p} />
            </Body>
          ))}
          {s.bullets ? (
            <ul className="legal-list">
              {s.bullets.map((b) => (
                <li key={b} className="t-body">
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {children}
      <p className="legal-back">
        <Link href="/" className="footer-link">
          {legalCommon.backHome}
        </Link>
      </p>
    </Section>
  );
}

/** Marks every placeholder marker in a sentence so preview builds show it visibly. */
export function Placeholdered({ text }: { text: string }) {
  const parts = text.split(/(«PH:[a-z_]+»)/);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('«PH:') ? (
          <span key={i} data-placeholder="true">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
