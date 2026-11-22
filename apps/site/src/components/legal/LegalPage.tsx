import Link from 'next/link';
import { legalCommon, type LegalBody, type LegalDoc } from '@content/en';
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
        <section key={s.heading} id={s.id} className="legal-section">
          <H3 as="h2">{s.heading}</H3>
          <LegalBlocks body={s} />
          {s.subsections?.map((sub) => (
            <div key={sub.heading} className="legal-sub">
              <H3 as="h3" className="legal-sub-h">
                {sub.heading}
              </H3>
              <LegalBlocks body={sub} />
            </div>
          ))}
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

function LegalBlocks({ body }: { body: LegalBody }) {
  return (
    <>
      {body.paragraphs?.map((p) => (
        <Body as="p" key={p}>
          <Placeholdered text={p} />
        </Body>
      ))}
      {body.bullets ? (
        <ul className="legal-list">
          {body.bullets.map((b) => (
            <li key={b} className="t-body">
              <Placeholdered text={b} />
            </li>
          ))}
        </ul>
      ) : null}
      {body.links?.map((l) => (
        <Body as="p" key={l.href}>
          <a href={l.href} className="footer-link" rel="noopener noreferrer">
            {l.label}
          </a>
        </Body>
      ))}
    </>
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
