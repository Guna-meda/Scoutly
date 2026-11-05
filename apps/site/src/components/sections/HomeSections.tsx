import Link from 'next/link';
import {
  control,
  emailCompare,
  faq,
  features,
  find,
  global,
  hero,
  join,
  teams,
  pricing,
} from '@content/en';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Mark } from '../ui/Mark';
import { Pill } from '../ui/Pill';
import { Body, BodyL, Display, H2, H3, Label, UI } from '../ui/Text';
import { SubmitForm } from '../forms/SubmitForm';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { FaqList } from './Faq';
import { FindSteps } from './FindSteps';
import { HeroDevice } from './HeroDevice';
import { TeamsSelect } from './TeamsSelect';
import { TypedEmail } from './TypedEmail';

export function Hero() {
  const wa = getWhatsAppLink();
  return (
    <Section as="div" className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <Label as="p">{hero.eyebrow}</Label>
          <Display className="hero-h1">{hero.h1}</Display>
          <BodyL as="p" className="hero-lead">
            {hero.lead}
          </BodyL>
          <div className="hero-cta">
            <Button
              href={wa.href}
              size="lg"
              icon={<Mark size={28} />}
              data-placeholder={wa.isPlaceholder ? 'true' : undefined}
            >
              {hero.button}
            </Button>
            <UI as="p" className="hero-small">
              {hero.smallLine}
            </UI>
          </div>
        </div>
        <HeroDevice />
      </div>
    </Section>
  );
}

const featureIcons: IconName[] = ['bolt', 'target', 'check-circle'];

export function FeatureRow() {
  return (
    <Container>
      <ul className="feature-row" aria-label={features.label}>
        {features.items.map((f, i) => (
          <li key={f.label} className="feature" data-tone={i + 1}>
            <Link href="/#how-it-works" className="feature-link">
              <Icon name={featureIcons[i] ?? 'bolt'} size={28} />
              <span className="feature-label">{f.label}</span>
              <span className="feature-line">{f.line}</span>
              <span className="sr-only">{features.linkNote}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export function FindSection() {
  return (
    <Section id="find" labelledBy="find-h">
      <div className="find-grid">
        <div className="find-head">
          <H2 id="find-h">{find.heading}</H2>
          <Body as="p" className="find-note">
            {find.note}
          </Body>
        </div>
        <FindSteps />
      </div>
    </Section>
  );
}

export function EmailSection() {
  return (
    <Section id="email" labelledBy="email-h">
      <H2 id="email-h">{emailCompare.heading}</H2>
      <div className="email-grid">
        <article className="email-card email-good">
          <div className="email-head">
            <Pill tone="lime">{emailCompare.goodLabel}</Pill>
          </div>
          <TypedEmail />
        </article>
        <article className="email-card email-bad">
          <div className="email-head">
            <Pill tone="pink">{emailCompare.badLabel}</Pill>
            <Pill tone="white">{emailCompare.tooLong}</Pill>
          </div>
          <p className="email-body">
            {emailCompare.bad.map((seg, i) =>
              'bad' in seg ? (
                <span key={i} className="email-flag">
                  <s>{seg.text}</s>
                  <span className="email-callout">{seg.bad}</span>
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>
        </article>
      </div>
      <BodyL as="p" className="email-standard">
        {emailCompare.standard}
      </BodyL>
    </Section>
  );
}

export function ControlSection() {
  return (
    <Section id="control" labelledBy="control-h">
      <H2 id="control-h">{control.heading}</H2>
      <ul className="control-grid">
        {control.items.map((c) => (
          <li key={c.title} className="control-card">
            <H3 as="h3" className="control-title">
              {c.title}
            </H3>
            <Body as="p">{c.body}</Body>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PricingSection() {
  return (
    <Section id="pricing" labelledBy="pricing-h">
      <H2 id="pricing-h">
        <span data-placeholder="true">{pricing.heading}</span>
      </H2>
      <Body as="p">
        <span data-placeholder="true">{pricing.plans}</span>
      </Body>
      <Body as="p">
        <span data-placeholder="true">{pricing.price}</span>
      </Body>
      <Body as="p">
        <span data-placeholder="true">{pricing.note}</span>
      </Body>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" labelledBy="faq-h">
      <H2 id="faq-h">{faq.heading}</H2>
      <FaqList />
    </Section>
  );
}

export function JoinSection({ waitlist }: { waitlist: boolean }) {
  const wa = getWhatsAppLink();
  return (
    <Section id="join" labelledBy="join-h" className="join">
      <H2 id="join-h">{join.heading}</H2>
      <div className="join-cta">
        <Button
          href={wa.href}
          size="lg"
          icon={<Mark size={28} />}
          data-placeholder={wa.isPlaceholder ? 'true' : undefined}
        >
          {global.primaryButton}
        </Button>
      </div>
      {waitlist ? (
        <div className="join-wait">
          <H3 as="h3">
            {join.or} {join.waitlistHeading.toLowerCase()}
          </H3>
          <SubmitForm endpoint="/api/waitlist" text={join} />
        </div>
      ) : null}
    </Section>
  );
}

export function TeamsSection() {
  return (
    <Section id="teams" labelledBy="teams-h" className="ts-wrap">
      <H2 id="teams-h">{teams.heading}</H2>
      <TeamsSelect />
    </Section>
  );
}
