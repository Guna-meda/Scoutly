import type { Metadata } from 'next';
import { faq, flags, hero } from '@content/en';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  ControlSection,
  EmailSection,
  FaqSection,
  FeatureRow,
  FindSection,
  Hero,
  JoinSection,
  PricingSection,
} from '@/components/sections/HomeSections';
import { StageSection } from '@/components/stage/StageSection';
import { pageMetadata } from '@/lib/metadata';
import { faqJsonLd, organizationJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = pageMetadata({
  title: null,
  description: hero.lead,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqJsonLd(faq.items)} />
      <Hero />
      <FeatureRow />
      <StageSection />
      <FindSection />
      <EmailSection />
      <ControlSection />
      {flags.pricing ? <PricingSection /> : null}
      <FaqSection />
      <JoinSection waitlist={flags.waitlist} />
    </>
  );
}
